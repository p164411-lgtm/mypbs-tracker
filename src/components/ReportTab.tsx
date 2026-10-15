import React, { useState } from 'react';
import { 
  PBSAppData, 
  ReportSection, 
  ReportSectionStatus 
} from '../types/pbs';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Eye, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  HelpCircle,
  FileDown
} from 'lucide-react';
import { countWords, generateReportMarkdown } from '../utils/storage';

interface ReportTabProps {
  data: PBSAppData;
  onUpdateSection: (id: string, updater: (prev: ReportSection) => ReportSection) => void;
}

export const ReportTab: React.FC<ReportTabProps> = ({
  data,
  onUpdateSection,
}) => {
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-2'); // Start with Pengenalan
  const [copiedReport, setCopiedReport] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);

  // Calculate live word counts
  const totalWords = data.reportSections.reduce(
    (acc, sec) => acc + countWords(sec.draftContent),
    0
  );

  const targetTotal = 1200;
  const progressPercent = Math.min(100, Math.round((totalWords / targetTotal) * 100));

  const currentSection =
    data.reportSections.find((s) => s.id === selectedSectionId) || data.reportSections[0];
  const currentSectionWords = countWords(currentSection.draftContent);

  const handleContentChange = (content: string) => {
    onUpdateSection(currentSection.id, (prev) => {
      let nextStatus: ReportSectionStatus = prev.status;
      const words = countWords(content);
      if (words >= prev.targetWords && prev.targetWords > 0) {
        nextStatus = 'lengkap';
      } else if (words > 10) {
        nextStatus = 'disunting';
      } else {
        nextStatus = 'draf';
      }
      return {
        ...prev,
        draftContent: content,
        status: nextStatus,
      };
    });
  };

  const handleStatusChange = (status: ReportSectionStatus) => {
    onUpdateSection(currentSection.id, (prev) => ({
      ...prev,
      status,
    }));
  };

  // Safe data synthesis: Inserts real data entered by user into draft
  const handleInsertRealData = (sectionId: string) => {
    const p = data.profile;

    if (sectionId === 'sec-1') {
      // Halaman Tajuk
      const text = `LAPORAN PEMERHATIAN PENGALAMAN BERASASKAN SEKOLAH (PBS)\nSEKOLAH KEBANGSAAN TANJUNG MINYAK 2, MELAKA\n\nNama Pelajar: ${p.studentName || '[Nama Pelajar]'}\nNombor Matrik: ${p.matricNo || '[Nombor Matrik]'}\nProgram: ${p.programme}\nPengkhususan: ${p.major}\nInstitut: ${p.ipgCampus}\nTempoh PBS: ${p.pbsDuration}\nPensyarah Penyelia: ${p.lecturerName || '[Nama Pensyarah Penyelia]'}\nGuru Pembimbing: ${p.mentorTeacher || '[Nama Guru Pembimbing]'}`;
      handleContentChange(text);
    } else if (sectionId === 'sec-3') {
      // Latar Belakang Sekolah from Profile and Day 2 notes
      const day2 = data.days.find((d) => d.id === 2);
      const text = `Sekolah Kebangsaan Tanjung Minyak 2 (SKTM2) beralamat di ${p.schoolAddress}. Sekolah ini beroperasi sebagai sebuah institusi pendidikan rendah kebangsaan di bawah naungan Pejabat Pendidikan Daerah (PPD) Melaka Tengah dan Jabatan Pendidikan Negeri Melaka.\n\n${day2?.notes ? `Berdasarkan rekod pentadbiran: ${day2.notes}\n\n` : ''}Pengurusan sekolah dipimpin oleh Guru Besar ${p.headmasterName || 'bersama barisan Penolong Kanan'} dengan sokongan barisan guru dan kakitangan sokongan yang berdedikasi bagi menyokong kemenjadian murid secara holistik berlandaskan Falsafah Pendidikan Kebangsaan.`;
      handleContentChange(text);
    } else if (sectionId === 'sec-4') {
      // Pemerhatian Komuniti & Budaya from Actual Observations
      const obsCulture = data.observations.filter((o) =>
        ['Budaya & Sahsiah', 'Iklim Pembelajaran', 'Komuniti & PIBG', 'Aktiviti Sekolah'].includes(o.category)
      );
      const filledObs = obsCulture.filter((o) => o.description.trim() || o.analysis.trim());

      let text = `Sepanjang tempoh 10 hari Pengalaman Berasaskan Sekolah di SK Tanjung Minyak 2, analisis pemerhatian mendalam telah dilaksanakan berkaitan komuniti dan iklim budaya sekolah.\n\n`;
      if (filledObs.length > 0) {
        filledObs.forEach((o) => {
          text += `Bagi aspek ${o.title.toLowerCase()}, hasil pemerhatian mendapati: ${o.description.trim() || 'Pemerhatian dijalankan di ' + o.location}. ${o.analysis.trim() ? `Analisis menunjukkan bahawa: ${o.analysis.trim()}` : ''}\n\n`;
        });
      } else {
        text += `Warga sekolah mengamalkan budaya perpaduan, saling menghormati dan kerjasama erat antara pihak sekolah, Persatuan Ibu Bapa dan Guru (PIBG) serta komuniti sekitar Taman Tanjung Minyak Jaya.`;
      }
      handleContentChange(text);
    } else if (sectionId === 'sec-5') {
      // Pemerhatian Peraturan & Disiplin
      const obsDisiplin = data.observations.filter((o) =>
        ['Disiplin & HEM', 'Infrastruktur & Persekitaran'].includes(o.category)
      );
      const interviewHEM = data.interviews.find((i) => i.id === 'hem');

      let text = `Pengurusan peraturan dan disiplin murid di SK Tanjung Minyak 2 berpandukan buku peraturan sekolah serta pemantauan sistem Sahsiah Diri Murid (SSDM).\n\n`;
      if (interviewHEM && interviewHEM.questions[0].answer) {
        text += `Berdasarkan temu bual bersama pentadbiran HEM: "${interviewHEM.questions[0].answer}"\n\n`;
      }
      obsDisiplin.forEach((o) => {
        if (o.description.trim()) {
          text += `Pemerhatian terhadap ${o.title.toLowerCase()}: ${o.description.trim()} ${o.analysis.trim() ? `(Ulasan: ${o.analysis.trim()})` : ''}\n\n`;
        }
      });
      handleContentChange(text);
    } else if (sectionId === 'sec-6') {
      // Refleksi Diri (draw from Final Reflection)
      const f = data.finalReflection;
      let text = `Menjalani Pengalaman Berasaskan Sekolah (PBS) di SK Tanjung Minyak 2 memberikan impak yang sangat signifikan terhadap kefahaman diri saya sebagai bakal guru Pendidikan Moral.\n\n`;
      if (f.effectiveness.trim()) {
        text += `Dari segi pencapaian matlamat: ${f.effectiveness.trim()}\n\n`;
      }
      if (f.strengthsWeaknesses.trim()) {
        text += `Penilaian kekuatan dan kelemahan: ${f.strengthsWeaknesses.trim()}\n\n`;
      }
      if (f.transformation.trim()) {
        text += `Komitmen transformasi profesional: ${f.transformation.trim()}`;
      }
      handleContentChange(text);
    }
  };

  const handleCopyReport = () => {
    const md = generateReportMarkdown(data);
    navigator.clipboard.writeText(md);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateReportMarkdown(data);
    const dateStr = new Date().toISOString().split('T')[0];
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-pbs-sk-tanjung-minyak-2-${dateStr}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Target Word Counter Top Strip */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Panduan Lampiran 1-6
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Sasaran: 1200 Patah Perkataan
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Laporan Pemerhatian Pengalaman Berasaskan Sekolah (PBS)
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveView(activeView === 'editor' ? 'preview' : 'editor')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>{activeView === 'editor' ? 'Pratonton Penuh' : 'Mod Editor'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Cetak Laporan / Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Cetak / PDF</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Muat Turun .md</span>
            </button>
          </div>
        </div>

        {/* Live Word Count Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 tabular-nums text-sm">
                {totalWords} <span className="text-xs font-normal text-slate-400">/ 1200 patah perkataan</span>
              </span>
              {totalWords >= 1200 ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px] border border-emerald-200">
                  ✓ Sasaran Tercapai!
                </span>
              ) : (
                <span className="text-slate-500 text-[11px]">
                  (Baki {Math.max(0, 1200 - totalWords)} perkataan)
                </span>
              )}
            </div>

            <span className="font-semibold text-emerald-700 text-xs">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                totalWords >= 1200
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-sky-400 to-indigo-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Guidelines Drawer */}
      {showGuidelines && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2 relative">
          <button
            onClick={() => setShowGuidelines(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            ✕
          </button>
          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
            Panduan Penulisan Lampiran 1-6:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
            <div><strong>i. Bahasa:</strong> Rasmi & akademik</div>
            <div><strong>ii. Panjang:</strong> 1200 patah perkataan</div>
            <div><strong>iii. Fon:</strong> Times New Roman/Arial 12pt, 1.5 spacing</div>
            <div><strong>iv. Fokus:</strong> Padat & pemerhatian sebenar</div>
          </div>
        </div>
      )}

      {/* VIEW A: EDITOR MODE */}
      {activeView === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section Navigation Drawer (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              8 Bahagian Laporan (Lampiran 1-6)
            </div>

            <div className="space-y-1.5">
              {data.reportSections.map((sec) => {
                const isSelected = sec.id === selectedSectionId;
                const words = countWords(sec.draftContent);
                const isTargetMet = sec.targetWords > 0 && words >= sec.targetWords;

                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900 shadow-xs font-semibold'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className={`shrink-0 w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {sec.sectionNumber}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">
                          {sec.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          Sasaran: ~{sec.targetWords} kata
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-semibold tabular-nums block ${
                        isTargetMet ? 'text-emerald-600' : words > 0 ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        {words}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">
                        {sec.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor Area (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  Bahagian {currentSection.sectionNumber} daripada 8
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {currentSection.title}
                </h2>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>Sasaran anggaran: <strong>~{currentSection.targetWords} patah perkataan</strong></span>
                  <span>·</span>
                  <span>Semasa: <strong className="text-indigo-700 tabular-nums">{currentSectionWords} perkataan</strong></span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-xs text-slate-500 font-medium">Status:</label>
                <select
                  value={currentSection.status}
                  onChange={(e) => handleStatusChange(e.target.value as ReportSectionStatus)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                >
                  <option value="draf">Draf</option>
                  <option value="disunting">Sedang Disunting</option>
                  <option value="lengkap">Lengkap</option>
                </select>
              </div>
            </div>

            {/* Section Guidance Box */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 text-xs text-sky-950 space-y-1">
              <span className="font-semibold block text-[11px] text-sky-900">
                Panduan Kandungan Lampiran 1-6:
              </span>
              <p className="leading-relaxed">
                {currentSection.guidance}
              </p>
            </div>

            {/* Safe Data Synthesis Helper Button */}
            {['sec-1', 'sec-3', 'sec-4', 'sec-5', 'sec-6'].includes(currentSection.id) && (
              <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/70 text-xs">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Jana draf awal daripada data sebenar yang telah anda masukkan</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleInsertRealData(currentSection.id)}
                  className="px-3 py-1 bg-white hover:bg-indigo-50 text-indigo-700 font-semibold rounded-lg border border-indigo-200 shadow-2xs transition-colors cursor-pointer"
                >
                  Sintesis Data Sebenar
                </button>
              </div>
            )}

            {/* Draft Textarea */}
            <div className="space-y-1.5">
              <textarea
                rows={14}
                value={currentSection.draftContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={`Tulis penulisan akademik anda untuk ${currentSection.title} di sini. Gunakan bahasa rasmi dan fokus kepada pemerhatian sebenar...`}
                className="w-full text-xs sm:text-sm p-4 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 leading-relaxed font-sans placeholder-slate-400 bg-slate-50/30 focus:bg-white transition-all"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>{currentSectionWords} patah perkataan</span>
                <span>{currentSection.draftContent.length} aksara</span>
              </div>
            </div>

            {/* Quick Section Pager */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              {currentSection.sectionNumber > 1 ? (
                <button
                  onClick={() => {
                    const prevSec = data.reportSections[currentSection.sectionNumber - 2];
                    if (prevSec) setSelectedSectionId(prevSec.id);
                  }}
                  className="text-slate-600 hover:text-indigo-600 font-medium cursor-pointer"
                >
                  ← Bahagian {currentSection.sectionNumber - 1}
                </button>
              ) : <div />}

              {currentSection.sectionNumber < 8 ? (
                <button
                  onClick={() => {
                    const nextSec = data.reportSections[currentSection.sectionNumber];
                    if (nextSec) setSelectedSectionId(nextSec.id);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer flex items-center gap-1"
                >
                  Bahagian {currentSection.sectionNumber + 1} →
                </button>
              ) : <div />}
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: PREVIEW / PRINT READY MODE */}
      {activeView === 'preview' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs max-w-4xl mx-auto space-y-8 font-serif">
          {/* Top Preview Controls */}
          <div className="no-print flex items-center justify-between pb-4 border-b border-slate-100 font-sans text-xs">
            <span className="font-semibold text-slate-600">
              Pratonton Laporan Lengkap ({totalWords} patah perkataan)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReport ? 'Tersalin' : 'Salin Semua'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Cetak PDF</span>
              </button>
            </div>
          </div>

          {/* Academic Cover & Title Header */}
          <div className="text-center space-y-3 pb-8 border-b-2 border-slate-800">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase">
              LAPORAN PEMERHATIAN PENGALAMAN BERASASKAN SEKOLAH (PBS)
            </h1>
            <h2 className="text-base sm:text-lg font-semibold text-slate-800">
              SEKOLAH KEBANGSAAN TANJUNG MINYAK 2, MELAKA
            </h2>
            <div className="text-xs text-slate-600 space-y-1 pt-2 font-sans">
              <p>Program Diploma Pascasiswazah Pendidikan (PDPP) — Pendidikan Moral (Sekolah Rendah)</p>
              <p>Institut Pendidikan Guru Kampus Ipoh, Perak</p>
              <p>Tempoh: 19 Oktober 2026 – 30 Oktober 2026</p>
            </div>
          </div>

          {/* Academic Sections */}
          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-900 text-justify">
            {data.reportSections.map((sec) => {
              if (sec.sectionNumber === 1) return null; // Cover section handled above
              return (
                <div key={sec.id} className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 uppercase border-b border-slate-200 pb-1">
                    {sec.sectionNumber}.0 {sec.title}
                  </h3>
                  {sec.draftContent.trim() ? (
                    <div className="whitespace-pre-line text-slate-800 leading-relaxed font-sans text-xs sm:text-sm">
                      {sec.draftContent.trim()}
                    </div>
                  ) : (
                    <p className="italic text-slate-400 text-xs font-sans">
                      [Kandungan bagi bahagian ini belum diisi oleh guru pelatih]
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Attached Evidences List */}
          <div className="pt-8 border-t border-slate-200 space-y-3 font-sans text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide">
              8.0 Lampiran Senarai Bukti & Dokumentasi
            </h3>
            {data.evidences.length > 0 ? (
              <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
                {data.evidences.map((ev, idx) => (
                  <li key={ev.id}>
                    <strong>{ev.title}</strong> ({ev.category}) — Lokasi/Rujukan: {ev.locationRef || 'Rekod PBS'}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 italic">Tiada lampiran bukti didaftarkan.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
