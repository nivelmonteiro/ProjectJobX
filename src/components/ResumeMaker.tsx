import React, { useState, useRef, useEffect } from 'react';
import mammoth from 'mammoth';
import { UserCredential, TailoredResume, WorkExperience, EducationItem, IrishStampVisa, IrishLocation } from '../types';
import { apiClient } from '../utils/apiClient';
import { exportResumeToPDF } from '../utils/pdfExport';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  ArrowRight,
  RefreshCw,
  Eye,
  Edit3,
  Upload,
  FileCheck,
  X,
  FileUp,
  User,
  MapPin,
  Phone,
  Mail,
  FileBadge
} from 'lucide-react';

interface ResumeMakerProps {
  currentCredential: UserCredential;
  remainingQuota: number;
  onQuotaUsed: (newRemaining: number) => void;
  savedResumes: TailoredResume[];
  onSaveResume: (resume: TailoredResume) => void;
  onSendToATS: (resumeText: string, jobDesc?: string) => void;
}

export const IRISH_VISA_OPTIONS = [
  { value: 'Stamp 1G (Third Level Graduate)', label: 'Stamp 1G (Third Level Graduate - 2-Year Full Work Rights)', badge: 'Full Rights (2 Yrs)' },
  { value: 'Stamp 1G (Spouse/Partner of CSEP)', label: 'Stamp 1G (Spouse / Partner of Critical Skills Permit Holder)', badge: 'Full Rights (Spouse)' },
  { value: 'Stamp 1 (Employment Permit Required)', label: 'Stamp 1 (General Employment Permit / CSEP Required)', badge: 'Permit Needed' },
  { value: 'Stamp 4 (Full Work Rights)', label: 'Stamp 4 (Permanent / Spousal / 21-Month CSEP - Unrestricted)', badge: 'Full Rights (Unrestricted)' },
  { value: 'EU/EEA/Irish Citizen', label: 'EU / EEA / Irish Citizen (Unrestricted Irish & EU Work Rights)', badge: 'Citizen Rights' },
  { value: 'Critical Skills (CSEP Eligible)', label: 'Critical Skills (CSEP Eligible - Direct 2-Yr Path to Stamp 4)', badge: 'CSEP Eligible' },
  { value: 'UK/Common Travel Area', label: 'UK / Common Travel Area (CTA - Full Work Rights)', badge: 'CTA Rights' },
  { value: 'Stamp 2 (Student - 20h/40h)', label: 'Stamp 2 (Student Visa - 20h/week term, 40h holidays)', badge: 'Student 20h/40h' }
];

export const IRISH_LOCATIONS: IrishLocation[] = [
  'Dublin (Silicon Docks / City)',
  'Dublin (County / Suburbs)',
  'Cork',
  'Galway',
  'Limerick',
  'Waterford',
  'Shannon / Midwest',
  'Belfast / Cross-Border',
  'Remote (Ireland-wide)',
  'Hybrid (Dublin/Regional)'
];

export const ResumeMaker: React.FC<ResumeMakerProps> = ({
  currentCredential,
  remainingQuota,
  onQuotaUsed,
  savedResumes,
  onSaveResume,
  onSendToATS
}) => {
  // Candidate Profile & Irish Work Eligibility States (Directly editable by user)
  const [candidateName, setCandidateName] = useState(currentCredential.name || 'Nivel Monteiro');
  const [candidateVisa, setCandidateVisa] = useState<string>(currentCredential.visaStatus || 'Stamp 1G (Third Level Graduate)');
  const [candidateEmail, setCandidateEmail] = useState(currentCredential.email || 'nivelmonteiro@outlook.com');
  const [candidatePhone, setCandidatePhone] = useState(currentCredential.phone || '+353 89 984 7924');
  const [candidateLocation, setCandidateLocation] = useState<string>(currentCredential.location || 'Dublin (Silicon Docks / City)');
  const [candidateEircode, setCandidateEircode] = useState(currentCredential.eircode || 'D02 X285');
  const [candidateLinkedin, setCandidateLinkedin] = useState(currentCredential.linkedinUrl || 'https://linkedin.com/in/nivelmonteiro');

  const [jobTitle, setJobTitle] = useState('Financial Crime & Regulatory Compliance Analyst');
  const [companyName, setCompanyName] = useState('Stripe Ireland / Bank of Ireland');
  const [jobDescription, setJobDescription] = useState(
    'Looking for a Financial Crime & Regulatory Compliance Analyst in Dublin IFSC. Responsibilities: Perform KYC/AML due diligence, real-time sanctions screening, transaction monitoring, AML risk assessments, regulatory reporting under Central Bank of Ireland guidelines, and cross-functional audit coordination. Requirements: 5+ years finance/compliance experience, Stamp 1G/4 or EU work authorization, strong Excel/financial systems expertise, and NFQ Level 8/9 education.'
  );
  const [tone, setTone] = useState('IFSC Finance & Rigour');
  
  // Existing resume content & file upload state
  const [existingNotes, setExistingNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Active or Generated Resume state
  const [currentResume, setCurrentResume] = useState<TailoredResume | null>(
    savedResumes.length > 0 ? savedResumes[0] : null
  );
  const [activeView, setActiveView] = useState<'preview' | 'edit'>('preview');

  // Sync profile values when currentCredential prop changes
  useEffect(() => {
    setCandidateName(currentCredential.name);
    setCandidateVisa(currentCredential.visaStatus);
    setCandidateEmail(currentCredential.email);
    setCandidatePhone(currentCredential.phone);
    setCandidateLocation(currentCredential.location);
    if (currentCredential.eircode) setCandidateEircode(currentCredential.eircode);
    if (currentCredential.linkedinUrl) setCandidateLinkedin(currentCredential.linkedinUrl);
  }, [currentCredential.id]);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploadingFile(true);

    try {
      const lowerName = file.name.toLowerCase();

      // 1. Text or Markdown files
      if (file.type === 'text/plain' || lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
        const text = await file.text();
        setExistingNotes(text);
        setUploadedFileName(file.name);
        return;
      }

      // 2. Client-side DOCX extraction with mammoth for instant speed
      if (lowerName.endsWith('.docx') || file.type.includes('wordprocessingml')) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const docxResult = await mammoth.extractRawText({ arrayBuffer });
          if (docxResult.value && docxResult.value.trim().length > 30) {
            setExistingNotes(docxResult.value.trim());
            setUploadedFileName(file.name);
            return;
          }
        } catch (docxErr) {
          console.warn('Client-side docx parsing note, trying server:', docxErr);
        }
      }

      // 3. Multi-layer Server parsing (PDF, Word, DOC, DOCX, OCR Fallback)
      const res = await apiClient.parseResumeFile(file);
      if (res.text && res.text.trim().length > 0) {
        setExistingNotes(res.text.trim());
        setUploadedFileName(res.fileName || file.name);
      } else {
        throw new Error('Could not extract text from document. Please paste the CV text directly or upload a PDF/Word file.');
      }
    } catch (err: any) {
      console.error('Upload parsing error:', err);
      setError(err.message || 'Failed to read uploaded resume file. Please ensure it is a valid PDF, DOCX, DOC, or TXT file.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleClearUploadedResume = () => {
    setExistingNotes('');
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadNivelResume = () => {
    setCandidateName('Nivel Monteiro');
    setCandidateVisa('Stamp 1G (Third Level Graduate)');
    setCandidateEmail('nivelmonteiro@outlook.com');
    setCandidatePhone('+353 89 984 7924');
    setCandidateLocation('Dublin (Silicon Docks / City)');
    setCandidateEircode('D02 X285');
    setCandidateLinkedin('https://linkedin.com/in/nivelmonteiro');

    const nivelCV = `NIVEL M.
STRATEGIC FINANCE & ACCOUNTING ANALYST | DRIVING FINANCIAL ACCURACY, COMPLIANCE & BUSINESS GROWTH
Stamp 1G | Dublin | +353 899847924 | nivelmonteiro@outlook.com | LinkedIn: https://linkedin.com/in/nivelmonteiro

EXECUTIVE SUMMARY
Strategic and detail-oriented Financial Crime & Financial Analyst with over 8+ years of experience spanning regulatory compliance, investment management, financial reporting, and audit operations across corporate. Demonstrated expertise in executing Know Your Customer (KYC) due diligence, real-time financial sanctions screening, and robust risk assessments to safeguard against financial crime and ensure strict adherence to AML frameworks. Adept at delivering GAAP/IFRS-compliant financial statements, managing audits, and optimizing liquidity performance. Proficient in SAP FICO, QuickBooks, and Advanced Excel, with a strong ability to transform complex financial and compliance data into actionable business insights.

KEY STRENGTHS:
- Recognized for analytical precision, problem-solving mindset, and identifying regulatory risk.
- End-to-end KYC profiling, sanctions checks, audit readiness, fraud detection, and operational efficiency.

CORE COMPETENCIES:
• Financial Reporting & Analysis – GAAP/IFRS compliant statements and variance analysis.
• Regulatory Compliance & Financial Crime Mitigation – Central KYC (CKYC) due diligence, AML protocols, sanctions screening, RIA compliance frameworks.
• Audit & Compliance – Internal/external audit coordination, statutory compliance.
• Accounting & Taxation – Income tax, sales tax, service tax/GST submissions.
• Budgeting & Forecasting – Liquidity management and capital allocation.
• Investment & Treasury Operations – Mutual fund accounting, NAV reporting.
• Systems: SAP FICO, QuickBooks, Xero, Advanced MS Excel, MS Word.

WORK EXPERIENCE:
1. FINANCIAL ANALYST (FREELANCER) — Finkasturi | 11/2024 – Present (Dublin Liaison)
- Lead full-cycle financial modeling, forecasting, and budget variance analyses to support strategic growth.
- Perform detailed due diligence, KYC, and financial health assessments for clients and prospective investments.
- Develop interactive financial dashboards to track KPIs, profitability margins, and operational cash flows.
- Review client financial data and transaction flows to identify compliance and operational risks.
- Prepare valuation models, sensitivity analyses, and investment memorandums for stakeholders.

2. ACCOUNTANT & ACCOUNTS EXECUTIVE — American Eye & Retina Care Pvt Ltd | 08/2022 – 08/2023 (Bangalore)
- Directed full-cycle financial reporting and statement finalization under GAAP/IFRS, ensuring 100% accuracy and regulatory compliance.
- Streamlined reporting and settlement processes, reducing turnaround time by 20% while improving accuracy.
- Led cross-department audits to strengthen regulatory adherence and fiscal governance.
- Designed and implemented cash flow forecasting systems that improved liquidity management.
- Optimized asset and inventory valuation for long-term capital planning and budgeting.
- Partnered with leadership to deliver actionable insights that supported strategic decision-making.

3. ACCOUNTS & FINANCE EXECUTIVE — RNS & Associates (Tax Practitioner) | 08/2017 – 04/2019 (Mangalore)
- Executed audits and prepared final accounts across diverse sectors, ensuring transparent financial reporting.
- Managed tax filings and compliance for sales and income tax, maintaining 100% on-time submissions.
- Improved reporting workflows by automating manual processes, reducing data errors by 15%.
- Advised clients on tax planning and investment optimization, improving cash flow efficiency.
- Supported internal audit and compliance documentation to enhance financial governance.

4. ACCOUNTS & FINANCE OFFICER — Bombay Oxygen Corporation Ltd / Bombay Investment Co Pvt Ltd | 11/2014 – 08/2017 (Mumbai)
- Managed mutual fund accounting, NAV computation, and asset reconciliation under SEBI guidelines.
- Prepared TDS and service tax filings, achieving full statutory compliance and timely submission.
- Developed financial reports and reconciliations supporting quarterly and annual audits.
- Negotiated insurance renewals, reducing premium costs while expanding policy coverage.
- Produced monthly financial summaries for management's decision-making and cost control.

ADDITIONAL EXPERIENCE:
Almae Holdings — Mutual Fund Distributor (Freelancer) | Jan 2023 – Present
- Delivered customized investment strategies based on client objectives and market research.
- Analyzed fund performance, advised on portfolio diversification, and monitored capital efficiency.

EDUCATION:
- Master Of Business Administration (MBA), Finance — Dublin Business School, Ireland (2023 – 2025) (NFQ Level 9)
  Focus: Corporate Finance, Financial Analysis, Global Markets, Leadership
- Bachelor Of Business Management (BBM: Accounts & Finance) — St. Aloysius College, Mangalore University (2011 – 2014) (NFQ Level 8 Equivalent)

CERTIFICATIONS:
- Certified Mutual Fund Distributor – National Institute of Securities Markets (NISM), India
- Diploma in Investment Management – Personal Finance, Stocks, Debt, Real Estate
- SAP Certified – FICO, MM, SD & PP Modules
- QuickBooks & Excel Certified – Financial Modelling, Macros & Scenario Analysis
- Diploma in Irish Taxation – University College Dublin (UCD)`;

    setExistingNotes(nivelCV);
    setUploadedFileName('Nivel_Monteiro_Strategic_Finance_CV.pdf');
    setJobTitle('Financial Crime & Regulatory Compliance Analyst');
    setCompanyName('Stripe / Bank of Ireland');
    setJobDescription('Looking for a Financial Crime & Regulatory Compliance Analyst in Dublin IFSC. Responsibilities: Perform KYC/AML due diligence, real-time sanctions screening, transaction monitoring, AML risk assessments, regulatory reporting under Central Bank of Ireland guidelines, and cross-functional audit coordination. Requirements: 5+ years finance/compliance experience, Stamp 1G/4 or EU work authorization, strong Excel/financial systems expertise, and NFQ Level 8/9 education.');
  };

  const handleLoadSampleResume = () => {
    setCandidateName('Aoife Murphy');
    setCandidateVisa('Stamp 4 (Full Work Rights)');
    setCandidateEmail('aoife.murphy.irl@eirecareers.ie');
    setCandidatePhone('+353 87 123 4567');
    setCandidateLocation('Dublin (Silicon Docks / City)');
    setCandidateEircode('D02 X285');
    setCandidateLinkedin('https://linkedin.com/in/aoifemurphy-dev');

    const sample = `Aoife Murphy
Senior Full Stack Engineer
Dublin, Ireland | Eircode: D02 X285 | +353 87 123 4567 | aoife.murphy.irl@eirecareers.ie
Work Authorization: Stamp 4 / EU Citizen (Full Work Rights)
LinkedIn: linkedin.com/in/aoifemurphy-dev | GitHub: github.com/aoifemurphy

PROFESSIONAL SUMMARY
Dynamic Senior Full Stack Engineer with 6+ years building distributed cloud platforms, fintech transaction engines, and modern web applications across Dublin Silicon Docks. Specialized in TypeScript, React, Node.js, and AWS.

PROFESSIONAL EXPERIENCE
Senior Software Engineer — Workday Ireland (Dublin) | 2022 - Present
- Architected enterprise financial microservices processing 3.5M+ daily API requests with 99.99% uptime.
- Engineered modern React and TypeScript frontend, slashing page load times by 48%.
- Partnered with European compliance teams to ensure strict GDPR compliance under Irish Data Protection Commission guidelines.

Software Developer — Version 1 (Dublin / Hybrid) | 2019 - 2022
- Developed scalable cloud backends on AWS using Node.js, PostgreSQL, and Redis.
- Implemented CI/CD deployment automation with GitHub Actions, reducing release cycle times by 35%.

EDUCATION
- M.Sc. in Computer Science — University College Dublin (UCD), 2019 (NFQ Level 9, First Class Honours 1:1)
- B.Sc. in Computer Applications — Dublin City University (DCU), 2018 (NFQ Level 8, 2.1 Honours)

SKILLS & CERTIFICATIONS
- Technical: TypeScript, JavaScript, React, Next.js, Node.js, PostgreSQL, AWS (ECS, Lambda, RDS), Docker, GraphQL, REST APIs
- Certifications: AWS Certified Solutions Architect – Associate`;
    setExistingNotes(sample);
    setUploadedFileName('Aoife_Murphy_Existing_CV.txt');
    setJobTitle('Senior Full Stack Developer');
    setCompanyName('Stripe Ireland');
    setJobDescription('Looking for an experienced Senior Full Stack Engineer in Dublin to build robust distributed payment systems. Requirements: TypeScript, React, Node.js, AWS, microservices architecture, strong communication skills, and understanding of European regulatory/GDPR compliance.');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    const tailoredProfile: UserCredential = {
      ...currentCredential,
      name: candidateName.trim() || currentCredential.name,
      visaStatus: candidateVisa as any,
      email: candidateEmail.trim() || currentCredential.email,
      phone: candidatePhone.trim() || currentCredential.phone,
      location: candidateLocation as any,
      eircode: candidateEircode.trim() || 'D02 X285',
      linkedinUrl: candidateLinkedin.trim() || currentCredential.linkedinUrl
    };

    try {
      const res = await apiClient.tailorResume({
        credentialId: currentCredential.id,
        userProfile: tailoredProfile,
        jobTitle,
        companyName,
        jobDescription,
        tone,
        existingResume: existingNotes
      });

      // Ensure personal details in response strictly match the candidate form inputs
      if (res.resume && res.resume.personalInfo) {
        res.resume.personalInfo.fullName = candidateName.trim() || res.resume.personalInfo.fullName;
        res.resume.personalInfo.workEligibility = candidateVisa || res.resume.personalInfo.workEligibility;
        res.resume.personalInfo.email = candidateEmail.trim() || res.resume.personalInfo.email;
        res.resume.personalInfo.phone = candidatePhone.trim() || res.resume.personalInfo.phone;
        res.resume.personalInfo.location = candidateLocation || res.resume.personalInfo.location;
        res.resume.personalInfo.eircode = candidateEircode.trim() || res.resume.personalInfo.eircode;
        res.resume.personalInfo.linkedin = candidateLinkedin.trim() || res.resume.personalInfo.linkedin;
      }

      setCurrentResume(res.resume);
      onSaveResume(res.resume);
      if (res.remainingQuota !== undefined) {
        onQuotaUsed(res.remainingQuota);
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
    } catch (err: any) {
      setError(err.message || 'Error generating tailored resume');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!currentResume) return;
    exportResumeToPDF(currentResume);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleCopyMarkdown = () => {
    if (!currentResume) return;
    const md = `# ${currentResume.personalInfo.fullName}
**${currentResume.targetRole}** | [${currentResume.personalInfo.workEligibility}]
${currentResume.personalInfo.phone} | ${currentResume.personalInfo.email} | ${currentResume.personalInfo.location} | Eircode: ${currentResume.personalInfo.eircode}

## Professional Summary
${currentResume.professionalSummary}

## Core Skills
- **Technical:** ${currentResume.skills.technical.join(', ')}
- **Domain & Compliance:** ${currentResume.skills.domain.join(', ')}
- **Tools & Systems:** ${currentResume.skills.tools.join(', ')}

## Experience
${currentResume.workExperiences.map(w => `### ${w.role} - ${w.company} (${w.startDate} - ${w.endDate})
${w.highlights.map(h => `- ${h}`).join('\n')}`).join('\n\n')}

## Education (Irish NFQ)
${currentResume.education.map(e => `- **${e.degree}** (${e.nfqLevel || 'NFQ Level 8'}) - ${e.institution}, ${e.year}`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatResumeForATS = (): string => {
    if (!currentResume) return '';
    return `${currentResume.personalInfo.fullName}\n${currentResume.targetRole}\n${currentResume.personalInfo.workEligibility}\n\nSummary:\n${currentResume.professionalSummary}\n\nSkills:\n${currentResume.skills.technical.join(', ')}, ${currentResume.skills.domain.join(', ')}\n\nExperience:\n${currentResume.workExperiences.map(e => `${e.role} at ${e.company}:\n${e.highlights.join('\n')}`).join('\n\n')}\n\nEducation:\n${currentResume.education.map(ed => `${ed.degree} - ${ed.institution}`).join('\n')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Irish CV Standard Guidance Banner */}
      <div className="bg-emerald-900/90 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h2 className="font-bold text-sm sm:text-base">Irish Job Market CV Standards Enforced</h2>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-3xl">
            Optimized for Irish recruiters and European ATS algorithms: Strictly 2-page max concise format, no photos (GDPR compliance), +353 dialing prefix, Eircode routing, NFQ Level 8/9 degree mapping, and explicit Stamp / right-to-work declarations (Stamp 1G, Stamp 1, Stamp 4, EU/EEA).
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-800/80 text-emerald-200 border border-emerald-700 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Unlimited Generations</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Candidate Profile, Stamp Selection & Job Target */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card 1: Candidate Info & Irish Work Eligibility / Stamp Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" />
                  Candidate Info & Irish Stamp Status
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Directly customize candidate full name and Irish work eligibility
                </p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Irish ATS Compliant
              </span>
            </div>

            <div className="space-y-3">
              {/* Full Name & Work Eligibility (Stamps) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Nivel Monteiro"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-slate-50/50 font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1 flex items-center justify-between">
                    <span>Work Eligibility / Stamp</span>
                    <span className="text-[10px] text-emerald-700 font-normal">Required</span>
                  </label>
                  <select
                    value={candidateVisa}
                    onChange={(e) => setCandidateVisa(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-emerald-50/40 text-emerald-950 font-medium"
                  >
                    {IRISH_VISA_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stamp explanation badge */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 font-semibold">{candidateVisa}:</strong>{' '}
                  {candidateVisa.includes('1G')
                    ? 'Grants 2 years full-time work rights in Ireland for NFQ Level 9 Masters graduates. Employers face zero sponsorship paperwork.'
                    : candidateVisa.includes('Stamp 1') && !candidateVisa.includes('1G')
                    ? 'Candidate is seeking employment permit sponsorship (CSEP or General Employment Permit).'
                    : candidateVisa.includes('Stamp 4')
                    ? 'Permanent / unrestricted right to work in Ireland with full entitlement.'
                    : candidateVisa.includes('EU')
                    ? 'Unrestricted right to work in Ireland and across the entire European Union.'
                    : 'Explicit work eligibility declaration at top of CV.'}
                </span>
              </div>

              {/* Phone (+353) & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Irish Phone (+353)</label>
                  <input
                    type="text"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="+353 89 984 7924"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="nivelmonteiro@outlook.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Irish Location & Eircode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Location in Ireland</label>
                  <select
                    value={candidateLocation}
                    onChange={(e) => setCandidateLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                  >
                    {IRISH_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Irish Eircode (Routing)</label>
                  <input
                    type="text"
                    value={candidateEircode}
                    onChange={(e) => setCandidateEircode(e.target.value)}
                    placeholder="D02 X285"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50 font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Target Job & Company */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Target Job & Company in Ireland
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI customizes keywords and quantifiable bullets specifically for this role
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Financial Analyst / Senior Software Engineer"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-slate-50/50 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe Ireland, Bank of Ireland, Workday, Pfizer"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Job Description / Key Requirements</label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the requirements or key responsibilities from LinkedIn/IrishJobs/Indeed..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden resize-none bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tone & Archetype</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                >
                  <option value="Irish Executive & High-Impact">Executive High-Impact</option>
                  <option value="IFSC Finance & Rigour">IFSC Finance & Regulatory Rigour</option>
                  <option value="Silicon Docks Tech Specialist">Silicon Docks Tech Specialist</option>
                  <option value="Pharma & MedTech GMP Precision">Pharma / GMP Precision</option>
                </select>
              </div>

              {/* Existing Resume Upload / Input Box */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileUp className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Upload or Paste Existing Resume</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleLoadNivelResume}
                      className="text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md transition-colors"
                      title="Load Nivel M. Strategic Finance & Accounting Analyst CV (Stamp 1G)"
                    >
                      ★ Load Nivel M. CV
                    </button>
                    <button
                      type="button"
                      onClick={handleLoadSampleResume}
                      className="text-[11px] font-semibold text-slate-600 hover:text-emerald-800 hover:underline"
                    >
                      Tech Sample CV
                    </button>
                    {existingNotes && (
                      <button
                        type="button"
                        onClick={handleClearUploadedResume}
                        className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-0.5"
                      >
                        <X className="w-3 h-3" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
                      : uploadedFileName
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : 'border-slate-300 hover:border-emerald-400 bg-slate-50/70 hover:bg-emerald-50/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.md"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {isUploadingFile ? (
                    <div className="flex items-center justify-center gap-2 py-1 text-xs text-emerald-700">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Extracting document text & career history...</span>
                    </div>
                  ) : uploadedFileName ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-slate-800 truncate max-w-[240px]">
                        {uploadedFileName}
                      </span>
                      <span className="text-[11px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                        Ready
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-700 font-semibold">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Upload existing resume (PDF, Word .docx/.doc, TXT)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Drag & drop your CV file here or click to browse (supports PDF & Word formats)
                      </p>
                    </div>
                  )}
                </div>

                {/* Textarea for viewing/editing extracted existing resume */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-slate-500">
                      Existing Resume Text / Work History
                    </span>
                    {existingNotes && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {existingNotes.length} characters
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={existingNotes}
                    onChange={(e) => setExistingNotes(e.target.value)}
                    placeholder="Paste or review your existing CV history, key projects, and accomplishments here. AI will re-engineer it strictly around the job description..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden resize-none bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-xs ${
                isGenerating
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Irish Standard CV...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Tailored Irish CV (Unlimited)</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets / Saved Resumes list */}
          {savedResumes.length > 1 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-slate-800">Saved Tailored CVs</h4>
              <div className="space-y-1.5">
                {savedResumes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setCurrentResume(r)}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentResume?.id === r.id ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{r.targetRole} — {r.targetCompany}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{new Date(r.createdAt).toLocaleDateString('en-IE')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Preview & Live Editor */}
        <div className="lg:col-span-7 space-y-4">
          
          {currentResume ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              
              {/* Document Action Bar */}
              <div className="px-5 py-3 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{currentResume.personalInfo.fullName}</span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs font-semibold text-emerald-800">{currentResume.targetRole}</span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs text-slate-600">{currentResume.targetCompany}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveView(activeView === 'preview' ? 'edit' : 'preview')}
                    className="p-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200/70 rounded-lg flex items-center gap-1 transition-colors"
                    title={activeView === 'preview' ? 'Edit directly' : 'View formatted preview'}
                  >
                    {activeView === 'preview' ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{activeView === 'preview' ? 'Edit' : 'Preview'}</span>
                  </button>

                  <button
                    onClick={handleCopyMarkdown}
                    className="p-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200/70 rounded-lg flex items-center gap-1 transition-colors"
                    title="Copy Markdown text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => onSendToATS(formatResumeForATS(), jobDescription)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200/80 rounded-lg flex items-center gap-1 transition-colors border border-emerald-200"
                    title="Run ATS check against target job"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Run ATS Scan</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* CV Document Body */}
              {activeView === 'preview' ? (
                <div className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white font-sans text-xs sm:text-[13px] leading-relaxed max-h-[750px] overflow-y-auto">
                  
                  {/* Header */}
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                        {currentResume.personalInfo.fullName.toUpperCase()}
                      </h2>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                        {currentResume.personalInfo.workEligibility}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-emerald-800 mt-0.5">{currentResume.targetRole}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
                      <span>{currentResume.personalInfo.phone}</span>
                      <span>•</span>
                      <span>{currentResume.personalInfo.email}</span>
                      <span>•</span>
                      <span>{currentResume.personalInfo.location}</span>
                      {currentResume.personalInfo.eircode && (
                        <>
                          <span>•</span>
                          <span className="font-mono">Eircode: {currentResume.personalInfo.eircode}</span>
                        </>
                      )}
                      {currentResume.personalInfo.linkedin && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">{currentResume.personalInfo.linkedin}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-emerald-600/60 pb-1">
                      Professional Summary
                    </h4>
                    <p className="text-slate-700">{currentResume.professionalSummary}</p>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-emerald-600/60 pb-1">
                      Core Competencies & Key Skills
                    </h4>
                    <div className="space-y-1 text-xs">
                      {currentResume.skills.technical?.length > 0 && (
                        <div>
                          <strong className="text-slate-900">Technical: </strong>
                          <span className="text-slate-700">{currentResume.skills.technical.join(', ')}</span>
                        </div>
                      )}
                      {currentResume.skills.domain?.length > 0 && (
                        <div>
                          <strong className="text-slate-900">Domain & Compliance: </strong>
                          <span className="text-slate-700">{currentResume.skills.domain.join(', ')}</span>
                        </div>
                      )}
                      {currentResume.skills.tools?.length > 0 && (
                        <div>
                          <strong className="text-slate-900">Systems & Tools: </strong>
                          <span className="text-slate-700">{currentResume.skills.tools.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-emerald-600/60 pb-1">
                      Professional Experience
                    </h4>
                    {currentResume.workExperiences.map((exp, idx) => (
                      <div key={exp.id || idx} className="space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                            <span className="text-slate-600"> — {exp.company}</span>
                          </div>
                          <span className="text-slate-500 font-mono">
                            {exp.startDate} – {exp.endDate || 'Present'} | {exp.location}
                          </span>
                        </div>
                        <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 text-xs">
                          {exp.highlights.map((hl, hIdx) => (
                            <li key={hIdx}>{hl}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-emerald-600/60 pb-1">
                      Education (Irish NFQ Framework)
                    </h4>
                    {currentResume.education.map((edu, idx) => (
                      <div key={edu.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{edu.degree}</span>
                          {edu.nfqLevel && (
                            <span className="ml-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {edu.nfqLevel}
                            </span>
                          )}
                          {edu.gradeOrHonours && (
                            <span className="text-slate-600 italic ml-1">({edu.gradeOrHonours})</span>
                          )}
                        </div>
                        <span className="text-slate-500 font-mono">{edu.institution}, {edu.year}</span>
                      </div>
                    ))}
                  </div>

                  {/* Certifications */}
                  {currentResume.certifications?.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-emerald-600/60 pb-1">
                        Certifications & Compliance
                      </h4>
                      <p className="text-xs text-slate-700">{currentResume.certifications.join('  •  ')}</p>
                    </div>
                  )}

                  {/* Irish Market Recruiter Advice note */}
                  {currentResume.irishMarketNotes && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600">
                      <strong className="text-emerald-800">Recruiter Note: </strong>
                      {currentResume.irishMarketNotes}
                    </div>
                  )}
                </div>
              ) : (
                /* Editable Form View */
                <div className="p-6 space-y-5 max-h-[750px] overflow-y-auto text-xs">
                  
                  {/* Candidate Header Edit */}
                  <div className="p-3.5 border border-emerald-200 rounded-xl bg-emerald-50/30 space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      Candidate Header & Work Eligibility
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-800 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={currentResume.personalInfo.fullName}
                          onChange={(e) => setCurrentResume({
                            ...currentResume,
                            personalInfo: { ...currentResume.personalInfo, fullName: e.target.value }
                          })}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-800 block mb-1">Work Eligibility / Stamp Status</label>
                        <select
                          value={currentResume.personalInfo.workEligibility}
                          onChange={(e) => setCurrentResume({
                            ...currentResume,
                            personalInfo: { ...currentResume.personalInfo, workEligibility: e.target.value }
                          })}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white text-xs"
                        >
                          {IRISH_VISA_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.value}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-800 block mb-1">Target Role on CV</label>
                        <input
                          type="text"
                          value={currentResume.targetRole}
                          onChange={(e) => setCurrentResume({ ...currentResume, targetRole: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-800 block mb-1">Phone (+353)</label>
                        <input
                          type="text"
                          value={currentResume.personalInfo.phone}
                          onChange={(e) => setCurrentResume({
                            ...currentResume,
                            personalInfo: { ...currentResume.personalInfo, phone: e.target.value }
                          })}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Professional Summary</label>
                    <textarea
                      rows={4}
                      value={currentResume.professionalSummary}
                      onChange={(e) => setCurrentResume({ ...currentResume, professionalSummary: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Technical Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={currentResume.skills.technical.join(', ')}
                      onChange={(e) => setCurrentResume({
                        ...currentResume,
                        skills: {
                          ...currentResume.skills,
                          technical: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Domain Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={currentResume.skills.domain.join(', ')}
                      onChange={(e) => setCurrentResume({
                        ...currentResume,
                        skills: {
                          ...currentResume.skills,
                          domain: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Experience Bullets</label>
                    {currentResume.workExperiences.map((exp, expIndex) => (
                      <div key={expIndex} className="p-3 border border-slate-200 rounded-lg mb-2 bg-slate-50/50 space-y-2">
                        <div className="font-bold text-slate-900">{exp.role} at {exp.company}</div>
                        {exp.highlights.map((hl, hlIndex) => (
                          <input
                            key={hlIndex}
                            type="text"
                            value={hl}
                            onChange={(e) => {
                              const newExps = [...currentResume.workExperiences];
                              newExps[expIndex].highlights[hlIndex] = e.target.value;
                              setCurrentResume({ ...currentResume, workExperiences: newExps });
                            }}
                            className="w-full p-2 border border-slate-300 rounded-md bg-white text-xs"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ready to Create Your Tailored Irish CV</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Enter your candidate name, select your Irish Stamp status (Stamp 1G, Stamp 1, Stamp 4, EU/EEA), and click Generate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
