import React from 'react';
import { 
  PBSAppData, 
  DayPlan 
} from '../types/pbs';
import { TabType } from './Header';
import { 
  CheckCircle2, 
  Clock, 
  Users, 
  Eye, 
  BookOpen, 
  FileText, 
  ArrowRight, 
  Calendar, 
  School, 
  Award, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { countWords } from '../utils/storage';

interface DashboardTabProps {
  data: PBSAppData;
  onNavigateTab: (tab: TabType) => void;
  onJumpToDay: (dayId: number) => void;
  onOpenProfile: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  data,
  onNavigateTab,
  onJumpToDay,
  onOpenProfile,
}) => {
  // Compute metrics
  const totalTasks = data.days.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = data.days.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
    0
  );
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedInterviews = data.interviews.filter((i) => i.status === 'selesai').length;
  const inProgressInterviews = data.interviews.filter((i) => i.status === 'mula').length;

  const observedCount = data.observations.filter((o) => o.status === 'diperhatikan').length;
  const unconfirmedCount = data.observations.filter((o) => o.status === 'tidak_dapat_disahkan').length;

  const completedReflections = data.reflections.filter((r) => r.completed).length;
  const finalReflectionDone = data.finalReflection.completed;

  const totalReportWords = data.reportSections.reduce(
    (acc, s) => acc + countWords(s.draftContent),
    0
  );
  const reportPercentage = Math.min(100, Math.round((totalReportWords / 1200) * 100));

  // Overall metric formula
  // 30% tasks, 20% interviews, 20% observations, 15% reflections, 15% report
  const overallScore = Math.round(
    taskPercentage * 0.3 +
    (completedInterviews / 4) * 20 +
    (observedCount / (data.observations.length || 1)) * 20 +
    ((completedReflections + (finalReflectionDone ? 1 : 0)) / 11) * 15 +
    (reportPercentage / 100) * 15
  );

  // Find last active or next incomplete day
  const incompleteDay = data.days.find((d) => d.status !== 'selesai') || data.days[data.days.length - 1];
  const lastActiveDayId = data.lastActiveDay || incompleteDay.id;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Profile Card */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/80 border border-indigo-100/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-gradient-to-br from-sky-200/30 to-indigo-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-100/60 w-fit px-3 py-1 rounded-full border border-indigo-200/60">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pengalaman Berasaskan Sekolah (PBS) · PDPP Ambilan 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Selamat Bertugas, {data.profile.studentName || 'Guru Pelatih'}!
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Jejak tugasan harian, rakam temu bual pentadbir & guru, catat pemerhatian bilik darjah, bina refleksi berpandukan <strong className="text-indigo-800">Lampiran 1-5</strong> serta lengkapkan laporan <strong className="text-indigo-800">Lampiran 1-6</strong> (1200 patah perkataan) di <span className="font-medium text-slate-800">SK Tanjung Minyak 2, Melaka</span>.
            </p>
          </div>

          {/* Quick jump to active day */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onNavigateTab('checklist');
                onJumpToDay(lastActiveDayId);
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 text-white font-semibold text-sm hover:from-indigo-700 hover:to-sky-700 transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Sambung Hari {lastActiveDayId}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={onOpenProfile}
              className="px-4 py-3 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium text-sm transition-colors text-center cursor-pointer"
            >
              Kemaskini Profil
            </button>
          </div>
        </div>

        {/* Profile summary strip */}
        <div className="mt-6 pt-6 border-t border-indigo-100/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Pengkhususan</span>
            <span className="font-semibold text-slate-800">{data.profile.major}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Pusat Latihan</span>
            <span className="font-semibold text-slate-800">{data.profile.ipgCampus}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Sekolah PBS</span>
            <span className="font-semibold text-slate-800">{data.profile.schoolName}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Tempoh Pelaksanaan</span>
            <span className="font-semibold text-slate-800">{data.profile.pbsDuration}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Checklist Tugasan */}
        <div 
          onClick={() => onNavigateTab('checklist')}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Checklist Harian</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {completedTasks} <span className="text-sm font-normal text-slate-400">/ {totalTasks} tugasan</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Kemajuan</span>
              <span className="font-semibold text-sky-700">{taskPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-400 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${taskPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Temu Bual */}
        <div 
          onClick={() => onNavigateTab('interviews')}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instrumen Temu Bual</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {completedInterviews} <span className="text-sm font-normal text-slate-400">/ 4 kategori</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-100">
              {completedInterviews} Selesai
            </span>
            {inProgressInterviews > 0 && (
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-100">
                {inProgressInterviews} Berjalan
              </span>
            )}
            <span className="text-slate-400 ml-auto">4 Responden</span>
          </div>
        </div>

        {/* Card 3: Pemerhatian */}
        <div 
          onClick={() => onNavigateTab('observations')}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pemerhatian Sekolah</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {observedCount} <span className="text-sm font-normal text-slate-400">/ {data.observations.length} item</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>{observedCount} Diperhatikan</span>
            {unconfirmedCount > 0 && (
              <span className="text-amber-600 font-medium">({unconfirmedCount} Tak Disahkan)</span>
            )}
            <span className="text-purple-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Lihat <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Laporan 1200 Patah Perkataan */}
        <div 
          onClick={() => onNavigateTab('report')}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Laporan Lampiran 1-6</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {totalReportWords} <span className="text-sm font-normal text-slate-400">/ 1200 patah kata</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Sasaran 1200 Patah Kata</span>
              <span className="font-semibold text-emerald-700">{reportPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${reportPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 10 Hari Persekolahan Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Jadual 10 Hari Persekolahan PBS
            </h2>
            <p className="text-xs text-slate-500">
              19 hingga 30 Oktober 2026 (Isnin hingga Jumaat) · Bebas akses mana-mana tarikh tanpa sekatan
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('checklist')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            Buka Checklist Penuh <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {data.days.map((day) => {
            const completedInDay = day.tasks.filter((t) => t.completed).length;
            const totalInDay = day.tasks.length;
            const isCompleted = day.status === 'selesai' || (totalInDay > 0 && completedInDay === totalInDay);
            const isWorking = day.status === 'sedang' || completedInDay > 0;
            const reflectionDone = data.reflections.find((r) => r.dayId === day.id)?.completed;

            return (
              <div
                key={day.id}
                onClick={() => {
                  onNavigateTab('checklist');
                  onJumpToDay(day.id);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                  day.id === lastActiveDayId
                    ? 'bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-200'
                    : isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                    : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700">Hari {day.id}</span>
                  <span className="text-[11px] text-slate-500">{day.dateDisplay.split(' ')[0]} {day.dateDisplay.split(' ')[1]}</span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {day.theme}
                </h3>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="tabular-nums font-medium">
                    {completedInDay}/{totalInDay} siap
                  </span>
                  {isCompleted ? (
                    <span className="text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                      Selesai
                    </span>
                  ) : isWorking ? (
                    <span className="text-sky-700 bg-sky-100/70 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                      Berjalan
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px]">
                      Belum
                    </span>
                  )}
                </div>

                {/* Reflection status indicator */}
                <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Refleksi</span>
                  {reflectionDone ? (
                    <span className="text-emerald-600 font-medium">✓ Lengkap</span>
                  ) : (
                    <span className="text-slate-400">Belum diisi</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Guidelines Dual Reference Cards (Lampiran 1-5 & 1-6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lampiran 1-5 Card */}
        <div className="bg-gradient-to-br from-lavender-50 to-indigo-50/40 border border-indigo-100 rounded-2xl p-6 relative">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Rujukan: Lampiran 1-5
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Panduan Perbincangan Refleksi PBS
          </h3>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Amalan refleksi ialah perlakuan memikirkan kembali pengalaman melalui penerokaan unsur ketara dan tersirat, membuat andaian rasional berpandukan fakta pemerhatian dan temu bual.
          </p>

          <div className="space-y-2 bg-white/80 rounded-xl p-3 border border-indigo-100/60 text-xs">
            <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">
              4 Ciri Utama Penulisan Refleksi:
            </div>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">1.</span>
                <span>Bermula dengan mengingat kembali pengalaman sebenar.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">2.</span>
                <span>Melibatkan domain afektif (perasaan dan reaksi kendiri).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">3.</span>
                <span>Menentukan usaha secara sedar (<em>conscious effort</em>).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">4.</span>
                <span>Bersedia mengubah sikap, kesedaran diri, amalan dan tingkah laku positif.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onNavigateTab('reflections')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              Buka Modul Refleksi <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lampiran 1-6 Card */}
        <div className="bg-gradient-to-br from-sky-50 to-indigo-50/40 border border-sky-100 rounded-2xl p-6 relative">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4 text-sky-600" />
            Rujukan: Lampiran 1-6
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Panduan Penulisan Laporan Pemerhatian PBS
          </h3>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Laporan pemerhatian disediakan untuk merekod dan menilai pengalaman sebenar guru pelatih, memahami pengurusan dan budaya pendidikan, serta menanam nilai profesionalisme keguruan (Sasaran 1200 patah perkataan).
          </p>

          <div className="space-y-2 bg-white/80 rounded-xl p-3 border border-sky-100/60 text-xs">
            <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">
              8 Bahagian Struktur Laporan:
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
              <span>1. Halaman Tajuk</span>
              <span>5. Peraturan & Disiplin</span>
              <span>2. Pengenalan</span>
              <span>6. Refleksi Diri</span>
              <span>3. Latar Belakang</span>
              <span>7. Kesimpulan</span>
              <span>4. Komuniti & Budaya</span>
              <span>8. Lampiran (Jika ada)</span>
            </div>
            <div className="text-[11px] text-sky-800 pt-1 font-medium">
              Format: Bahasa rasmi & akademik, padat dan tersusun tanpa rekaan fakta palsu.
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onNavigateTab('report')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
            >
              Buka Penulis Laporan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
