import { useState, useCallback, useEffect } from 'react';
import { ScheduleEvent, TodoItem, Category, DEFAULT_CATEGORIES } from '@/types/schedule';
import { addDays, startOfWeek, format } from 'date-fns';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
}

function saveToStorage(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

const SAMPLE_EVENTS: ScheduleEvent[] = [
  {
    id: '1', title: 'Client Meeting', description: 'Discuss Q1 roadmap', 
    date: format(new Date(), 'yyyy-MM-dd'), startTime: '09:00', endTime: '10:00',
    type: 'meeting', isOnline: true, priority: 'high', attendees: ['Alice', 'Bob'],
  },
  {
    id: '2', title: 'Design Review', description: 'Review new dashboard mockups',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), startTime: '11:00', endTime: '12:00',
    type: 'meeting', isOnline: false, location: 'Room 4B', priority: 'medium', attendees: ['Charlie'],
  },
  {
    id: '3', title: 'Ship Feature', description: 'Deploy new scheduling module',
    date: format(new Date(), 'yyyy-MM-dd'), startTime: '14:00', endTime: '15:30',
    type: 'task', isOnline: true, priority: 'high',
  },
  {
    id: '4', title: 'Team Standup', description: 'Daily sync',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), startTime: '09:30', endTime: '10:00',
    type: 'meeting', isOnline: true, priority: 'low', attendees: ['Alice', 'Bob', 'Charlie'],
  },
  {
    id: '5', title: 'Deadline: Proposal', description: 'Submit partnership proposal',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), startTime: '16:00', endTime: '17:00',
    type: 'important', isOnline: false, priority: 'high',
  },
  {
    id: '6', title: 'Yoga Class', description: 'Weekly stretch session',
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'), startTime: '07:00', endTime: '08:00',
    type: 'personal', isOnline: false, location: 'Downtown Studio', priority: 'low',
  },
];

const SAMPLE_TODOS: TodoItem[] = [
  { id: 't1', text: 'Review pull requests', completed: false, date: format(new Date(), 'yyyy-MM-dd'), priority: 'high' },
  { id: 't2', text: 'Update documentation', completed: false, date: format(new Date(), 'yyyy-MM-dd'), priority: 'medium' },
  { id: 't3', text: 'Send weekly report', completed: true, date: format(new Date(), 'yyyy-MM-dd'), priority: 'low' },
];

export function useScheduleStore() {
  const [events, setEvents] = useState<ScheduleEvent[]>(() => loadFromStorage('schedule-events', SAMPLE_EVENTS));
  const [todos, setTodos] = useState<TodoItem[]>(() => loadFromStorage('schedule-todos', SAMPLE_TODOS));
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage('schedule-categories', DEFAULT_CATEGORIES));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState<'week' | 'day'>('week');

  useEffect(() => { saveToStorage('schedule-events', events); }, [events]);
  useEffect(() => { saveToStorage('schedule-todos', todos); }, [todos]);
  useEffect(() => { saveToStorage('schedule-categories', categories); }, [categories]);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const filteredEvents = events.filter(e => {
    if (activeCategory === 'all') return true;
    return e.type === activeCategory || e.categoryId === activeCategory;
  });

  const addEvent = useCallback((event: Omit<ScheduleEvent, 'id'>) => {
    setEvents(prev => [...prev, { ...event, id: crypto.randomUUID() }]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<ScheduleEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const addTodo = useCallback((todo: Omit<TodoItem, 'id'>) => {
    setTodos(prev => [...prev, { ...todo, id: crypto.randomUUID() }]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...category, id: crypto.randomUUID() }]);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    if (['all', 'meeting', 'task', 'important', 'personal'].includes(id)) return;
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return {
    events, filteredEvents, todos, categories, selectedDate, activeCategory, view, weekDays,
    setSelectedDate, setActiveCategory, setView,
    addEvent, updateEvent, deleteEvent,
    addTodo, toggleTodo, deleteTodo,
    addCategory, deleteCategory,
  };
}
