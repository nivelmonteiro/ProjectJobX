import React, { useState, useRef, useEffect } from 'react';
import { UserCredential, TailoredResume, WorkExperience, EducationItem, IrishStampVisa, IrishLocation } from '../types';
import { apiClient } from '../utils/apiClient';
import { exportResumeToPDF } from '../utils/pdfExport';
import { extractTextFromFile, extractProfileFromText } from '../utils/fileParser';
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
  FileBadge,
  ExternalLink
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
  { value: '', label: '(Blank - None / Do not display)' },
  { value: 'Stamp 1G', label: 'Stamp 1G' },
  { value: 'Stamp 1', label: 'Stamp 1' },
  { value: 'Stamp 4', label: 'Stamp 4' },
  { value: 'Stamp 2', label: 'Stamp 2' },
  { value: 'EU/EEA Citizen', label: 'EU/EEA Citizen' },
  { value: 'UK/CTA Citizen', label: 'UK/CTA Citizen' }
];

export const IRISH_LOCATIONS: IrishLocation[] = [
  'Dublin',
  'Cork',
  'Galway',
  'Limerick',
  'Waterford',
  'Kilkenny',
  'Drogheda',
  'Dundalk',
  'Sligo',
  'Athlone'
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
  const [showWorkEligibility, setShowWorkEligibility] = useState(true);
  const [candidateVisa, setCandidateVisa] = useState<string>(currentCredential.visaStatus || 'Stamp 1G');
  const [candidateEmail, setCandidateEmail] = useState(currentCredential.email || 'nivelmonteiro@outlook.com');
  const [candidatePhone, setCandidatePhone] = useState(currentCredential.phone || '+353 89 984 7924');
  const [candidateLocation, setCandidateLocation] = useState<string>(currentCredential.location || 'Dublin');
  const [candidateEircode, setCandidateEircode] = useState(currentCredential.eircode || 'D02 X285');
  const [candidateLinkedin, setCandidateLinkedin] = useState(currentCredential.linkedinUrl || 'https://linkedin.com/in/nivelmonteiro');

  const [jobTitle, setJobTitle] = useState('Financial Analyst (FP&A & Corporate Finance)');
  const [companyName, setCompanyName] = useState('Bank of Ireland / Stripe Ireland');
  const [jobDescription, setJobDescription] = useState(
    'Financial Analyst to lead corporate financial modeling, multi-scenario budgeting, variance analysis, cash flow forecasting, and executive reporting in Dublin. Requirements: Strong Excel (XLOOKUP, Pivot, financial modeling), Power BI, SAP/ERP knowledge, variance analysis, and immediate full-time Irish work eligibility (Stamp 1G / Stamp 4 / EU Citizen).'
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
      // Extract text directly in client (PDF, DOCX, TXT, MD) with multi-layer fallback
      const result = await extractTextFromFile(file);
      if (result.text && result.text.trim().length > 0) {
        setExistingNotes(result.text.trim());
        setUploadedFileName(result.fileName || file.name);

        // Auto-extract candidate contact details from CV text if found
        const extracted = extractProfileFromText(result.text);
        if (extracted.fullName) setCandidateName(extracted.fullName);
        if (extracted.email) setCandidateEmail(extracted.email);
        if (extracted.phone) setCandidatePhone(extracted.phone);
        if (extracted.location) setCandidateLocation(extracted.location as IrishLocation);
        if (extracted.eircode) setCandidateEircode(extracted.eircode);
        if (extracted.visaStatus) {
          setCandidateVisa(extracted.visaStatus);
          setShowWorkEligibility(true);
        }
        if (extracted.linkedinUrl) setCandidateLinkedin(extracted.linkedinUrl);
      } else {
        throw new Error('Could not extract readable text from document. Please paste the CV text directly or upload a PDF/Word file.');
      }
    } catch (err: any) {
      console.error('Upload parsing error:', err);
      setError(err.message || 'Failed to read uploaded resume file. Please ensure it is a valid PDF, DOCX, DOC, or TXT file.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleAutoFillFromPastedText = () => {
    if (!existingNotes.trim()) {
      setError('Please paste your resume text in the box below first.');
      return;
    }
    const extracted = extractProfileFromText(existingNotes);
    let count = 0;
    if (extracted.fullName) { setCandidateName(extracted.fullName); count++; }
    if (extracted.email) { setCandidateEmail(extracted.email); count++; }
    if (extracted.phone) { setCandidatePhone(extracted.phone); count++; }
    if (extracted.location) { setCandidateLocation(extracted.location as IrishLocation); count++; }
    if (extracted.eircode) { setCandidateEircode(extracted.eircode); count++; }
    if (extracted.visaStatus) {
      setCandidateVisa(extracted.visaStatus);
      setShowWorkEligibility(true);
      count++;
    }
    if (extracted.linkedinUrl) { setCandidateLinkedin(extracted.linkedinUrl); count++; }

    if (count > 0) {
      confetti({ particleCount: 30, spread: 40 });
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
    setCandidateVisa('Stamp 1G');
    setShowWorkEligibility(true);
    setCandidateEmail('nivelmonteiro@outlook.com');
    setCandidatePhone('+353 89 984 7924');
    setCandidateLocation('Dublin');
    setCandidateEircode('D02 X285');
    setCandidateLinkedin('https://linkedin.com/in/nivelmonteiro');

    const nivelCV = `NIVEL MONTEIRO
STRATEGIC FINANCE & REGULATORY COMPLIANCE ANALYST
Dublin, Ireland | +353 89 984 7924 | nivelmonteiro@outlook.com | Eircode: D02 X285 | LinkedIn: https://linkedin.com/in/nivelmonteiro
Work Authorization: Stamp 1G (Full legal entitlement to work in Ireland)

PROFESSIONAL SUMMARY
Strategic and detail-oriented Financial Analyst & Regulatory Compliance Specialist with over 8+ years of progressive experience spanning corporate finance, KYC/AML due diligence, sanctions screening, financial statement finalization, and statutory audit operations. Holds an MBA in Finance from Dublin Business School (NFQ Level 9) and valid Irish Stamp 1G work authorization with immediate right to work in Ireland without sponsorship. Proficient in SAP FICO, Advanced MS Excel financial modeling, and leading cross-functional audit readiness.

CORE COMPETENCIES & TECHNICAL SKILLS
• Technical & Modeling: Financial Modeling (DCF/LBO), Cash Flow Forecasting, Budget Variance, NAV Accounting, Advanced MS Excel (XLOOKUP, Pivot, Macros), Power BI, SQL Queries, SAP FICO, QuickBooks, Tally Prime.
• Compliance & Governance: KYC / CKYC Due Diligence, AML Protocols, Financial Sanctions Screening, Statutory Audit Readiness, GAAP & IFRS Financial Reporting, Direct & Indirect Taxation (Irish Tax / VAT / TDS), Internal Financial Controls.
• Soft Skills: Executive Stakeholder Reporting, Analytical Problem-Solving, Cross-Functional Team Leadership, Audit Coordination & Regulatory Communication.

PROFESSIONAL EXPERIENCE

1. FINANCIAL ANALYST (FREELANCE / ADVISORY) — Finkasturi Technologies / Strategic Advisory | 11/2024 – Present
Domain: Corporate Advisory, Financial Modeling & Strategy (Dublin Liaison & Remote)
- Spearhead full-cycle corporate financial modeling, multi-scenario forecasting, and budget variance analyses to support strategic executive decisions.
- Execute end-to-end KYC/AML customer due diligence, sanctions screening, and financial crime risk profiling for international corporate client portfolios.
- Engineer dynamic KPI & liquidity dashboards in Advanced MS Excel and Power BI, tracking operating burn rates, cash flow, and margin performance.
- Develop DCF valuation models, sensitivity analyses, and investment memoranda for board presentations and investor due diligence review.
- Ensure rigorous compliance with international reporting standards, statutory frameworks, and data protection guidelines.

2. ACCOUNTANT & FINANCIAL ANALYST — American Eye & Retina Care Pvt. Ltd. | 08/2022 – 08/2023
Domain: Healthcare Financial Operations & Multi-Branch Accounting (Bangalore, India)
- Directed full-cycle financial reporting, ledger maintenance, and final accounts finalization under GAAP/IFRS standards with 100% statutory compliance.
- Streamlined accounts reconciliation and billing workflows, reducing monthly close turnaround time by 20% while eliminating reporting bottlenecks.
- Led cross-departmental internal audits and balance sheet reconciliations, identifying cost anomalies and enhancing working capital efficiency.
- Designed structured cash flow forecasting models that improved short-term liquidity management and vendor settlement cycles.

3. ACCOUNTS & FINANCE EXECUTIVE — RNS & Associates (Chartered Accountants & Tax Practitioners) | 08/2017 – 04/2019
Domain: Statutory Audit, Direct & Indirect Taxation, Corporate Advisory (Mangalore, India)
- Executed statutory audits, trial balance reconciliations, and financial statement preparations for corporate and SME clients across multiple industries.
- Managed direct and indirect tax compliance (GST, Income Tax, Sales Tax), ensuring 100% on-time statutory submissions with zero penalties.
- Automated ledger reconciliation and reporting workflows via Advanced Excel, reducing data reconciliation errors by 15%.
- Advised client executives on tax planning strategies, compliance documentation, and financial governance frameworks.

4. ACCOUNTS & FINANCE OFFICER — Bombay Oxygen Corporation Ltd. / Bombay Investment Co. Pvt. Ltd. | 11/2014 – 08/2017
Domain: Treasury, Mutual Fund Accounting, NAV Computation & Statutory Filings (Mumbai, India)
- Managed mutual fund accounting, daily Net Asset Value (NAV) computation, and asset reconciliation under SEBI regulatory guidelines.
- Prepared Tax Deducted at Source (TDS) schedules, statutory service tax filings, and documentation for quarterly and annual external audits.
- Coordinated liquidity management and treasury transactions with banking institutions and asset management houses.
- Negotiated corporate insurance renewals, reducing annual premium costs by 12% while expanding policy coverage.

EDUCATION
- Master of Business Administration (MBA) – Finance | Dublin Business School (DBS), Dublin, Ireland (2023 – 2025)
  Honours Graduate (NFQ Level 9 Equivalent)
- Bachelor of Business Management (BBM) – Accounts & Finance | St. Aloysius College, Mangalore University, India (2011 – 2014)
  First Class Honours (NFQ Level 8 Equivalent)

CERTIFICATIONS & COMPLIANCE
- Diploma in Irish Taxation – University College Dublin (UCD Professional Academy)
- Certified Mutual Fund Distributor – National Institute of Securities Markets (NISM), India
- SAP Certified – ERP Financials (FICO, MM, SD & PP Modules)
- Diploma in Investment Management & Portfolio Strategy
- Advanced Financial Modeling & Valuation – QuickBooks & Advanced MS Excel Certified
- Irish GDPR & Data Protection Regulations Compliance
- AML / KYC & Financial Crime Due Diligence Frameworks`;

    setExistingNotes(nivelCV);
    setUploadedFileName('Nivel_Monteiro_Tailored_Irish_CV.pdf');
    setJobTitle('Financial Analyst (FP&A & Corporate Finance)');
    setCompanyName('Bank of Ireland / Stripe Ireland');
    setJobDescription('Financial Analyst to lead corporate financial modeling, multi-scenario budgeting, variance analysis, cash flow forecasting, and executive reporting in Dublin. Requirements: Strong Excel (XLOOKUP, Pivot, financial modeling), Power BI, SAP/ERP knowledge, variance analysis, and immediate full-time Irish work eligibility (Stamp 1G / Stamp 4 / EU Citizen).');
    setTone('IFSC Finance & Rigour');
  };

  const handleLoadSampleResume = () => {
    setCandidateName('Aoife Murphy');
    setCandidateVisa('Stamp 4');
    setShowWorkEligibility(true);
    setCandidateEmail('aoife.murphy.irl@eirecareers.ie');
    setCandidatePhone('+353 87 123 4567');
    setCandidateLocation('Dublin');
    setCandidateEircode('D02 X285');
    setCandidateLinkedin('https://linkedin.com/in/aoifemurphy-dev');

    const sample = `Aoife Murphy
Senior Full Stack Engineer
Dublin, Ireland | Eircode: D02 X285 | +353 87 123 4567 | aoife.murphy.irl@eirecareers.ie
Work Authorization: Stamp 4
LinkedIn: linkedin.com/in/aoifemurphy-dev | GitHub: github.com/aoifemurphy

PROFESSIONAL SUMMARY
Dynamic Senior Full Stack Engineer with 6+ years building distributed cloud platforms, fintech transaction engines, and modern web applications. Specialized in TypeScript, React, Node.js, and AWS.

PROFESSIONAL EXPERIENCE
Senior Software Engineer — Workday Ireland (Enterprise Cloud & HCM) | 2022 - Present
- Architected enterprise financial microservices processing 3.5M+ daily API requests with 99.99% uptime.
- Engineered modern React and TypeScript frontend, slashing page load times by 48%.
- Partnered with compliance and security teams to ensure strict GDPR data protection adherence.

Software Developer — Version 1 (Digital Transformation & Cloud Advisory) | 2019 - 2022
- Developed scalable cloud backends on AWS using Node.js, PostgreSQL, and Redis.
- Implemented CI/CD deployment automation with GitHub Actions, reducing release cycle times by 35%.

EDUCATION
- M.Sc. in Computer Science — University College Dublin (UCD), 2019 (First Class Honours 1:1)
- B.Sc. in Computer Applications — Dublin City University (DCU), 2018 (2.1 Honours)

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

    const effectiveWorkEligibility = showWorkEligibility ? candidateVisa : '';

    const tailoredProfile: UserCredential = {
      ...currentCredential,
      name: candidateName.trim() || currentCredential.name,
      visaStatus: effectiveWorkEligibility as any,
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
        res.resume.personalInfo.workEligibility = effectiveWorkEligibility;
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
    const eligibilityTag = currentResume.personalInfo?.workEligibility?.trim()
      ? ` | [${currentResume.personalInfo.workEligibility.trim()}]`
      : '';
    const technicalSkills = (currentResume.skills?.technical || []).join(', ');
    const domainSkills = (currentResume.skills?.domain || []).join(', ');
    const toolsSkills = (currentResume.skills?.tools || []).join(', ');

    const md = `# ${currentResume.personalInfo?.fullName || 'Candidate'}
**${currentResume.targetRole || 'Professional'}**${eligibilityTag}
${currentResume.personalInfo?.phone || ''} | ${currentResume.personalInfo?.email || ''} | ${currentResume.personalInfo?.location || ''} | Eircode: ${currentResume.personalInfo?.eircode || ''}

## Professional Summary
${currentResume.professionalSummary || ''}

## Core Skills
- **Technical:** ${technicalSkills}
- **Domain & Compliance:** ${domainSkills}
- **Tools & Systems:** ${toolsSkills}

## Experience
${(currentResume.workExperiences || []).map(w => `### ${w.role} - ${w.company} (${w.startDate} - ${w.endDate || 'Present'}${w.location ? ` | ${w.location}` : ''})
${(w.highlights || []).map(h => `- ${h}`).join('\n')}`).join('\n\n')}

## Education
${(currentResume.education || []).map(e => `- **${e.degree}** - ${e.institution}, ${e.year}`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatResumeForATS = (): string => {
    if (!currentResume) return '';
    const eligibilityLine = currentResume.personalInfo?.workEligibility?.trim()
      ? `${currentResume.personalInfo.workEligibility.trim()}\n`
      : '';
    const tech = (currentResume.skills?.technical || []).join(', ');
    const domain = (currentResume.skills?.domain || []).join(', ');
    return `${currentResume.personalInfo?.fullName || 'Candidate'}\n${currentResume.targetRole || 'Professional'}\n${eligibilityLine}Summary:\n${currentResume.professionalSummary || ''}\n\nSkills:\n${tech}, ${domain}\n\nExperience:\n${(currentResume.workExperiences || []).map(e => `${e.role} at ${e.company}:\n${(e.highlights || []).join('\n')}`).join('\n\n')}\n\nEducation:\n${(currentResume.education || []).map(ed => `${ed.degree} - ${ed.institution}`).join('\n')}`;
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800">
                      Work Eligibility
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showWorkEligibility}
                        onChange={(e) => setShowWorkEligibility(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                      />
                      <span className="text-[11px] font-semibold text-slate-600">Include on CV</span>
                    </label>
                  </div>
                  <select
                    value={candidateVisa}
                    disabled={!showWorkEligibility}
                    onChange={(e) => setCandidateVisa(e.target.value)}
                    className={`w-full px-2.5 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium transition-colors ${
                      showWorkEligibility
                        ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
                        : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {IRISH_VISA_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
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

              {/* LinkedIn Profile URL */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={candidateLinkedin}
                  onChange={(e) => setCandidateLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                />
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

            {/* Quick Target Presets */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">Quick Target Presets:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setJobTitle('Financial Analyst (FP&A & Corporate Finance)');
                    setCompanyName('Bank of Ireland / Stripe Ireland');
                    setJobDescription('Financial Analyst to lead corporate financial modeling, multi-scenario budgeting, variance analysis, cash flow forecasting, and executive reporting in Dublin. Requirements: Strong Excel (XLOOKUP, Pivot, financial modeling), Power BI, SAP/ERP knowledge, variance analysis, and immediate full-time Irish work eligibility (Stamp 1G / Stamp 4 / EU Citizen).');
                    setTone('IFSC Finance & Rigour');
                  }}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    jobTitle.toLowerCase().includes('financial analyst')
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <span>📊</span>
                    <span>Financial Analyst</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-normal">FP&A, DCF Modeling, Variance & Cash Flow</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setJobTitle('Fund Accountant (NAV & Portfolio Valuation)');
                    setCompanyName('State Street Ireland / BNY Mellon');
                    setJobDescription('Fund Accountant in Dublin IFSC to manage Net Asset Value (NAV) computations, daily mutual fund & portfolio valuations, cash and asset reconciliations, subscription/redemption oversight, and statutory audit preparation under CBI / UCITS / AIFMD regulatory frameworks. Requirements: Degree in Finance/Accounting, NAV calculation experience, advanced Excel, strong numerical accuracy, and Stamp 1G/4 or EU work authorization.');
                    setTone('IFSC Finance & Rigour');
                  }}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    jobTitle.toLowerCase().includes('fund')
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <span>🏛️</span>
                    <span>Fund Accountant</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-normal">NAV Valuation, Reconciliations & UCITS/CBI</div>
                </button>
              </div>
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
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                      <span>Existing Resume Text / Work History</span>
                      {existingNotes && (
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1 rounded">
                          {existingNotes.length} chars
                        </span>
                      )}
                    </span>
                    {existingNotes && (
                      <button
                        type="button"
                        onClick={handleAutoFillFromPastedText}
                        className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                        title="Auto-detect Candidate Name, Email, Phone, Eircode, and Visa status from pasted CV"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        Auto-Detect Contact & Profile
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={existingNotes}
                    onChange={(e) => setExistingNotes(e.target.value)}
                    placeholder="Paste or review your existing CV history, key projects, degrees, and accomplishments here. Uploading or pasting your CV works 100% offline & on Vercel..."
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
                      {currentResume.personalInfo.workEligibility?.trim() && 
                       !currentResume.personalInfo.workEligibility.toLowerCase().includes('critical') &&
                       !currentResume.personalInfo.workEligibility.toLowerCase().includes('csep') ? (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                          {currentResume.personalInfo.workEligibility.trim()}
                        </span>
                      ) : null}
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
                          <a 
                            href={currentResume.personalInfo.linkedin.startsWith('http') ? currentResume.personalInfo.linkedin : `https://${currentResume.personalInfo.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:text-emerald-800 underline font-medium cursor-pointer inline-flex items-center gap-0.5"
                            title="Open LinkedIn Profile"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5 inline text-emerald-600" />
                          </a>
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
                            {exp.startDate} – {exp.endDate || 'Present'} {exp.location ? `| ${exp.location}` : ''}
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
                      Education
                    </h4>
                    {currentResume.education.map((edu, idx) => (
                      <div key={edu.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{edu.degree}</span>
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
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-semibold text-slate-800">Work Eligibility</label>
                          <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                        </div>
                        <select
                          value={currentResume.personalInfo.workEligibility || ''}
                          onChange={(e) => setCurrentResume({
                            ...currentResume,
                            personalInfo: { ...currentResume.personalInfo, workEligibility: e.target.value }
                          })}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white text-xs"
                        >
                          {IRISH_VISA_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
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

                      <div className="sm:col-span-2">
                        <label className="font-semibold text-slate-800 block mb-1">LinkedIn Profile URL</label>
                        <input
                          type="text"
                          value={currentResume.personalInfo.linkedin || ''}
                          onChange={(e) => setCurrentResume({
                            ...currentResume,
                            personalInfo: { ...currentResume.personalInfo, linkedin: e.target.value }
                          })}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white text-xs"
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
                      value={(currentResume.skills?.technical || []).join(', ')}
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
                      value={(currentResume.skills?.domain || []).join(', ')}
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
                    <label className="font-semibold text-slate-800 block mb-1">Experience (Nature of Business & Highlights)</label>
                    {(currentResume.workExperiences || []).map((exp, expIndex) => (
                      <div key={expIndex} className="p-3 border border-slate-200 rounded-lg mb-2 bg-slate-50/50 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-500 font-semibold block">Role & Company</label>
                            <div className="font-bold text-slate-900">{exp.role} at {exp.company}</div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-semibold block">Firm Nature of Business</label>
                            <input
                              type="text"
                              value={exp.location || ''}
                              placeholder="e.g. Fintech & Payments, Asset Management"
                              onChange={(e) => {
                                const newExps = [...currentResume.workExperiences];
                                newExps[expIndex].location = e.target.value;
                                setCurrentResume({ ...currentResume, workExperiences: newExps });
                              }}
                              className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                            />
                          </div>
                        </div>
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
