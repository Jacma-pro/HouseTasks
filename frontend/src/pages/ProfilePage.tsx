import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogOut, Users, Mail, UserPen, ChevronRight, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { familiesApi } from '../api/families';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import Overlay from '../components/ui/Overlay';
import AvatarPicker from '../components/ui/AvatarPicker';

const profileSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
});
type ProfileForm = z.infer<typeof profileSchema>;

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [inviteToken, setInviteToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await familiesApi.invite(email) as { token: string };
      if (res?.token) setInviteToken(res.token);
      setSuccess(true);
    } catch {
      setError('Impossible d\'envoyer l\'invitation.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(inviteToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Overlay onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-gray-900">Inviter un membre</h2>
      {success ? (
        <div className="text-center py-2">
          <p className="text-primary-600 font-semibold mb-2">Code d'invitation généré !</p>
          <p className="text-sm text-gray-500 mb-4">Envoyez ce code à votre proche pour qu'il rejoigne la famille lors de son inscription :</p>
          
          {inviteToken && (
            <div className="mb-4 rounded-xl bg-gray-50 p-4 border border-gray-200">
              <code className="text-sm font-bold text-gray-900 break-all select-all">{inviteToken}</code>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-4">
            {inviteToken && (
              <Button type="button" variant="ghost" fullWidth onClick={handleCopy}>
                {copied ? 'Copié ✓' : 'Copier le code'}
              </Button>
            )}
            <Button fullWidth onClick={onClose}>Fermer</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            id="invite-email"
            type="email"
            label="Email du membre"
            placeholder="alice@exemple.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail size={16} />}
          />
          {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 mt-1">
            <Button variant="ghost" fullWidth onClick={onClose} type="button">Annuler</Button>
            <Button fullWidth isLoading={loading} type="submit">Inviter</Button>
          </div>
        </form>
      )}
    </Overlay>
  );
}

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const { data: family } = useQuery({
    queryKey: ['family'],
    queryFn: familiesApi.getMyFamily,
    retry: false,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; avatar_url?: string }) =>
      api.put<User>(`/api/users/${user?.id}`, data).then(r => r.data),
    onSuccess: (updated) => {
      updateUser({ name: updated.name, avatar_url: updated.avatar_url });
      setEditSuccess(true);
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      setTimeout(() => setEditSuccess(false), 2000);
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (avatarUrl: string) =>
      api.put<User>(`/api/users/${user?.id}`, { avatar_url: avatarUrl }).then(r => r.data),
    onSuccess: (updated) => {
      updateUser({ avatar_url: updated.avatar_url });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      setShowAvatarPicker(false);
    },
  });

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex flex-col px-4 py-6 gap-5">
      {/* Avatar + nom */}
      <div className="flex items-center gap-4">
        {user && (
          <button
            onClick={() => setShowAvatarPicker(true)}
            className="relative shrink-0 cursor-pointer group"
            aria-label="Changer l'avatar"
          >
            <Avatar name={user.name} avatar_url={user.avatar_url} size="lg" />
            <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary-600 border-2 border-white flex items-center justify-center">
              <Smile size={10} className="text-white" />
            </div>
          </button>
        )}
        <div>
          <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Modifier le profil */}
      <Card>
        <h2 className="mb-3 font-semibold text-gray-900 flex items-center gap-2">
          <UserPen size={16} className="text-primary-600" /> Mon profil
        </h2>
        <form onSubmit={handleSubmit(d => updateMutation.mutate(d))} className="flex flex-col gap-3">
          <Input
            id="name"
            label="Nom"
            error={errors.name?.message}
            {...register('name')}
          />
          {editSuccess && <p className="text-sm text-primary-600 font-medium">Profil mis à jour ✓</p>}
          <Button type="submit" isLoading={isSubmitting || updateMutation.isPending} size="sm">
            Enregistrer
          </Button>
        </form>
      </Card>

      {/* Famille */}
      {family && (
        <Card>
          <h2 className="mb-3 font-semibold text-gray-900 flex items-center gap-2">
            <Users size={16} className="text-primary-600" /> Famille · {family.name}
          </h2>
          {family.members?.length > 0 && (
            <div className="flex flex-col gap-1 mb-3">
              {family.members.map(m => (
                <div key={m.user?.id} className="flex items-center justify-between min-h-[44px] py-1">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={m.user?.name ?? '?'} avatar_url={m.user?.avatar_url} size="sm" />
                    <p className="text-sm font-medium text-gray-800">{m.user?.name}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                    {m.role === 'admin' ? 'Admin' : 'Membre'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowInvite(true)}
            className="flex w-full items-center justify-between rounded-xl bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors cursor-pointer"
          >
            Inviter un membre <ChevronRight size={16} />
          </button>
        </Card>
      )}

      {/* Déconnexion */}
      <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:bg-red-50 mt-2">
        <LogOut size={16} /> Se déconnecter
      </Button>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      {showAvatarPicker && user && (
        <AvatarPicker
          name={user.name}
          currentAvatarUrl={user.avatar_url}
          onSave={(avatarUrl) => avatarMutation.mutate(avatarUrl)}
          onClose={() => setShowAvatarPicker(false)}
          isSaving={avatarMutation.isPending}
        />
      )}
    </div>
  );
}
