import React, { useState } from 'react';
import { 
  InterviewCategory, 
  InterviewQuestion, 
  InterviewStatus 
} from '../types/pbs';
import { 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  FileDown, 
  MessageSquare,
  Building,
  UserCheck,
  HeartHandshake
} from 'lucide-react';

interface InterviewTabProps {
  interviews: InterviewCategory[];
  onUpdateCategory: (
    categoryId: 'pentadbiran' | 'hem' | 'moral' | 'kokurikulum',
    updater: (prev: InterviewCategory) => InterviewCategory
  ) => void;
}

export const InterviewTab: React.FC<InterviewTabProps> = ({
  interviews,
  onUpdateCategory,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<'pentadbiran' | 'hem' | 'moral' | 'kokurikulum'>('pentadbiran');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');

  const currentCategory = interviews.find((i) => i.id === selectedCatId) || interviews[0];

  const handleFieldChange = (field: keyof InterviewCategory, value: any) => {
    onUpdateCategory(selectedCatId, (prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    onUpdateCategory(selectedCatId, (prev) => {
      const updatedQuestions = prev.questions.map((q) =>
        q.id === questionId ? { ...q, answer } : q
      );
      // Auto check if any questions answered or all answered
      const answeredCount = updatedQuestions.filter((q) => q.answer.trim().length > 0).length;
      let nextStatus: InterviewStatus = prev.status;
      if (answeredCount === updatedQuestions.length && answeredCount > 0) {
        nextStatus = 'selesai';
      } else if (answeredCount > 0) {
        nextStatus = 'mula';
      }

      return {
        ...prev,
        questions: updatedQuestions,
        status: nextStatus,
      };
    });
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newQ: InterviewQuestion = {
      id: `q-custom-${Date.now()}`,
      questionText: newQuestionText.trim(),
      answer: '',
      isCustom: true,
    };
    onUpdateCategory(selectedCatId, (prev) => ({
      ...prev,
      questions: [...prev.questions, newQ],
    }));
    setNewQuestionText('');
  };

  const handleDeleteQuestion = (questionId: string) => {
    onUpdateCategory(selectedCatId, (prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const copyCategoryTranscript = () => {
    let text = `INSTRUMEN TEMU BUAL: KATEGORI ${currentCategory.code} - ${currentCategory.categoryTitle}\n`;
    text += `Sekolah: SK Tanjung Minyak 2, Melaka\n`;
    text += `Responden: ${currentCategory.respondentName || 'Tanpa Nama'} (${currentCategory.respondentDesignation})\n`;
    text += `Tarikh: ${currentCategory.interviewDate}\n`;
    text += `Status: ${currentCategory.status.toUpperCase()}\n\n`;

    currentCategory.questions.forEach((q, idx) => {
      text += `[Soalan ${idx + 1}]\n${q.questionText}\n\n`;
      text += `[Jawapan]\n${q.answer.trim() || '(Tiada rekod jawapan)'}\n\n---\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedId(currentCategory.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getCategoryIcon = (code: string) => {
    switch (code) {
      case 'A': return <Building className="w-4 h-4" />;
      case 'B': return <UserCheck className="w-4 h-4" />;
      case 'C': return <HeartHandshake className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Ethic & Consent Notice */}
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs text-xs text-amber-900 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            Peringatan Etika Keguruan & Kerahsiaan Responden
          </h2>
          <p className="mt-1">
            Sebelum memulakan temu bual atau membuat sebarang rakaman suara, <strong>mohon persetujuan (consent)</strong> responden terlebih dahulu. Jelaskan bahawa maklumat ini hanya digunakan bagi tujuan akademik Pengalaman Berasaskan Sekolah (PBS) PDPP IPG Kampus Ipoh. Hormati jika responden meminta nama atau maklumat sensitif dirahsiakan.
          </p>
        </div>
      </div>

      {/* Respondent Categories Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {interviews.map((cat) => {
          const isSelected = selectedCatId === cat.id;
          const answeredCount = cat.questions.filter((q) => q.answer.trim().length > 0).length;
          const totalQ = cat.questions.length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-400 shadow-xs ring-1 ring-indigo-300'
                  : 'bg-white/80 border-slate-200 hover:border-indigo-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1">
                    {getCategoryIcon(cat.code)}
                    Kategori {cat.code}
                  </span>
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    {answeredCount}/{totalQ} dijawab
                  </span>
                </div>
                <h2 className="text-xs font-bold text-slate-900 line-clamp-1 mt-1.5">
                  {cat.categoryTitle}
                </h2>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 truncate max-w-[100px]">
                  {cat.respondentName || cat.respondentDesignation}
                </span>
                {cat.status === 'selesai' ? (
                  <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                    Selesai
                  </span>
                ) : cat.status === 'mula' ? (
                  <span className="text-amber-700 font-semibold text-[10px] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100">
                    Berjalan
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px]">
                    Belum
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Form */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/70">
                Kategori {currentCategory.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">SK Tanjung Minyak 2</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Temu Bual: {currentCategory.categoryTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {currentCategory.roleDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyCategoryTranscript}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salin transkrip kategori ini"
            >
              {copiedId === currentCategory.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Jawapan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Respondent Metadata Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-150 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nama Responden (Pilihan/Kebenaran):
            </label>
            <input
              type="text"
              value={currentCategory.respondentName}
              onChange={(e) => handleFieldChange('respondentName', e.target.value)}
              placeholder="cth: Pn. Rusnah / Dirahsiakan"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Jawatan Rasmi:
            </label>
            <input
              type="text"
              value={currentCategory.respondentDesignation}
              onChange={(e) => handleFieldChange('respondentDesignation', e.target.value)}
              placeholder="cth: Penolong Kanan Hal Ehwal Murid"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Tarikh:
              </label>
              <input
                type="date"
                value={currentCategory.interviewDate}
                onChange={(e) => handleFieldChange('interviewDate', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Status:
              </label>
              <select
                value={currentCategory.status}
                onChange={(e) => handleFieldChange('status', e.target.value as InterviewStatus)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 cursor-pointer"
              >
                <option value="belum">Belum</option>
                <option value="mula">Sedang Berjalan</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions & Long Answers */}
        <div className="space-y-6 pt-2">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
            <span>Instrumen Soalan & Transkrip Jawapan Responden</span>
            <span className="text-[11px] font-normal text-slate-400">
              Isi jawapan sebenar mengikut temubual anda
            </span>
          </div>

          <div className="space-y-5">
            {currentCategory.questions.map((q, index) => {
              const hasAnswer = q.answer.trim().length > 0;

              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-200 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-100 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <h2 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                          {q.questionText}
                        </h2>
                        {q.isCustom && (
                          <span className="text-[10px] text-indigo-600 font-medium">
                            Soalan Tambahan Guru Pelatih
                          </span>
                        )}
                      </div>
                    </div>

                    {q.isCustom && (
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer shrink-0"
                        title="Padam Soalan Tambahan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Long Answer Textarea */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Transkrip / Ringkasan Jawapan Responden:
                    </label>
                    <textarea
                      rows={4}
                      value={q.answer}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Taip jawapan atau catatan penting yang disampaikan oleh responden di sini..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed placeholder-slate-400 transition-all"
                    />
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 px-1">
                      <span>{hasAnswer ? '✓ Ada rekod jawapan' : 'Belum diisi'}</span>
                      <span>{q.answer.length} aksara</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Custom Question Box */}
          <div className="bg-slate-50/70 border border-dashed border-indigo-200 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" /> Tambah Soalan Tambahan untuk Kategori {currentCategory.code}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddQuestion();
                }}
                placeholder="Taip soalan tambahan khusus untuk diterokai..."
                className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
              />
              <button
                onClick={handleAddQuestion}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                Tambah Soalan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
