import React, { useState } from 'react';
import { UserCredential, IrishStampVisa, IrishLocation } from '../types';
import { X, Check, User, Shield, MapPin, Phone, Mail, Sparkles, Building2, ExternalLink } from 'lucide-react';

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: UserCredential[];
  currentCredential: UserCredential;
  onSelectCredential: (credId: string) => void;
  onUpdateProfile: (updatedData: Partial<UserCredential>) => void;
}

const IRISH_LOCATIONS: IrishLocation[] = [
  'Dublin',
  'Cork',
  'Galway',
  'Limerick',
  'Waterford',
  'Kilkenny',
  'Drogheda',
  'Dundalk',
  'Sligo',
  'Athlone'
];

const IRISH_STAMPS: IrishStampVisa[] = [
  '',
  'Stamp 1G',
  'Stamp 1',
  'Stamp 4',
  'Stamp 2',
  'EU/EEA Citizen',
  'UK/CTA Citizen'
];

export const CredentialModal: React.FC<CredentialModalProps> = ({
  isOpen,
  onClose,
  credentials,
  currentCredential,
  onSelectCredential,
  onUpdateProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserCredential>>({
    name: currentCredential.name,
    headline: currentCredential.headline,
    email: currentCredential.email,
    location: currentCredential.location,
    visaStatus: currentCredential.visaStatus,
    phone: currentCredential.phone,
    eircode: currentCredential.eircode || 'D02 X285',
    linkedinUrl: currentCredential.linkedinUrl || '',
    githubUrl: currentCredential.githubUrl || ''
  });

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      id: currentCredential.id,
      ...formData
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-700" />
              User Credential & Quota Manager
            </h3>
            <p className="text-xs text-slate-500">
              Maximum 4 active credential slots • Max 4 AI generations per user per day
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* 4 Login Credential Slots */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
              Active Login Credential Accounts (Max 4 slots)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {credentials.map((cred) => {
                const isSelected = cred.id === currentCredential.id;
                const remaining = cred.maxDailyQuota - cred.dailyUsageCount;
                return (
                  <div
                    key={cred.id}
                    onClick={() => {
                      onSelectCredential(cred.id);
                      setFormData(cred);
                    }}
                    className={`relative p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                            {cred.id}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{cred.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{cred.headline}</p>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                      <span className="text-slate-600 font-medium">{cred.location.split(' ')[0]}</span>
                      <span className={`font-semibold ${remaining > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {remaining} of {cred.maxDailyQuota} AI uses left today
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profile Details & Irish Career Settings */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Profile Details for {currentCredential.id}
                </h4>
                <p className="text-xs text-slate-500">
                  Customizes AI generation for Irish contact standards, Eircodes, and visa status
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Professional Headline / Target Role</label>
                  <input
                    type="text"
                    value={formData.headline || ''}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                    placeholder="e.g. Senior Full Stack Developer (React / Node / AWS)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Irish Location / Region</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value as IrishLocation })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white"
                    >
                      {IRISH_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Irish Visa & Work Rights (Stamp)</label>
                    <select
                      value={formData.visaStatus}
                      onChange={(e) => setFormData({ ...formData, visaStatus: e.target.value as IrishStampVisa })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white"
                    >
                      {IRISH_STAMPS.map((stamp) => (
                        <option key={stamp} value={stamp}>{stamp === '' ? '(Blank - None / Do not display)' : stamp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Irish Phone (+353)</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      placeholder="+353 87 123 4567"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Eircode / County</label>
                    <input
                      type="text"
                      value={formData.eircode || ''}
                      onChange={(e) => setFormData({ ...formData, eircode: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                      placeholder="D02 X285"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={formData.linkedinUrl || ''}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      placeholder="linkedin.com/in/..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Current Name & Title</span>
                  <span className="font-semibold text-slate-900">{currentCredential.name}</span>
                  <p className="text-slate-600 mt-0.5">{currentCredential.headline}</p>
                </div>

                <div>
                  <span className="text-slate-500 block">Location & Eircode</span>
                  <span className="font-semibold text-slate-900">{currentCredential.location}</span>
                  <p className="font-mono text-slate-600 mt-0.5">Eircode: {currentCredential.eircode || 'D02 X285'}</p>
                </div>

                <div>
                  <span className="text-slate-500 block">Work Authorization</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">
                    {currentCredential.visaStatus}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Contact & Dialing</span>
                  <span className="font-semibold text-slate-900">{currentCredential.phone}</span>
                  <p className="text-slate-600 mt-0.5">{currentCredential.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
