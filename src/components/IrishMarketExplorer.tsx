import React, { useState } from 'react';
import { ExternalJobListing, IrishSalaryBenchmark } from '../types';
import { INITIAL_EXTERNAL_JOBS, IRISH_SALARY_BENCHMARKS, IRISH_CV_GUIDELINES } from '../data/irishMarketData';
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
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';

interface IrishMarketExplorerProps {
  onSelectJobForCV: (job: ExternalJobListing) => void;
  onSelectJobForCoverLetter: (job: ExternalJobListing) => void;
}

export const IrishMarketExplorer: React.FC<IrishMarketExplorerProps> = ({
  onSelectJobForCV,
  onSelectJobForCoverLetter
}) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'salaries' | 'visa-rules'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredJobs = INITIAL_EXTERNAL_JOBS.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoc = locationFilter === 'all' || j.location.includes(locationFilter);
    const matchesCat = categoryFilter === 'all' || j.category === categoryFilter;
    return matchesSearch && matchesLoc && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Hero Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-800">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-emerald-300" />
            <h2 className="text-lg font-bold">Irish Employment Intelligence & Live Vacancies</h2>
          </div>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            Directly bridge from live Irish vacancies to AI-tailored 2-page CVs, cover letters, and interview coaching. Verified for Dublin Silicon Docks, Cork BioPharma, and Galway MedTech.
          </p>
        </div>

        {/* Sub-nav inside Explorer */}
        <div className="flex items-center gap-1 bg-emerald-950/70 p-1 rounded-xl border border-emerald-800 self-stretch sm:self-auto shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'jobs' ? 'bg-emerald-700 text-white' : 'text-emerald-300 hover:text-white'
            }`}
          >
            Live Irish Jobs
          </button>
          <button
            onClick={() => setActiveTab('salaries')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'salaries' ? 'bg-emerald-700 text-white' : 'text-emerald-300 hover:text-white'
            }`}
          >
            Salary Benchmarks (€)
          </button>
          <button
            onClick={() => setActiveTab('visa-rules')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'visa-rules' ? 'bg-emerald-700 text-white' : 'text-emerald-300 hover:text-white'
            }`}
          >
            Irish Visa & Stamp Guide
          </button>
        </div>
      </div>

      {/* Content based on active explorer sub-tab */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, tech stack (React, AWS, Python), or company..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-hidden text-slate-700"
              >
                <option value="all">All Locations</option>
                <option value="Dublin">Dublin</option>
                <option value="Cork">Cork</option>
                <option value="Galway">Galway</option>
                <option value="Remote">Remote Ireland</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-hidden text-slate-700"
              >
                <option value="all">All Categories</option>
                <option value="Engineering">Engineering</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Pharma & Biotech">Pharma & Biotech</option>
                <option value="Product">Product</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {job.category}
                    </span>
                    {job.salary && (
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {job.salary}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                    <p className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {job.location}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 1-Click Tailor Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectJobForCV(job)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Tailor Irish CV</span>
                  </button>

                  <button
                    onClick={() => onSelectJobForCoverLetter(job)}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    title="Generate Cover Letter"
                  >
                    Cover Letter
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Salary Benchmarks */}
      {activeTab === 'salaries' && (
        <div className="space-y-6">
          {IRISH_SALARY_BENCHMARKS.map((sectorBench, sIdx) => (
            <div key={sIdx} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Euro className="w-4 h-4 text-emerald-700" />
                  {sectorBench.sector} — 2025/2026 Irish Salary Bands (€ EUR)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100/60 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Role</th>
                      <th className="p-3">Junior</th>
                      <th className="p-3">Mid-Level</th>
                      <th className="p-3">Senior</th>
                      <th className="p-3">Lead / Staff</th>
                      <th className="p-3">Hubs</th>
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

      {/* Irish Visa & Stamp Guide */}
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
