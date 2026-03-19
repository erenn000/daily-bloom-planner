import { motion } from 'framer-motion';
import { MapPin, Monitor, Users, Trash2, Pencil } from 'lucide-react';
import { ScheduleEvent, EVENT_TYPE_COLORS } from '@/types/schedule';

interface EventCardProps {
  event: ScheduleEvent;
  compact?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (event: ScheduleEvent) => void;
  onClick?: () => void;
}

export function EventCard({ event, compact, onDelete, onEdit, onClick }: EventCardProps) {
  const typeColor = `hsl(${EVENT_TYPE_COLORS[event.type]})`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="group relative rounded-lg p-3 cursor-pointer transition-all overflow-hidden"
      style={{
        background: `hsl(${EVENT_TYPE_COLORS[event.type]} / 0.08)`,
        borderLeft: `3px solid ${typeColor}`,
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, hsl(${EVENT_TYPE_COLORS[event.type]} / 0.12), transparent 60%)` }}
      />

      <div className="relative z-10">
        <p className="text-[11px] text-muted-foreground">{event.startTime} - {event.endTime}</p>
        <h4 className="font-display font-semibold text-sm mt-0.5 text-foreground">{event.title}</h4>
        {!compact && (
          <>
            <span className="text-xs font-medium capitalize" style={{ color: typeColor }}>{event.type}</span>
            <span className="text-xs text-muted-foreground"> · {event.isOnline ? 'Online' : 'Offline'}</span>

            {event.location && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                {event.isOnline ? <Monitor className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                {event.location}
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <Users className="w-3 h-3 text-muted-foreground" />
                <div className="flex -space-x-1.5">
                  {event.attendees.slice(0, 3).map((a, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-card flex items-center justify-center text-[9px] font-bold"
                      style={{ background: `hsl(${(i * 90 + 200) % 360} 60% 45%)`, color: 'white' }}
                    >
                      {a[0]}
                    </div>
                  ))}
                  {event.attendees.length > 3 && (
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] text-muted-foreground border border-card">
                      +{event.attendees.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {(onDelete || onEdit) && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(event); }}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}