import React from 'react';
import { CandidateProfile, PortalUser } from '../types';
import { 
  FileText, 
  CheckCircle2, 
  Mail, 
  Mic2, 
  Kanban, 
  Globe2, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Radio, 
  LogIn, 
  MapPin,
  ChevronDown,
  Layers,
  LogOut,
  FolderLock
} from 'lucide-react';

interface HeaderProps {
  portalUser: PortalUser;
  currentProfile: CandidateProfile;
  candidateProfiles?: CandidateProfile[];
  onSelectProfile?: (profileId: string) => void;
  remainingQuota?: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCredentialModal: (view?: 'profiles' | 'signin' | 'register' | 'verify' | 'sync') => void;
  activeLocationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  portalUser,
  currentProfile,
  candidateProfiles = [],
  onSelectProfile,
  activeTab,
  onTabChange,
  onOpenCredentialModal,
  activeLocationsCount = 1
}) => {
  const tabs = [
    { id: 'resume', label: 'Tailored Irish CV', icon: FileText },
    { id: 'ats', label: 'ATS Score Checker', icon: CheckCircle2 },
    { id: 'cover-letter', label: 'Cover Letter Maker', icon: Mail },
    { id: 'interview', label: 'Competency Prep', icon: Mic2 },
    { id: 'tracker', label: 'Job Tracker', icon: Kanban },
    { id: 'market', label: 'Irish Market & Jobs', icon: Globe2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner with Portal Credentials & Multi-Location Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2.5 gap-3">
          
          {/* Logo & Irish Job Market Tag */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-emerald-600/20">
                É
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                    EireCareer
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                      Ireland 🇮🇪
                    </span>
                  </h1>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Portal Login: <span className="font-mono text-slate-700 font-semibold">{portalUser.email}</span>
                </p>
              </div>
            </div>

            {/* Mobile Account Switcher Trigger */}
            <div className="sm:hidden flex items-center gap-1.5">
              <button
                onClick={() => onOpenCredentialModal('profiles')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>{currentProfile.name ? currentProfile.name.split(' ')[0] : 'Profile'}</span>
              </button>
            </div>
          </div>

          {/* User Profile & Real-Time Sync Status */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            
            {/* Real-time Multi-Location Indicator */}
            <div 
              onClick={() => onOpenCredentialModal('sync')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 cursor-pointer border border-slate-200 text-xs transition-colors"
              title="Multi-Location Real-Time Sync Status across Dublin, Cork, etc."
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="text-slate-700 font-medium hidden md:inline">Live Synced:</span>
              <span className="text-slate-900 font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {currentProfile.location || 'Dublin'} ({activeLocationsCount} loc)
              </span>
            </div>

            {/* Unlimited AI Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/90 text-xs shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="text-emerald-900 font-bold hidden sm:inline">Unlimited AI</span>
            </div>

            {/* Active Candidate Profile Switcher & Portal User Pill */}
            <div className="relative flex items-center">
              <button
                onClick={() => onOpenCredentialModal('profiles')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-2xs group border border-slate-700"
                title="Manage Portal Credentials & Switch Candidate Profiles"
              >
                <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentProfile.name ? currentProfile.name.charAt(0) : 'P'}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-100 max-w-[120px] truncate">{currentProfile.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform" />
                  </div>
                  <div className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                    <span>{currentProfile.visaStatus || 'Stamp 1G'}</span>
                    <span className="text-slate-400">• {candidateProfiles.length} profiles</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Sign Out / Switch Portal Account Button */}
            <button
              onClick={() => onOpenCredentialModal('signin')}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
              title="Portal User Sign In / Switch Account"
            >
              <LogIn className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-100">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
