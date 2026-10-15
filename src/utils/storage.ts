import { PBSAppData } from '../types/pbs';
import { INITIAL_PBS_DATA } from '../data/defaultData';

const STORAGE_KEY = 'my_pbs_tracker_sk_tanjung_minyak_2_data';

export function loadPBSData(): PBSAppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_PBS_DATA;
    }
    const parsed = JSON.parse(raw);
    // Ensure all critical top-level properties exist
    return {
      ...INITIAL_PBS_DATA,
      ...parsed,
      profile: { ...INITIAL_PBS_DATA.profile, ...(parsed.profile || {}) },
      days: parsed.days || INITIAL_PBS_DATA.days,
      interviews: parsed.interviews || INITIAL_PBS_DATA.interviews,
      observations: parsed.observations || INITIAL_PBS_DATA.observations,
      reflections: parsed.reflections || INITIAL_PBS_DATA.reflections,
      finalReflection: { ...INITIAL_PBS_DATA.finalReflection, ...(parsed.finalReflection || {}) },
      reportSections: parsed.reportSections || INITIAL_PBS_DATA.reportSections,
      evidences: parsed.evidences || INITIAL_PBS_DATA.evidences,
    };
  } catch (error) {
    console.error('Ralat memuatkan data dari simpanan setempat:', error);
    return INITIAL_PBS_DATA;
  }
}

export function savePBSData(data: PBSAppData): { success: boolean; error?: string } {
  try {
    const updated = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true };
  } catch (error: any) {
    console.error('Ralat menyimpan data ke storan setempat:', error);
    return {
      success: false,
      error: error?.message || 'Storan pelayar penuh atau tidak dapat diakses.',
    };
  }
}

export function countWords(text: string): number {
  if (!text) return 0;
  const cleaned = text.trim();
  if (!cleaned) return 0;
  // Match whitespace-separated non-empty words
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.length;
}

export function exportToJSON(data: PBSAppData): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `my-pbs-tracker-sktm2-${dateStr}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromJSON(fileContent: string): { success: boolean; data?: PBSAppData; error?: string } {
  try {
    const parsed = JSON.parse(fileContent);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Format fail JSON tidak sah.' };
    }
    if (!parsed.days || !Array.isArray(parsed.days) || !parsed.interviews) {
      return { success: false, error: 'Struktur data PBS tidak lengkap atau tidak serasi.' };
    }
    const validated: PBSAppData = {
      ...INITIAL_PBS_DATA,
      ...parsed,
      profile: { ...INITIAL_PBS_DATA.profile, ...(parsed.profile || {}) },
      days: parsed.days,
      interviews: parsed.interviews,
      observations: parsed.observations || INITIAL_PBS_DATA.observations,
      reflections: parsed.reflections || INITIAL_PBS_DATA.reflections,
      finalReflection: { ...INITIAL_PBS_DATA.finalReflection, ...(parsed.finalReflection || {}) },
      reportSections: parsed.reportSections || INITIAL_PBS_DATA.reportSections,
      evidences: parsed.evidences || INITIAL_PBS_DATA.evidences,
    };
    return { success: true, data: validated };
  } catch (e: any) {
    return { success: false, error: `Gagal membaca fail: ${e.message}` };
  }
}

export function generateReportMarkdown(data: PBSAppData): string {
  const p = data.profile;
  const dateExport = new Date().toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let md = `# LAPORAN PEMERHATIAN PENGALAMAN BERASASKAN SEKOLAH (PBS)\n`;
  md += `## SK TANJUNG MINYAK 2, MELAKA\n\n`;
  md += `*Dijana pada: ${dateExport} | Rujukan: Lampiran 1-6 (1200 Patah Perkataan)*\n\n`;
  md += `---\n\n`;

  md += `### 1. HALAMAN MAKLUMAT PELAJAR & SEKOLAH\n\n`;
  md += `- **Nama Pelajar**: ${p.studentName || '[Nama Pelajar]'}\n`;
  md += `- **No. Matrik**: ${p.matricNo || '[No. Matrik]'}\n`;
  md += `- **Program**: ${p.programme} - ${p.major}\n`;
  md += `- **Institut**: ${p.ipgCampus}\n`;
  md += `- **Sekolah PBS**: ${p.schoolName}, ${p.schoolAddress}\n`;
  md += `- **Tempoh PBS**: ${p.pbsDuration}\n`;
  md += `- **Pensyarah Penyelia**: ${p.lecturerName || '[Pensyarah Penyelia]'}\n`;
  md += `- **Guru Pembimbing**: ${p.mentorTeacher || '[Guru Pembimbing]'}\n\n`;

  md += `---\n\n`;

  // Add each section from reportSections
  data.reportSections.forEach((sec) => {
    if (sec.sectionNumber === 1) return; // skip header since shown above
    const wordCount = countWords(sec.draftContent);
    md += `### ${sec.sectionNumber}. ${sec.title.toUpperCase()} (${wordCount} perkataan)\n\n`;
    if (sec.draftContent.trim()) {
      md += `${sec.draftContent.trim()}\n\n`;
    } else {
      md += `*[Kandungan belum diisi bagi seksyen ini]*\n\n`;
    }
  });

  md += `---\n\n`;
  md += `### LAMPIRAN BUKTI & DOKUMENTASI\n\n`;
  if (data.evidences.length > 0) {
    data.evidences.forEach((ev, idx) => {
      md += `${idx + 1}. **${ev.title}** (${ev.category})\n`;
      md += `   - Lokasi / Rujukan: ${ev.locationRef || 'Tiada rekod fizikal'}\n`;
      md += `   - Penerangan: ${ev.description || '-'}\n`;
      if (ev.urlLink) md += `   - Pautan: ${ev.urlLink}\n`;
    });
  } else {
    md += `Tiada bukti direkodkan.\n`;
  }

  return md;
}

export function generateInterviewsMarkdown(data: PBSAppData): string {
  let md = `# REKOD INSTRUMEN TEMU BUAL PBS — SK TANJUNG MINYAK 2\n\n`;
  md += `*Program Diploma Pascasiswazah Pendidikan (PDPP) Pendidikan Moral, IPG Kampus Ipoh*\n\n`;
  md += `---\n\n`;

  data.interviews.forEach((cat) => {
    md += `## Kategori ${cat.code}: ${cat.categoryTitle}\n`;
    md += `- **Nama Responden**: ${cat.respondentName || 'Belum dinyatakan'}\n`;
    md += `- **Jawatan**: ${cat.respondentDesignation}\n`;
    md += `- **Tarikh Temu Bual**: ${cat.interviewDate || 'Belum ditetapkan'}\n`;
    md += `- **Status**: ${cat.status.toUpperCase()}\n\n`;

    cat.questions.forEach((q, idx) => {
      md += `### Soalan ${idx + 1}:\n${q.questionText}\n\n`;
      md += `**Jawapan / Catatan:**\n${q.answer.trim() ? q.answer.trim() : '*[Belum ada jawapan direkodkan]*'}\n\n`;
    });

    md += `---\n\n`;
  });

  return md;
}

export function generateReflectionsMarkdown(data: PBSAppData): string {
  let md = `# REKOD REFLEKSI HARIAN & REFLEKSI AKHIR PBS (LAMPIRAN 1-5)\n\n`;
  md += `*SK Tanjung Minyak 2, Melaka (19 - 30 Oktober 2026)*\n\n`;
  md += `---\n\n`;

  data.reflections.forEach((ref) => {
    md += `## Refleksi Hari ${ref.dayId}: ${ref.dateDisplay}\n\n`;
    md += `**1. Pengalaman / Aktiviti Utama:**\n${ref.activity.trim() || '-'}\n\n`;
    md += `**2. Perasaan & Reaksi Diri:**\n${ref.feelings.trim() || '-'}\n\n`;
    md += `**3. Kekuatan & Kelemahan:**\n${ref.strengthsWeaknesses.trim() || '-'}\n\n`;
    md += `**4. Pengajaran Sebagai Bakal Guru:**\n${ref.learning.trim() || '-'}\n\n`;
    md += `**5. Tindakan / Penambahbaikan:**\n${ref.actions.trim() || '-'}\n\n`;
    md += `---\n\n`;
  });

  md += `## REFLEKSI AKHIR KESELURUHAN PBS (Lampiran 1-5 Bahagian 4)\n\n`;
  md += `**1. Keberkesanan Pelaksanaan PBS yang Dirancang:**\n${data.finalReflection.effectiveness.trim() || '-'}\n\n`;
  md += `**2. Kekuatan & Kelemahan Dikenal Pasti:**\n${data.finalReflection.strengthsWeaknesses.trim() || '-'}\n\n`;
  md += `**3. Cadangan Penambahbaikan Berdasarkan Kelemahan:**\n${data.finalReflection.improvements.trim() || '-'}\n\n`;
  md += `**4. Kesediaan Mengubah Sikap, Kesedaran Diri & Amalan Positif:**\n${data.finalReflection.transformation.trim() || '-'}\n\n`;

  return md;
}
