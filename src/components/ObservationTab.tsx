import React, { useState } from 'react';
import { 
  ObservationItem, 
  ObservationStatus 
} from '../types/pbs';
import { 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Plus, 
  Trash2, 
  MapPin, 
  Calendar, 
  FileCheck, 
  Info,
  Search,
  Filter
} from 'lucide-react';

interface ObservationTabProps {
  observations: ObservationItem[];
  onUpdateObservation: (id: string, updater: (prev: ObservationItem) => ObservationItem) => void;
  onAddObservation: (item: ObservationItem) => void;
  onDeleteObservation: (id: string) => void;
}

export const ObservationTab: React.FC<ObservationTabProps> = ({
  observations,
  onUpdateObservation,
  onAddObservation,
  onDeleteObservation,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New observation modal state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Pemerhatian Tambahan');
  const [newLocation, setNewLocation] = useState('');

  const handleFieldChange = (id: string, field: keyof ObservationItem, value: any) => {
    onUpdateObservation(id, (prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateObservation = () => {
    if (!newTitle.trim()) return;
    const newItem: ObservationItem = {
      id: `obs-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory.trim() || 'Pemerhatian Khusus',
      status: 'belum',
      date: new Date().toISOString().split('T')[0],
      location: newLocation.trim() || 'Kawasan SK Tanjung Minyak 2',
      evidence: '',
      description: '',
      analysis: '',
      isCustom: true,
    };
    onAddObservation(newItem);
    setNewTitle('');
    setNewLocation('');
    setShowAddModal(false);
  };

  const filteredObservations = observations.filter((obs) => {
    if (filterStatus !== 'all' && obs.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = obs.title.toLowerCase().includes(q);
      const inDesc = obs.description.toLowerCase().includes(q);
      const inLoc = obs.location.toLowerCase().includes(q);
      const inAnalysis = obs.analysis.toLowerCase().includes(q);
      return inTitle || inDesc || inLoc || inAnalysis;
    }
    return true;
  });

  const observedCount = observations.filter((o) => o.status === 'diperhatikan').length;
  const unconfirmedCount = observations.filter((o) => o.status === 'tidak_dapat_disahkan').length;
  const pendingCount = observations.filter((o) => o.status === 'belum').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Integrity Notice Banner */}
      <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs text-xs text-sky-950 leading-relaxed">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-xs font-bold text-sky-950 uppercase tracking-wide">
            Prinsip Pemerhatian Saintifik & Integriti Data
          </h2>
          <p className="mt-1">
            <strong>Jangan anggap perkara yang tidak diperhatikan sebagai tidak dilaksanakan</strong> oleh pihak sekolah. Sekiranya sesuatu aspek belum berkesempatan untuk disaksikan atau disahkan secara langsung, tandakan sebagai <em>"Tidak dapat disahkan"</em> atau <em>"Belum diperhatikan"</em>.
          </p>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-6 h-6 text-purple-600" />
            Instrumen Pemerhatian Sekolah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Merekodkan suasana fizikal, budaya, disiplin dan iklim PdP SK Tanjung Minyak 2
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick status counters */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({observations.length})
            </button>
            <button
              onClick={() => setFilterStatus('diperhatikan')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterStatus === 'diperhatikan'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Diperhatikan ({observedCount})
            </button>
            <button
              onClick={() => setFilterStatus('tidak_dapat_disahkan')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterStatus === 'tidak_dapat_disahkan'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Tak Disahkan ({unconfirmedCount})
            </button>
            <button
              onClick={() => setFilterStatus('belum')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterStatus === 'belum'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Belum ({pendingCount})
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari dalam pemerhatian, lokasi atau ulasan..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Observation Cards */}
      <div className="space-y-4">
        {filteredObservations.map((obs, idx) => {
          return (
            <div
              key={obs.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-indigo-200 transition-all shadow-xs space-y-4"
            >
              {/* Top row: Title, Category, Status selector */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {obs.category}
                    </span>
                    {obs.isCustom && (
                      <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-medium border border-indigo-100">
                        Pemerhatian Tambahan
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {obs.title}
                  </h2>
                </div>

                {/* Status Picker */}
                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-xs text-slate-500 font-medium">Status:</label>
                  <select
                    value={obs.status}
                    onChange={(e) =>
                      handleFieldChange(obs.id, 'status', e.target.value as ObservationStatus)
                    }
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-200 ${
                      obs.status === 'diperhatikan'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : obs.status === 'tidak_dapat_disahkan'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-50 text-slate-600 border-slate-300'
                    }`}
                  >
                    <option value="belum">Belum diperhatikan</option>
                    <option value="diperhatikan">✓ Diperhatikan</option>
                    <option value="tidak_dapat_disahkan">? Tidak dapat disahkan</option>
                  </select>

                  {obs.isCustom && (
                    <button
                      onClick={() => onDeleteObservation(obs.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer ml-1"
                      title="Padam Item Tambahan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Context Fields: Date, Location, Evidence Ref */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-150 text-xs">
                <div>
                  <label className="text-slate-500 font-medium block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tarikh Pemerhatian:
                  </label>
                  <input
                    type="date"
                    value={obs.date}
                    onChange={(e) => handleFieldChange(obs.id, 'date', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-500 font-medium block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Lokasi / Konteks:
                  </label>
                  <input
                    type="text"
                    value={obs.location}
                    onChange={(e) => handleFieldChange(obs.id, 'location', e.target.value)}
                    placeholder="cth: Dewan Perhimpunan / Bilik Darjah 4 Cemerlang"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-slate-500 font-medium block mb-1 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-slate-400" /> Bukti Dirujuk:
                  </label>
                  <input
                    type="text"
                    value={obs.evidence}
                    onChange={(e) => handleFieldChange(obs.id, 'evidence', e.target.value)}
                    placeholder="cth: Gambar papan notis / Buku rekod disiplin"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Two Textareas: Description & Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Huraian Pemerhatian Sebenar (Fakta & Peristiwa):
                  </label>
                  <textarea
                    rows={3}
                    value={obs.description}
                    onChange={(e) => handleFieldChange(obs.id, 'description', e.target.value)}
                    placeholder="Huraikan apa yang dilihat, didengar atau dialami secara objektif tanpa prasangka..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 placeholder-slate-400 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Ulasan & Analisis Reflektif (Implikasi Pedagogi / Nilai):
                  </label>
                  <textarea
                    rows={3}
                    value={obs.analysis}
                    onChange={(e) => handleFieldChange(obs.id, 'analysis', e.target.value)}
                    placeholder="Apakah makna amalan ini terhadap budaya sekolah dan pembentukan sahsiah murid Pendidikan Moral..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-200 text-slate-800 placeholder-slate-400 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Observation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Tambah Aspek Pemerhatian Khusus
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tajuk Pemerhatian:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="cth: Pengurusan Waktu Rehat di Kantin Sekolah"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                  autoFocus
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Kategori:
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="cth: Disiplin & Pemakanan / Kelab Sukan"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Lokasi:
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="cth: Kantin Blok C"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
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
                onClick={handleCreateObservation}
                disabled={!newTitle.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg cursor-pointer"
              >
                Simpan Pemerhatian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
