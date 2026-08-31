import React, { useState } from 'react';
import { CandidateProfile, PortalUser, IrishStampVisa, IrishLocation } from '../types';
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
  CheckCircle2,
  LogIn,
  KeyRound,
  Laptop,
  Smartphone,
  Globe2,
  RefreshCw,
  AlertCircle,
  Radio,
  Clock,
  ArrowRight,
  Send,
  Lock,
  LogOut,
  FolderLock,
  Layers
} from 'lucide-react';

export interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalUser: PortalUser;
  candidateProfiles: CandidateProfile[];
  currentProfile: CandidateProfile;
  onSelectProfile: (profileId: string) => void;
  onAddProfile: (profileData: Partial<CandidateProfile>) => void;
  onUpdateProfile: (profileId: string, updatedData: Partial<CandidateProfile>) => void;
  onDeleteProfile: (profileId: string) => void;
  onLogin: (email: string, password?: string, location?: string) => Promise<boolean>;
  onRegister: (data: any) => Promise<any>;
  onVerifyEmail: (email: string, code: string) => Promise<boolean>;
  onResendCode: (email: string) => Promise<any>;
  onLogout: () => void;
  activeLocations?: string[];
  activeSessionsCount?: number;
  initialView?: 'profiles' | 'signin' | 'register' | 'verify' | 'sync';
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
  'Athlone',
  'Wexford'
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
  portalUser,
  candidateProfiles,
  currentProfile,
  onSelectProfile,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
  onLogin,
  onRegister,
  onVerifyEmail,
  onResendCode,
  onLogout,
  activeLocations = ['Dublin (Silicon Docks)', 'Cork (Mobile App)'],
  activeSessionsCount = 2,
  initialView = 'profiles'
}) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'signin' | 'register' | 'verify' | 'addProfile' | 'editProfile' | 'sync'>(initialView);
  const [editingProfileId, setEditingProfileId] = useState<string>(currentProfile.id);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState<string>(portalUser.email || 'nivelmonteiro.NM@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('Password123!');
  const [clientLocation, setClientLocation] = useState<string>('Dublin (Silicon Docks)');

  // Register Form State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: 'Password123!',
    headline: 'Financial Analyst & Fund Accountant',
    location: 'Dublin' as IrishLocation,
    visaStatus: 'Stamp 1G' as IrishStampVisa,
    phone: '+353 89 984 7924',
    eircode: 'D02 X285',
    linkedinUrl: '',
    githubUrl: ''
  });

  // Email Verification State
  const [verificationTargetEmail, setVerificationTargetEmail] = useState<string>(portalUser.email || '');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [simulatedInboxCode, setSimulatedInboxCode] = useState<string | null>(null);

  // Candidate Profile Form State (Add / Edit)
  const [profileFormData, setProfileFormData] = useState<Partial<CandidateProfile>>({
    name: currentProfile.name,
    headline: currentProfile.headline,
    email: currentProfile.email,
    location: currentProfile.location,
    visaStatus: currentProfile.visaStatus,
    phone: currentProfile.phone,
    eircode: currentProfile.eircode || 'D02 X285',
    linkedinUrl: currentProfile.linkedinUrl || '',
    githubUrl: currentProfile.githubUrl || ''
  });

  if (!isOpen) return null;

  const handleStartEdit = (profile: CandidateProfile) => {
    setEditingProfileId(profile.id);
    setProfileFormData({
      name: profile.name,
      headline: profile.headline,
      email: profile.email,
      location: profile.location,
      visaStatus: profile.visaStatus,
      phone: profile.phone,
      eircode: profile.eircode || 'D02 X285',
      linkedinUrl: profile.linkedinUrl || '',
      githubUrl: profile.githubUrl || ''
    });
    setActiveTab('editProfile');
  };

  const handleStartAdd = () => {
    setProfileFormData({
      name: '',
      headline: '',
      email: portalUser.email,
      location: 'Dublin',
      visaStatus: 'Stamp 1G',
      phone: '+353 87 000 0000',
      eircode: 'D02 X285',
      linkedinUrl: '',
      githubUrl: ''
    });
    setActiveTab('addProfile');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editingProfileId, profileFormData);
    setAuthSuccess('Candidate profile updated successfully.');
    setActiveTab('profiles');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFormData.name?.trim()) {
      setAuthError('Candidate name is required.');
      return;
    }
    onAddProfile(profileFormData);
    setAuthSuccess(`Candidate profile "${profileFormData.name}" added to your account.`);
    setActiveTab('profiles');
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const ok = await onLogin(loginEmail, loginPassword, clientLocation);
      if (ok) {
        setAuthSuccess(`Signed in to portal successfully as ${loginEmail}. Candidate profiles loaded.`);
        setTimeout(() => {
          setActiveTab('profiles');
        }, 600);
      } else {
        setAuthError('Unable to sign in. Please verify your email & password.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name.trim() || !regData.email.trim()) {
      setAuthError('Please fill in your name and email.');
      return;
    }
    setIsLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const res = await onRegister(regData);
      if (res && res.success) {
        setVerificationTargetEmail(regData.email);
        if (res.codePreview) {
          setSimulatedInboxCode(res.codePreview);
          setVerificationCode(res.codePreview);
        }
        setAuthSuccess(res.message);
        setActiveTab('verify');
      } else {
        setAuthError(res?.error || 'Registration could not be completed.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setAuthError('Please enter the 6-digit confirmation PIN.');
      return;
    }
    setIsLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const ok = await onVerifyEmail(verificationTargetEmail, verificationCode);
      if (ok) {
        setAuthSuccess('Portal account confirmed! You are now logged in.');
        setTimeout(() => {
          setActiveTab('profiles');
        }, 800);
      } else {
        setAuthError('Invalid code. Please re-check or click Resend Code.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await onResendCode(verificationTargetEmail);
      if (res && res.codePreview) {
        setSimulatedInboxCode(res.codePreview);
        setVerificationCode(res.codePreview);
        setAuthSuccess(`New code generated: ${res.codePreview}`);
      }
    } catch (e: any) {
      setAuthError('Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold">
              <FolderLock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">EireCareer Portal Authentication</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Account & Candidate Profiles
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Single secure login account hosting multiple candidate profiles with real-time multi-location sync
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notifications */}
        {authSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{authSuccess}</span>
            </div>
            <button onClick={() => setAuthSuccess(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">×</button>
          </div>
        )}

        {authError && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">{authError}</span>
            </div>
            <button onClick={() => setAuthError(null)} className="text-rose-600 hover:text-rose-900 font-bold">×</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'profiles' || activeTab === 'addProfile' || activeTab === 'editProfile'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Candidate Profiles ({candidateProfiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('signin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'signin'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Portal Login Account</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'register'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Create New Account</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'verify'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email PIN Confirmation</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'sync'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Multi-Location Live Sync ({activeLocations.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {/* TAB 1: CANDIDATE PROFILES LIST */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              
              {/* Account Status Card */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xl">
                    {portalUser.name ? portalUser.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{portalUser.name}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Portal Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{portalUser.email}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>• {candidateProfiles.length} Candidate Profiles Available</span>
                      <span>• Synced across {activeLocations.length} locations</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartAdd}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Candidate Profile</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 text-xs font-semibold transition-colors flex items-center gap-1 border border-slate-700"
                    title="Sign out of portal"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Explanatory Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-xs text-emerald-950 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Single Login Architecture:</strong> You are signed into this portal using your master user credentials (<span className="font-mono font-semibold">{portalUser.email}</span>). Individual candidate profiles do not have separate passwords; you can switch, tailor CVs, run ATS scans, and manage job applications for any candidate profile listed below.
                </p>
              </div>

              {/* Profiles Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Candidate Profiles under this User Account
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">Click "Access & Switch" to make active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {candidateProfiles.map(profile => {
                    const isActive = profile.id === currentProfile.id;
                    return (
                      <div
                        key={profile.id}
                        className={`p-4 rounded-xl border transition-all duration-150 relative flex flex-col justify-between ${
                          isActive
                            ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-600/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                                isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {profile.name.charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                  {profile.name}
                                  {isActive && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-700 text-white">
                                      Active
                                    </span>
                                  )}
                                </h5>
                                <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{profile.headline}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleStartEdit(profile)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="Edit Profile Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {candidateProfiles.length > 1 && (
                                <button
                                  onClick={() => onDeleteProfile(profile.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete Profile"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Profile Details Tags */}
                          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              {profile.location || 'Dublin'}
                            </span>
                            {profile.visaStatus && (
                              <span className="px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800 font-semibold">
                                {profile.visaStatus}
                              </span>
                            )}
                            {profile.phone && (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                                {profile.phone}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 font-mono">ID: {profile.id}</span>
                          {isActive ? (
                            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Currently Selected
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                onSelectProfile(profile.id);
                                setAuthSuccess(`Switched active profile to ${profile.name}`);
                              }}
                              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <span>Access & Switch</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTAL SIGN IN */}
          {activeTab === 'signin' && (
            <div className="max-w-xl mx-auto space-y-6 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
                  <LogIn className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Portal User Sign In</h3>
                <p className="text-xs text-slate-500">
                  Access the full EireCareer job hunting suite and all associated candidate profiles
                </p>
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">User Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="e.g. nivelmonteiro.NM@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Portal Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Client Active Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={clientLocation}
                      onChange={e => setClientLocation(e.target.value)}
                      placeholder="e.g. Dublin (Silicon Docks), Cork, Galway"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Multi-location sessions in Dublin, Cork, etc., sync live in real-time.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Signing In to Portal...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In & Load Candidate Profiles</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-xs text-emerald-700 hover:underline font-semibold"
                  >
                    Don't have an account? Create an EireCareer user account →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: CREATE NEW ACCOUNT (REGISTER) */}
          {activeTab === 'register' && (
            <div className="max-w-xl mx-auto space-y-6 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
                  <UserCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Create EireCareer User Account</h3>
                <p className="text-xs text-slate-500">
                  Register your account with email confirmation code for multi-location access
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={regData.name}
                      onChange={e => setRegData({ ...regData, name: e.target.value })}
                      placeholder="e.g. Nivel Monteiro"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Login Email *</label>
                    <input
                      type="email"
                      value={regData.email}
                      onChange={e => setRegData({ ...regData, email: e.target.value })}
                      placeholder="e.g. nivelmonteiro.NM@gmail.com"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Candidate Headline</label>
                  <input
                    type="text"
                    value={regData.headline}
                    onChange={e => setRegData({ ...regData, headline: e.target.value })}
                    placeholder="e.g. Financial Analyst & Fund Accountant | NAV Accounting, FP&A"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                    <select
                      value={regData.location}
                      onChange={e => setRegData({ ...regData, location: e.target.value as IrishLocation })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {IRISH_LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Work Eligibility / Stamp Visa</label>
                    <select
                      value={regData.visaStatus}
                      onChange={e => setRegData({ ...regData, visaStatus: e.target.value as IrishStampVisa })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {IRISH_STAMPS.map(stamp => (
                        <option key={stamp || 'none'} value={stamp}>{stamp || 'Select Visa Status'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Register & Generate 6-Digit Email Code</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: EMAIL VERIFICATION */}
          {activeTab === 'verify' && (
            <div className="max-w-md mx-auto space-y-6 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
                  <Mail className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Email Access</h3>
                <p className="text-xs text-slate-500">
                  Enter the 6-digit confirmation PIN sent to <span className="font-semibold text-slate-700">{verificationTargetEmail || portalUser.email}</span>
                </p>
              </div>

              {simulatedInboxCode && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <KeyRound className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Email Inbox Preview Code: <span className="font-mono text-sm text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-amber-300 ml-1">{simulatedInboxCode}</span></p>
                    <p className="text-[11px] text-amber-700 mt-0.5">Use this code or default master pin <span className="font-mono font-bold">202600</span> to verify immediately.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifySubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">6-Digit Verification PIN</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    placeholder="202600"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-center text-lg font-mono tracking-widest font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Activate Access</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Resend 6-Digit PIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="text-slate-600 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: ADD CANDIDATE PROFILE */}
          {activeTab === 'addProfile' && (
            <div className="max-w-xl mx-auto space-y-5 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Candidate Profile</h3>
                  <p className="text-xs text-slate-500">Add a distinct candidate profile under your portal login account</p>
                </div>
                <button
                  onClick={() => setActiveTab('profiles')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveAdd} className="space-y-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Name *</label>
                    <input
                      type="text"
                      value={profileFormData.name || ''}
                      onChange={e => setProfileFormData({ ...profileFormData, name: e.target.value })}
                      placeholder="e.g. Ciaran O'Connor"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={profileFormData.email || ''}
                      onChange={e => setProfileFormData({ ...profileFormData, email: e.target.value })}
                      placeholder="e.g. ciaran.oconnor@eirecareers.ie"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Professional Headline / Role *</label>
                  <input
                    type="text"
                    value={profileFormData.headline || ''}
                    onChange={e => setProfileFormData({ ...profileFormData, headline: e.target.value })}
                    placeholder="e.g. Product Manager & Scrum Master (Fintech / Asset Management)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                    <select
                      value={profileFormData.location || 'Dublin'}
                      onChange={e => setProfileFormData({ ...profileFormData, location: e.target.value as IrishLocation })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {IRISH_LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Visa / Work Status</label>
                    <select
                      value={profileFormData.visaStatus || 'Stamp 1G'}
                      onChange={e => setProfileFormData({ ...profileFormData, visaStatus: e.target.value as IrishStampVisa })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {IRISH_STAMPS.map(stamp => (
                        <option key={stamp || 'none'} value={stamp}>{stamp || 'Select Visa'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Irish Phone</label>
                    <input
                      type="text"
                      value={profileFormData.phone || ''}
                      onChange={e => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                      placeholder="+353 87 000 0000"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Irish Eircode</label>
                    <input
                      type="text"
                      value={profileFormData.eircode || ''}
                      onChange={e => setProfileFormData({ ...profileFormData, eircode: e.target.value })}
                      placeholder="D02 X285"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profiles')}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Candidate Profile</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: EDIT CANDIDATE PROFILE */}
          {activeTab === 'editProfile' && (
            <div className="max-w-xl mx-auto space-y-5 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Candidate Profile ({editingProfileId})</h3>
                  <p className="text-xs text-slate-500">Update professional details, location & Irish stamp eligibility</p>
                </div>
                <button
                  onClick={() => setActiveTab('profiles')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Name *</label>
                    <input
                      type="text"
                      value={profileFormData.name || ''}
                      onChange={e => setProfileFormData({ ...profileFormData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={profileFormData.email || ''}
                      onChange={e => setProfileFormData({ ...profileFormData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Headline / Target Roles *</label>
                  <input
                    type="text"
                    value={profileFormData.headline || ''}
                    onChange={e => setProfileFormData({ ...profileFormData, headline: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                    <select
                      value={profileFormData.location || 'Dublin'}
                      onChange={e => setProfileFormData({ ...profileFormData, location: e.target.value as IrishLocation })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {IRISH_LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Visa / Work Eligibility</label>
                    <select
                      value={profileFormData.visaStatus || 'Stamp 1G'}
                      onChange={e => setProfileFormData({ ...profileFormData, visaStatus: e.target.value as IrishStampVisa })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {IRISH_STAMPS.map(stamp => (
                        <option key={stamp || 'none'} value={stamp}>{stamp || 'Select Visa'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={profileFormData.phone || ''}
                      onChange={e => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Eircode</label>
                    <input
                      type="text"
                      value={profileFormData.eircode || ''}
                      onChange={e => setProfileFormData({ ...profileFormData, eircode: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profiles')}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: MULTI-LOCATION SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Live Multi-Location Sync Engine</h3>
                    <p className="text-xs text-slate-400">
                      User Account <span className="text-emerald-300 font-mono">{portalUser.email}</span> connected across {activeLocations.length} active locations
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Real-Time Active
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Connected Hubs & Sessions</h4>
                <div className="space-y-2">
                  {activeLocations.map((loc, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{loc}</p>
                          <p className="text-[11px] text-slate-500">Active real-time job application & CV sync session</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                        Synced
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Portal User Account: <strong className="text-slate-800">{portalUser.email}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
