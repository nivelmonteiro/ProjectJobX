import React, { useState, useRef } from 'react';
import { UserCredential, TailoredResume, WorkExperience, EducationItem } from '../types';
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
  SlidersHorizontal
} from 'lucide-react';

interface ResumeMakerProps {
  currentCredential: UserCredential;
  remainingQuota: number;
  onQuotaUsed: (newRemaining: number) => void;
  savedResumes: TailoredResume[];
  onSaveResume: (resume: TailoredResume) => void;
  onSendToATS: (resumeText: string, jobDesc?: string) => void;
}

export const ResumeMaker: React.FC<ResumeMakerProps> = ({
  currentCredential,
  remainingQuota,
  onQuotaUsed,
  savedResumes,
  onSaveResume,
  onSendToATS
}) => {
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Developer');
  const [companyName, setCompanyName] = useState('Stripe Ireland');
  const [jobDescription, setJobDescription] = useState(
    'Looking for an experienced Senior Full Stack Engineer in Dublin to build robust distributed payment systems. Requirements: TypeScript, React, Node.js, AWS, microservices architecture, strong communication skills, and understanding of European regulatory/GDPR compliance.'
  );
  const [tone, setTone] = useState('Irish Executive & High-Impact');
  
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

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploadingFile(true);

    try {
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        setExistingNotes(text);
        setUploadedFileName(file.name);
      } else {
        // PDF or other document
        const res = await apiClient.parseResumeFile(file);
        if (res.text) {
          setExistingNotes(res.text);
          setUploadedFileName(res.fileName || file.name);
        } else {
          throw new Error('Could not extract text from document. Please paste the CV text directly.');
        }
      }
    } catch (err: any) {
      console.error('Upload parsing error:', err);
      setError(err.message || 'Failed to read uploaded resume file');
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

  const handleLoadSampleResume = () => {
    const sample = `Aoife Murphy
Senior Full Stack Engineer
Dublin, Ireland | Eircode: D02 X285 | +353 87 123 4567 | aoife.murphy@example.ie
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
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await apiClient.tailorResume({
        credentialId: currentCredential.id,
        userProfile: currentCredential,
        jobTitle,
        companyName,
        jobDescription,
        tone,
        existingResume: existingNotes
      });

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
- **Domain:** ${currentResume.skills.domain.join(', ')}
- **Tools:** ${currentResume.skills.tools.join(', ')}

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
            Optimized for Irish recruiters and European ATS algorithms: Strictly 2-page max concise format, no photos (GDPR compliance), +353 dialing prefix, Eircode routing, NFQ Level 8/9 degree mapping, and explicit Stamp / right-to-work declarations.
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
        
        {/* Left Form: Job Target & Inputs */}
        <div className="lg:col-span-5 space-y-5">
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
                  placeholder="e.g. Senior Software Engineer / Data Scientist"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe Ireland, Workday, Pfizer, Revolut"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Job Description / Key Requirements</label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the requirements or key responsibilities from LinkedIn/IrishJobs/Indeed..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden resize-none bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tone & Archetype</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                  >
                    <option value="Irish Executive & High-Impact">Executive High-Impact</option>
                    <option value="Silicon Docks Tech Specialist">Silicon Docks Tech</option>
                    <option value="Pharma & MedTech GMP Precision">Pharma / GMP Precision</option>
                    <option value="IFSC Finance & Rigour">IFSC Finance & Rigour</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Work Eligibility Declared</label>
                  <div className="px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium truncate">
                    {currentCredential.visaStatus}
                  </div>
                </div>
              </div>

              {/* Existing Resume Upload / Input Box */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileUp className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Upload or Paste Existing Resume</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSampleResume}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      Load Sample CV
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
                    accept=".pdf,.txt,.md,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {isUploadingFile ? (
                    <div className="flex items-center justify-center gap-2 py-1 text-xs text-emerald-700 font-medium">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Parsing existing resume content...</span>
                    </div>
                  ) : uploadedFileName ? (
                    <div className="flex items-center justify-between text-xs text-emerald-900 px-2 py-0.5">
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold truncate">{uploadedFileName}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono shrink-0">
                        {existingNotes.length} chars loaded
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-700 font-semibold">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Upload existing resume (PDF, TXT, MD)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Drag & drop your current CV here or click to browse
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
              <h4 className="text-xs font-bold text-slate-800">Saved Tailored CVs for {currentCredential.id}</h4>
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
                  <span className="text-xs font-bold text-slate-900">{currentResume.targetRole}</span>
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
                          <strong className="text-slate-900">Domain & Architecture: </strong>
                          <span className="text-slate-700">{currentResume.skills.domain.join(', ')}</span>
                        </div>
                      )}
                      {currentResume.skills.tools?.length > 0 && (
                        <div>
                          <strong className="text-slate-900">Cloud & Tools: </strong>
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
                <div className="p-6 space-y-4 max-h-[750px] overflow-y-auto text-xs">
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
                Enter your target job on the left and click Generate. Your 2-page Irish compliant CV will appear here instantly for PDF export.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
