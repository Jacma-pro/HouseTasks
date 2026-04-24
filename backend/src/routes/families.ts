import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase';
import { requireAuth } from '../middleware/auth';
import { getUserFamily } from '../lib/helpers';
import { AuthRequest } from '../types';

const router = Router();

const createFamilySchema = z.object({
  name: z.string().min(1).max(100),
});

const inviteSchema = z.object({
  email: z.string().email(),
});

// POST /api/families — créer une famille
router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const body = createFamilySchema.parse(req.body);

    const existing = await getUserFamily(user.id);
    if (existing) {
      res.status(409).json({ error: 'Vous êtes déjà membre d\'une famille' });
      return;
    }

    const { data: family, error: familyError } = await supabaseAdmin
      .from('families')
      .insert({ name: body.name, created_by: user.id })
      .select()
      .single();

    if (familyError || !family) {
      res.status(400).json({ error: familyError?.message ?? 'Erreur lors de la création' });
      return;
    }

    const { error: memberError } = await supabaseAdmin
      .from('family_members')
      .insert({ family_id: family.id, user_id: user.id, role: 'admin' });

    if (memberError) {
      await supabaseAdmin.from('families').delete().eq('id', family.id);
      res.status(400).json({ error: memberError.message });
      return;
    }

    res.status(201).json(family);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Données invalides', details: error.issues });
      return;
    }
    next(error);
  }
});

// GET /api/families/me — ma famille avec ses membres
router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(404).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const [familyResult, membersResult] = await Promise.all([
      supabaseAdmin.from('families').select('*').eq('id', membership.familyId).single(),
      supabaseAdmin
        .from('family_members')
        .select('role, joined_at, user:profiles(id, name, avatar_url)')
        .eq('family_id', membership.familyId),
    ]);

    if (familyResult.error || !familyResult.data) {
      res.status(404).json({ error: 'Famille non trouvée' });
      return;
    }

    res.json({
      ...familyResult.data,
      members: membersResult.data ?? [],
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/families/invite — inviter un membre par email
router.post('/invite', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const body = inviteSchema.parse(req.body);

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }
    if (membership.role !== 'admin') {
      res.status(403).json({ error: 'Seul un admin peut inviter des membres' });
      return;
    }

    // Vérifier invitation en cours
    const { data: existingInvite } = await supabaseAdmin
      .from('invitations')
      .select('id')
      .eq('family_id', membership.familyId)
      .eq('email', body.email)
      .eq('accepted', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (existingInvite) {
      res.status(409).json({ error: 'Une invitation est déjà en cours pour cet email' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');

    const { data: invitation, error } = await supabaseAdmin
      .from('invitations')
      .insert({
        family_id: membership.familyId,
        email: body.email,
        token,
        invited_by: user.id,
      })
      .select()
      .single();

    if (error || !invitation) {
      res.status(400).json({ error: error?.message ?? 'Erreur lors de la création de l\'invitation' });
      return;
    }

    res.status(201).json({
      message: `Invitation créée pour ${body.email}`,
      token: invitation.token,
      expires_at: invitation.expires_at,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Données invalides', details: error.issues });
      return;
    }
    next(error);
  }
});

// POST /api/families/join/:token — rejoindre via token
router.post('/join/:token', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const { token } = req.params;

    const existing = await getUserFamily(user.id);
    if (existing) {
      res.status(409).json({ error: 'Vous êtes déjà membre d\'une famille' });
      return;
    }

    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (inviteError || !invitation) {
      res.status(404).json({ error: 'Invitation introuvable' });
      return;
    }
    if (invitation.accepted) {
      res.status(410).json({ error: 'Cette invitation a déjà été utilisée' });
      return;
    }
    if (new Date(invitation.expires_at) < new Date()) {
      res.status(410).json({ error: 'Cette invitation a expiré' });
      return;
    }
    if (invitation.email !== user.email) {
      res.status(403).json({ error: 'Cette invitation ne vous est pas destinée' });
      return;
    }

    const { error: memberError } = await supabaseAdmin
      .from('family_members')
      .insert({ family_id: invitation.family_id, user_id: user.id, role: 'member' });

    if (memberError) {
      res.status(400).json({ error: memberError.message });
      return;
    }

    await supabaseAdmin
      .from('invitations')
      .update({ accepted: true })
      .eq('id', invitation.id);

    const { data: family } = await supabaseAdmin
      .from('families')
      .select('*')
      .eq('id', invitation.family_id)
      .single();

    res.json({ message: 'Vous avez rejoint la famille avec succès', family });
  } catch (error) {
    next(error);
  }
});

export default router;
