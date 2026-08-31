export type IrishStampVisa = 
  | 'Stamp 1G'
  | 'Stamp 1'
  | 'Stamp 4'
  | 'Stamp 2'
  | 'EU/EEA Citizen'
  | 'UK/CTA Citizen'
  | string;

export type IrishVisaStatus = IrishStampVisa;

export type IrishLocation = 
  | 'Dublin'
  | 'Cork'
  | 'Galway'
  | 'Limerick'
  | 'Waterford'
  | 'Kilkenny'
  | 'Drogheda'
  | 'Dundalk'
  | 'Sligo'
  | 'Athlone'
  | 'Wexford';

export type JobStatus = 
  | 'Saved'
  | 'Applied'
  | 'Phone Screen'
  | '1st Round Interview'
  | 'Final Interview / Assessment'
  | 'Offer Received'
  | 'Rejected'
  | 'Withdrawn';

export interface UserCredential {
  id: string; // e.g. "IND-101"
  name: string;
  email: string;
  headline: string;
  location: IrishLocation;
  visaStatus: IrishStampVisa;
  phone: string; // +353...
  eircode?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  dailyUsageCount?: number;
  lastUsageDate?: string;
  maxDailyQuota?: number;
}

export type IndividualAccount = UserCredential;

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string; // Nature of Business / Industry
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  gradeOrHonours?: string; // e.g. "First Class Honours (1:1)" or "2:1"
}

export interface TailoredResume {
  id: string;
  title: string;
  targetRole: string;
  targetCompany: string;
  createdAt: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    eircode: string;
    workEligibility: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  professionalSummary: string;
  skills: {
    technical: string[];
    domain: string[];
    soft: string[];
    tools: string[];
  };
  workExperiences: WorkExperience[];
  education: EducationItem[];
  certifications: string[];
  projects?: {
    name: string;
    description: string;
    techStack: string[];
    link?: string;
  }[];
  keyAchievements: string[];
}

export interface ATSAnalysis {
  id: string;
  jobTitle: string;
  companyName: string;
  analyzedAt: string;
  overallScore: number; // 0-100
  keywordMatchScore: number; // 0-100
  formatStructureScore: number; // 0-100
  irishMarketComplianceScore: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  essentialSkillsFound: string[];
  essentialSkillsMissing: string[];
  formatCritiques: {
    aspect: string;
    status: 'pass' | 'warning' | 'fail';
    comment: string;
  }[];
  irishSpecificAdvice: string[];
  actionableImprovements: string[];
  optimizedSummarySuggestion?: string;
}

export interface TailoredCoverLetter {
  id: string;
  title: string;
  targetRole: string;
  targetCompany: string;
  hiringManager: string;
  companyAddressOrLocation: string;
  createdAt: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  workAuthorizationStatement: string;
  closingParagraph: string;
  signOff: string; // e.g. "Kind regards," or "Is mise le meas,"
  fullFormattedText: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Competency (STAR)' | 'Irish Market & Culture' | 'Technical/Domain' | 'Situational' | 'Salary & Visa';
  question: string;
  whyAsked: string;
  starFramework: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  keyIrishKeywordsToMention: string[];
  pitfallsToAvoid: string[];
  suggestedAnswer: string;
  userPracticeAnswer?: string;
  aiEvaluation?: {
    score: number; // 0-100
    strengths: string[];
    improvements: string[];
    starRating: {
      clarity: number;
      impact: number;
      relevance: number;
    };
  };
}

export interface InterviewPrepSession {
  id: string;
  targetRole: string;
  targetCompany: string;
  salaryBenchmarkGuide: {
    dublinRange: string;
    regionalRange: string;
    irishMarketNotes: string;
  };
  questions: InterviewQuestion[];
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  location: IrishLocation;
  salaryMin?: number;
  salaryMax?: number;
  currency: 'EUR';
  status: JobStatus;
  visaRequirement: IrishStampVisa;
  jobUrl?: string;
  jobDescription?: string;
  dateApplied: string;
  nextFollowUpDate?: string;
  contactPerson?: string;
  contactEmail?: string;
  notes: string;
  linkedResumeId?: string;
  linkedCoverLetterId?: string;
  linkedInterviewPrepId?: string;
  updatedAt: string;
}

export interface IrishSalaryBenchmark {
  sector: string;
  roles: {
    title: string;
    junior: string;
    mid: string;
    senior: string;
    lead: string;
    popularHubs: string[];
    inDemandSkills: string[];
  }[];
}

export interface ExternalJobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  salary?: string;
  tags: string[];
  description: string;
  url: string;
  applyUrl?: string;
  postedDate: string;
  category: string;
  source?: string;
  sourceType?: 'google-search' | 'linkedin' | 'indeed' | 'irishjobs' | 'agency' | 'publicjobs' | 'company-site';
  agencyName?: string;
  visaFriendlyNote?: string;
}

export interface IrishRecruitmentAgency {
  id: string;
  name: string;
  specialism: string;
  locations: string[];
  websiteUrl: string;
  jobsUrl: string;
  logoText: string;
  keySectors: string[];
  recruiterTip: string;
}

