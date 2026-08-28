import React, { useState, useEffect } from 'react';
import { 
  UserCredential, 
  TailoredResume, 
  ATSAnalysis, 
  TailoredCoverLetter, 
  InterviewPrepSession, 
  JobApplication,
  ExternalJobListing
} from './types';
import { apiClient } from './utils/apiClient';
import { INITIAL_USER_CREDENTIALS, INITIAL_EXTERNAL_JOBS } from './data/irishMarketData';
import { Header } from './components/Header';
import { CredentialModal } from './components/CredentialModal';
import { ResumeMaker } from './components/ResumeMaker';
import { ATSChecker } from './components/ATSChecker';
import { CoverLetterMaker } from './components/CoverLetterMaker';
import { InterviewPrep } from './components/InterviewPrep';
import { JobTracker } from './components/JobTracker';
import { IrishMarketExplorer } from './components/IrishMarketExplorer';

const DEFAULT_SAMPLE_RESUME: TailoredResume = {
  id: 'resume-sample-1',
  title: 'Senior Full Stack Developer - Stripe Ireland',
  targetRole: 'Senior Full Stack Developer',
  targetCompany: 'Stripe Ireland',
  createdAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Aoife Murphy',
    email: 'aoife.murphy.irl@eirecareers.ie',
    phone: '+353 87 123 4567',
    location: 'Dublin 2, Ireland',
    eircode: 'D02 X285',
    workEligibility: 'Stamp 4 / EU Citizen (Full Work Rights in Ireland)',
    linkedin: 'linkedin.com/in/aoifemurphy-dev',
    github: 'github.com/aoifemurphy'
  },
  professionalSummary: 'Accomplished Senior Full Stack Engineer with 5+ years building distributed European payment rails and high-throughput web applications in Dublin Silicon Docks. Proven track record reducing API latency by 45% and architecting GDPR-compliant microservices.',
  skills: {
    technical: ['TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS (ECS, Lambda, RDS)'],
    domain: ['Payment Systems', 'Distributed Architecture', 'REST & GraphQL APIs', 'GDPR & Irish Data Privacy'],
    soft: ['Technical Leadership', 'Cross-Functional Collaboration', 'Agile/Scrum', 'Mentorship'],
    tools: ['Git', 'Datadog', 'Jira', 'Terraform', 'Playwright', 'Jest']
  },
  workExperiences: [
    {
      id: 'exp-1',
      role: 'Senior Software Engineer',
      company: 'Workday Ireland',
      location: 'Dublin, Ireland',
      startDate: '2022',
      endDate: 'Present',
      isCurrent: true,
      highlights: [
        'Architected high-resiliency microservices processing 4M+ daily financial transactions with 99.99% uptime.',
        'Migrated legacy monolithic UI to modern React & TypeScript, slashing initial page load times by 52%.',
        'Implemented strict European data residency protocols in compliance with Irish Data Protection Commission guidelines.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Full Stack Engineer',
      company: 'Version 1',
      location: 'Dublin / Remote Ireland',
      startDate: '2020',
      endDate: '2022',
      isCurrent: false,
      highlights: [
        'Built enterprise cloud platforms on AWS using Node.js and PostgreSQL for public & private sector Irish clients.',
        'Championed automated CI/CD pipelines reducing deployment failure rates by 35%.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'M.Sc. in Computer Science',
      institution: 'University College Dublin (UCD)',
      location: 'Dublin, Ireland',
      year: '2020',
      nfqLevel: 'NFQ Level 9 (Masters)',
      gradeOrHonours: 'First Class Honours (1:1)'
    }
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate',
    'Certified ScrumMaster (CSM)'
  ],
  keyAchievements: [
    'Awarded Top Technical Innovator at Workday Ireland 2024.',
    'Mentored 6 junior engineers and interns from Trinity College Dublin and DCU.'
  ],
  irishMarketNotes: 'Compliant with Irish equality standards: No photo, 2-page max, Eircode included, explicit right-to-work header.'
};

const DEFAULT_SAMPLE_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobTitle: 'Senior Full Stack Engineer',
    company: 'Stripe Ireland',
    location: 'Dublin (Silicon Docks / City)',
    salaryMin: 95000,
    salaryMax: 120000,
    currency: 'EUR',
    status: '1st Round Interview',
    visaRequirement: 'Stamp 4 (Full Work Rights)',
    jobUrl: 'https://stripe.com/jobs',
    dateApplied: '2025-02-15',
    nextFollowUpDate: '2025-03-02',
    contactPerson: 'Talent Acquisition Team',
    notes: 'Phone screen completed. Technical system design round scheduled with hiring manager.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app-2',
    jobTitle: 'Cloud Infrastructure Specialist',
    company: 'Pfizer Ireland',
    location: 'Cork',
    salaryMin: 70000,
    salaryMax: 88000,
    currency: 'EUR',
    status: 'Applied',
    visaRequirement: 'Stamp 1G (Third Level Graduate)',
    jobUrl: 'https://pfizer.com/careers',
    dateApplied: '2025-02-20',
    notes: 'Submitted tailored Irish CV and motivation statement regarding Cork bio-tech operations.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app-3',
    jobTitle: 'Lead Product Manager',
    company: 'Revolut Ireland',
    location: 'Remote (Ireland-wide)',
    salaryMin: 90000,
    salaryMax: 115000,
    currency: 'EUR',
    status: 'Final Interview / Assessment',
    visaRequirement: 'EU/EEA/Irish Citizen',
    jobUrl: 'https://revolut.com',
    dateApplied: '2025-02-08',
    notes: 'Presentation on European SME credit expansion completed.',
    updatedAt: new Date().toISOString()
  }
];

export default function App() {
  // Credentials (max 4 allowed login credentials)
  const [credentials, setCredentials] = useState<UserCredential[]>(() => {
    const saved = localStorage.getItem('eire_credentials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER_CREDENTIALS;
  });

  const [activeCredId, setActiveCredId] = useState<string>(() => {
    return localStorage.getItem('eire_active_cred_id') || 'IRL-JOB-101';
  });

  const [activeTab, setActiveTab] = useState<string>('resume');
  const [isCredModalOpen, setIsCredModalOpen] = useState<boolean>(false);

  // Quota for active credential
  const [remainingQuota, setRemainingQuota] = useState<number>(4);

  // Persistent stored items
  const [savedResumes, setSavedResumes] = useState<TailoredResume[]>(() => {
    const saved = localStorage.getItem('eire_resumes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [DEFAULT_SAMPLE_RESUME];
  });

  const [savedATSAnalyses, setSavedATSAnalyses] = useState<ATSAnalysis[]>(() => {
    const saved = localStorage.getItem('eire_ats_analyses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [savedCoverLetters, setSavedCoverLetters] = useState<TailoredCoverLetter[]>(() => {
    const saved = localStorage.getItem('eire_cover_letters');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [savedPreps, setSavedPreps] = useState<InterviewPrepSession[]>(() => {
    const saved = localStorage.getItem('eire_preps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('eire_job_apps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SAMPLE_APPLICATIONS;
  });

  // Cross-tool pipeline transfers
  const [atsInitialResume, setAtsInitialResume] = useState<string>('');
  const [atsInitialJobDesc, setAtsInitialJobDesc] = useState<string>('');

  // Current active credential object
  const currentCredential = credentials.find(c => c.id === activeCredId) || credentials[0];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('eire_credentials', JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem('eire_active_cred_id', activeCredId);
  }, [activeCredId]);

  useEffect(() => {
    localStorage.setItem('eire_resumes', JSON.stringify(savedResumes));
  }, [savedResumes]);

  useEffect(() => {
    localStorage.setItem('eire_ats_analyses', JSON.stringify(savedATSAnalyses));
  }, [savedATSAnalyses]);

  useEffect(() => {
    localStorage.setItem('eire_cover_letters', JSON.stringify(savedCoverLetters));
  }, [savedCoverLetters]);

  useEffect(() => {
    localStorage.setItem('eire_preps', JSON.stringify(savedPreps));
  }, [savedPreps]);

  useEffect(() => {
    localStorage.setItem('eire_job_apps', JSON.stringify(jobApplications));
  }, [jobApplications]);

  // Fetch / Sync quota from backend for active credential
  useEffect(() => {
    async function syncQuota() {
      try {
        const q = await apiClient.getQuota(activeCredId);
        setRemainingQuota(q.remaining);
      } catch (e) {
        const cred = credentials.find(c => c.id === activeCredId);
        if (cred) {
          setRemainingQuota(Math.max(0, cred.maxDailyQuota - cred.dailyUsageCount));
        }
      }
    }
    syncQuota();
  }, [activeCredId]);

  const handleQuotaUsed = (newRemaining: number) => {
    setRemainingQuota(newRemaining);
    setCredentials(prev => prev.map(c => {
      if (c.id === activeCredId) {
        return {
          ...c,
          dailyUsageCount: c.maxDailyQuota - newRemaining
        };
      }
      return c;
    }));
  };

  const handleUpdateProfile = (updatedData: Partial<UserCredential>) => {
    setCredentials(prev => prev.map(c => {
      if (c.id === updatedData.id) {
        return { ...c, ...updatedData } as UserCredential;
      }
      return c;
    }));
  };

  const handleSaveResume = (newResume: TailoredResume) => {
    setSavedResumes(prev => [newResume, ...prev.filter(r => r.id !== newResume.id)]);
  };

  const handleSaveATSAnalysis = (analysis: ATSAnalysis) => {
    setSavedATSAnalyses(prev => [analysis, ...prev.filter(a => a.id !== analysis.id)]);
  };

  const handleSaveCoverLetter = (letter: TailoredCoverLetter) => {
    setSavedCoverLetters(prev => [letter, ...prev.filter(l => l.id !== letter.id)]);
  };

  const handleSavePrep = (prep: InterviewPrepSession) => {
    setSavedPreps(prev => [prep, ...prev.filter(p => p.id !== prep.id)]);
  };

  const handleSaveJobApplication = (job: JobApplication) => {
    setJobApplications(prev => {
      const exists = prev.some(j => j.id === job.id);
      if (exists) {
        return prev.map(j => j.id === job.id ? job : j);
      }
      return [job, ...prev];
    });
  };

  const handleDeleteJobApplication = (jobId: string) => {
    setJobApplications(prev => prev.filter(j => j.id !== jobId));
  };

  // Cross-linking handlers
  const handleSendToATS = (resumeFormattedText: string, jobDesc?: string) => {
    setAtsInitialResume(resumeFormattedText);
    if (jobDesc) setAtsInitialJobDesc(jobDesc);
    setActiveTab('ats');
  };

  const handleSelectJobForCV = (job: ExternalJobListing) => {
    setActiveTab('resume');
  };

  const handleSelectJobForCoverLetter = (job: ExternalJobListing) => {
    setActiveTab('cover-letter');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Persistent Navigation Header & Quota Monitor */}
      <Header
        currentCredential={currentCredential}
        remainingQuota={remainingQuota}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCredentialModal={() => setIsCredModalOpen(true)}
      />

      {/* Main Tab Panels */}
      <main className="flex-1 pb-16">
        {activeTab === 'resume' && (
          <ResumeMaker
            currentCredential={currentCredential}
            remainingQuota={remainingQuota}
            onQuotaUsed={handleQuotaUsed}
            savedResumes={savedResumes}
            onSaveResume={handleSaveResume}
            onSendToATS={handleSendToATS}
          />
        )}

        {activeTab === 'ats' && (
          <ATSChecker
            currentCredential={currentCredential}
            remainingQuota={remainingQuota}
            onQuotaUsed={handleQuotaUsed}
            savedAnalyses={savedATSAnalyses}
            onSaveAnalysis={handleSaveATSAnalysis}
            initialResumeText={atsInitialResume}
            initialJobDesc={atsInitialJobDesc}
          />
        )}

        {activeTab === 'cover-letter' && (
          <CoverLetterMaker
            currentCredential={currentCredential}
            remainingQuota={remainingQuota}
            onQuotaUsed={handleQuotaUsed}
            savedLetters={savedCoverLetters}
            onSaveLetter={handleSaveCoverLetter}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewPrep
            currentCredential={currentCredential}
            remainingQuota={remainingQuota}
            onQuotaUsed={handleQuotaUsed}
            savedPreps={savedPreps}
            onSavePrep={handleSavePrep}
          />
        )}

        {activeTab === 'tracker' && (
          <JobTracker
            currentCredential={currentCredential}
            jobApplications={jobApplications}
            onSaveJobApplication={handleSaveJobApplication}
            onDeleteJobApplication={handleDeleteJobApplication}
          />
        )}

        {activeTab === 'market' && (
          <IrishMarketExplorer
            onSelectJobForCV={handleSelectJobForCV}
            onSelectJobForCoverLetter={handleSelectJobForCoverLetter}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>EireCareer</strong> • Irish Job Hunting Suite (Unlimited 2-Page Irish CVs, ATS Scan, STAR Interview Coach, Salary € Bands)
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Active Account: {currentCredential.id} ({currentCredential.name}) • Unlimited Irish CV Maker
          </span>
        </div>
      </footer>

      {/* Credential & Account Switcher Modal */}
      <CredentialModal
        isOpen={isCredModalOpen}
        onClose={() => setIsCredModalOpen(false)}
        credentials={credentials}
        currentCredential={currentCredential}
        onSelectCredential={(id) => {
          setActiveCredId(id);
          setIsCredModalOpen(false);
        }}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
}
