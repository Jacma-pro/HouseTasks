import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Link as LinkIcon, ChevronLeft } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { familiesApi } from '../api/families';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

type Step = 'choice' | 'create' | 'join';

const createSchema = z.object({ name: z.string().min(1, 'Nom requis').max(100) });
const joinSchema = z.object({ token: z.string().min(1, 'Token requis') });

type CreateForm = z.infer<typeof createSchema>;
type JoinForm = z.infer<typeof joinSchema>;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('choice');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const qc = useQueryClient();

  const createForm = useForm<CreateForm>({ resolver: zodResolver(createSchema) });
  const joinForm = useForm<JoinForm>({ resolver: zodResolver(joinSchema) });

  async function handleCreate(data: CreateForm) {
    setError('');
    try {
      await familiesApi.create(data.name);
      await qc.invalidateQueries({ queryKey: ['family'] });
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Impossible de créer la famille.');
    }
  }

  async function handleJoin(data: JoinForm) {
    setError('');
    try {
      await familiesApi.join(data.token);
      await qc.invalidateQueries({ queryKey: ['family'] });
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Token invalide ou expiré.');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary-50 px-4 py-10">
      <div className="w-full max-w-sm">
        {step !== 'choice' && (
          <button
            onClick={() => { setStep('choice'); setError(''); }}
            className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} /> Retour
          </button>
        )}

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'choice' ? 'Bienvenue 👋' : step === 'create' ? 'Créer une famille' : 'Rejoindre une famille'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {step === 'choice' ? 'Commencez par configurer votre famille.' : ''}
          </p>
        </div>

        {step === 'choice' && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setStep('create')}
              className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card border border-gray-100 text-left hover:shadow-card-hover transition-shadow cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100">
                <Users size={22} className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Créer une famille</p>
                <p className="text-sm text-gray-500">Démarrez et invitez vos proches</p>
              </div>
            </button>

            <button
              onClick={() => setStep('join')}
              className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card border border-gray-100 text-left hover:shadow-card-hover transition-shadow cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100">
                <LinkIcon size={22} className="text-accent-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Rejoindre une famille</p>
                <p className="text-sm text-gray-500">Entrez le token d'invitation reçu</p>
              </div>
            </button>
          </div>
        )}

        {step === 'create' && (
          <div className="rounded-2xl bg-white p-6 shadow-card border border-gray-100">
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="flex flex-col gap-4" noValidate>
              <Input
                id="family-name"
                label="Nom de la famille"
                placeholder="Les Dupont"
                error={createForm.formState.errors.name?.message}
                {...createForm.register('name')}
              />
              {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
              <Button type="submit" fullWidth isLoading={createForm.formState.isSubmitting}>
                Créer ma famille
              </Button>
            </form>
          </div>
        )}

        {step === 'join' && (
          <div className="rounded-2xl bg-white p-6 shadow-card border border-gray-100">
            <form onSubmit={joinForm.handleSubmit(handleJoin)} className="flex flex-col gap-4" noValidate>
              <Input
                id="token"
                label="Token d'invitation"
                placeholder="Collez le token ici"
                error={joinForm.formState.errors.token?.message}
                {...joinForm.register('token')}
              />
              {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
              <Button type="submit" fullWidth isLoading={joinForm.formState.isSubmitting}>
                Rejoindre
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
