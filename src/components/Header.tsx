import React from 'react';
import { 
  CheckSquare, 
  Users, 
  Eye, 
  BookOpen, 
  FileText, 
  FolderCheck, 
  LayoutDashboard,
  Download,
  Save,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export type TabType = 'dashboard' | 'checklist' | 'interviews' | 'observations' | 'reflections' | 'report' | 'evidences';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenBackup: () => void;
  onOpenProfile: () => void;
  studentName?: string;
  overallProgress: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBackup,
  onOpenProfile,
  studentName,
  overallProgress,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'checklist', label: 'Checklist Harian', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'interviews', label: 'Temu Bual', icon: <Users className="w-4 h-4" /> },
    { id: 'observations', label: 'Pemerhatian', icon: <Eye className="w-4 h-4" /> },
    { id: 'reflections', label: 'Refleksi', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'report', label: 'Laporan PBS', icon: <FileText className="w-4 h-4" /> },
    { id: 'evidences', label: 'Bukti & Dokumen', icon: <FolderCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border-b border-indigo-50/80 px-4 py-1.5 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="font-semibold text-indigo-700">PDPP Pendidikan Moral</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 truncate">IPG Kampus Ipoh · SK Tanjung Minyak 2 (19–30 Okt 2026)</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 shrink-0 text-slate-500">
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200">
            <Save className="w-3 h-3 text-emerald-600" /> Autosave Tempatan Aktif
          </span>
          <button 
            onClick={onOpenProfile} 
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline cursor-pointer"
          >
            {studentName ? `Pelajar: ${studentName}` : '+ Isi Profil Pelajar'}
          </button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  My PBS Tracker
                </span>
                <span className="block text-[11px] font-medium text-slate-500">
                  SK Tanjung Minyak 2
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Progress Pill + Export / Backup Button */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-50 border border-sky-100 text-xs text-sky-800">
              <span className="font-semibold">{overallProgress}%</span>
              <span className="text-slate-400">selesai</span>
            </div>

            <button
              onClick={onOpenBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-lg transition-colors cursor-pointer"
              title="Sandaran & Eksport Data"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Sandaran / Eksport</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Buka menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-indigo-100 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in fade-in duration-150">
          <div className="sm:hidden pb-2 mb-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <button 
              onClick={() => { onOpenProfile(); setMobileMenuOpen(false); }}
              className="text-indigo-600 font-medium hover:underline text-left truncate"
            >
              {studentName ? `Pelajar: ${studentName}` : '+ Isi Profil Pelajar'}
            </button>
            <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
              {overallProgress}% Siap
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
