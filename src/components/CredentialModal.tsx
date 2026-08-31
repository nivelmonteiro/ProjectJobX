import React, { useState } from 'react';
import { UserCredential, IrishStampVisa, IrishLocation } from '../types';
import { 
  X, 
  Check, 
  User, 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  Building2, 
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: UserCredential[];
  currentCredential: UserCredential;
  onSelectCredential: (credId: string) => void;
  onUpdateProfile: (updatedData: Partial<UserCredential>) => void;
  onAddAccount?: (accountData: Partial<UserCredential>) => void;
  onDeleteAccount?: (id: string) => void;
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
  onUpdateProfile,
  onAddAccount,
  onDeleteAccount
}) => {
  const [activeSubView, setActiveSubView] = useState<'list' | 'edit' | 'add'>('list');
  const [editingCredId, setEditingCredId] = useState<string>(currentCredential.id);
  
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

  const [newAccountData, setNewAccountData] = useState<Partial<UserCredential>>({
    name: '',
    email: '',
    headline: '',
    location: 'Dublin',
    visaStatus: 'Stamp 1G',
    phone: '+353 87 ',
    eircode: 'D02 X285',
    linkedinUrl: '',
    githubUrl: ''
  });

  if (!isOpen) return null;

  const handleStartEdit = (cred: UserCredential) => {
    setEditingCredId(cred.id);
    setFormData({
      name: cred.name,
      headline: cred.headline,
      email: cred.email,
      location: cred.location,
      visaStatus: cred.visaStatus,
      phone: cred.phone,
      eircode: cred.eircode || 'D02 X285',
      linkedinUrl: cred.linkedinUrl || '',
      githubUrl: cred.githubUrl || ''
    });
    setActiveSubView('edit');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      id: editingCredId,
      ...formData
    });
    setActiveSubView('list');
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountData.name?.trim()) return;
    
    if (onAddAccount) {
      onAddAccount(newAccountData);
    }
    setNewAccountData({
      name: '',
      email: '',
      headline: '',
      location: 'Dublin',
      visaStatus: 'Stamp 1G',
      phone: '+353 87 ',
      eircode: 'D02 X285',
      linkedinUrl: '',
      githubUrl: ''
    });
    setActiveSubView('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Accounts of Individuals & Profiles
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Unlimited AI Generations
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch candidate profiles or create dedicated accounts for different roles & target sectors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Sub Navigation Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSubView('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSubView === 'list'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Accounts ({credentials.length})
              </button>
              {activeSubView === 'edit' && (
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  Editing Profile: {editingCredId}
                </button>
              )}
            </div>

            {activeSubView !== 'add' && (
              <button
                type="button"
                onClick={() => setActiveSubView('add')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Individual Account
              </button>
            )}
          </div>

          {/* VIEW: All Accounts of Individuals */}
          {activeSubView === 'list' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {credentials.map((cred, idx) => {
                  const isSelected = cred.id === currentCredential.id;
                  return (
                    <div
                      key={cred.id}
                      className={`relative p-4 rounded-xl border transition-all duration-150 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-100'
                          }`}>
                            {cred.name ? cred.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : `A${idx+1}`}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {cred.name}
                              </h4>
                              {isSelected && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  Active Profile
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {cred.headline || 'Candidate Profile'}
                            </p>
                          </div>
                        </div>

                        {/* Card Top Right Quick Action */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(cred);
                            }}
                            title="Edit Account Details"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {credentials.length > 1 && onDeleteAccount && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Remove account for ${cred.name}?`)) {
                                  onDeleteAccount(cred.id);
                                }
                              }}
                              title="Delete Account"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Account Tags & Status */}
                      <div className="mt-3 flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {cred.location}
                          </span>
                          {cred.visaStatus && (
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                              {cred.visaStatus}
                            </span>
                          )}
                        </div>

                        {!isSelected ? (
                          <button
                            type="button"
                            onClick={() => onSelectCredential(cred.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-100/70 rounded-md transition-colors"
                          >
                            Switch to this
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-800">
                            Unlimited AI ⚡
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Profile Info Banner */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    Active Candidate Context: {currentCredential.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(currentCredential)}
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Edit Active Profile
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                    <span className="font-medium text-slate-800 truncate block">{currentCredential.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Phone (+353)</span>
                    <span className="font-medium text-slate-800">{currentCredential.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Eircode</span>
                    <span className="font-mono text-slate-800">{currentCredential.eircode || 'D02 X285'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Work Rights</span>
                    <span className="font-bold text-emerald-700">{currentCredential.visaStatus || 'Eligible'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Edit Profile Form */}
          {activeSubView === 'edit' && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">
                  Edit Candidate Profile: {formData.name || editingCredId}
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveSubView('list')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ← Back to all accounts
                </button>
              </div>

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
                  placeholder="e.g. Senior Fund Accountant & Financial Analyst (MBA)"
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
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSubView('list')}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                >
                  Save Account Changes
                </button>
              </div>
            </form>
          )}

          {/* VIEW: Add New Account of Individual Form */}
          {activeSubView === 'add' && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Create New Account of Individual
                  </h4>
                  <p className="text-xs text-slate-500">
                    Add candidate information for a new individual or distinct job-seeker persona
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubView('list')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ← Back to all accounts
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newAccountData.name || ''}
                    onChange={(e) => setNewAccountData({ ...newAccountData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                    placeholder="e.g. Siobhan Burke"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newAccountData.email || ''}
                    onChange={(e) => setNewAccountData({ ...newAccountData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                    placeholder="siobhan@eirecareers.ie"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Professional Headline / Target Specialty</label>
                <input
                  type="text"
                  value={newAccountData.headline || ''}
                  onChange={(e) => setNewAccountData({ ...newAccountData, headline: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                  placeholder="e.g. Senior UX Designer & Product Specialist (Figma / Research)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Irish Location</label>
                  <select
                    value={newAccountData.location}
                    onChange={(e) => setNewAccountData({ ...newAccountData, location: e.target.value as IrishLocation })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white"
                  >
                    {IRISH_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Irish Stamp / Work Status</label>
                  <select
                    value={newAccountData.visaStatus}
                    onChange={(e) => setNewAccountData({ ...newAccountData, visaStatus: e.target.value as IrishStampVisa })}
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
                  <label className="text-xs font-medium text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newAccountData.phone || ''}
                    onChange={(e) => setNewAccountData({ ...newAccountData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    placeholder="+353 87 999 8888"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Eircode</label>
                  <input
                    type="text"
                    value={newAccountData.eircode || ''}
                    onChange={(e) => setNewAccountData({ ...newAccountData, eircode: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                    placeholder="D02 X285"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={newAccountData.linkedinUrl || ''}
                    onChange={(e) => setNewAccountData({ ...newAccountData, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSubView('list')}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Individual Account
                </button>
              </div>
            </form>
          )}

        </div>

        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Active Individual: <strong className="text-slate-800">{currentCredential.name}</strong> ({currentCredential.visaStatus || 'Full Work Rights'})</span>
          </div>
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

