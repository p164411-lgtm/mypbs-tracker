import React, { useState } from 'react';
import { 
  DailyReflection, 
  FinalReflection 
} from '../types/pbs';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Brain, 
  Target, 
  Flame, 
  Copy, 
  Check, 
  ChevronRight,
  ChevronLeft,
  Calendar,
  Award
} from 'lucide-react';

interface ReflectionTabProps {
  reflections: DailyReflection[];
  finalReflection: FinalReflection;
  onUpdateDailyReflection: (dayId: number, updater: (prev: DailyReflection) => DailyReflection) => void;
  onUpdateFinalReflection: (updater: (prev: FinalReflection) => FinalReflection) => void;
  selectedDayId?: number;
}

export const ReflectionTab: React.FC<ReflectionTabProps> = ({
  reflections,
  finalReflection,
  onUpdateDailyReflection,
  onUpdateFinalReflection,
  selectedDayId = 1,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'final'>('daily');
  const [currentDay, setCurrentDay] = useState<number>(selectedDayId || 1);
  const [copiedDaily, setCopiedDaily] = useState(false);
  const [copiedFinal, setCopiedFinal] = useState(false);

  const activeReflection = reflections.find((r) => r.dayId === currentDay) || reflections[0];

  const handleFieldChange = (field: keyof DailyReflection, value: any) => {
    onUpdateDailyReflection(currentDay, (prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      // Auto determine if all 5 questions are filled
      const isComplete =
        updated.activity.trim().length > 0 &&
        updated.feelings.trim().length > 0 &&
        updated.strengthsWeaknesses.trim().length > 0 &&
        updated.learning.trim().length > 0 &&
        updated.actions.trim().length > 0;

      return {
        ...updated,
        completed: isComplete,
      };
    });
  };

  const handleFinalFieldChange = (field: keyof FinalReflection, value: any) => {
    onUpdateFinalReflection((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      const isComplete =
        updated.effectiveness.trim().length > 0 &&
        updated.strengthsWeaknesses.trim().length > 0 &&
        updated.improvements.trim().length > 0 &&
        updated.transformation.trim().length > 0;

      return {
        ...updated,
        completed: isComplete,
      };
    });
  };

  const copyDailyToClipboard = () => {
    let text = `REFLEKSI HARIAN: HARI ${activeReflection.dayId} (${activeReflection.dateDisplay})\n`;
    text += `Sekolah: SK Tanjung Minyak 2, Melaka\n`;
    text += `Rujukan: Lampiran 1-5 Garis Panduan PDPP\n\n`;
    text += `1. Apakah pengalaman atau aktiviti utama hari ini?\n${activeReflection.activity || '-'}\n\n`;
    text += `2. Apakah perasaan dan reaksi saya terhadap pengalaman itu?\n${activeReflection.feelings || '-'}\n\n`;
    text += `3. Apakah kekuatan dan kelemahan yang dikenal pasti?\n${activeReflection.strengthsWeaknesses || '-'}\n\n`;
    text += `4. Apakah pengajaran yang saya peroleh sebagai bakal guru?\n${activeReflection.learning || '-'}\n\n`;
    text += `5. Apakah tindakan atau penambahbaikan yang akan saya lakukan?\n${activeReflection.actions || '-'}\n`;

    navigator.clipboard.writeText(text);
    setCopiedDaily(true);
    setTimeout(() => setCopiedDaily(false), 2000);
  };

  const copyFinalToClipboard = () => {
    let text = `REFLEKSI AKHIR KESELURUHAN PBS (LAMPIRAN 1-5 BAHAGIAN 4)\n`;
    text += `Sekolah: SK Tanjung Minyak 2, Melaka (19 - 30 Oktober 2026)\n\n`;
    text += `1. Sejauh manakah keberkesanan pelaksanaan PBS yang dirancang telah tercapai?\n${finalReflection.effectiveness || '-'}\n\n`;
    text += `2. Apakah kekuatan dan kelemahan yang dapat dikenal pasti?\n${finalReflection.strengthsWeaknesses || '-'}\n\n`;
    text += `3. Apakah cadangan penambahbaikan berdasarkan kelemahan yang dikenal pasti?\n${finalReflection.improvements || '-'}\n\n`;
    text += `4. Rumusan komitmen dan kesediaan mengubah sikap, kesedaran diri, amalan dan tingkah laku positif:\n${finalReflection.transformation || '-'}\n`;

    navigator.clipboard.writeText(text);
    setCopiedFinal(true);
    setTimeout(() => setCopiedFinal(false), 2000);
  };

  const completedDailyCount = reflections.filter((r) => r.completed).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Lampiran 1-5 Criteria Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 border border-indigo-150 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-700" />
            <h2 className="text-sm font-bold text-indigo-950 uppercase tracking-wide">
              Panduan Perbincangan Refleksi PBS (Lampiran 1-5)
            </h2>
          </div>
          <span className="text-[11px] text-indigo-700 font-semibold bg-white/80 px-2.5 py-0.5 rounded-full border border-indigo-200">
            Kualiti Domain Afektif
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Amalan refleksi dalam PBS membolehkan guru pelatih menaakul, memilih strategi, dan menilai kendiri bagi menghayati profesion keguruan. Penulisan refleksi mesti memenuhi 4 teras ini:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/80 flex items-start gap-2">
            <Brain className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block text-[11px]">1. Pengalaman</span>
              <span className="text-[11px] text-slate-500">Mengingat kembali peristiwa sebenar.</span>
            </div>
          </div>

          <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/80 flex items-start gap-2">
            <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block text-[11px]">2. Domain Afektif</span>
              <span className="text-[11px] text-slate-500">Menyatakan emosi & reaksi batiniah.</span>
            </div>
          </div>

          <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/80 flex items-start gap-2">
            <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block text-[11px]">3. Usaha Sedar</span>
              <span className="text-[11px] text-slate-500">Conscious effort mengenalpasti punca.</span>
            </div>
          </div>

          <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/80 flex items-start gap-2">
            <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block text-[11px]">4. Amalan Positif</span>
              <span className="text-[11px] text-slate-500">Bersedia mengubah amalan keguruan.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab switcher: Daily vs Final */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('daily')}
            className={`pb-3 text-xs font-bold transition-colors relative cursor-pointer ${
              activeSubTab === 'daily'
                ? 'text-indigo-700 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Refleksi Harian (10 Hari)
            <span className="ml-1.5 px-2 py-0.5 text-[10px] bg-slate-100 rounded-full text-slate-600">
              {completedDailyCount}/10
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('final')}
            className={`pb-3 text-xs font-bold transition-colors relative cursor-pointer ${
              activeSubTab === 'final'
                ? 'text-indigo-700 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Refleksi Akhir PBS (Lampiran 1-5 Bahagian 4)
            {finalReflection.completed && (
              <span className="ml-1.5 px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                ✓ Siap
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW A: DAILY REFLECTIONS */}
      {activeSubTab === 'daily' && (
        <div className="space-y-6">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {reflections.map((r) => {
              const isSelected = r.dayId === currentDay;
              return (
                <button
                  key={r.dayId}
                  onClick={() => setCurrentDay(r.dayId)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : r.completed
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>Hari {r.dayId}</span>
                  {r.completed && <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />}
                </button>
              );
            })}
          </div>

          {/* Active Day Reflection Form */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                    Hari {activeReflection.dayId}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeReflection.dateDisplay} · SK Tanjung Minyak 2
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Borang Refleksi Harian (5 Soalan Panduan)
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyDailyToClipboard}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedDaily ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salin Refleksi Hari Ini</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    disabled={currentDay <= 1}
                    onClick={() => setCurrentDay((prev) => Math.max(1, prev - 1))}
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                    title="Hari Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentDay >= 10}
                    onClick={() => setCurrentDay((prev) => Math.min(10, prev + 1))}
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                    title="Hari Seterusnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 5 Prompts */}
            <div className="space-y-5">
              {/* Question 1 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] flex items-center justify-center font-bold">1</span>
                  <span>Apakah pengalaman atau aktiviti utama hari ini?</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-auto">(Mengingat kembali peristiwa)</span>
                </label>
                <textarea
                  rows={3}
                  value={activeReflection.activity}
                  onChange={(e) => handleFieldChange('activity', e.target.value)}
                  placeholder="Huraikan aktiviti sebenar yang anda jalankan hari ini (cth: Lapor diri, sesi temu bual bersama pentadbir, menghadiri perhimpunan pagi)..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed placeholder-slate-400 bg-slate-50/40 focus:bg-white transition-all"
                />
              </div>

              {/* Question 2 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-rose-50 text-rose-700 text-[11px] flex items-center justify-center font-bold">2</span>
                  <span>Apakah perasaan dan reaksi saya terhadap pengalaman itu?</span>
                  <span className="text-[10px] text-rose-600 font-normal ml-auto">(Domain Afektif)</span>
                </label>
                <textarea
                  rows={3}
                  value={activeReflection.feelings}
                  onChange={(e) => handleFieldChange('feelings', e.target.value)}
                  placeholder="Kongsikan emosi dan reaksi dalaman anda (cth: Rasa teruja, sedikit gementar tetapi terharu dengan sambutan mesra warga sekolah)..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed placeholder-slate-400 bg-slate-50/40 focus:bg-white transition-all"
                />
              </div>

              {/* Question 3 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-amber-50 text-amber-700 text-[11px] flex items-center justify-center font-bold">3</span>
                  <span>Apakah kekuatan dan kelemahan yang dikenal pasti?</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-auto">(Analisis Kritis)</span>
                </label>
                <textarea
                  rows={3}
                  value={activeReflection.strengthsWeaknesses}
                  onChange={(e) => handleFieldChange('strengthsWeaknesses', e.target.value)}
                  placeholder="Kekuatan: Kerjasama erat pihak sekolah / Kelemahan: Masa pemerhatian terhad disebabkan kekangan jadual PdP..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed placeholder-slate-400 bg-slate-50/40 focus:bg-white transition-all"
                />
              </div>

              {/* Question 4 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-sky-50 text-sky-700 text-[11px] flex items-center justify-center font-bold">4</span>
                  <span>Apakah pengajaran yang saya peroleh sebagai bakal guru?</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-auto">(Kefahaman Keguruan)</span>
                </label>
                <textarea
                  rows={3}
                  value={activeReflection.learning}
                  onChange={(e) => handleFieldChange('learning', e.target.value)}
                  placeholder="Apakah nilai profesional, pedagogi moral, atau hikmah kepimpinan yang anda pelajari hari ini..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed placeholder-slate-400 bg-slate-50/40 focus:bg-white transition-all"
                />
              </div>

              {/* Question 5 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] flex items-center justify-center font-bold">5</span>
                  <span>Apakah tindakan atau penambahbaikan yang akan saya lakukan?</span>
                  <span className="text-[10px] text-emerald-700 font-normal ml-auto">(Kesediaan Mengubah Amalan)</span>
                </label>
                <textarea
                  rows={3}
                  value={activeReflection.actions}
                  onChange={(e) => handleFieldChange('actions', e.target.value)}
                  placeholder="Langkah konkrit yang akan anda laksanakan untuk esok hari atau dalam amalan keguruan masa hadapan..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed placeholder-slate-400 bg-slate-50/40 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Bottom Status feedback */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                {activeReflection.completed ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Refleksi Hari {currentDay} Lengkap
                  </span>
                ) : (
                  <span>Sila lengkapkan kelima-lima aspek refleksi di atas.</span>
                )}
              </span>

              {currentDay < 10 && (
                <button
                  onClick={() => setCurrentDay((prev) => prev + 1)}
                  className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Refleksi Hari {currentDay + 1} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: FINAL REFLECTION (Lampiran 1-5 Bahagian 4) */}
      {activeSubTab === 'final' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                  Lampiran 1-5 Bahagian 4
                </span>
                <span className="text-xs text-slate-500 font-medium">Penilaian Kendiri Keseluruhan PBS</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 mt-1">
                Refleksi Akhir Pelaksanaan PBS (10 Hari)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Proses mengkaji semula keberkesanan pelaksanaan PBS bagi mempertingkatkan kemahiran dan jati diri keguruan.
              </p>
            </div>

            <button
              onClick={copyFinalToClipboard}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copiedFinal ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin Refleksi Akhir</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {/* 1.1 Keberkesanan */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">1.1</span>
                <span>Sejauh manakah keberkesanan pelaksanaan PBS yang dirancang telah tercapai?</span>
              </label>
              <textarea
                rows={4}
                value={finalReflection.effectiveness}
                onChange={(e) => handleFinalFieldChange('effectiveness', e.target.value)}
                placeholder="Nilaikan pencapaian matlamat dan objektif PBS anda sepanjang 10 hari di SK Tanjung Minyak 2..."
                className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed placeholder-slate-400 bg-slate-50/40 focus:bg-white transition-all"
              />
            </div>

            {/* 1.2 Kekuatan dan Kelemahan */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">1.2</span>
                <span>Apakah kekuatan dan kelemahan yang dapat dikenal pasti?</span>
              </label>
              <textarea
                rows={4}
                value={finalReflection.strengthsWeaknesses}
                onChange={(e) => handleFinalFieldChange('strengthsWeaknesses', e.target.value)}
                placeholder="Huraikan kekuatan diri/sistem sekolah serta kelemahan atau kekangan yang dialami sepanjang proses PBS..."
                className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed placeholder-slate-400 bg-slate-50/40 focus:bg-white transition-all"
              />
            </div>

            {/* 1.3 Cadangan Penambahbaikan */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">1.3</span>
                <span>Apakah cadangan penambahbaikan berdasarkan kelemahan yang dikenal pasti?</span>
              </label>
              <textarea
                rows={4}
                value={finalReflection.improvements}
                onChange={(e) => handleFinalFieldChange('improvements', e.target.value)}
                placeholder="Cadangkan tindakan penambahbaikan praktikal bagi mengatasi kelemahan tersebut pada masa akan datang..."
                className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed placeholder-slate-400 bg-slate-50/40 focus:bg-white transition-all"
              />
            </div>

            {/* 1.4 Kesediaan Mengubah Amalan & Sikap Positif */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold">1.4</span>
                <span>Rumusan Kesediaan Mengubah Sikap, Kesedaran Diri, Amalan dan Tingkah Laku Positif:</span>
              </label>
              <textarea
                rows={4}
                value={finalReflection.transformation}
                onChange={(e) => handleFinalFieldChange('transformation', e.target.value)}
                placeholder="Bagaimanakah pengalaman PBS ini mengubah persepsi, kematangan emosi, dan iltizam profesional anda sebagai guru Pendidikan Moral..."
                className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-200 text-slate-800 leading-relaxed placeholder-slate-400 bg-slate-50/40 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
