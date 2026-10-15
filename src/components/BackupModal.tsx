import React, { useRef, useState } from 'react';
import { 
  PBSAppData 
} from '../types/pbs';
import { 
  exportToJSON, 
  importFromJSON, 
  generateReportMarkdown, 
  generateInterviewsMarkdown, 
  generateReflectionsMarkdown 
} from '../utils/storage';
import { 
  Download, 
  Upload, 
  FileText, 
  Users, 
  BookOpen, 
  Printer, 
  AlertTriangle, 
  Check, 
  X, 
  ShieldCheck, 
  RefreshCw,
  FolderArchive
} from 'lucide-react';
import { INITIAL_PBS_DATA } from '../data/defaultData';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PBSAppData;
  onDataLoaded: (data: PBSAppData) => void;
  onResetData: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  data,
  onDataLoaded,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  const showStatus = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleExportJSON = () => {
    try {
      exportToJSON(data);
      showStatus('Fail JSON berjaya dimuat turun ke peranti anda!');
    } catch (e: any) {
      showStatus(`Ralat mengeksport: ${e.message}`, true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importFromJSON(content);
      if (res.success && res.data) {
        onDataLoaded(res.data);
        showStatus('Data PBS berjaya dipulihkan dari fail JSON!');
      } else {
        showStatus(res.error || 'Gagal memulihkan fail.', true);
      }
    };
    reader.onerror = () => {
      showStatus('Ralat semasa membaca fail sandaran.', true);
    };
    reader.readAsText(file);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadReportMD = () => {
    const md = generateReportMarkdown(data);
    downloadFile(md, 'laporan-pbs-lampiran-1-6.md', 'text/markdown');
    showStatus('Laporan Markdown berjaya dimuat turun!');
  };

  const handleDownloadInterviewsMD = () => {
    const md = generateInterviewsMarkdown(data);
    downloadFile(md, 'transkrip-temu-bual-pbs.md', 'text/markdown');
    showStatus('Transkrip temu bual berjaya dimuat turun!');
  };

  const handleDownloadReflectionsMD = () => {
    const md = generateReflectionsMarkdown(data);
    downloadFile(md, 'refleksi-harian-dan-akhir-pbs.md', 'text/markdown');
    showStatus('Refleksi Lampiran 1-5 berjaya dimuat turun!');
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pusat Sandaran & Eksport Data PBS
              </h2>
              <p className="text-xs text-slate-500">
                SK Tanjung Minyak 2 · Simpanan Tempatan & Eksport Dokumen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.isError
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {statusMessage.isError ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Local Storage Honest Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Penyimpanan Automatik Tempatan (Browser LocalStorage)</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Semua input anda disimpan secara langsung dalam pelayar ini. <strong>Peringatan penting:</strong> Sekiranya anda menukar komputer atau membersihkan data pelayar (clear cache), data mungkin hilang. Sila <strong>Eksport Fail JSON</strong> di bawah secara berkala untuk keselamatan mutlak.
          </p>
        </div>

        {/* Primary JSON Actions */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
            1. Sandaran Penuh Sistem (JSON)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportJSON}
              className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 font-semibold text-xs flex flex-col items-start gap-1 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Download className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span>Eksport Fail JSON</span>
              </div>
              <span className="text-[11px] text-indigo-700 font-normal">
                Simpan semua 10 hari, temu bual, pemerhatian & laporan.
              </span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex flex-col items-start gap-1 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Upload className="w-4 h-4 text-slate-600 group-hover:scale-110 transition-transform" />
                <span>Pulihkan dari Fail JSON</span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                Muat naik fail sandaran sebelumnya untuk pulihkan data.
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Markdown / Text Document Exports */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
            2. Eksport Dokumen & Transkrip (Markdown / Teks)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={handleDownloadReportMD}
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-800 text-xs text-left transition-all cursor-pointer flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Laporan PBS (.md)</span>
              </div>
              <span className="text-[10px] text-slate-500">1200 patah perkataan</span>
            </button>

            <button
              onClick={handleDownloadInterviewsMD}
              className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-800 text-xs text-left transition-all cursor-pointer flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5 font-bold text-indigo-800">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Temu Bual (.md)</span>
              </div>
              <span className="text-[10px] text-slate-500">4 kategori responden</span>
            </button>

            <button
              onClick={handleDownloadReflectionsMD}
              className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-slate-800 text-xs text-left transition-all cursor-pointer flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5 font-bold text-purple-800">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>Refleksi (.md)</span>
              </div>
              <span className="text-[10px] text-slate-500">Harian & Akhir (L1-5)</span>
            </button>
          </div>
        </div>

        {/* Reset Danger Zone */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (window.confirm('Adakah anda pasti ingin mengosongkan semua data dan kembali ke tetapan asal? Sila pastikan anda telah muat turun fail JSON terlebih dahulu!')) {
                onResetData();
                showStatus('Data telah dikosongkan ke format permulaan.');
              }
            }}
            className="text-rose-600 hover:text-rose-800 font-medium hover:underline cursor-pointer"
          >
            Kosongkan / Reset Semua Data
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
