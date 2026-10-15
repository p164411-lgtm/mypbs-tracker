import React, { useState } from 'react';
import { 
  DayPlan, 
  ChecklistTask, 
  DayStatus 
} from '../types/pbs';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Search,
  Filter,
  Check,
  X
} from 'lucide-react';

interface ChecklistTabProps {
  days: DayPlan[];
  onUpdateDay: (dayId: number, updater: (prev: DayPlan) => DayPlan) => void;
  onNavigateToReflection: (dayId: number) => void;
  activeJumpDay?: number;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  days,
  onUpdateDay,
  onNavigateToReflection,
  activeJumpDay,
}) => {
  // State for which cards are expanded
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    days.forEach((d) => {
      // By default open the active jump day or Day 1
      initial[d.id] = activeJumpDay ? d.id === activeJumpDay : d.id === 1;
    });
    return initial;
  });

  // Filter & Search
  const [filterWeek, setFilterWeek] = useState<'all' | 'w1' | 'w2' | 'incomplete'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New task input state per day
  const [newTaskText, setNewTaskText] = useState<Record<number, string>>({});
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  // Expand all / Collapse all helper
  const toggleAll = (expand: boolean) => {
    const next: Record<number, boolean> = {};
    days.forEach((d) => {
      next[d.id] = expand;
    });
    setExpandedDays(next);
  };

  const toggleDay = (dayId: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  // Task actions
  const handleToggleTask = (dayId: number, taskId: string) => {
    onUpdateDay(dayId, (prev) => {
      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const allDone = updatedTasks.length > 0 && updatedTasks.every((t) => t.completed);
      const anyDone = updatedTasks.some((t) => t.completed);
      
      let nextStatus: DayStatus = prev.status;
      if (allDone) {
        nextStatus = 'selesai';
      } else if (anyDone) {
        nextStatus = 'sedang';
      }

      return {
        ...prev,
        tasks: updatedTasks,
        status: nextStatus,
      };
    });
  };

  const handleAddTask = (dayId: number) => {
    const text = (newTaskText[dayId] || '').trim();
    if (!text) return;

    onUpdateDay(dayId, (prev) => {
      const newTask: ChecklistTask = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: text,
        completed: false,
        isCustom: true,
      };
      return {
        ...prev,
        tasks: [...prev.tasks, newTask],
      };
    });

    setNewTaskText((prev) => ({ ...prev, [dayId]: '' }));
  };

  const handleDeleteTask = (dayId: number, taskId: string) => {
    onUpdateDay(dayId, (prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const startEditTask = (taskId: string, currentTitle: string) => {
    setEditingTaskId(taskId);
    setEditingTaskText(currentTitle);
  };

  const saveEditTask = (dayId: number, taskId: string) => {
    if (!editingTaskText.trim()) return;
    onUpdateDay(dayId, (prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, title: editingTaskText.trim() } : t
      ),
    }));
    setEditingTaskId(null);
  };

  const handleStatusChange = (dayId: number, status: DayStatus) => {
    onUpdateDay(dayId, (prev) => ({
      ...prev,
      status,
    }));
  };

  const handleNotesChange = (dayId: number, notes: string) => {
    onUpdateDay(dayId, (prev) => ({
      ...prev,
      notes,
    }));
  };

  // Filter days
  const filteredDays = days.filter((day) => {
    if (filterWeek === 'w1' && day.id > 5) return false;
    if (filterWeek === 'w2' && day.id <= 5) return false;
    if (filterWeek === 'incomplete' && day.status === 'selesai') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTheme = day.theme.toLowerCase().includes(q);
      const inDesc = day.description.toLowerCase().includes(q);
      const inNotes = day.notes.toLowerCase().includes(q);
      const inTasks = day.tasks.some((t) => t.title.toLowerCase().includes(q));
      return inTheme || inDesc || inNotes || inTasks;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            Checklist Harian PBS (10 Hari)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            19–30 Oktober 2026 · SK Tanjung Minyak 2 · Anda boleh membuka mana-mana hari tanpa sekatan
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs">
            <button
              onClick={() => setFilterWeek('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterWeek === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Hari
            </button>
            <button
              onClick={() => setFilterWeek('w1')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterWeek === 'w1'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minggu 1 (19–23 Okt)
            </button>
            <button
              onClick={() => setFilterWeek('w2')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterWeek === 'w2'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minggu 2 (26–30 Okt)
            </button>
            <button
              onClick={() => setFilterWeek('incomplete')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterWeek === 'incomplete'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum Siap
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
            <button
              onClick={() => toggleAll(true)}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              Buka Semua
            </button>
            <span>·</span>
            <button
              onClick={() => toggleAll(false)}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              Tutup Semua
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari tugasan, tema, atau catatan harian..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 placeholder-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
          >
            Kosongkan
          </button>
        )}
      </div>

      {/* Days Accordion List */}
      <div className="space-y-4">
        {filteredDays.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            Tiada hari atau tugasan yang sepadan dengan carian "{searchQuery}".
          </div>
        ) : (
          filteredDays.map((day) => {
            const isExpanded = !!expandedDays[day.id];
            const completedCount = day.tasks.filter((t) => t.completed).length;
            const totalCount = day.tasks.length;
            const isAllCompleted = totalCount > 0 && completedCount === totalCount;

            return (
              <div
                key={day.id}
                id={`day-card-${day.id}`}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-indigo-200 shadow-xs'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleDay(day.id)}
                  className={`p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                    isExpanded ? 'bg-indigo-50/30' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Day Pill */}
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex flex-col items-center justify-center font-bold shadow-xs">
                      <span className="text-[10px] uppercase tracking-wider -mb-0.5">Hari</span>
                      <span className="text-sm">{day.id}</span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {day.dateDisplay}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {day.dayName}
                        </span>
                        {isAllCompleted && (
                          <span className="text-emerald-700 bg-emerald-50 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                          </span>
                        )}
                      </div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">
                        {day.theme}
                      </h2>
                    </div>
                  </div>

                  {/* Right: Progress & Status Badges */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex flex-col items-end text-xs">
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {completedCount}/{totalCount} Siap
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                      </span>
                    </div>

                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-slate-100 space-y-6">
                    {/* Theme Description */}
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-150 text-xs text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-800">Fokus Hari Ini: </span>
                      {day.description}
                    </div>

                    {/* Status & Quick Reflection Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-medium">Status Hari:</span>
                        <select
                          value={day.status}
                          onChange={(e) => handleStatusChange(day.id, e.target.value as DayStatus)}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                        >
                          <option value="belum">Belum Bermula</option>
                          <option value="sedang">Sedang Berjalan</option>
                          <option value="selesai">Selesai</option>
                        </select>
                      </div>

                      <button
                        onClick={() => onNavigateToReflection(day.id)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200/60 flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Tulis Refleksi Hari {day.id} (Lampiran 1-5)</span>
                      </button>
                    </div>

                    {/* Task Checklist Items */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                        <span>Senarai Tugasan</span>
                        <span>{completedCount} daripada {totalCount} siap</span>
                      </div>

                      <div className="space-y-1.5">
                        {day.tasks.map((task) => {
                          const isEditing = editingTaskId === task.id;

                          return (
                            <div
                              key={task.id}
                              className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all ${
                                task.completed
                                  ? 'bg-slate-50/80 border-slate-200 text-slate-500'
                                  : 'bg-white border-slate-200/90 text-slate-800 hover:border-indigo-200'
                              }`}
                            >
                              {/* Left: Checkbox & Title */}
                              <div className="flex items-start gap-3 flex-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleTask(day.id, task.id)}
                                  className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer"
                                  aria-label={task.completed ? 'Batal tanda siap' : 'Tanda siap'}
                                >
                                  {task.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                                  ) : (
                                    <Circle className="w-5 h-5" />
                                  )}
                                </button>

                                {isEditing ? (
                                  <div className="flex items-center gap-2 flex-1">
                                    <input
                                      type="text"
                                      value={editingTaskText}
                                      onChange={(e) => setEditingTaskText(e.target.value)}
                                      className="flex-1 text-xs border border-indigo-300 rounded px-2 py-1 focus:outline-hidden"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => saveEditTask(day.id, task.id)}
                                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                      title="Simpan"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setEditingTaskId(null)}
                                      className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                      title="Batal"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <span
                                    onClick={() => handleToggleTask(day.id, task.id)}
                                    className={`text-xs leading-relaxed select-none cursor-pointer flex-1 ${
                                      task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                                    }`}
                                  >
                                    {task.title}
                                    {task.isCustom && (
                                      <span className="ml-2 text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-medium border border-indigo-100">
                                        Tambahan
                                      </span>
                                    )}
                                  </span>
                                )}
                              </div>

                              {/* Action buttons (only for custom tasks or edit) */}
                              {task.isCustom && !isEditing && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => startEditTask(task.id, task.title)}
                                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer"
                                    title="Edit Tugasan"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(day.id, task.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                                    title="Padam Tugasan"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Custom Task Input */}
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={newTaskText[day.id] || ''}
                          onChange={(e) =>
                            setNewTaskText((prev) => ({ ...prev, [day.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTask(day.id);
                          }}
                          placeholder={`+ Tambah tugasan khusus untuk Hari ${day.id}...`}
                          className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all"
                        />
                        <button
                          onClick={() => handleAddTask(day.id)}
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah</span>
                        </button>
                      </div>
                    </div>

                    {/* Daily Notes Textarea */}
                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Catatan Ringkas Hari {day.id} (Pemerhatian segera / peringatan):
                      </label>
                      <textarea
                        rows={2}
                        value={day.notes}
                        onChange={(e) => handleNotesChange(day.id, e.target.value)}
                        placeholder="Contoh: Berjumpa Cikgu Siti jam 10.30 pagi untuk bincang jadual PdP..."
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed placeholder-slate-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
