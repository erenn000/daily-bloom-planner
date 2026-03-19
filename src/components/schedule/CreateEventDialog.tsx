import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScheduleEvent, EventType } from '@/types/schedule';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, Zap } from 'lucide-react';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: Omit<ScheduleEvent, 'id'>) => void;
  defaultDate?: Date;
}

export function CreateEventDialog({ open, onOpenChange, onSubmit, defaultDate }: CreateEventDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(defaultDate || new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [type, setType] = useState<EventType>('meeting');
  const [isOnline, setIsOnline] = useState(true);
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [attendeesStr, setAttendeesStr] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      date, startTime, endTime, type, isOnline, priority,
      location: location.trim() || undefined,
      attendees: attendeesStr ? attendeesStr.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    });
    // Reset
    setTitle(''); setDescription(''); setLocation(''); setAttendeesStr('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">New Schedule Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Input placeholder="Event title..." value={title} onChange={e => setTitle(e.target.value)} className="bg-muted/50 border-border/50 text-base font-medium" />

          <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="bg-muted/50 border-border/50 resize-none" rows={2} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-muted/50 border-border/50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" />Type</Label>
              <Select value={type} onValueChange={v => setType(v as EventType)}>
                <SelectTrigger className="bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Start</Label>
              <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-muted/50 border-border/50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">End</Label>
              <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-muted/50 border-border/50" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Priority</Label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                    priority === p
                      ? p === 'high' ? 'bg-destructive/20 text-destructive' : p === 'medium' ? 'bg-event-important/20 text-event-important' : 'bg-accent/20 text-accent'
                      : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <Label className="text-sm flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />Online</Label>
            <Switch checked={isOnline} onCheckedChange={setIsOnline} />
          </div>

          {!isOnline && (
            <Input placeholder="Location..." value={location} onChange={e => setLocation(e.target.value)} className="bg-muted/50 border-border/50" />
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />Attendees (comma-separated)</Label>
            <Input placeholder="Alice, Bob, Charlie..." value={attendeesStr} onChange={e => setAttendeesStr(e.target.value)} className="bg-muted/50 border-border/50" />
          </div>

          <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display">
            Create Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
