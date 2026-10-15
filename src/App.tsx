/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  PBSAppData, 
  DayPlan, 
  InterviewCategory, 
  ObservationItem, 
  DailyReflection, 
  FinalReflection, 
  ReportSection, 
  EvidenceItem, 
  UserProfile 
} from './types/pbs';
import { loadPBSData, savePBSData, countWords } from './utils/storage';
import { INITIAL_PBS_DATA } from './data/defaultData';
import { Header, TabType } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { ChecklistTab } from './components/ChecklistTab';
import { InterviewTab } from './components/InterviewTab';
import { ObservationTab } from './components/ObservationTab';
import { ReflectionTab } from './components/ReflectionTab';
import { ReportTab } from './components/ReportTab';
import { EvidenceTab } from './components/EvidenceTab';
import { BackupModal } from './components/BackupModal';
import { ProfileModal } from './components/ProfileModal';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Eye, 
  BookOpen, 
  FileText, 
  FolderCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState<PBSAppData>(() => loadPBSData());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeJumpDay, setActiveJumpDay] = useState<number>(1);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Autosave to localStorage on changes
  useEffect(() => {
    savePBSData(data);
  }, [data]);

  // Compute overall progress percentage
  const totalTasks = data.days.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = data.days.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
    0
  );
  const taskPct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const interviewPct = (data.interviews.filter((i) => i.status === 'selesai').length / 4) * 100;
  const observationPct = (data.observations.filter((o) => o.status === 'diperhatikan').length / (data.observations.length || 1)) * 100;
  const reflectionCount = data.reflections.filter((r) => r.completed).length + (data.finalReflection.completed ? 1 : 0);
  const reflectionPct = (reflectionCount / 11) * 100;
  const totalWords = data.reportSections.reduce((acc, s) => acc + countWords(s.draftContent), 0);
  const reportPct = Math.min(100, (totalWords / 1200) * 100);

  const overallProgress = Math.round(
    taskPct * 0.3 +
    interviewPct * 0.2 +
    observationPct * 0.2 +
    reflectionPct * 0.15 +
    reportPct * 0.15
  );

  // Updaters
  const handleUpdateDay = (dayId: number, updater: (prev: DayPlan) => DayPlan) => {
    setData((prev) => ({
      ...prev,
      lastActiveDay: dayId,
      days: prev.days.map((d) => (d.id === dayId ? updater(d) : d)),
    }));
  };

  const handleUpdateInterview = (
    categoryId: 'pentadbiran' | 'hem' | 'moral' | 'kokurikulum',
    updater: (prev: InterviewCategory) => InterviewCategory
  ) => {
    setData((prev) => ({
      ...prev,
      interviews: prev.interviews.map((cat) => (cat.id === categoryId ? updater(cat) : cat)),
    }));
  };

  const handleUpdateObservation = (id: string, updater: (prev: ObservationItem) => ObservationItem) => {
    setData((prev) => ({
      ...prev,
      observations: prev.observations.map((obs) => (obs.id === id ? updater(obs) : obs)),
    }));
  };

  const handleAddObservation = (item: ObservationItem) => {
    setData((prev) => ({
      ...prev,
      observations: [item, ...prev.observations],
    }));
  };

  const handleDeleteObservation = (id: string) => {
    setData((prev) => ({
      ...prev,
      observations: prev.observations.filter((o) => o.id !== id),
    }));
  };

  const handleUpdateDailyReflection = (dayId: number, updater: (prev: DailyReflection) => DailyReflection) => {
    setData((prev) => ({
      ...prev,
      reflections: prev.reflections.map((r) => (r.dayId === dayId ? updater(r) : r)),
    }));
  };

  const handleUpdateFinalReflection = (updater: (prev: FinalReflection) => FinalReflection) => {
    setData((prev) => ({
      ...prev,
      finalReflection: updater(prev.finalReflection),
    }));
  };

  const handleUpdateSection = (id: string, updater: (prev: ReportSection) => ReportSection) => {
    setData((prev) => ({
      ...prev,
      reportSections: prev.reportSections.map((sec) => (sec.id === id ? updater(sec) : sec)),
    }));
  };

  const handleAddEvidence = (item: EvidenceItem) => {
    setData((prev) => ({
      ...prev,
      evidences: [item, ...prev.evidences],
    }));
  };

  const handleUpdateEvidence = (id: string, updater: (prev: EvidenceItem) => EvidenceItem) => {
    setData((prev) => ({
      ...prev,
      evidences: prev.evidences.map((e) => (e.id === id ? updater(e) : e)),
    }));
  };

  const handleDeleteEvidence = (id: string) => {
    setData((prev) => ({
      ...prev,
      evidences: prev.evidences.filter((e) => e.id !== id),
    }));
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setData((prev) => ({
      ...prev,
      profile,
    }));
  };

  const handleResetData = () => {
    setData(INITIAL_PBS_DATA);
  };

  const handleJumpToDay = (dayId: number) => {
    setActiveJumpDay(dayId);
    setActiveTab('checklist');
  };

  const handleNavigateToReflection = (dayId: number) => {
    setActiveJumpDay(dayId);
    setActiveTab('reflections');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-16 lg:pb-0">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBackup={() => setBackupModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        studentName={data.profile.studentName}
        overallProgress={overallProgress}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            data={data}
            onNavigateTab={setActiveTab}
            onJumpToDay={handleJumpToDay}
            onOpenProfile={() => setProfileModalOpen(true)}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistTab
            days={data.days}
            onUpdateDay={handleUpdateDay}
            onNavigateToReflection={handleNavigateToReflection}
            activeJumpDay={activeJumpDay}
          />
        )}

        {activeTab === 'interviews' && (
          <InterviewTab
            interviews={data.interviews}
            onUpdateCategory={handleUpdateInterview}
          />
        )}

        {activeTab === 'observations' && (
          <ObservationTab
            observations={data.observations}
            onUpdateObservation={handleUpdateObservation}
            onAddObservation={handleAddObservation}
            onDeleteObservation={handleDeleteObservation}
          />
        )}

        {activeTab === 'reflections' && (
          <ReflectionTab
            reflections={data.reflections}
            finalReflection={data.finalReflection}
            onUpdateDailyReflection={handleUpdateDailyReflection}
            onUpdateFinalReflection={handleUpdateFinalReflection}
            selectedDayId={activeJumpDay}
          />
        )}

        {activeTab === 'report' && (
          <ReportTab
            data={data}
            onUpdateSection={handleUpdateSection}
          />
        )}

        {activeTab === 'evidences' && (
          <EvidenceTab
            evidences={data.evidences}
            onAddEvidence={handleAddEvidence}
            onUpdateEvidence={handleUpdateEvidence}
            onDeleteEvidence={handleDeleteEvidence}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200/80 bg-white/70 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-700">My PBS Tracker — SK Tanjung Minyak 2, Melaka</span>
            <p className="text-[11px] text-slate-400">
              Pengalaman Berasaskan Sekolah · PDPP Pendidikan Moral (Ambilan 2026) · IPG Kampus Ipoh
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button 
              onClick={() => setBackupModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
            >
              Sandaran & Eksport
            </button>
            <span>·</span>
            <span className="text-slate-400">Rujukan: Lampiran 1-5 & 1-6</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Thumb Bar (Friendly for iPhone & Android) */}
      <div className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'checklist' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('interviews')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'interviews' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Temu Bual</span>
        </button>

        <button
          onClick={() => setActiveTab('observations')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'observations' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Pemerhatian</span>
        </button>

        <button
          onClick={() => setActiveTab('reflections')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'reflections' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Refleksi</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'report' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Laporan</span>
        </button>
      </div>

      {/* Modals */}
      <BackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        data={data}
        onDataLoaded={(loadedData) => setData(loadedData)}
        onResetData={handleResetData}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={data.profile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
