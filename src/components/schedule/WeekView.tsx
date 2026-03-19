import { format, isToday, isSameDay } from 'date-fns';
import { ScheduleEvent } from '@/types/schedule';
import { EventCard } from './EventCard';
import { AnimatePresence } from 'framer-motion';

interface WeekViewProps {
  weekDays: Date[];
  events: ScheduleEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onDeleteEvent: (id: string) => void;
  onEditEvent: (event: ScheduleEvent) => void;
  onDayDoubleClick: (date: Date) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7);

export function WeekView({ weekDays, events, selectedDate, onSelectDate, onDeleteEvent, onEditEvent, onDayDoubleClick }: WeekViewProps) {
  const getEventsForDayAndHour = (day: Date, hour: number) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return events.filter(e => {
      if (e.date !== dayStr) return false;
      const h = parseInt(e.startTime.split(':')[0]);
      return h === hour;
    });
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="grid grid-cols-[70px_repeat(7,1fr)] border-b border-border/50">
        <div className="p-3 text-xs text-muted-foreground text-center">GMT</div>
        {weekDays.map(day => {
          const today = isToday(day);
          const selected = isSameDay(day, selectedDate);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              onDoubleClick={() => onDayDoubleClick(day)}
              className={`p-3 text-center transition-all ${today ? 'bg-primary/10' : ''} ${selected ? 'ring-1 ring-primary/30' : ''}`}
            >
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                {format(day, 'dd')} {format(day, 'EEE')}
              </span>
              {today && <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-1" />}
            </button>
          );
        })}
      </div>

      <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
        {HOURS.map(hour => (
          <div key={hour} className="grid grid-cols-[70px_repeat(7,1fr)] min-h-[80px] border-b border-border/30">
            <div className="p-2 text-xs text-muted-foreground text-right pr-3 pt-1">
              {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
            </div>
            {weekDays.map(day => {
              const dayEvents = getEventsForDayAndHour(day, hour);
              const today = isToday(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`border-l border-border/30 p-1 ${today ? 'bg-primary/[0.03]' : ''}`}
                  onDoubleClick={() => onDayDoubleClick(day)}
                >
                  <AnimatePresence>
                    {dayEvents.map(event => (
                      <EventCard key={event.id} event={event} compact onDelete={onDeleteEvent} onEdit={onEditEvent} />
                    ))}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}