import React, { useState, useEffect, useRef } from 'react';
import { 
  UserCredential, 
  PortalUser,
  CandidateProfile,
  TailoredResume, 
  ATSAnalysis, 
  TailoredCoverLetter, 
  InterviewPrepSession, 
  JobApplication,
  ExternalJobListing
} from './types';
import { apiClient } from './utils/apiClient';
import { 
  INITIAL_PORTAL_USER,
  INITIAL_CANDIDATE_PROFILES,
  INITIAL_USER_CREDENTIALS, 
  INITIAL_EXTERNAL_JOBS 
} from './data/irishMarketData';
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
    email: 'nivelmonteiro.NM@gmail.com',
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
      'Statutory Audit & Direct/Indirect Taxation',
      'UCITS / AIFMD Regulatory Compliance',
      'KYC / AML Due Diligence & CBI Guidelines',
      'Working Capital & Multi-Branch Accounting',
      'Treasury & Liquidity Management',
      'Irish Corporate Tax & VAT Filings'
    ],
    soft: [
      'Stakeholder Management',
      'Cross-Border Financial Governance',
      'Audit Coordination',
      'Analytical Problem Solving',
      'Executive Financial Reporting'
    ],
    tools: [
      'Advanced MS Excel',
      'Power BI',
      'SAP FICO',
      'QuickBooks',
      'Bloomberg Terminal',
      'SQL'
    ]
  },
  workExperiences: [
    {
      id: 'exp-1',
      role: 'Financial Analyst & Fund Accounting Specialist',
      company: 'Corporate & Asset Management Advisory',
      location: 'Dublin IFSC / Hybrid',
      startDate: 'Sep 2023',
      endDate: 'Present',
      isCurrent: true,
      highlights: [
        'Perform daily and weekly Net Asset Value (NAV) calculations and asset reconciliations for diverse portfolio funds under UCITS/AIFMD frameworks.',
        'Construct comprehensive discounted cash flow (DCF) and three-statement financial models in Excel and Power BI to evaluate capital allocation scenarios.',
        'Execute rigorous variance analysis on monthly management accounts, presenting executive commentary on EBITDA performance and working capital trends.',
        'Liaise with external auditors (Big 4) and regulatory bodies, compiling audit schedules that ensured zero non-compliance findings.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Finance & Accounts Manager',
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
  // Master Portal User Account
  const [portalUser, setPortalUser] = useState<PortalUser>(() => {
    return safeParseLocalStorage<PortalUser>('eire_portal_user', INITIAL_PORTAL_USER);
  });

  // Candidate Profiles under this account
  const [candidateProfiles, setCandidateProfiles] = useState<CandidateProfile[]>(() => {
    const parsed = safeParseLocalStorage<CandidateProfile[]>('eire_candidate_profiles', INITIAL_CANDIDATE_PROFILES);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CANDIDATE_PROFILES;
  });

  // Currently active candidate profile
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return localStorage.getItem('eire_active_profile_id') || 'PROF-101';
  });

  const [activeTab, setActiveTab] = useState<string>('resume');
  const [isCredModalOpen, setIsCredModalOpen] = useState<boolean>(false);
  const [modalInitialView, setModalInitialView] = useState<'profiles' | 'signin' | 'register' | 'verify' | 'sync'>('profiles');
  const [activeLocationsCount, setActiveLocationsCount] = useState<number>(2);
  const [activeLocationsList, setActiveLocationsList] = useState<string[]>(['Dublin (Silicon Docks)', 'Cork (Mobile App)']);

  // Quota (unlimited)
  const [remainingQuota, setRemainingQuota] = useState<number>(999999);

  // Persistent stored workspace items
  const [savedResumes, setSavedResumes] = useState<TailoredResume[]>(() => {
    const parsed = safeParseLocalStorage<TailoredResume[]>('eire_resumes', [DEFAULT_SAMPLE_RESUME]);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_SAMPLE_RESUME];
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

  // Derived current candidate profile
  const currentProfile: CandidateProfile = candidateProfiles.find(p => p.id === activeProfileId) || candidateProfiles[0] || INITIAL_CANDIDATE_PROFILES[0];
  
  // Backward compatibility alias
  const currentCredential: UserCredential = {
    ...currentProfile,
    isEmailVerified: portalUser.isEmailVerified,
    activeSessionsCount: portalUser.activeSessionsCount,
    activeLocations: portalUser.activeLocations
  };

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('eire_portal_user', JSON.stringify(portalUser));
  }, [portalUser]);

  useEffect(() => {
    localStorage.setItem('eire_candidate_profiles', JSON.stringify(candidateProfiles));
  }, [candidateProfiles]);

  useEffect(() => {
    localStorage.setItem('eire_active_profile_id', activeProfileId);
  }, [activeProfileId]);

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

  // Load server profiles and account state on start
  useEffect(() => {
    async function loadAccountData() {
      try {
        const res = await apiClient.getCandidateProfiles(portalUser.id);
        if (res && Array.isArray(res.candidateProfiles) && res.candidateProfiles.length > 0) {
          setCandidateProfiles(res.candidateProfiles);
          if (res.activeLocations) {
            setActiveLocationsList(res.activeLocations);
            setActiveLocationsCount(res.activeLocations.length);
          }
        }
      } catch (e) {
        console.warn('Initial candidate profiles load:', e);
      }
    }
    loadAccountData();
  }, [portalUser.id]);

  // Real-Time Multi-Location Synchronization Engine
  useEffect(() => {
    const syncTargetId = portalUser.id || activeProfileId;
    
    // Heartbeat & Presence Interval
    const interval = setInterval(async () => {
      try {
        // Send presence heartbeat
        const presence = await apiClient.sendPresence(syncTargetId, currentProfile.location || 'Dublin', 'Web Applet');
        if (presence && Array.isArray(presence.activeLocations)) {
          setActiveLocationsList(presence.activeLocations);
          setActiveLocationsCount(presence.activeLocations.length);
        }

        // Pull latest changes from other connected locations/tabs
        const syncData = await apiClient.pullWorkspace(syncTargetId);
        if (syncData && syncData.workspace) {
          if (Array.isArray(syncData.workspace.jobApplications) && syncData.workspace.jobApplications.length > 0) {
            setJobApplications(prev => {
              if (syncData.workspace.jobApplications.length !== prev.length) {
                return syncData.workspace.jobApplications;
              }
              return prev;
            });
          }
        }
      } catch {
        // silent background sync catch
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [portalUser.id, activeProfileId, currentProfile.location]);

  // Push local changes to server
  const syncChangesToServer = async (overrideData?: any) => {
    try {
      const syncTargetId = portalUser.id || activeProfileId;
      await apiClient.syncWorkspace(syncTargetId, {
        resumes: overrideData?.resumes || savedResumes,
        atsAnalyses: overrideData?.atsAnalyses || savedATSAnalyses,
        coverLetters: overrideData?.coverLetters || savedCoverLetters,
        interviewPreps: overrideData?.interviewPreps || savedPreps,
        jobApplications: overrideData?.jobApplications || jobApplications
      });
    } catch (e) {
      console.warn('Sync push deferred:', e);
    }
  };

  const handleQuotaUsed = (newRemaining: number) => {
    setRemainingQuota(999999);
  };

  // Auth Handlers
  const handleLogin = async (email: string, password?: string, location?: string): Promise<boolean> => {
    try {
      const res = await apiClient.login({
        email,
        password,
        clientLocation: location || 'Dublin (Silicon Docks)'
      });

      if (res && res.success && res.user) {
        setPortalUser(res.user);
        if (Array.isArray(res.candidateProfiles) && res.candidateProfiles.length > 0) {
          setCandidateProfiles(res.candidateProfiles);
          setActiveProfileId(res.activeProfile?.id || res.candidateProfiles[0].id);
        }
        if (res.activeLocations) {
          setActiveLocationsList(res.activeLocations);
          setActiveLocationsCount(res.activeLocations.length);
        }
        return true;
      }
    } catch (e) {
      console.warn('Login error:', e);
    }
    return false;
  };

  const handleRegister = async (data: any) => {
    return await apiClient.register(data);
  };

  const handleVerifyEmail = async (email: string, code: string): Promise<boolean> => {
    try {
      const res = await apiClient.verifyEmail({
        email: email || portalUser.email,
        code,
        userId: portalUser.id
      });
      if (res && res.success) {
        setPortalUser(prev => ({ ...prev, isEmailVerified: true }));
        if (res.candidateProfiles && res.candidateProfiles.length > 0) {
          setCandidateProfiles(res.candidateProfiles);
        }
        return true;
      }
    } catch (e) {
      console.warn('Verify error:', e);
    }
    return false;
  };

  const handleResendCode = async (email: string) => {
    return await apiClient.resendCode({ email: email || portalUser.email, userId: portalUser.id });
  };

  const handleLogout = () => {
    apiClient.logout({ userId: portalUser.id });
    setPortalUser({
      id: 'USR-GUEST',
      name: 'Guest User',
      email: 'guest@eirecareers.ie',
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      candidateProfiles: INITIAL_CANDIDATE_PROFILES
    });
  };

  // Candidate Profile Management
  const handleSelectProfile = (profileId: string) => {
    setActiveProfileId(profileId);
  };

  const handleAddProfile = async (profileData: Partial<CandidateProfile>) => {
    try {
      const res = await apiClient.addCandidateProfile(portalUser.id, profileData);
      if (res && res.candidateProfiles) {
        setCandidateProfiles(res.candidateProfiles);
        if (res.profile) {
          setActiveProfileId(res.profile.id);
        }
      } else {
        const newProf: CandidateProfile = {
          id: `PROF-${Date.now().toString().slice(-4)}`,
          name: profileData.name || 'New Candidate',
          headline: profileData.headline || 'Professional',
          location: (profileData.location as any) || 'Dublin',
          visaStatus: (profileData.visaStatus as any) || 'Stamp 1G',
          phone: profileData.phone || '+353 87 000 0000',
          email: profileData.email || portalUser.email,
          eircode: profileData.eircode || 'D02 X285',
          linkedinUrl: profileData.linkedinUrl || '',
          githubUrl: profileData.githubUrl || ''
        };
        setCandidateProfiles(prev => [newProf, ...prev]);
        setActiveProfileId(newProf.id);
      }
    } catch (e) {
      console.warn('Add profile local fallback:', e);
    }
  };

  const handleUpdateProfile = async (profileId: string, updatedData: Partial<CandidateProfile>) => {
    try {
      const res = await apiClient.updateCandidateProfile(portalUser.id, profileId, updatedData);
      if (res && res.candidateProfiles) {
        setCandidateProfiles(res.candidateProfiles);
      } else {
        setCandidateProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updatedData } : p));
      }
    } catch (e) {
      setCandidateProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updatedData } : p));
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    try {
      const res = await apiClient.deleteCandidateProfile(portalUser.id, profileId);
      if (res && res.candidateProfiles) {
        setCandidateProfiles(res.candidateProfiles);
        if (activeProfileId === profileId && res.candidateProfiles.length > 0) {
          setActiveProfileId(res.candidateProfiles[0].id);
        }
      } else {
        const remaining = candidateProfiles.filter(p => p.id !== profileId);
        setCandidateProfiles(remaining);
        if (activeProfileId === profileId && remaining.length > 0) {
          setActiveProfileId(remaining[0].id);
        }
      }
    } catch (e) {
      console.warn('Delete profile fallback:', e);
    }
  };

  // Workspace items handlers
  const handleSaveResume = (newResume: TailoredResume) => {
    const updated = [newResume, ...savedResumes.filter(r => r.id !== newResume.id)];
    setSavedResumes(updated);
    syncChangesToServer({ resumes: updated });
  };

  const handleSaveATSAnalysis = (analysis: ATSAnalysis) => {
    const updated = [analysis, ...savedATSAnalyses.filter(a => a.id !== analysis.id)];
    setSavedATSAnalyses(updated);
    syncChangesToServer({ atsAnalyses: updated });
  };

  const handleSaveCoverLetter = (letter: TailoredCoverLetter) => {
    const updated = [letter, ...savedCoverLetters.filter(l => l.id !== letter.id)];
    setSavedCoverLetters(updated);
    syncChangesToServer({ coverLetters: updated });
  };

  const handleSavePrep = (prep: InterviewPrepSession) => {
    const updated = [prep, ...savedPreps.filter(p => p.id !== prep.id)];
    setSavedPreps(updated);
    syncChangesToServer({ interviewPreps: updated });
  };

  const handleSaveJobApplication = (job: JobApplication) => {
    let updated: JobApplication[];
    const exists = jobApplications.some(j => j.id === job.id);
    if (exists) {
      updated = jobApplications.map(j => j.id === job.id ? job : j);
    } else {
      updated = [job, ...jobApplications];
    }
    setJobApplications(updated);
    syncChangesToServer({ jobApplications: updated });
  };

  const handleDeleteJobApplication = (jobId: string) => {
    const updated = jobApplications.filter(j => j.id !== jobId);
    setJobApplications(updated);
    syncChangesToServer({ jobApplications: updated });
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
      visaRequirement: currentProfile.visaStatus as any || 'Stamp 1G',
      jobUrl: job.applyUrl || job.url,
      jobDescription: job.description,
      dateApplied: new Date().toISOString().split('T')[0],
      nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: `Discovered via ${job.source || 'Irish Market & Jobs'}. ${job.visaFriendlyNote ? `[Visa Note: ${job.visaFriendlyNote}]` : ''}`,
      updatedAt: new Date().toISOString()
    };

    handleSaveJobApplication(newApp);
  };

  const openAuthModal = (view: 'profiles' | 'signin' | 'register' | 'verify' | 'sync' = 'profiles') => {
    setModalInitialView(view);
    setIsCredModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Persistent Navigation Header with Multi-Location Real-Time Status */}
      <Header
        portalUser={portalUser}
        currentProfile={currentProfile}
        candidateProfiles={candidateProfiles}
        onSelectProfile={handleSelectProfile}
        remainingQuota={remainingQuota}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCredentialModal={openAuthModal}
        activeLocationsCount={activeLocationsCount}
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
            Portal Account: {portalUser.email} • Active Profile: {currentProfile.name} ({currentProfile.id}) • Multi-Location Sync 🇮🇪
          </span>
        </div>
      </footer>

      {/* Portal User Authentication, Email Confirmation & Candidate Profiles Modal */}
      <CredentialModal
        isOpen={isCredModalOpen}
        onClose={() => setIsCredModalOpen(false)}
        portalUser={portalUser}
        candidateProfiles={candidateProfiles}
        currentProfile={currentProfile}
        onSelectProfile={handleSelectProfile}
        onAddProfile={handleAddProfile}
        onUpdateProfile={handleUpdateProfile}
        onDeleteProfile={handleDeleteProfile}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onVerifyEmail={handleVerifyEmail}
        onResendCode={handleResendCode}
        onLogout={handleLogout}
        activeLocations={activeLocationsList}
        activeSessionsCount={activeLocationsCount}
        initialView={modalInitialView}
      />
    </div>
  );
}
