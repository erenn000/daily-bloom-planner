import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Category, ScheduleEvent } from '@/types/schedule';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  events: ScheduleEvent[];
  onSelect: (id: string) => void;
  onAddCategory: (cat: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
}

const TAB_COLORS = ['hsl(265 85% 65%)', 'hsl(170 75% 50%)', 'hsl(35 95% 60%)', 'hsl(340 75% 60%)', 'hsl(200 80% 55%)', 'hsl(140 60% 50%)'];

export function CategoryTabs({ categories, activeCategory, events, onSelect, onAddCategory, onDeleteCategory }: CategoryTabsProps) {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(TAB_COLORS[0]);
  const [open, setOpen] = useState(false);

  const getCount = (catId: string) => {
    if (catId === 'all') return events.length;
    return events.filter(e => e.type === catId || e.categoryId === catId).length;
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddCategory({ name: newName.trim(), color: newColor });
    setNewName('');
    setOpen(false);
  };

  const isDefault = (id: string) => ['all', 'meeting', 'task', 'important', 'personal'].includes(id);

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin pb-1">
      {categories.map(cat => {
        const isActive = activeCategory === cat.id;
        const count = getCount(cat.id);
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all group"
            style={{
              color: isActive ? cat.color : 'hsl(var(--muted-foreground))',
              background: isActive ? `${cat.color}15` : 'transparent',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                style={{ background: cat.color }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {cat.name}
            {count > 0 && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                style={{
                  background: isActive ? cat.color : 'hsl(var(--muted))',
                  color: isActive ? 'white' : 'hsl(var(--muted-foreground))',
                }}
              >
                {count}
              </span>
            )}
            {!isDefault(cat.id) && (
              <X
                className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }}
              />
            )}
          </button>
        );
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </DialogTrigger>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="font-display">New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Category name..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="bg-muted/50 border-border/50"
            />
            <div className="flex gap-2">
              {TAB_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className="w-8 h-8 rounded-full border-2 transition-transform"
                  style={{
                    background: c,
                    borderColor: newColor === c ? 'white' : 'transparent',
                    transform: newColor === c ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
            <Button onClick={handleAdd} className="w-full">Create Category</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
