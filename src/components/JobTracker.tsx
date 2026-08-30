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
  FileText
} from 'lucide-react';

interface JobTrackerProps {
  currentCredential: UserCredential;
  jobApplications: JobApplication[];
  onSaveJobApplication: (app: JobApplication) => void;
  onDeleteJobApplication: (id: string) => void;
  onSelectForTailoring?: (jobTitle: string, company: string, description?: string) => void;
}

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
  onSelectForTailoring
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<JobApplication> | null>(null);

  // Filtered applications
  const filteredApps = jobApplications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoc = filterLocation === 'all' || app.location.includes(filterLocation);
    return matchesSearch && matchesLoc;
  });

  // Analytics
  const totalApps = jobApplications.length;
  const activeApps = jobApplications.filter(a => a.status !== 'Rejected' && a.status !== 'Withdrawn').length;
  const interviewStageApps = jobApplications.filter(a => a.status.includes('Interview') || a.status.includes('Screen')).length;
  const offerApps = jobApplications.filter(a => a.status === 'Offer Received').length;

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
              Track vacancies, interview milestones, visa compliance & salary bands across Dublin, Cork, Galway, Limerick & Remote.
            </p>
          </div>

          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job Application</span>
          </button>
        </div>

        {/* Quick Analytics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Total Tracked</span>
            <span className="text-xl font-bold text-slate-900">{totalApps}</span>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <span className="text-blue-700 block text-[11px]">Active Pipelines</span>
            <span className="text-xl font-bold text-blue-900">{activeApps}</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
            <span className="text-purple-700 block text-[11px]">In Interviews</span>
            <span className="text-xl font-bold text-purple-900">{interviewStageApps}</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-emerald-700 block text-[11px]">Offers Received</span>
            <span className="text-xl font-bold text-emerald-900">{offerApps}</span>
          </div>
        </div>
      </div>

      {/* Filter and View toggles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company or title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
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
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Table List
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-start">
          {STATUS_COLUMNS.map(col => {
            const columnApps = filteredApps.filter(a => a.status === col.id);
            return (
              <div key={col.id} className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${col.id === 'Offer Received' ? 'bg-emerald-600' : 'bg-slate-600'}`} />
                    {col.label}
                  </span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                    {columnApps.length}
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[120px]">
                  {columnApps.map(app => (
                    <div
                      key={app.id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5 hover:border-slate-300 transition-colors"
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
                            className="p-1 text-slate-400 hover:text-slate-700 rounded"
                            title="Edit"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteJobApplication(app.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {app.location.split(' ')[0]}
                        </span>
                        {app.salaryMin && (
                          <span className="flex items-center gap-0.5 font-semibold text-slate-700">
                            • €{Math.round(app.salaryMin / 1000)}k - €{Math.round((app.salaryMax || 0) / 1000)}k
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-100">
                        <span className="text-slate-400">
                          Applied: {new Date(app.dateApplied).toLocaleDateString('en-IE')}
                        </span>
                        
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app, e.target.value as JobStatus)}
                          className="px-1.5 py-0.5 text-[10px] border border-slate-200 rounded bg-slate-50 font-medium text-slate-700 outline-hidden"
                        >
                          {STATUS_COLUMNS.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
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
                  </td>
                  <td className="p-3.5 text-slate-600">{app.location}</td>
                  <td className="p-3.5 font-medium text-slate-700">
                    {app.salaryMin ? `€${app.salaryMin.toLocaleString()} - €${(app.salaryMax || 0).toLocaleString()}` : 'Not specified'}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono">
                    {new Date(app.dateApplied).toLocaleDateString('en-IE')}
                  </td>
                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => {
                        setEditingJob(app);
                        setIsModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteJobApplication(app.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Job Modal */}
      {isModalOpen && editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingJob.id ? 'Edit Job Application' : 'Add New Irish Job Opportunity'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
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
                    placeholder="e.g. Senior Software Engineer"
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
                    placeholder="e.g. Stripe Ireland"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Irish Location</label>
                  <select
                    value={editingJob.location}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value as IrishLocation })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden bg-white"
                  >
                    {IRISH_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pipeline Stage</label>
                  <select
                    value={editingJob.status}
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
                  <label className="font-semibold text-slate-700 block mb-1">Target Salary Min (€ EUR)</label>
                  <input
                    type="number"
                    value={editingJob.salaryMin || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, salaryMin: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden"
                    placeholder="75000"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Salary Max (€ EUR)</label>
                  <input
                    type="number"
                    value={editingJob.salaryMax || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, salaryMax: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden"
                    placeholder="95000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Application Date</label>
                  <input
                    type="date"
                    value={editingJob.dateApplied || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, dateApplied: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Next Follow-Up Date</label>
                  <input
                    type="date"
                    value={editingJob.nextFollowUpDate || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, nextFollowUpDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Job Link / URL</label>
                <input
                  type="url"
                  value={editingJob.jobUrl || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, jobUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notes & Recruiter Contacts</label>
                <textarea
                  rows={3}
                  value={editingJob.notes || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, notes: e.target.value })}
                  placeholder="e.g. Connected on LinkedIn with recruiter John, technical round focused on AWS & STAR..."
                  className="w-full p-2 border border-slate-300 rounded-lg outline-hidden resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
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
