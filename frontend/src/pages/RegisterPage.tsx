import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setApiError('');
    try {
      await registerUser(data.email, data.password, data.name);
      navigate('/onboarding', { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setApiError(msg ?? 'Erreur lors de la création du compte.');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 drop-shadow-md">
            <Logo size={56} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">HouseTasks</h1>
          <p className="mt-1 text-sm text-gray-500">Créez votre compte</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              id="name"
              label="Prénom / Nom"
              placeholder="Alice Dupont"
              autoComplete="name"
              icon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="vous@exemple.com"
              autoComplete="email"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="password"
              type="password"
              label="Mot de passe"
              placeholder="Minimum 8 caractères"
              autoComplete="new-password"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />

            {apiError && (
              <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{apiError}</p>
            )}

            <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-1">
              Créer mon compte
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
