import React from 'react';
import { UserCredential } from '../types';
import { FileText, CheckCircle2, Mail, Mic2, Kanban, Globe2, User, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentCredential: UserCredential;
  remainingQuota: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCredentialModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCredential,
  remainingQuota,
  activeTab,
  onTabChange,
  onOpenCredentialModal
}) => {
  const tabs = [
    { id: 'resume', label: 'Tailored Irish CV', icon: FileText },
    { id: 'ats', label: 'ATS Score Checker', icon: CheckCircle2 },
    { id: 'cover-letter', label: 'Cover Letter Maker', icon: Mail },
    { id: 'interview', label: 'Competency Prep', icon: Mic2 },
    { id: 'tracker', label: 'Job Tracker', icon: Kanban },
    { id: 'market', label: 'Irish Market & Jobs', icon: Globe2 },
  ];

  const quotaPercent = ((currentCredential.maxDailyQuota - remainingQuota) / currentCredential.maxDailyQuota) * 100;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner with Quota & Credential Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          
          {/* Logo & Irish Job Market Tag */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm ring-2 ring-emerald-600/20">
                É
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                    EireCareer
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                      Ireland 🇮🇪
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-500 font-medium">Tailored CVs, ATS Scan & Job Hunting Suite</p>
              </div>
            </div>

            {/* Mobile Credential trigger */}
            <div className="sm:hidden">
              <button
                onClick={onOpenCredentialModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentCredential.id}</span>
              </button>
            </div>
          </div>

          {/* User Profile & Daily Quota Control */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            
            {/* Daily Generation Quota Widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs shadow-2xs">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-600 font-medium">Daily AI Quota:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`font-bold ${remainingQuota > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {remainingQuota} of {currentCredential.maxDailyQuota} left
                </span>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      remainingQuota === 0 ? 'bg-rose-500' : remainingQuota === 1 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.max(10, 100 - quotaPercent)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Credential Account Switcher / Info Button */}
            <button
              onClick={onOpenCredentialModal}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-2xs group"
              title="Switch user credential profile (Max 4)"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-pulse" />
              <span className="font-semibold text-slate-200">{currentCredential.id}</span>
              <span className="text-slate-400">•</span>
              <span className="truncate max-w-[110px] text-slate-300">{currentCredential.name.split(' ')[0]}</span>
              <span className="text-[10px] bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded font-mono border border-slate-700">
                {currentCredential.visaStatus.includes('Stamp 4') ? 'Stamp 4' : currentCredential.visaStatus.includes('Stamp 1G') ? 'Stamp 1G' : 'EU/IRL'}
              </span>
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
