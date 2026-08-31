import React, { useState, useEffect } from 'react';
import { ExternalJobListing, JobApplication, IrishRecruitmentAgency } from '../types';
import { 
  INITIAL_EXTERNAL_JOBS, 
  IRISH_SALARY_BENCHMARKS, 
  IRISH_JOB_PORTALS, 
  IRISH_RECRUITMENT_AGENCIES 
} from '../data/irishMarketData';
import { apiClient } from '../utils/apiClient';
import confetti from 'canvas-confetti';
import { 
  Globe2, 
  Search, 
  MapPin, 
  Euro, 
  Building2, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Zap,
  Briefcase,
  Layers,
  ChevronRight,
  Filter,
  Check,
  Building,
  Info,
  Mic2,
  FileText
} from 'lucide-react';

interface IrishMarketExplorerProps {
  onSelectJobForCV: (job: ExternalJobListing) => void;
  onSelectJobForCoverLetter: (job: ExternalJobListing) => void;
  onSelectJobForInterview?: (job: ExternalJobListing) => void;
  jobApplications: JobApplication[];
  onTrackJob: (job: ExternalJobListing) => void;
  onNavigateToTracker?: () => void;
}

const QUICK_SEARCH_CHIPS = [
  'Senior Fund Accountant Dublin',
  'Financial Analyst IFSC',
  'Commercial FP&A',
  'React Full Stack Dublin',
  'Data Scientist GenAI',
  'BioPharma QA Specialist',
  'DevOps AWS Galway',
  'Stamp 1G Friendly Roles'
];

export const IrishMarketExplorer: React.FC<IrishMarketExplorerProps> = ({
  onSelectJobForCV,
  onSelectJobForCoverLetter,
  onSelectJobForInterview,
  jobApplications,
  onTrackJob,
  onNavigateToTracker
}) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'agencies' | 'salaries' | 'visa-rules'>('jobs');
  const [searchQuery, setSearchQuery] = useState('Financial Analyst Fund Accountant');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  
  const [jobs, setJobs] = useState<ExternalJobListing[]>(INITIAL_EXTERNAL_JOBS);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('Financial Analyst Fund Accountant');
  const [groundingSources, setGroundingSources] = useState<{ title: string; url: string }[]>([]);
  const [trackedToast, setTrackedToast] = useState<string | null>(null);

  // Check if a job is already in the Job Tracker
  const isJobTracked = (job: ExternalJobListing) => {
    return jobApplications.some(app => 
      (app.jobTitle || '').toLowerCase() === (job.title || '').toLowerCase() &&
      (app.company || '').toLowerCase() === (job.company || '').toLowerCase()
    );
  };

  // Perform live web & Google Search Engine search for Irish jobs
  const handlePerformLiveSearch = async (queryToUse?: string) => {
    const q = (queryToUse !== undefined ? queryToUse : searchQuery || '').trim();
    if (!q) return;

    setIsSearchingLive(true);
    setLastSearchQuery(q);

    try {
      const response = await apiClient.searchLiveJobs({
        query: q,
        location: locationFilter,
        category: categoryFilter,
        sourcePortal: sourceFilter
      });

      if (response && Array.isArray(response.jobs) && response.jobs.length > 0) {
        setJobs(response.jobs);
        if (response.groundingSources) {
          setGroundingSources(response.groundingSources);
        }
      }
    } catch (err) {
      console.warn('Live job search error:', err);
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handleTrackClick = (job: ExternalJobListing) => {
    onTrackJob(job);
    setTrackedToast(`"${job.title}" at ${job.company} added to Job Tracker!`);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 }
    });
    setTimeout(() => {
      setTrackedToast(null);
    }, 4000);
  };

  // Filter the currently displayed jobs
  const filteredJobs = jobs.filter(j => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q || 
      (j.title || '').toLowerCase().includes(q) ||
      (j.company || '').toLowerCase().includes(q) ||
      (j.description || '').toLowerCase().includes(q) ||
      (Array.isArray(j.tags) && j.tags.some(t => (t || '').toLowerCase().includes(q)));

    const matchesLoc = locationFilter === 'all' || (j.location || '').toLowerCase().includes(locationFilter.toLowerCase());
    const matchesCat = categoryFilter === 'all' || j.category === categoryFilter;
    
    let matchesSource = true;
    if (sourceFilter !== 'all') {
      if (sourceFilter === 'google-search') matchesSource = j.sourceType === 'google-search' || Boolean(j.source?.includes('Google'));
      else if (sourceFilter === 'linkedin') matchesSource = j.sourceType === 'linkedin' || Boolean(j.source?.includes('LinkedIn'));
      else if (sourceFilter === 'indeed') matchesSource = j.sourceType === 'indeed' || Boolean(j.source?.includes('Indeed'));
      else if (sourceFilter === 'irishjobs') matchesSource = j.sourceType === 'irishjobs' || Boolean(j.source?.includes('IrishJobs')) || Boolean(j.source?.includes('Jobs.ie'));
      else if (sourceFilter === 'agency') matchesSource = j.sourceType === 'agency' || Boolean(j.agencyName);
      else if (sourceFilter === 'publicjobs') matchesSource = j.sourceType === 'publicjobs' || Boolean(j.source?.includes('PublicJobs'));
    }

    return matchesSearch && matchesLoc && matchesCat && matchesSource;
  });

  const getSourceBadge = (job: ExternalJobListing) => {
    if (job.sourceType === 'google-search' || job.source?.includes('Google')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
          <Globe2 className="w-3 h-3 text-amber-600" />
          Google Search Engine
        </span>
      );
    }
    if (job.sourceType === 'linkedin' || job.source?.includes('LinkedIn')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
          <Briefcase className="w-3 h-3 text-blue-600" />
          LinkedIn Ireland
        </span>
      );
    }
    if (job.sourceType === 'indeed' || job.source?.includes('Indeed')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
          <Search className="w-3 h-3 text-indigo-600" />
          Indeed Ireland
        </span>
      );
    }
    if (job.sourceType === 'irishjobs' || job.source?.includes('IrishJobs') || job.source?.includes('Jobs.ie')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
          <Globe2 className="w-3 h-3 text-emerald-600" />
          {job.source || 'IrishJobs.ie'}
        </span>
      );
    }
    if (job.sourceType === 'agency' || job.agencyName) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
          <Building className="w-3 h-3 text-purple-600" />
          {job.agencyName || job.source || 'Irish Recruitment Agency'}
        </span>
      );
    }
    if (job.sourceType === 'publicjobs' || job.source?.includes('PublicJobs')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
          <ShieldCheck className="w-3 h-3 text-slate-600" />
          PublicJobs.ie
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
        <ExternalLink className="w-3 h-3 text-slate-500" />
        {job.source || 'Irish Market Direct'}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Tracked Toast Notification */}
      {trackedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-700 flex items-center gap-3 animate-bounce">
          <BookmarkCheck className="w-5 h-5 text-emerald-300" />
          <span className="text-xs font-semibold">{trackedToast}</span>
          {onNavigateToTracker && (
            <button
              onClick={onNavigateToTracker}
              className="ml-2 px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold underline"
            >
              View Tracker →
            </button>
          )}
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight">Irish Market & Live Vacancy Search</h2>
            <span className="bg-emerald-800/80 text-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-700 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-300" /> Live Search Grounded
            </span>
          </div>
          <p className="text-xs text-emerald-100/85 max-w-3xl leading-relaxed">
            Search real-time Irish vacancies across <strong>Google Search Engine, LinkedIn Ireland, Indeed Ireland, IrishJobs.ie, and premier recruitment agencies</strong> (Cpl, Morgan McKinley, Hays, Sigmar, Mason Alexander, Brightwater). 1-click apply, track in Job Tracker, or tailor your 2-page Irish CV!
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-emerald-900/90 p-1.5 rounded-xl border border-emerald-800 self-stretch sm:self-auto shrink-0 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'jobs' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Live Irish Vacancies
          </button>
          <button
            onClick={() => setActiveTab('agencies')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'agencies' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Recruitment Agencies
          </button>
          <button
            onClick={() => setActiveTab('salaries')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'salaries' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Euro className="w-3.5 h-3.5" />
            Salary Benchmarks (€)
          </button>
          <button
            onClick={() => setActiveTab('visa-rules')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'visa-rules' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Visa & Stamp Guide
          </button>
        </div>
      </div>

      {/* TAB 1: Live Irish Vacancies & Portals */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">

          {/* Quick-Launch Hub for Irish Portals & Agencies */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-emerald-600" />
                Irish Job Portals & Search Engines (Instant Pre-filled Launch)
              </h3>
              <span className="text-[11px] text-slate-500">
                Click any portal to search "{searchQuery || 'Ireland jobs'}" directly
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {IRISH_JOB_PORTALS.map(portal => {
                const searchLink = portal.searchUrlTemplate(searchQuery || 'Financial Analyst', locationFilter !== 'all' ? locationFilter : 'Ireland');
                return (
                  <a
                    key={portal.id}
                    href={searchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all bg-slate-50/70 hover:bg-white flex flex-col justify-between space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {portal.badge}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 line-clamp-1">
                        {portal.name}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        Launch Search ↗
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Live Search & Filter Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              {/* Query Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePerformLiveSearch();
                  }}
                  placeholder="Search job title (e.g. Senior Fund Accountant, FP&A, React, QA Pharma, Stamp 1G)..."
                  className="w-full pl-10 pr-24 py-2 text-xs border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 px-2 py-1 text-[10px] text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Live Search Trigger Button */}
              <button
                onClick={() => handlePerformLiveSearch()}
                disabled={isSearchingLive}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs shrink-0"
              >
                {isSearchingLive ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching Google & Portals...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Live Web & Agency Search</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Search Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mr-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Quick Queries:
              </span>
              {QUICK_SEARCH_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(chip);
                    handlePerformLiveSearch(chip);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    searchQuery === chip 
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-800'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters:
              </div>

              {/* Location Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px]">Location:</span>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white outline-hidden text-slate-800 font-medium"
                >
                  <option value="all">All Locations</option>
                  <option value="Dublin">Dublin (IFSC / Silicon Docks)</option>
                  <option value="Cork">Cork (City & Little Island)</option>
                  <option value="Galway">Galway (Tech & MedTech)</option>
                  <option value="Limerick">Limerick (Raheen)</option>
                  <option value="Waterford">Waterford & South-East</option>
                  <option value="Remote">Remote Ireland</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px]">Sector:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white outline-hidden text-slate-800 font-medium"
                >
                  <option value="all">All Sectors</option>
                  <option value="Finance & IFSC">Finance & IFSC</option>
                  <option value="Engineering">Software Engineering</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Pharma & Biotech">Pharma & Life Sciences</option>
                  <option value="Product">Product & Agile</option>
                  <option value="DevOps">DevOps & Cloud</option>
                </select>
              </div>

              {/* Source Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px]">Source Portal / Agency:</span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white outline-hidden text-slate-800 font-medium"
                >
                  <option value="all">All Sources</option>
                  <option value="google-search">Google Search Engine</option>
                  <option value="linkedin">LinkedIn Ireland</option>
                  <option value="indeed">Indeed Ireland</option>
                  <option value="irishjobs">IrishJobs.ie & Jobs.ie</option>
                  <option value="agency">Recruitment Agencies (Cpl, Morgan McKinley, Hays, Sigmar)</option>
                  <option value="publicjobs">PublicJobs.ie (Irish Civil Service)</option>
                </select>
              </div>

              <div className="ml-auto text-[11px] text-slate-500 font-medium">
                Showing <strong>{filteredJobs.length}</strong> active vacancies
              </div>
            </div>
          </div>

          {/* Active Job Cards Grid */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">No matching vacancies found for current filter</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try broadening your search query or trigger the Live Web & Agency Search above to query Google Search index across all Irish job portals.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilter('all');
                  setCategoryFilter('all');
                  setSourceFilter('all');
                  handlePerformLiveSearch('Finance Software Ireland');
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
              >
                Reset Filters & Search All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => {
                const tracked = isJobTracked(job);
                const directApplyUrl = job.applyUrl || job.url;

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2.5">
                      
                      {/* Top Badges: Category + Source + Salary */}
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {getSourceBadge(job)}
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {job.category}
                          </span>
                        </div>

                        {job.salary && (
                          <span className="text-[11px] font-bold text-slate-900 bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded">
                            {job.salary}
                          </span>
                        )}
                      </div>

                      {/* Job Title & Employer */}
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-900 transition-colors leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-700 font-semibold flex items-center gap-1 mt-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {job.company}
                        </p>
                      </div>

                      {/* Location & Remote */}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {job.location}
                        </span>
                        {job.isRemote && (
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-blue-200">
                            Hybrid / Remote
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Visa Friendly Note */}
                      {job.visaFriendlyNote && (
                        <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="line-clamp-1">{job.visaFriendlyNote}</span>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {job.tags.slice(0, 4).map((tag, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions Area */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      
                      {/* Primary Action Row: Apply Link + Job Tracker Option */}
                      <div className="flex items-center gap-2">
                        {/* Direct Apply on Portal/Agency */}
                        <a
                          href={directApplyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs group/btn"
                        >
                          <span>Apply on {job.source || 'Portal'}</span>
                          <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </a>

                        {/* Track in Job Tracker Button */}
                        <button
                          onClick={() => handleTrackClick(job)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            tracked
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-600 hover:text-white'
                          }`}
                          title={tracked ? 'Already tracked in Job Tracker. Click to update/re-save.' : 'Save to Job Tracker'}
                        >
                          {tracked ? (
                            <>
                              <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                              <span>Tracked ✓</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-4 h-4" />
                              <span>+ Track</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 1-Click AI Tailoring Tools Row */}
                      <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                        <button
                          onClick={() => onSelectJobForCV(job)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-700" />
                          <span>Tailor CV</span>
                        </button>

                        <button
                          onClick={() => onSelectJobForCoverLetter(job)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                        >
                          <FileText className="w-3 h-3 text-slate-600" />
                          <span>Cover Letter</span>
                        </button>

                        {onSelectJobForInterview && (
                          <button
                            onClick={() => onSelectJobForInterview(job)}
                            className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                            title="STAR Interview Coaching"
                          >
                            <Mic2 className="w-3 h-3 text-purple-600" />
                            <span>Interview</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Grounding Sources Footer if available */}
          {groundingSources.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-slate-700 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                Live Grounded Search Sources ({groundingSources.length} verified listings found via Google Search Engine):
              </p>
              <div className="flex flex-wrap gap-2">
                {groundingSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-800 text-[11px] font-medium transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                    <span className="max-w-[200px] truncate">{source.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: Top Irish Recruitment Agencies Directory */}
      {activeTab === 'agencies' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              Ireland's Premier Recruitment Agencies & Headhunters
            </h3>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              In Ireland, over 60% of senior and mid-level roles in Banking, IFSC Fund Accounting, BioPharma, and Cloud Tech are placed exclusively through accredited recruitment consultancies. Connecting directly with specialist consultants can accelerate your interview invitations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {IRISH_RECRUITMENT_AGENCIES.map(agency => (
              <div
                key={agency.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-slate-900 text-white font-mono">
                      {agency.logoText}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {agency.locations.join(', ')}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{agency.name}</h4>
                    <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                      {agency.specialism}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <strong>Recruiter Insider Tip: </strong>
                    {agency.recruiterTip}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {agency.keySectors.map((sector, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={agency.jobsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Browse {agency.name} Jobs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={agency.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Submit CV
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Salary Benchmarks (€ EUR) */}
      {activeTab === 'salaries' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Euro className="w-4 h-4 text-emerald-700" />
              Irish National Salary Benchmarks 2025/2026 (€ EUR Annual Gross)
            </h3>
            <p className="text-xs text-slate-600">
              Verified against Morgan McKinley, Cpl, and Hays Ireland annual salary surveys. Base salaries exclude pension (standard 5-8% match), health cover, and performance bonuses.
            </p>
          </div>

          {IRISH_SALARY_BENCHMARKS.map((sectorBench, sIdx) => (
            <div key={sIdx} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Euro className="w-4 h-4 text-emerald-700" />
                  {sectorBench.sector}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Ireland Base Salary Ranges</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100/60 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Role</th>
                      <th className="p-3">Junior (0-2 yrs)</th>
                      <th className="p-3">Mid-Level (3-5 yrs)</th>
                      <th className="p-3">Senior (6-8 yrs)</th>
                      <th className="p-3">Lead / Manager (8+ yrs)</th>
                      <th className="p-3">Primary Irish Hubs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {sectorBench.roles.map((r, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{r.title}</td>
                        <td className="p-3 text-slate-600">{r.junior}</td>
                        <td className="p-3 text-slate-700 font-medium">{r.mid}</td>
                        <td className="p-3 font-semibold text-emerald-800 bg-emerald-50/30">{r.senior}</td>
                        <td className="p-3 font-bold text-slate-900">{r.lead}</td>
                        <td className="p-3 text-slate-500 text-[11px]">{r.popularHubs.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Irish Visa & Stamp Guide */}
      {activeTab === 'visa-rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Stamp 1G (Third Level Graduate Scheme)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Allows non-EEA graduates of Irish universities (NFQ Level 8 Honors Bachelor for 1 year, NFQ Level 9 Masters / Level 10 PhD for up to 2 years) to work full-time (40 hours/week) without needing an employer-sponsored work permit during this period.
            </p>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <strong>CV Strategy: </strong> State clearly on top of your CV: <em>"Stamp 1G — Full time right to work in Ireland without sponsorship requirement."</em>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Critical Skills Employment Permit (CSEP)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              For highly skilled occupations on the DETE Critical Skills list (Software Engineers, Data Scientists, BioPharma Chemists, Financial Analysts). Minimum remuneration threshold is €38,000/yr (with relevant degree) or €64,000/yr (all occupations).
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <strong>Path to Stamp 4: </strong> After 21 months of working on CSEP, you can convert directly to Stamp 4 permanent work rights.
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Stamp 4 (Full Permanent Work Authorization)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Grants full unrestricted employment and business operation in Ireland. Employers do not need to sponsor permits or conduct labour market needs tests.
            </p>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <strong>CV Strategy: </strong> Highlight "Stamp 4 Holder" prominently in your contact header to bypass automated filtering.
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Irish CV Gold Standard Rules
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-outside pl-4">
              <li><strong>No Photo:</strong> European GDPR and Irish equality laws make photos unacceptable.</li>
              <li><strong>2-Page Rule:</strong> Irish recruiters strongly discard 3+ page CVs for all non-academic roles.</li>
              <li><strong>Eircode Routing:</strong> Include postal district (e.g. D02 X285 or Dublin 4).</li>
              <li><strong>NFQ Classification:</strong> State degree honours level (Level 8 Honours Bachelor, Level 9 Masters).</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
