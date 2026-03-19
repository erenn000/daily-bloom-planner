import { format, isToday, isSameDay } from 'date-fns';
import { ScheduleEvent } from '@/types/schedule';
import { EventCard } from './EventCard';
import { AnimatePresence } from 'framer-motion';
import { timeToHours } from '@/lib/timeUtils';

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
const HOUR_HEIGHT = 80; // px per hour

export function WeekView({ weekDays, events, selectedDate, onSelectDate, onDeleteEvent, onEditEvent, onDayDoubleClick }: WeekViewProps) {
  const getEventsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return events.filter(e => e.date === dayStr);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header row */}
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

      {/* Time grid */}
      <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-[70px_repeat(7,1fr)]">
          {/* Time labels column */}
          <div className="relative" style={{ height: HOURS.length * HOUR_HEIGHT }}>
            {HOURS.map((hour, i) => (
              <div
                key={hour}
                className="absolute left-0 right-0 p-2 text-xs text-muted-foreground text-right pr-3 pt-1 border-b border-border/30"
                style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
              >
                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map(day => {
            const today = isToday(day);
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={day.toISOString()}
                className={`relative border-l border-border/30 ${today ? 'bg-primary/[0.03]' : ''}`}
                style={{ height: HOURS.length * HOUR_HEIGHT }}
                onDoubleClick={() => onDayDoubleClick(day)}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour, i) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-b border-border/30"
                    style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                  />
                ))}

                {/* Events */}
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
                        className="absolute left-0.5 right-0.5 z-10"
                        style={{ top: topOffset, height }}
                      >
                        <EventCard
                          event={event}
                          compact
                          onDelete={onDeleteEvent}
                          onEdit={onEditEvent}
                          fillHeight
                        />
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
