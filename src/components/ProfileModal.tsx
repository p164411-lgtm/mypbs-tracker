import React, { useState } from 'react';
import { UserProfile } from '../types/pbs';
import { X, User, School, BookOpen, Check } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Profil Guru Pelatih PBS
              </h2>
              <p className="text-xs text-slate-500">
                Maklumat ini akan digunakan secara rasmi dalam Halaman Tajuk Laporan PBS
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nama Guru Pelatih:
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => handleChange('studentName', e.target.value)}
                placeholder="cth: Ahmad bin Ali"
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                autoFocus
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nombor Matrik Pelajar:
              </label>
              <input
                type="text"
                value={formData.matricNo}
                onChange={(e) => handleChange('matricNo', e.target.value)}
                placeholder="cth: P164411 / D202610123"
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Program Pengajian:
              </label>
              <input
                type="text"
                value={formData.programme}
                onChange={(e) => handleChange('programme', e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Pengkhususan / Major:
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => handleChange('major', e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Institut Pendidikan Guru (IPG):
            </label>
            <input
              type="text"
              value={formData.ipgCampus}
              onChange={(e) => handleChange('ipgCampus', e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide block mb-2">
              Maklumat Sekolah PBS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Sekolah:
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => handleChange('schoolName', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tempoh Pelaksanaan:
                </label>
                <input
                  type="text"
                  value={formData.pbsDuration}
                  onChange={(e) => handleChange('pbsDuration', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="mt-2">
              <label className="font-semibold text-slate-700 block mb-1">
                Alamat Sekolah:
              </label>
              <input
                type="text"
                value={formData.schoolAddress}
                onChange={(e) => handleChange('schoolAddress', e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide block mb-2">
              Penyelia & Pembimbing
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pensyarah Penyelia IPG:
                </label>
                <input
                  type="text"
                  value={formData.lecturerName}
                  onChange={(e) => handleChange('lecturerName', e.target.value)}
                  placeholder="Nama Pensyarah"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Guru Pembimbing Sekolah:
                </label>
                <input
                  type="text"
                  value={formData.mentorTeacher}
                  onChange={(e) => handleChange('mentorTeacher', e.target.value)}
                  placeholder="Nama Guru Pembimbing"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Guru Besar:
                </label>
                <input
                  type="text"
                  value={formData.headmasterName}
                  onChange={(e) => handleChange('headmasterName', e.target.value)}
                  placeholder="Nama Guru Besar"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer shadow-xs"
            >
              Simpan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
