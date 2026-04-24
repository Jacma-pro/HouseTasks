import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase';
import { requireAuth } from '../middleware/auth';
import { getUserFamily } from '../lib/helpers';
import { AuthRequest } from '../types';

const router = Router();

const baseSchema = z.object({
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM requis'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM requis'),
  reason: z.string().optional(),
});

const recurringSchema = baseSchema.extend({
  is_recurring: z.literal(true),
  day_of_week: z.number().int().min(0).max(6),
  specific_date: z.undefined().optional(),
});

const oneTimeSchema = baseSchema.extend({
  is_recurring: z.literal(false),
  specific_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis'),
  day_of_week: z.undefined().optional(),
});

const availabilitySchema = z.discriminatedUnion('is_recurring', [recurringSchema, oneTimeSchema]);

// GET /api/availability — toutes les dispos de la famille
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('availability')
      .select('*, user:profiles(id, name, avatar_url)')
      .eq('family_id', membership.familyId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data ?? []);
  } catch (error) {
    next(error);
  }
});

// GET /api/availability/:userId — dispos d'un membre
router.get('/:userId', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const { userId } = req.params;

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data: targetMembership } = await supabaseAdmin
      .from('family_members')
      .select('user_id')
      .eq('family_id', membership.familyId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!targetMembership) {
      res.status(404).json({ error: 'Utilisateur introuvable dans cette famille' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('availability')
      .select('*')
      .eq('user_id', userId)
      .eq('family_id', membership.familyId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data ?? []);
  } catch (error) {
    next(error);
  }
});

// POST /api/availability
router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const body = availabilitySchema.parse(req.body);

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('availability')
      .insert({
        user_id: user.id,
        family_id: membership.familyId,
        is_recurring: body.is_recurring,
        day_of_week: body.is_recurring ? body.day_of_week : null,
        specific_date: !body.is_recurring ? body.specific_date : null,
        start_time: body.start_time,
        end_time: body.end_time,
        reason: body.reason,
      })
      .select()
      .single();

    if (error || !data) {
      res.status(400).json({ error: error?.message ?? 'Erreur lors de la création' });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Données invalides', details: error.issues });
      return;
    }
    next(error);
  }
});

// PUT /api/availability/:id
router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;
    const body = availabilitySchema.parse(req.body);

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('availability')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      res.status(404).json({ error: 'Créneau introuvable' });
      return;
    }

    if (existing.user_id !== user.id) {
      res.status(403).json({ error: 'Accès non autorisé' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('availability')
      .update({
        is_recurring: body.is_recurring,
        day_of_week: body.is_recurring ? body.day_of_week : null,
        specific_date: !body.is_recurring ? body.specific_date : null,
        start_time: body.start_time,
        end_time: body.end_time,
        reason: body.reason,
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      res.status(400).json({ error: error?.message ?? 'Erreur lors de la mise à jour' });
      return;
    }

    res.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Données invalides', details: error.issues });
      return;
    }
    next(error);
  }
});

// DELETE /api/availability/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('availability')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      res.status(404).json({ error: 'Créneau introuvable' });
      return;
    }

    if (existing.user_id !== user.id) {
      res.status(403).json({ error: 'Accès non autorisé' });
      return;
    }

    const { error } = await supabaseAdmin.from('availability').delete().eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
