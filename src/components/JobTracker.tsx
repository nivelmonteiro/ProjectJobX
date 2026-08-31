import React, { useState } from 'react';
import { UserCredential, JobApplication, JobStatus, IrishLocation, IrishStampVisa } from '../types';
import confetti from 'canvas-confetti';
import { 
  Kanban, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Euro, 
  Building2, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  X,
  FileText,
  RefreshCw,
  Layers,
  Sparkles,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

interface JobTrackerProps {
  currentCredential: UserCredential;
  jobApplications: JobApplication[];
  onSaveJobApplication: (app: JobApplication) => void;
  onDeleteJobApplication: (id: string) => void;
  onSelectForTailoring?: (jobTitle: string, company: string, description?: string) => void;
  onRefresh?: () => void;
  onResetSampleApplications?: () => void;
}

export type AnalyticsFilterType = 'all' | 'active' | 'interview' | 'offers' | 'saved' | 'rejected';

const STATUS_COLUMNS: { id: JobStatus; label: string; color: string }[] = [
  { id: 'Saved', label: 'Saved / Target', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'Applied', label: 'Applied', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { id: 'Phone Screen', label: 'Phone Screen', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: '1st Round Interview', label: '1st Round Interview', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { id: 'Final Interview / Assessment', label: 'Final Interview', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { id: 'Offer Received', label: 'Offer Received 🎉', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-800 border-rose-200' }
];

const IRISH_LOCATIONS: IrishLocation[] = [
  'Dublin',
  'Cork',
  'Galway',
  'Limerick',
  'Waterford',
  'Kilkenny',
  'Sligo',
  'Drogheda',
  'Dundalk',
  'Athlone',
  'Wexford'
];

const IRISH_STAMPS: IrishStampVisa[] = [
  'Stamp 1G',
  'Stamp 4',
  'Stamp 1',
  'Stamp 2',
  'EU/EEA Citizen',
  'UK/CTA Citizen'
];

export const JobTracker: React.FC<JobTrackerProps> = ({
  currentCredential,
  jobApplications,
  onSaveJobApplication,
  onDeleteJobApplication,
  onSelectForTailoring,
  onRefresh,
  onResetSampleApplications
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [analyticsFilter, setAnalyticsFilter] = useState<AnalyticsFilterType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotification, setRefreshNotification] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<JobApplication> | null>(null);

  // Analytics counts
  const totalApps = jobApplications.length;
  const activeApps = jobApplications.filter(a => a.status !== 'Rejected' && a.status !== 'Withdrawn').length;
  const interviewStageApps = jobApplications.filter(a => (a.status || '').includes('Interview') || (a.status || '').includes('Screen')).length;
  const offerApps = jobApplications.filter(a => a.status === 'Offer Received').length;
  const savedApps = jobApplications.filter(a => a.status === 'Saved').length;
  const rejectedApps = jobApplications.filter(a => a.status === 'Rejected' || a.status === 'Withdrawn').length;

  // Filtered applications based on search, location, and interactive analytics filter
  const filteredApps = jobApplications.filter(app => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q || 
      (app.jobTitle || '').toLowerCase().includes(q) ||
      (app.company || '').toLowerCase().includes(q) ||
      (app.notes || '').toLowerCase().includes(q);
    const matchesLoc = filterLocation === 'all' || (app.location || '').includes(filterLocation);

    let matchesAnalytics = true;
    if (analyticsFilter === 'active') {
      matchesAnalytics = app.status !== 'Rejected' && app.status !== 'Withdrawn';
    } else if (analyticsFilter === 'interview') {
      matchesAnalytics = (app.status || '').includes('Interview') || (app.status || '').includes('Screen');
    } else if (analyticsFilter === 'offers') {
      matchesAnalytics = app.status === 'Offer Received';
    } else if (analyticsFilter === 'saved') {
      matchesAnalytics = app.status === 'Saved';
    } else if (analyticsFilter === 'rejected') {
      matchesAnalytics = app.status === 'Rejected' || app.status === 'Withdrawn';
    }

    return matchesSearch && matchesLoc && matchesAnalytics;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshNotification(`Refreshed: ${jobApplications.length} application${jobApplications.length !== 1 ? 's' : ''} in sync.`);
      setTimeout(() => setRefreshNotification(null), 3000);
    }, 600);
  };

  const handleToggleAnalyticsFilter = (filterType: AnalyticsFilterType) => {
    if (analyticsFilter === filterType) {
      setAnalyticsFilter('all');
    } else {
      setAnalyticsFilter(filterType);
      // Smooth scroll down to the filtered results if needed
      const target = document.getElementById('tracker-content-area');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleClearAllFilters = () => {
    setAnalyticsFilter('all');
    setSearchQuery('');
    setFilterLocation('all');
  };

  const handleOpenNewModal = () => {
    setEditingJob({
      id: `job-app-${Date.now()}`,
      jobTitle: '',
      company: '',
      location: 'Dublin',
      currency: 'EUR',
      salaryMin: 70000,
      salaryMax: 90000,
      status: 'Applied',
      visaRequirement: currentCredential.visaStatus,
      dateApplied: new Date().toISOString().split('T')[0],
      nextFollowUpDate: '',
      notes: '',
      updatedAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !editingJob.jobTitle || !editingJob.company) return;

    const fullJob: JobApplication = {
      id: editingJob.id || `job-app-${Date.now()}`,
      jobTitle: editingJob.jobTitle,
      company: editingJob.company,
      location: (editingJob.location as IrishLocation) || 'Dublin',
      currency: 'EUR',
      salaryMin: editingJob.salaryMin,
      salaryMax: editingJob.salaryMax,
      status: (editingJob.status as JobStatus) || 'Applied',
      visaRequirement: (editingJob.visaRequirement as IrishStampVisa) || 'Stamp 4',
      jobUrl: editingJob.jobUrl,
      jobDescription: editingJob.jobDescription,
      dateApplied: editingJob.dateApplied || new Date().toISOString().split('T')[0],
      nextFollowUpDate: editingJob.nextFollowUpDate,
      contactPerson: editingJob.contactPerson,
      contactEmail: editingJob.contactEmail,
      notes: editingJob.notes || '',
      updatedAt: new Date().toISOString()
    };

    onSaveJobApplication(fullJob);
    if (fullJob.status === 'Offer Received') {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.7 } });
    }
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleStatusChange = (app: JobApplication, newStatus: JobStatus) => {
    const updated = { ...app, status: newStatus, updatedAt: new Date().toISOString() };
    onSaveJobApplication(updated);
    if (newStatus === 'Offer Received') {
      confetti({ particleCount: 70, spread: 70 });
    }
  };

  // Helper to describe active filter
  const getFilterLabel = (f: AnalyticsFilterType) => {
    switch (f) {
      case 'active': return 'Active Pipelines';
      case 'interview': return 'In Interviews';
      case 'offers': return 'Offers Received';
      case 'saved': return 'Saved / Target';
      case 'rejected': return 'Rejected / Closed';
      default: return 'All Applications';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner & Stats Overview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Kanban className="w-5 h-5 text-emerald-700" />
              Irish Job Hunting & Application Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any analytics category below to quickly filter applications shown down on the board.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Refresh Button */}
            <button
              id="job-tracker-refresh-btn"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh and synchronize applications"
              className={`px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-xl flex items-center gap-1.5 transition-all border border-slate-200 ${
                isRefreshing ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin text-emerald-700' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            {onResetSampleApplications && totalApps === 0 && (
              <button
                onClick={onResetSampleApplications}
                className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-200"
                title="Restore default sample Irish applications"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Sample Jobs</span>
              </button>
            )}

            <button
              id="job-tracker-add-job-btn"
              onClick={handleOpenNewModal}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job Application</span>
            </button>
          </div>
        </div>

        {/* Refresh feedback alert */}
        {refreshNotification && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              {refreshNotification}
            </span>
            <button onClick={() => setRefreshNotification(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Interactive Quick Analytics Filter Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
              Analytics & Quick Filter (Click to Filter Below)
            </span>
            {analyticsFilter !== 'all' && (
              <button
                onClick={() => setAnalyticsFilter('all')}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                Reset Analytics Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Total Tracked */}
            <button
              type="button"
              onClick={() => handleToggleAnalyticsFilter('all')}
              className={`p-3.5 rounded-xl text-left transition-all relative border cursor-pointer ${
                analyticsFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/30 scale-[1.01]'
                  : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`block text-[11px] font-medium ${analyticsFilter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Total Tracked
                </span>
                <Layers className={`w-3.5 h-3.5 ${analyticsFilter === 'all' ? 'text-slate-300' : 'text-slate-400'}`} />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className={`text-xl font-bold ${analyticsFilter === 'all' ? 'text-white' : 'text-slate-900'}`}>
                  {totalApps}
                </span>
                <span className={`text-[10px] font-medium ${analyticsFilter === 'all' ? 'text-emerald-300' : 'text-slate-400'}`}>
                  {analyticsFilter === 'all' ? 'Active view' : 'Show all'}
                </span>
              </div>
            </button>

            {/* Active Pipelines */}
            <button
              type="button"
              onClick={() => handleToggleAnalyticsFilter('active')}
              className={`p-3.5 rounded-xl text-left transition-all relative border cursor-pointer ${
                analyticsFilter === 'active'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/40 scale-[1.01]'
                  : 'bg-blue-50/70 border-blue-200/80 text-blue-900 hover:bg-blue-100 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`block text-[11px] font-medium ${analyticsFilter === 'active' ? 'text-blue-100' : 'text-blue-700'}`}>
                  Active Pipelines
                </span>
                <TrendingUp className={`w-3.5 h-3.5 ${analyticsFilter === 'active' ? 'text-blue-200' : 'text-blue-600'}`} />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className={`text-xl font-bold ${analyticsFilter === 'active' ? 'text-white' : 'text-blue-950'}`}>
                  {activeApps}
                </span>
                <span className={`text-[10px] font-medium ${analyticsFilter === 'active' ? 'text-blue-200' : 'text-blue-600'}`}>
                  {analyticsFilter === 'active' ? 'Filtered ✓' : 'Filter ↓'}
                </span>
              </div>
            </button>

            {/* In Interviews */}
            <button
              type="button"
              id="analytics-filter-interview-btn"
              onClick={() => handleToggleAnalyticsFilter('interview')}
              className={`p-3.5 rounded-xl text-left transition-all relative border cursor-pointer ${
                analyticsFilter === 'interview'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-500/40 scale-[1.01]'
                  : 'bg-purple-50/70 border-purple-200/80 text-purple-900 hover:bg-purple-100 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`block text-[11px] font-medium ${analyticsFilter === 'interview' ? 'text-purple-100' : 'text-purple-700'}`}>
                  In Interviews
                </span>
                <Clock className={`w-3.5 h-3.5 ${analyticsFilter === 'interview' ? 'text-purple-200' : 'text-purple-600'}`} />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className={`text-xl font-bold ${analyticsFilter === 'interview' ? 'text-white' : 'text-purple-950'}`}>
                  {interviewStageApps}
                </span>
                <span className={`text-[10px] font-medium ${analyticsFilter === 'interview' ? 'text-purple-200' : 'text-purple-600'}`}>
                  {analyticsFilter === 'interview' ? 'Filtered ✓' : 'Filter ↓'}
                </span>
              </div>
            </button>

            {/* Offers Received */}
            <button
              type="button"
              onClick={() => handleToggleAnalyticsFilter('offers')}
              className={`p-3.5 rounded-xl text-left transition-all relative border cursor-pointer ${
                analyticsFilter === 'offers'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/40 scale-[1.01]'
                  : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`block text-[11px] font-medium ${analyticsFilter === 'offers' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                  Offers Received
                </span>
                <CheckCircle2 className={`w-3.5 h-3.5 ${analyticsFilter === 'offers' ? 'text-emerald-200' : 'text-emerald-600'}`} />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className={`text-xl font-bold ${analyticsFilter === 'offers' ? 'text-white' : 'text-emerald-950'}`}>
                  {offerApps}
                </span>
                <span className={`text-[10px] font-medium ${analyticsFilter === 'offers' ? 'text-emerald-200' : 'text-emerald-600'}`}>
                  {analyticsFilter === 'offers' ? 'Filtered ✓' : 'Filter ↓'}
                </span>
              </div>
            </button>
          </div>

          {/* Additional Quick Filter Status Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
            <span className="text-slate-400 font-medium mr-1">Other filters:</span>
            <button
              onClick={() => handleToggleAnalyticsFilter('saved')}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                analyticsFilter === 'saved'
                  ? 'bg-slate-800 text-white border-slate-800 font-semibold shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Saved / Target ({savedApps})
            </button>
            <button
              onClick={() => handleToggleAnalyticsFilter('rejected')}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                analyticsFilter === 'rejected'
                  ? 'bg-rose-700 text-white border-rose-700 font-semibold shadow-2xs'
                  : 'bg-rose-50/60 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              Rejected / Closed ({rejectedApps})
            </button>
          </div>
        </div>
      </div>

      {/* Target Content Anchor for smooth scrolling */}
      <div id="tracker-content-area" className="space-y-4">
        
        {/* Filter and View toggles */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company, title, notes..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-hidden text-slate-700"
            >
              <option value="all">All Irish Regions</option>
              <option value="Dublin">Dublin</option>
              <option value="Cork">Cork</option>
              <option value="Galway">Galway</option>
              <option value="Limerick">Limerick</option>
              <option value="Remote">Remote Ireland</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table List
            </button>
          </div>
        </div>

        {/* Active Filter Notice Banner */}
        {(analyticsFilter !== 'all' || searchQuery || filterLocation !== 'all') && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                Showing <strong>{filteredApps.length}</strong> of {totalApps} applications
                {analyticsFilter !== 'all' && (
                  <> • Category: <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded text-[11px]">{getFilterLabel(analyticsFilter)}</span></>
                )}
                {filterLocation !== 'all' && (
                  <> • Region: <span className="font-semibold text-slate-800">{filterLocation}</span></>
                )}
                {searchQuery && (
                  <> • Query: <span className="font-semibold text-slate-800">"{searchQuery}"</span></>
                )}
              </span>
            </div>

            <button
              onClick={handleClearAllFilters}
              className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              Clear all filters
            </button>
          </div>
        )}

        {/* Kanban View */}
        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-start">
            {STATUS_COLUMNS.map(col => {
              const columnApps = filteredApps.filter(a => a.status === col.id);
              const isRelevantColumn = analyticsFilter === 'all' || 
                (analyticsFilter === 'interview' && (col.id.includes('Interview') || col.id.includes('Screen'))) ||
                (analyticsFilter === 'offers' && col.id === 'Offer Received') ||
                (analyticsFilter === 'saved' && col.id === 'Saved') ||
                (analyticsFilter === 'rejected' && col.id === 'Rejected') ||
                (analyticsFilter === 'active' && col.id !== 'Rejected' && col.id !== 'Withdrawn');

              return (
                <div 
                  key={col.id} 
                  className={`rounded-2xl p-3 border space-y-3 transition-all ${
                    isRelevantColumn 
                      ? 'bg-slate-100/80 border-slate-200/90' 
                      : 'bg-slate-50/50 border-slate-200/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        col.id === 'Offer Received' ? 'bg-emerald-600' : 
                        col.id.includes('Interview') ? 'bg-purple-600' :
                        col.id === 'Applied' ? 'bg-blue-600' :
                        col.id === 'Rejected' ? 'bg-rose-500' : 'bg-slate-600'
                      }`} />
                      {col.label}
                    </span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full border ${
                      columnApps.length > 0 ? 'bg-white text-slate-800 border-slate-300 shadow-2xs' : 'bg-transparent text-slate-400 border-transparent'
                    }`}>
                      {columnApps.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 min-h-[120px]">
                    {columnApps.map(app => (
                      <div
                        key={app.id}
                        className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5 hover:border-slate-300 hover:shadow-xs transition-all"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 leading-tight">{app.jobTitle}</h4>
                            <p className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {app.company}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingJob(app);
                                setIsModalOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteJobApplication(app.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            {(app.location || 'Dublin').split(' ')[0]}
                          </span>
                          {app.salaryMin && (
                            <span className="flex items-center gap-0.5 font-semibold text-slate-700">
                              • €{Math.round(app.salaryMin / 1000)}k - €{Math.round((app.salaryMax || 0) / 1000)}k
                            </span>
                          )}
                        </div>

                        {app.notes && (
                          <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 line-clamp-2">
                            {app.notes}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-100">
                          <span className="text-slate-400">
                            Applied: {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString('en-IE') : 'Recent'}
                          </span>
                          
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app, e.target.value as JobStatus)}
                            className="px-1.5 py-0.5 text-[10px] border border-slate-200 rounded bg-slate-50 font-medium text-slate-700 outline-hidden focus:ring-1 focus:ring-emerald-500"
                          >
                            {STATUS_COLUMNS.map(c => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Direct AI Tailoring Shortcut */}
                        {onSelectForTailoring && (
                          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <button
                              type="button"
                              onClick={() => onSelectForTailoring(app.jobTitle, app.company, app.jobDescription || app.notes)}
                              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Tailor 2-Page CV ↗</span>
                            </button>
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-slate-400 hover:text-slate-700"
                                title="Open Job Posting"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {columnApps.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No applications
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table List View */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Role & Company</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Salary (€ EUR)</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Applied Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <strong className="text-slate-900 block">{app.jobTitle}</strong>
                      <span className="text-slate-500">{app.company}</span>
                      {app.notes && <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{app.notes}</p>}
                    </td>
                    <td className="p-3.5 text-slate-600">{app.location}</td>
                    <td className="p-3.5 font-medium text-slate-700">
                      {app.salaryMin ? `€${app.salaryMin.toLocaleString()} - €${(app.salaryMax || 0).toLocaleString()}` : 'Not specified'}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value as JobStatus)}
                        className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-800 outline-hidden"
                      >
                        {STATUS_COLUMNS.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono">
                      {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString('en-IE') : '—'}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      {onSelectForTailoring && (
                        <button
                          onClick={() => onSelectForTailoring(app.jobTitle, app.company, app.jobDescription || app.notes)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 inline-flex items-center gap-1 cursor-pointer"
                          title="Tailor CV"
                        >
                          <FileText className="w-3 h-3" /> CV
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingJob(app);
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded inline-flex items-center cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteJobApplication(app.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded inline-flex items-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No applications match the selected filter.
                      <button onClick={handleClearAllFilters} className="block mx-auto mt-2 text-emerald-700 font-semibold underline cursor-pointer">
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Job Modal */}
      {isModalOpen && editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingJob.id && jobApplications.some(a => a.id === editingJob.id) ? 'Edit Job Application' : 'Add New Irish Job Opportunity'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.jobTitle || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, jobTitle: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Senior Fund Accountant"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.company || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. State Street Ireland"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Irish Location</label>
                  <select
                    value={editingJob.location || 'Dublin'}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value as IrishLocation })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden bg-white"
                  >
                    {IRISH_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pipeline Status</label>
                  <select
                    value={editingJob.status || 'Applied'}
                    onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as JobStatus })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden bg-white"
                  >
                    {STATUS_COLUMNS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Min Salary (€ EUR/yr)</label>
                  <input
                    type="number"
                    step="1000"
                    value={editingJob.salaryMin || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, salaryMin: parseInt(e.target.value) || undefined })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden"
                    placeholder="e.g. 60000"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Salary (€ EUR/yr)</label>
                  <input
                    type="number"
                    step="1000"
                    value={editingJob.salaryMax || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, salaryMax: parseInt(e.target.value) || undefined })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden"
                    placeholder="e.g. 75000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date Applied</label>
                  <input
                    type="date"
                    value={editingJob.dateApplied || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, dateApplied: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Visa / Stamp Requirement</label>
                  <select
                    value={editingJob.visaRequirement || currentCredential.visaStatus}
                    onChange={(e) => setEditingJob({ ...editingJob, visaRequirement: e.target.value as IrishStampVisa })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden bg-white"
                  >
                    {IRISH_STAMPS.map(stamp => (
                      <option key={stamp} value={stamp}>{stamp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Job URL / Direct Link</label>
                <input
                  type="url"
                  value={editingJob.jobUrl || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, jobUrl: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-hidden"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notes & Follow-up Details</label>
                <textarea
                  rows={3}
                  value={editingJob.notes || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, notes: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-hidden"
                  placeholder="e.g. HR Phone screening completed on Tuesday. Case study assignment scheduled next."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
