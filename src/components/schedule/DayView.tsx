import { format } from 'date-fns';
import { ScheduleEvent } from '@/types/schedule';
import { EventCard } from './EventCard';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

interface DayViewProps {
  date: Date;
  events: ScheduleEvent[];
  onDeleteEvent: (id: string) => void;
  onEditEvent: (event: ScheduleEvent) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7);

export function DayView({ date, events, onDeleteEvent, onEditEvent }: DayViewProps) {
  const dayStr = format(date, 'yyyy-MM-dd');
  const dayEvents = events.filter(e => e.date === dayStr);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="p-4 border-b border-border/50 flex items-center gap-3">
        <CalendarDays className="w-5 h-5 text-primary" />
        <div>
          <h3 className="font-display font-semibold text-lg">{format(date, 'EEEE')}</h3>
          <p className="text-sm text-muted-foreground">{format(date, 'MMMM d, yyyy')}</p>
        </div>
        <span className="ml-auto text-sm text-muted-foreground">{dayEvents.length} events</span>
      </div>

      <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
        {HOURS.map(hour => {
          const hourEvents = dayEvents.filter(e => parseInt(e.startTime.split(':')[0]) === hour);
          return (
            <div key={hour} className="grid grid-cols-[70px_1fr] min-h-[70px] border-b border-border/30">
              <div className="p-2 text-xs text-muted-foreground text-right pr-3 pt-1">
                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </div>
              <div className="border-l border-border/30 p-1 space-y-1">
                <AnimatePresence>
                  {hourEvents.map(event => (
                    <EventCard key={event.id} event={event} onDelete={onDeleteEvent} onEdit={onEditEvent} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}