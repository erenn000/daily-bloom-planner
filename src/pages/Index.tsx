import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CalendarDays, LayoutGrid, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { useScheduleStore } from '@/hooks/useScheduleStore';
import { CategoryTabs } from '@/components/schedule/CategoryTabs';
import { WeekView } from '@/components/schedule/WeekView';
import { DayView } from '@/components/schedule/DayView';
import { TodoList } from '@/components/schedule/TodoList';
import { CreateEventDialog } from '@/components/schedule/CreateEventDialog';
import { Button } from '@/components/ui/button';

const Index = () => {
  const store = useScheduleStore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDefaultDate, setCreateDefaultDate] = useState<Date | undefined>();

  const handleDayDoubleClick = (date: Date) => {
    setCreateDefaultDate(date);
    setCreateDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl tracking-tight">Schedule Planner</h1>
                <p className="text-xs text-muted-foreground">{format(new Date(), 'EEEE, MMMM d')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex bg-muted/50 rounded-lg p-1">
                <button
                  onClick={() => store.setView('week')}
                  className={`p-2 rounded-md transition-all ${store.view === 'week' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => store.setView('day')}
                  className={`p-2 rounded-md transition-all ${store.view === 'day' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <CalendarDays className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={() => { setCreateDefaultDate(undefined); setCreateDialogOpen(true); }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-display gap-2"
              >
                <Plus className="w-4 h-4" /> New Entry
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Category tabs + week navigation */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <CategoryTabs
            categories={store.categories}
            activeCategory={store.activeCategory}
            events={store.events}
            onSelect={store.setActiveCategory}
            onAddCategory={store.addCategory}
            onDeleteCategory={store.deleteCategory}
          />

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => store.setSelectedDate(subWeeks(store.selectedDate, 1))}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => store.setSelectedDate(new Date())}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-all"
            >
              Today
            </button>
            <button
              onClick={() => store.setSelectedDate(addWeeks(store.selectedDate, 1))}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <AnimatePresence mode="wait">
            {store.view === 'week' ? (
              <motion.div key="week" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <WeekView
                  weekDays={store.weekDays}
                  events={store.filteredEvents}
                  selectedDate={store.selectedDate}
                  onSelectDate={store.setSelectedDate}
                  onDeleteEvent={store.deleteEvent}
                  onDayDoubleClick={handleDayDoubleClick}
                />
              </motion.div>
            ) : (
              <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DayView
                  date={store.selectedDate}
                  events={store.filteredEvents}
                  onDeleteEvent={store.deleteEvent}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <div className="space-y-6">
            <TodoList
              todos={store.todos}
              selectedDate={store.selectedDate}
              onAdd={store.addTodo}
              onToggle={store.toggleTodo}
              onDelete={store.deleteTodo}
            />

            {/* Quick stats */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <h3 className="font-display font-semibold text-sm">This Week</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Meetings', count: store.events.filter(e => e.type === 'meeting').length, color: 'from-primary to-primary/60' },
                  { label: 'Tasks', count: store.events.filter(e => e.type === 'task').length, color: 'from-accent to-accent/60' },
                  { label: 'Important', count: store.events.filter(e => e.type === 'important').length, color: 'from-event-important to-event-important/60' },
                  { label: 'Personal', count: store.events.filter(e => e.type === 'personal').length, color: 'from-event-personal to-event-personal/60' },
                ].map(stat => (
                  <div key={stat.label} className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className={`text-2xl font-display font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                      {stat.count}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <CreateEventDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={store.addEvent}
        defaultDate={createDefaultDate}
      />
    </div>
  );
};

export default Index;
