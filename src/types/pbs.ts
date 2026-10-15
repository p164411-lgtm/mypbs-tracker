export type DayStatus = 'belum' | 'sedang' | 'selesai';

export interface ChecklistTask {
  id: string;
  title: string;
  completed: boolean;
  isCustom?: boolean;
}

export interface DayPlan {
  id: number; // 1 to 10
  dayName: string; // e.g. "Hari 1 (Isnin)"
  dateDisplay: string; // "19 Okt 2026"
  dateIso: string; // "2026-10-19"
  theme: string;
  description: string;
  status: DayStatus;
  tasks: ChecklistTask[];
  notes: string;
}

export interface InterviewQuestion {
  id: string;
  questionText: string;
  answer: string;
  isCustom?: boolean;
}

export type InterviewStatus = 'belum' | 'mula' | 'selesai';

export interface InterviewCategory {
  id: 'pentadbiran' | 'hem' | 'moral' | 'kokurikulum';
  code: 'A' | 'B' | 'C' | 'D';
  categoryTitle: string;
  roleDescription: string;
  respondentName: string;
  respondentDesignation: string;
  interviewDate: string;
  status: InterviewStatus;
  questions: InterviewQuestion[];
}

export type ObservationStatus = 'belum' | 'diperhatikan' | 'tidak_dapat_disahkan';

export interface ObservationItem {
  id: string;
  title: string;
  category: string;
  status: ObservationStatus;
  date: string;
  location: string;
  evidence: string;
  description: string;
  analysis: string;
  isCustom?: boolean;
}

export interface DailyReflection {
  dayId: number;
  dateDisplay: string;
  activity: string; // 1. Apakah pengalaman atau aktiviti utama hari ini?
  feelings: string; // 2. Apakah perasaan dan reaksi saya terhadap pengalaman itu?
  strengthsWeaknesses: string; // 3. Apakah kekuatan dan kelemahan yang dikenal pasti?
  learning: string; // 4. Apakah pengajaran yang saya peroleh sebagai bakal guru?
  actions: string; // 5. Apakah tindakan atau penambahbaikan yang akan saya lakukan?
  completed: boolean;
}

export interface FinalReflection {
  effectiveness: string; // Sejauh manakah keberkesanan pelaksanaan PBS yang dirancang telah tercapai?
  strengthsWeaknesses: string; // Apakah kekuatan dan kelemahan yang dapat dikenal pasti?
  improvements: string; // Apakah cadangan penambahbaikan berdasarkan kelemahan yang dikenal pasti?
  transformation: string; // Kesediaan mengubah sikap, kesedaran diri, amalan dan tingkah laku positif
  completed: boolean;
}

export type ReportSectionStatus = 'draf' | 'disunting' | 'lengkap';

export interface ReportSection {
  id: string;
  sectionNumber: number;
  title: string;
  targetWords: number;
  draftContent: string;
  status: ReportSectionStatus;
  guidance: string;
}

export type EvidenceStatus = 'diperlukan' | 'diperoleh' | 'disahkan';

export interface EvidenceItem {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  locationRef: string;
  urlLink?: string;
  status: EvidenceStatus;
}

export interface UserProfile {
  studentName: string;
  matricNo: string;
  programme: string;
  major: string;
  ipgCampus: string;
  schoolName: string;
  schoolAddress: string;
  pbsDuration: string;
  lecturerName: string;
  mentorTeacher: string;
  headmasterName: string;
}

export interface PBSAppData {
  version: string;
  lastUpdated: string;
  lastActiveDay: number;
  profile: UserProfile;
  days: DayPlan[];
  interviews: InterviewCategory[];
  observations: ObservationItem[];
  reflections: DailyReflection[];
  finalReflection: FinalReflection;
  reportSections: ReportSection[];
  evidences: EvidenceItem[];
}
