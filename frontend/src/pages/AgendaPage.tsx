import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Settings, CalendarX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { availabilityApi } from '../api/availability';
import { familiesApi } from '../api/families';
import type { Availability } from '../types';
import Overlay from '../components/ui/Overlay';

const DAY_HEADERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const MEMBER_COLORS = [
  { dot: 'bg-primary-500', label: 'text-primary-700', card: 'bg-primary-50 border-primary-100' },
  { dot: 'bg-accent-500', label: 'text-accent-700', card: 'bg-accent-50 border-accent-100' },
  { dot: 'bg-violet-500', label: 'text-violet-700', card: 'bg-violet-50 border-violet-100' },
  { dot: 'bg-rose-500', label: 'text-rose-700', card: 'bg-rose-50 border-rose-100' },
  { dot: 'bg-amber-500', label: 'text-amber-700', card: 'bg-amber-50 border-amber-100' },
];

function toDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function slotsForDay(slots: Availability[], date: Date): Availability[] {
  const dow = date.getDay();
  const dateStr = toDateStr(date);
  return slots.filter(s =>
    s.is_recurring ? s.day_of_week === dow : s.specific_date === dateStr
  );
}

export default function AgendaPage() {
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: availabilityApi.getFamily,
  });

  const { data: family } = useQuery({
    queryKey: ['family'],
    queryFn: familiesApi.getMyFamily,
  });

  const members = family?.members ?? [];

  const memberColorMap = useMemo(() => {
    const map: Record<string, number> = {};
    members.forEach((m, i) => { if (m.user?.id) map[m.user.id] = i % MEMBER_COLORS.length; });
    return map;
  }, [members]);

  const memberNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    members.forEach(m => { if (m.user?.id) map[m.user.id] = m.user.name; });
    return map;
  }, [members]);

  const { year, month } = current;

  const days = useMemo(() => {
    const firstDow = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDow === 0 ? 6 : firstDow - 1;
    const grid: (Date | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= lastDate; d++) grid.push(new Date(year, month, d));
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [year, month]);

  const todayStr = toDateStr(new Date());
  const monthLabel = new Date(year, month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const selectedSlots = selectedDay ? slotsForDay(slots, selectedDay) : [];

  return (
    <div className="flex flex-col px-4 py-6 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Agenda</h1>
        <Link
          to="/availability"
          className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Settings size={13} />
          Mes dispos
        </Link>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrent(c => {
            const d = new Date(c.year, c.month - 1, 1);
            return { year: d.getFullYear(), month: d.getMonth() };
          })}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <span className="font-semibold text-gray-900 capitalize">{monthLabel}</span>
        <button
          onClick={() => setCurrent(c => {
            const d = new Date(c.year, c.month + 1, 1);
            return { year: d.getFullYear(), month: d.getMonth() };
          })}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Legend */}
      {members.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {members.map((m, i) => (
            <div key={m.user?.id ?? i} className="flex items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-full ${MEMBER_COLORS[i % MEMBER_COLORS.length].dot}`} />
              <span className="text-xs text-gray-500">{m.user?.name ?? 'Membre'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Calendar */}
      <div className="rounded-2xl bg-white shadow-card border border-gray-100 overflow-hidden">
        {/* Headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAY_HEADERS.map((d, i) => (
            <div key={i} className="py-2.5 text-center text-xs font-semibold text-gray-400">{d}</div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {days.map((date, i) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${i}`}
                    className="h-14 border-b border-r border-gray-50 last:border-r-0 bg-gray-50/50"
                  />
                );
              }

              const dateStr = toDateStr(date);
              const isToday = dateStr === todayStr;
              const daySlots = slotsForDay(slots, date);
              const uniqueUserIds = [...new Set(daySlots.map(s => s.user_id))];

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDay(date)}
                  className="h-14 flex flex-col items-center pt-1.5 gap-1 border-b border-r border-gray-50 last:border-r-0 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className={[
                    'text-xs font-medium h-6 w-6 flex items-center justify-center rounded-full leading-none',
                    isToday ? 'bg-primary-600 text-white' : 'text-gray-700',
                  ].join(' ')}>
                    {date.getDate()}
                  </span>
                  <div className="flex gap-0.5 flex-wrap justify-center max-w-[28px]">
                    {uniqueUserIds.slice(0, 4).map(uid => (
                      <div
                        key={uid}
                        className={`h-1.5 w-1.5 rounded-full ${MEMBER_COLORS[memberColorMap[uid] ?? 0].dot}`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Day detail overlay */}
      {selectedDay && (
        <Overlay onClose={() => setSelectedDay(null)}>
          <h2 className="mb-4 text-base font-bold text-gray-900 capitalize">
            {selectedDay.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          {selectedSlots.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
              <CalendarX size={28} strokeWidth={1.4} />
              <p className="text-sm">Tout le monde est disponible</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedSlots.map(slot => {
                const colorIdx = memberColorMap[slot.user_id] ?? 0;
                const color = MEMBER_COLORS[colorIdx];
                return (
                  <div key={slot.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${color.card}`}>
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${color.dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${color.label}`}>
                        {memberNameMap[slot.user_id] ?? 'Membre'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {slot.start_time} – {slot.end_time}
                        {slot.reason ? ` · ${slot.reason}` : ''}
                        {slot.is_recurring && <span className="ml-1 text-gray-400">(récurrent)</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Overlay>
      )}
    </div>
  );
}
