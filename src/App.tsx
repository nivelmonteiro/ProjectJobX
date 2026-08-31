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
  id: 'resume-nivel-1',
  title: 'Financial Analyst / Fund Accountant - Dublin IFSC',
  targetRole: 'Financial Analyst / Fund Accountant',
  targetCompany: 'State Street Ireland / Bank of Ireland',
  createdAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Nivel Monteiro',
    email: 'nivelmonteiro@outlook.com',
    phone: '+353 89 984 7924',
    location: 'Dublin, Ireland',
    eircode: 'D02 X285',
    workEligibility: 'Stamp 1G',
    linkedin: 'https://linkedin.com/in/nivelmonteiro',
    github: ''
  },
  professionalSummary: 'Strategic and detail-oriented Financial Analyst & Fund Accounting Specialist with over 8+ years of progressive experience spanning corporate finance, Net Asset Value (NAV) computation, mutual fund valuations, cash flow forecasting, and statutory audit governance. Holds an MBA in Finance from Dublin Business School (NFQ Level 9) and valid Irish Stamp 1G work authorization with immediate right to work in Ireland without sponsorship. Proficient in SAP FICO, Advanced MS Excel financial modeling, and leading cross-functional audit readiness for Irish IFSC and multinational institutions.',
  skills: {
    technical: [
      'Financial Modeling (DCF / LBO)',
      'NAV Calculation & Asset Pricing',
      'Cash Flow Forecasting & Budget Variance',
      'NAV Accounting & Reconciliations',
      'Advanced MS Excel (XLOOKUP, Pivot, Macros)',
      'Power BI & Executive KPI Dashboards',
      'SAP FICO',
      'QuickBooks',
      'Tally Prime',
      'SQL'
    ],
    domain: [
      'Fund Accounting & Mutual Fund Valuations',
      'KYC / CKYC Customer Due Diligence',
      'AML Protocols & Sanctions Screening',
      'Statutory Audit Governance',
      'GAAP & IFRS Financial Reporting',
      'Direct & Indirect Taxation (Irish Tax / VAT / TDS)',
      'Balance Sheet Reconciliation',
      'Liquidity & Working Capital Management',
      'Internal Financial Controls'
    ],
    soft: [
      'Executive Stakeholder Reporting',
      'Analytical Problem Solving',
      'Cross-Functional Team Collaboration',
      'Audit Coordination & Negotiation',
      'Regulatory Communication'
    ],
    tools: [
      'SAP ERP',
      'Power BI',
      'QuickBooks',
      'MS Office 365',
      'Alteryx',
      'Tableau',
      'Jira'
    ]
  },
  workExperiences: [
    {
      id: 'exp-1',
      role: 'Financial Analyst (Freelance / Advisory)',
      company: 'Finkasturi Technologies / Strategic Advisory',
      location: 'Corporate Advisory, Financial Modeling & Strategy',
      startDate: 'Nov 2024',
      endDate: 'Present',
      isCurrent: true,
      highlights: [
        'Spearhead full-cycle corporate financial modeling, multi-scenario forecasting, and budget variance analyses to support strategic executive decisions.',
        'Execute end-to-end KYC/AML customer due diligence, sanctions screening, and financial crime risk profiling for international corporate client portfolios.',
        'Engineer dynamic KPI & liquidity dashboards in Advanced MS Excel and Power BI, tracking operating burn rates, cash flow, and margin performance.',
        'Develop DCF valuation models, sensitivity analyses, and investment memoranda for board presentations and investor due diligence review.',
        'Ensure rigorous compliance with international reporting standards, statutory frameworks, and data protection guidelines.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Accountant & Financial Analyst',
      company: 'American Eye & Retina Care Pvt. Ltd.',
      location: 'Healthcare Financial Operations & Multi-Branch Accounting',
      startDate: 'Aug 2022',
      endDate: 'Aug 2023',
      isCurrent: false,
      highlights: [
        'Directed full-cycle financial reporting, ledger maintenance, and final accounts finalization under GAAP/IFRS standards with 100% statutory compliance.',
        'Streamlined accounts reconciliation and billing workflows, reducing monthly close turnaround time by 20% while eliminating reporting bottlenecks.',
        'Led cross-departmental internal audits and balance sheet reconciliations, identifying cost anomalies and enhancing working capital efficiency.',
        'Designed structured cash flow forecasting models that improved short-term liquidity management and vendor settlement cycles.'
      ]
    },
    {
      id: 'exp-3',
      role: 'Accounts & Finance Executive',
      company: 'RNS & Associates (Chartered Accountants & Tax Practitioners)',
      location: 'Statutory Audit, Direct & Indirect Taxation, Corporate Advisory',
      startDate: 'Aug 2017',
      endDate: 'Apr 2019',
      isCurrent: false,
      highlights: [
        'Executed statutory audits, trial balance reconciliations, and financial statement preparations for corporate and SME clients across multiple industries.',
        'Managed direct and indirect tax compliance (GST, Income Tax, Sales Tax), ensuring 100% on-time statutory submissions with zero penalties.',
        'Automated ledger reconciliation and reporting workflows via Advanced Excel, reducing data reconciliation errors by 15%.',
        'Advised client executives on tax planning strategies, compliance documentation, and financial governance frameworks.'
      ]
    },
    {
      id: 'exp-4',
      role: 'Accounts & Finance Officer',
      company: 'Bombay Oxygen Corporation Ltd. / Bombay Investment Co. Pvt. Ltd.',
      location: 'Treasury, Mutual Fund Accounting, NAV Computation & Statutory Filings',
      startDate: 'Nov 2014',
      endDate: 'Aug 2017',
      isCurrent: false,
      highlights: [
        'Managed mutual fund accounting, daily Net Asset Value (NAV) computation, and asset reconciliation under SEBI regulatory guidelines.',
        'Prepared Tax Deducted at Source (TDS) schedules, statutory service tax filings, and documentation for quarterly and annual external audits.',
        'Coordinated liquidity management and treasury transactions with banking institutions and asset management houses.',
        'Negotiated corporate insurance renewals, reducing annual premium costs by 12% while expanding policy coverage.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Master of Business Administration (MBA) – Finance',
      institution: 'Dublin Business School (DBS)',
      location: 'Dublin, Ireland',
      year: '2023 – 2025',
      gradeOrHonours: 'Honours Graduate (NFQ Level 9 Equivalent)'
    },
    {
      id: 'edu-2',
      degree: 'Bachelor of Business Management (BBM) – Accounts & Finance',
      institution: 'St. Aloysius College, Mangalore University',
      location: 'Mangalore, India',
      year: '2011 – 2014',
      gradeOrHonours: 'First Class Honours (NFQ Level 8 Equivalent)'
    }
  ],
  certifications: [
    'Diploma in Irish Taxation – University College Dublin (UCD Professional Academy)',
    'Certified Mutual Fund Distributor – National Institute of Securities Markets (NISM), India',
    'SAP Certified – ERP Financials (FICO, MM, SD & PP Modules)',
    'Diploma in Investment Management & Portfolio Strategy',
    'Advanced Financial Modeling & Valuation – QuickBooks & Advanced MS Excel Certified',
    'Irish GDPR & Data Protection Regulations Compliance',
    'AML / KYC & Financial Crime Due Diligence Frameworks'
  ],
  keyAchievements: [
    'Tailored for Irish financial institutions and multinationals adhering to the Irish 2-page CV gold standard.',
    'Features 8+ years of progressive financial analysis, statutory audit, KYC/AML risk assessment, and regulatory compliance experience.',
    'Fully validated for high parse rate across Workday, Taleo, Greenhouse, and Lever ATS platforms.'
  ]
};

const DEFAULT_SAMPLE_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobTitle: 'Senior Fund Accountant (NAV Valuation)',
    company: 'State Street International Ireland',
    location: 'Dublin',
    salaryMin: 58000,
    salaryMax: 72000,
    currency: 'EUR',
    status: '1st Round Interview',
    visaRequirement: 'Stamp 1G',
    jobUrl: 'https://statestreet.com/careers',
    dateApplied: '2025-02-15',
    nextFollowUpDate: '2025-03-02',
    contactPerson: 'Fund Administration Hiring Team',
    notes: 'HR phone screen completed. Technical assessment on NAV reconciliations & pricing scheduled.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app-2',
    jobTitle: 'Financial Analyst (FP&A & Variance Modeling)',
    company: 'Bank of Ireland / Stripe',
    location: 'Dublin',
    salaryMin: 60000,
    salaryMax: 75000,
    currency: 'EUR',
    status: 'Applied',
    visaRequirement: 'Stamp 1G',
    jobUrl: 'https://bankofireland.com/careers',
    dateApplied: '2025-02-20',
    notes: 'Submitted tailored Irish CV focusing on 8+ years corporate financial analysis and MBA qualification.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app-3',
    jobTitle: 'Fund Accounting & Valuation Specialist',
    company: 'BNY Mellon Ireland',
    location: 'Dublin',
    salaryMin: 55000,
    salaryMax: 70000,
    currency: 'EUR',
    status: 'Final Interview / Assessment',
    visaRequirement: 'Stamp 1G',
    jobUrl: 'https://bnymellon.com',
    dateApplied: '2025-02-08',
    notes: 'Completed case study on multi-asset mutual fund portfolio reconciliation under CBI regulations.',
    updatedAt: new Date().toISOString()
  }
];

function safeParseLocalStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const trimmed = saved.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return fallback;
    }
    return JSON.parse(trimmed) as T;
  } catch (e) {
    console.warn(`Local storage recovery for ${key}:`, e);
    return fallback;
  }
}

export default function App() {
  // Credentials (max 4 allowed login credentials)
  const [credentials, setCredentials] = useState<UserCredential[]>(() => {
    const parsed = safeParseLocalStorage<UserCredential[]>('eire_credentials', INITIAL_USER_CREDENTIALS);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((c: any) => ({
        ...c,
        visaStatus: (c.visaStatus && (c.visaStatus.includes('Critical') || c.visaStatus.includes('CSEP'))) ? '' : c.visaStatus
      }));
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
    const parsed = safeParseLocalStorage<TailoredResume[]>('eire_resumes', [DEFAULT_SAMPLE_RESUME]);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((r: any) => {
        if (r.personalInfo?.workEligibility && (r.personalInfo.workEligibility.includes('Critical') || r.personalInfo.workEligibility.includes('CSEP'))) {
          return {
            ...r,
            personalInfo: {
              ...r.personalInfo,
              workEligibility: ''
            }
          };
        }
        return r;
      });
    }
    return [DEFAULT_SAMPLE_RESUME];
  });

  const [savedATSAnalyses, setSavedATSAnalyses] = useState<ATSAnalysis[]>(() => {
    return safeParseLocalStorage<ATSAnalysis[]>('eire_ats_analyses', []);
  });

  const [savedCoverLetters, setSavedCoverLetters] = useState<TailoredCoverLetter[]>(() => {
    return safeParseLocalStorage<TailoredCoverLetter[]>('eire_cover_letters', []);
  });

  const [savedPreps, setSavedPreps] = useState<InterviewPrepSession[]>(() => {
    return safeParseLocalStorage<InterviewPrepSession[]>('eire_preps', []);
  });

  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() => {
    const parsed = safeParseLocalStorage<JobApplication[]>('eire_job_apps', DEFAULT_SAMPLE_APPLICATIONS);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SAMPLE_APPLICATIONS;
  });

  // Cross-tool pipeline transfers
  const [atsInitialResume, setAtsInitialResume] = useState<string>('');
  const [atsInitialJobDesc, setAtsInitialJobDesc] = useState<string>('');

  const [cvInitialRole, setCvInitialRole] = useState<string | undefined>(undefined);
  const [cvInitialCompany, setCvInitialCompany] = useState<string | undefined>(undefined);
  const [cvInitialDesc, setCvInitialDesc] = useState<string | undefined>(undefined);

  const [clInitialTitle, setClInitialTitle] = useState<string | undefined>(undefined);
  const [clInitialCompany, setClInitialCompany] = useState<string | undefined>(undefined);
  const [clInitialDesc, setClInitialDesc] = useState<string | undefined>(undefined);

  const [intInitialTitle, setIntInitialTitle] = useState<string | undefined>(undefined);
  const [intInitialCompany, setIntInitialCompany] = useState<string | undefined>(undefined);
  const [intInitialDesc, setIntInitialDesc] = useState<string | undefined>(undefined);

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

  const handleAddAccount = async (accountData: Partial<UserCredential>) => {
    try {
      const res = await apiClient.addAccount(accountData);
      if (res && res.credentials) {
        setCredentials(res.credentials);
        if (res.account) {
          setActiveCredId(res.account.id);
        }
      }
    } catch (e) {
      console.warn('Error adding candidate account:', e);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      const res = await apiClient.deleteAccount(id);
      if (res && res.credentials) {
        setCredentials(res.credentials);
        if (activeCredId === id && res.credentials.length > 0) {
          setActiveCredId(res.credentials[0].id);
        }
      }
    } catch (e) {
      console.warn('Error deleting candidate account:', e);
    }
  };

  const handleUpdateProfile = (updatedData: Partial<UserCredential>) => {
    setCredentials(prev => prev.map(c => {
      if (c.id === updatedData.id) {
        return { ...c, ...updatedData } as UserCredential;
      }
      return c;
    }));
    apiClient.updateProfile(updatedData);
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
    setCvInitialRole(job.title);
    setCvInitialCompany(job.company);
    setCvInitialDesc(job.description);
    setActiveTab('resume');
  };

  const handleSelectJobForCoverLetter = (job: ExternalJobListing) => {
    setClInitialTitle(job.title);
    setClInitialCompany(job.company);
    setClInitialDesc(job.description);
    setActiveTab('cover-letter');
  };

  const handleSelectJobForInterview = (job: ExternalJobListing) => {
    setIntInitialTitle(job.title);
    setIntInitialCompany(job.company);
    setIntInitialDesc(job.description);
    setActiveTab('interview');
  };

  const handleTrackJobFromMarket = (job: ExternalJobListing) => {
    const existing = jobApplications.find(j => 
      (j.jobTitle || '').toLowerCase() === (job.title || '').toLowerCase() && 
      (j.company || '').toLowerCase() === (job.company || '').toLowerCase()
    );

    if (existing) {
      return;
    }

    const rawLocation = (job.location || '').toLowerCase();
    let matchedLocation: any = 'Dublin';
    if (rawLocation.includes('cork')) matchedLocation = 'Cork';
    else if (rawLocation.includes('galway')) matchedLocation = 'Galway';
    else if (rawLocation.includes('limerick')) matchedLocation = 'Limerick';
    else if (rawLocation.includes('waterford')) matchedLocation = 'Waterford';
    else if (rawLocation.includes('sligo')) matchedLocation = 'Sligo';
    else if (rawLocation.includes('athlone')) matchedLocation = 'Athlone';

    const newApp: JobApplication = {
      id: `app-market-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      jobTitle: job.title,
      company: job.company,
      location: matchedLocation,
      status: 'Saved',
      currency: 'EUR',
      salaryMin: 55000,
      salaryMax: 75000,
      visaRequirement: currentCredential.visaStatus as any || 'Stamp 1G',
      jobUrl: job.applyUrl || job.url,
      jobDescription: job.description,
      dateApplied: new Date().toISOString().split('T')[0],
      nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: `Discovered via ${job.source || 'Irish Market & Jobs'}. ${job.visaFriendlyNote ? `[Visa Note: ${job.visaFriendlyNote}]` : ''}`,
      updatedAt: new Date().toISOString()
    };

    handleSaveJobApplication(newApp);
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
            initialTargetRole={cvInitialRole}
            initialTargetCompany={cvInitialCompany}
            initialJobDescription={cvInitialDesc}
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
            initialJobTitle={clInitialTitle}
            initialCompanyName={clInitialCompany}
            initialJobDescription={clInitialDesc}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewPrep
            currentCredential={currentCredential}
            remainingQuota={remainingQuota}
            onQuotaUsed={handleQuotaUsed}
            savedPreps={savedPreps}
            onSavePrep={handleSavePrep}
            initialJobTitle={intInitialTitle}
            initialCompanyName={intInitialCompany}
            initialJobDescription={intInitialDesc}
          />
        )}

        {activeTab === 'tracker' && (
          <JobTracker
            currentCredential={currentCredential}
            jobApplications={jobApplications}
            onSaveJobApplication={handleSaveJobApplication}
            onDeleteJobApplication={handleDeleteJobApplication}
            onSelectForTailoring={(role, company, desc) => {
              setCvInitialRole(role);
              setCvInitialCompany(company);
              setCvInitialDesc(desc);
              setActiveTab('resume');
            }}
          />
        )}

        {activeTab === 'market' && (
          <IrishMarketExplorer
            onSelectJobForCV={handleSelectJobForCV}
            onSelectJobForCoverLetter={handleSelectJobForCoverLetter}
            onSelectJobForInterview={handleSelectJobForInterview}
            jobApplications={jobApplications}
            onTrackJob={handleTrackJobFromMarket}
            onNavigateToTracker={() => setActiveTab('tracker')}
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
        onAddAccount={handleAddAccount}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}
