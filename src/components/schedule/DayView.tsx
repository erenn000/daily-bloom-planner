import { format } from 'date-fns';
import { ScheduleEvent } from '@/types/schedule';
import { EventCard } from './EventCard';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { timeToHours } from '@/lib/timeUtils';

interface DayViewProps {
  date: Date;
  events: ScheduleEvent[];
  onDeleteEvent: (id: string) => void;
  onEditEvent: (event: ScheduleEvent) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7);
const HOUR_HEIGHT = 70; // px per hour

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
        <div className="relative" style={{ height: HOURS.length * HOUR_HEIGHT }}>
          {/* Hour grid lines */}
          {HOURS.map((hour, i) => (
            <div
              key={hour}
              className="absolute left-0 right-0 grid grid-cols-[70px_1fr] border-b border-border/30"
              style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
            >
              <div className="p-2 text-xs text-muted-foreground text-right pr-3 pt-1">
                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </div>
              <div className="border-l border-border/30" />
            </div>
          ))}

          {/* Events positioned absolutely */}
          <div className="absolute left-[70px] right-0 top-0 bottom-0">
            <AnimatePresence>
              {dayEvents.map(event => {
                const startH = timeToHours(event.startTime);
                const endH = timeToHours(event.endTime);
                const duration = Math.max(endH - startH, 0.5);
                const topOffset = (startH - HOURS[0]) * HOUR_HEIGHT;
                const height = duration * HOUR_HEIGHT;

                return (
                  <div
                    key={event.id}
                    className="absolute left-1 right-1 z-10"
                    style={{ top: topOffset, height }}
                  >
                    <EventCard
                      event={event}
                      onDelete={onDeleteEvent}
                      onEdit={onEditEvent}
                      fillHeight
                    />
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
