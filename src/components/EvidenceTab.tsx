import React, { useState } from 'react';
import { 
  EvidenceItem, 
  EvidenceStatus 
} from '../types/pbs';
import { 
  FolderCheck, 
  Plus, 
  Trash2, 
  ExternalLink, 
  FileText, 
  Calendar, 
  MapPin, 
  Info, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Search
} from 'lucide-react';

interface EvidenceTabProps {
  evidences: EvidenceItem[];
  onAddEvidence: (item: EvidenceItem) => void;
  onUpdateEvidence: (id: string, updater: (prev: EvidenceItem) => EvidenceItem) => void;
  onDeleteEvidence: (id: string) => void;
}

export const EvidenceTab: React.FC<EvidenceTabProps> = ({
  evidences,
  onAddEvidence,
  onUpdateEvidence,
  onDeleteEvidence,
}) => {
  const [filterCat, setFilterCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Dokumen Pentadbiran');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDescription, setNewDescription] = useState('');
  const [newLocationRef, setNewLocationRef] = useState('');
  const [newUrlLink, setNewUrlLink] = useState('');
  const [newStatus, setNewStatus] = useState<EvidenceStatus>('diperoleh');

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const item: EvidenceItem = {
      id: `ev-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      date: newDate,
      description: newDescription.trim(),
      locationRef: newLocationRef.trim() || 'Portfolio PBS',
      urlLink: newUrlLink.trim(),
      status: newStatus,
    };
    onAddEvidence(item);
    setNewTitle('');
    setNewDescription('');
    setNewLocationRef('');
    setNewUrlLink('');
    setShowAddModal(false);
  };

  const handleStatusChange = (id: string, status: EvidenceStatus) => {
    onUpdateEvidence(id, (prev) => ({
      ...prev,
      status,
    }));
  };

  const categories = [
    'Semua',
    'Dokumen Pentadbiran',
    'Disiplin & HEM',
    'Foto & Visual',
    'Instrumen Temu Bual',
    'Infrastruktur',
    'Kurikulum & PdP',
    'Komuniti & PIBG',
  ];

  const filteredEvidences = evidences.filter((ev) => {
    if (filterCat !== 'all' && ev.category !== filterCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = ev.title.toLowerCase().includes(q);
      const inDesc = ev.description.toLowerCase().includes(q);
      const inLoc = ev.locationRef.toLowerCase().includes(q);
      return inTitle || inDesc || inLoc;
    }
    return true;
  });

  const obtainedCount = evidences.filter((e) => e.status === 'diperoleh' || e.status === 'disahkan').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Honest Storage Notice Banner */}
      <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs text-xs text-indigo-950 leading-relaxed">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
            Notis Ketelusan Pengurusan Fail & Bukti
          </h2>
          <p className="mt-1">
            Aplikasi ini menyimpan rekod metadata, rujukan fizikal dan pautan storan awan (seperti Google Drive / OneDrive). Fail media sebenar seperti gambar beresolusi tinggi atau dokumen fizikal sekolah tidak disimpan dalam pangkalan data pelayar bagi mengelakkan had kuota simpanan. Pastikan anda menyimpan fail fizikal dalam fail portfolio PBS anda.
          </p>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderCheck className="w-6 h-6 text-indigo-600" />
            Senarai Bukti & Dokumentasi PBS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumen sokongan, foto aktiviti, dan bahan rujukan lampiran laporan (SK Tanjung Minyak 2)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 font-semibold">
            {obtainedCount} daripada {evidences.length} bukti diperoleh
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Bukti</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bukti mengikut tajuk, lokasi atau keterangan..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => {
            const val = c === 'Semua' ? 'all' : c;
            const isSelected = filterCat === val;
            return (
              <button
                key={c}
                onClick={() => setFilterCat(val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Evidences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidences.map((ev) => {
          return (
            <div
              key={ev.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-indigo-200 transition-all shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {ev.category}
                  </span>

                  <select
                    value={ev.status}
                    onChange={(e) =>
                      handleStatusChange(ev.id, e.target.value as EvidenceStatus)
                    }
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border cursor-pointer ${
                      ev.status === 'disahkan'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : ev.status === 'diperoleh'
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    <option value="diperoleh">Diperoleh</option>
                    <option value="disahkan">Disahkan</option>
                    <option value="diperlukan">Diperlukan</option>
                  </select>
                </div>

                <h2 className="text-sm font-bold text-slate-900 leading-snug">
                  {ev.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {ev.description || 'Tiada huraian tambahan disediakan.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{ev.locationRef || 'Portfolio Fizikal'}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{ev.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ev.urlLink && (
                      <a
                        href={ev.urlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                      >
                        Pautan <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => onDeleteEvidence(ev.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                      title="Padam Bukti"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Daftar Rekod Bukti / Dokumen Baharu
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tajuk Dokumen / Bukti:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="cth: Gambar Sudut Nilai Murni Bilik Darjah 3 Arif"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Kategori:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="Dokumen Pentadbiran">Dokumen Pentadbiran</option>
                    <option value="Disiplin & HEM">Disiplin & HEM</option>
                    <option value="Foto & Visual">Foto & Visual</option>
                    <option value="Instrumen Temu Bual">Instrumen Temu Bual</option>
                    <option value="Infrastruktur">Infrastruktur</option>
                    <option value="Kurikulum & PdP">Kurikulum & PdP</option>
                    <option value="Komuniti & PIBG">Komuniti & PIBG</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Tarikh Diperoleh:
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Lokasi / Rujukan Fizikal:
                </label>
                <input
                  type="text"
                  value={newLocationRef}
                  onChange={(e) => setNewLocationRef(e.target.value)}
                  placeholder="cth: Fail PBS No. 2 / Album Foto Telefon / Google Drive"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pautan URL Awan (Pilihan - Google Drive / OneDrive):
                </label>
                <input
                  type="url"
                  value={newUrlLink}
                  onChange={(e) => setNewUrlLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Penerangan Ringkas:
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ringkasan kandungan dan bagaimana ia menyokong pemerhatian PBS anda..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg cursor-pointer"
              >
                Simpan Rekod Bukti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
