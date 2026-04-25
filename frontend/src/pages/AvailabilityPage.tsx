import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Repeat, Calendar, Clock } from 'lucide-react';
import { availabilityApi, type AvailabilityPayload } from '../api/availability';
import type { Availability } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Overlay from '../components/ui/Overlay';

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

type FormData = {
  day_of_week: string;
  specific_date: string;
  start_time: string;
  end_time: string;
  reason: string;
};

function SlotCard({ slot, onDelete }: { slot: Availability; onDelete: () => void }) {
  return (
    <Card className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${slot.is_recurring ? 'bg-primary-100' : 'bg-accent-100'}`}>
          {slot.is_recurring
            ? <Repeat size={18} className="text-primary-600" />
            : <Calendar size={18} className="text-accent-600" />
          }
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">
            {slot.is_recurring
              ? `${DAYS[slot.day_of_week ?? 0]} — récurrent`
              : slot.specific_date
                ? new Date(slot.specific_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                : '—'
            }
          </p>
          <p className="text-xs text-gray-500">
            {slot.start_time} – {slot.end_time}
            {slot.reason ? ` · ${slot.reason}` : ''}
          </p>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
        aria-label="Supprimer"
      >
        <Trash2 size={16} />
      </button>
    </Card>
  );
}

function AddSlotModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [isRecurring, setIsRecurring] = useState(true);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: { day_of_week: '1' },
  });

  async function onSubmit(data: FormData) {
    setApiError('');
    if (!data.start_time || !data.end_time) { setApiError('Heure de début et de fin requises.'); return; }
    if (!isRecurring && !data.specific_date) { setApiError('Date requise.'); return; }
    try {
      const payload: AvailabilityPayload = {
        is_recurring: isRecurring,
        start_time: data.start_time,
        end_time: data.end_time,
        reason: data.reason || undefined,
        ...(isRecurring
          ? { day_of_week: Number(data.day_of_week) }
          : { specific_date: data.specific_date }),
      };
      await availabilityApi.create(payload);
      onAdded();
    } catch {
      setApiError("Impossible d'ajouter ce créneau.");
    }
  }

  return (
    <Overlay onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-gray-900">Ajouter un créneau</h2>

      <div className="flex gap-2 mb-4">
        {[{ v: true, l: 'Récurrent' }, { v: false, l: 'Ponctuel' }].map(({ v, l }) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => setIsRecurring(v)}
            className={[
              'flex-1 rounded-xl py-2 text-sm font-semibold transition-colors cursor-pointer border',
              isRecurring === v
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-200',
            ].join(' ')}
          >
            {l}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
        {isRecurring ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Jour</label>
            <select
              className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none bg-white"
              {...register('day_of_week')}
            >
              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>
        ) : (
          <Input
            id="specific_date"
            type="date"
            label="Date"
            {...register('specific_date')}
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input id="start_time" type="time" label="Début" {...register('start_time')} />
          <Input id="end_time" type="time" label="Fin" {...register('end_time')} />
        </div>

        <Input id="reason" label="Raison (optionnel)" placeholder="Ex: Travail" {...register('reason')} />

        {apiError && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{apiError}</p>}

        <div className="flex gap-2 mt-1">
          <Button variant="ghost" fullWidth onClick={onClose} type="button">Annuler</Button>
          <Button fullWidth isLoading={isSubmitting} type="submit">Ajouter</Button>
        </div>
      </form>
    </Overlay>
  );
}

export default function AvailabilityPage() {
  const [showAdd, setShowAdd] = useState(false);
  const qc = useQueryClient();

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: availabilityApi.getFamily,
  });

  const deleteMutation = useMutation({
    mutationFn: availabilityApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['availability'] }),
  });

  const recurring = slots.filter(s => s.is_recurring);
  const oneTime = slots.filter(s => !s.is_recurring);

  return (
    <div className="flex flex-col px-4 py-6 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Disponibilités</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Ajouter
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {recurring.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Récurrents</h2>
              {recurring.map(slot => (
                <SlotCard key={slot.id} slot={slot} onDelete={() => deleteMutation.mutate(slot.id)} />
              ))}
            </div>
          )}
          {oneTime.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Ponctuels</h2>
              {oneTime.map(slot => (
                <SlotCard key={slot.id} slot={slot} onDelete={() => deleteMutation.mutate(slot.id)} />
              ))}
            </div>
          )}
          {slots.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-gray-400">
              <Clock size={36} strokeWidth={1.2} />
              <p className="text-sm">Aucun créneau ajouté</p>
            </div>
          )}
        </>
      )}

      {showAdd && (
        <AddSlotModal
          onClose={() => setShowAdd(false)}
          onAdded={() => { qc.invalidateQueries({ queryKey: ['availability'] }); setShowAdd(false); }}
        />
      )}
    </div>
  );
}
