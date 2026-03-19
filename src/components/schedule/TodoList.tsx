import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, Flame, Minus, ArrowDown } from 'lucide-react';
import { TodoItem } from '@/types/schedule';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface TodoListProps {
  todos: TodoItem[];
  selectedDate: Date;
  onAdd: (todo: Omit<TodoItem, 'id'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_ICONS = {
  high: <Flame className="w-3.5 h-3.5 text-destructive" />,
  medium: <Minus className="w-3.5 h-3.5 text-event-important" />,
  low: <ArrowDown className="w-3.5 h-3.5 text-accent" />,
};

export function TodoList({ todos, selectedDate, onAdd, onToggle, onDelete }: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTodos = todos.filter(t => t.date === dateStr);
  const completed = dayTodos.filter(t => t.completed).length;

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    onAdd({ text: newTodo.trim(), completed: false, date: dateStr, priority });
    setNewTodo('');
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold">Today's Tasks</h3>
        <span className="text-xs text-muted-foreground">
          {completed}/{dayTodos.length} done
        </span>
      </div>

      {/* Progress bar */}
      {dayTodos.length > 0 && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completed / dayTodos.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Add todo */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a task..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="bg-muted/50 border-border/50 text-sm"
        />
        <div className="flex items-center gap-1">
          {(['low', 'medium', 'high'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`p-1.5 rounded-md transition-all ${priority === p ? 'bg-muted' : 'opacity-40 hover:opacity-70'}`}
            >
              {PRIORITY_ICONS[p]}
            </button>
          ))}
        </div>
        <button
          onClick={handleAdd}
          className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Todo list */}
      <div className="space-y-1 max-h-[300px] overflow-y-auto scrollbar-thin">
        <AnimatePresence>
          {dayTodos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/30 group"
            >
              <button onClick={() => onToggle(todo.id)} className="flex-shrink-0">
                {todo.completed ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-accent" />
                ) : (
                  <Circle className="w-4.5 h-4.5 text-muted-foreground" />
                )}
              </button>
              <span className={`text-sm flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                {todo.text}
              </span>
              {PRIORITY_ICONS[todo.priority]}
              <button
                onClick={() => onDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {dayTodos.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No tasks for today ✨</p>
        )}
      </div>
    </div>
  );
}
