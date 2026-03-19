export type EventType = 'meeting' | 'task' | 'important' | 'personal';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: EventType;
  location?: string;
  isOnline: boolean;
  priority: 'low' | 'medium' | 'high';
  color?: string;
  attendees?: string[];
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  meeting: 'var(--event-meeting)',
  task: 'var(--event-task)',
  important: 'var(--event-important)',
  personal: 'var(--event-personal)',
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Schedule', color: 'hsl(265 85% 65%)' },
  { id: 'meeting', name: 'Meetings', color: 'hsl(265 85% 65%)' },
  { id: 'task', name: 'Tasks', color: 'hsl(170 75% 50%)' },
  { id: 'important', name: 'Important', color: 'hsl(35 95% 60%)' },
  { id: 'personal', name: 'Personal', color: 'hsl(340 75% 60%)' },
];
