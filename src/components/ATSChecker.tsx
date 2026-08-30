import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import { UserCredential, ATSAnalysis, TailoredResume } from '../types';
import { apiClient } from '../utils/apiClient';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Check, 
  Copy, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  TrendingUp,
  Upload,
  FileUp,
  FileCheck,
  X
} from 'lucide-react';

interface ATSCheckerProps {
  currentCredential: UserCredential;
  remainingQuota: number;
  onQuotaUsed: (newRemaining: number) => void;
  savedAnalyses: ATSAnalysis[];
  onSaveAnalysis: (analysis: ATSAnalysis) => void;
  initialResumeText?: string;
  initialJobDesc?: string;
}

export const ATSChecker: React.FC<ATSCheckerProps> = ({
  currentCredential,
  remainingQuota,
  onQuotaUsed,
  savedAnalyses,
  onSaveAnalysis,
  initialResumeText = '',
  initialJobDesc = ''
}) => {
  const [resumeText, setResumeText] = useState(
    initialResumeText ||
    `NIVEL MONTEIRO
STRATEGIC FINANCE & REGULATORY COMPLIANCE ANALYST
Dublin, Ireland | +353 89 984 7924 | nivelmonteiro@outlook.com | Eircode: D02 X285 | LinkedIn: https://linkedin.com/in/nivelmonteiro
Work Authorization: Stamp 1G (Full legal entitlement to work in Ireland)

Summary:
Strategic Financial Analyst & Regulatory Compliance Specialist with over 8+ years progressive experience spanning corporate finance, KYC/AML due diligence, sanctions screening, financial statement finalization, and statutory audit operations. Holds an MBA in Finance from Dublin Business School (NFQ Level 9) and valid Irish Stamp 1G work authorization with immediate right to work in Ireland without sponsorship.

Skills:
Financial Modeling (DCF/LBO), KYC / AML Due Diligence, Sanctions Screening, Statutory Audit, GAAP & IFRS Reporting, Irish Taxation, Advanced MS Excel, Power BI, SAP FICO, QuickBooks, SQL.

Experience:
1. Financial Analyst (Freelance / Advisory) - Finkasturi Technologies (11/2024 - Present, Dublin Liaison):
- Lead full-cycle corporate financial modeling, cash flow forecasting, and budget variance analyses to support strategic executive decisions.
- Execute end-to-end KYC/AML customer due diligence, sanctions screening, and financial crime risk profiling for international corporate accounts.
- Develop dynamic KPI & liquidity dashboards in Advanced MS Excel and Power BI, tracking operating burn rates and margin performance.

2. Accountant & Financial Analyst - American Eye & Retina Care Pvt. Ltd. (08/2022 - 08/2023):
- Directed full-cycle financial reporting, ledger maintenance, and final accounts finalization under GAAP/IFRS standards with 100% compliance.
- Streamlined accounts reconciliation and billing workflows, reducing monthly close turnaround time by 20%.
- Led cross-departmental internal audits and balance sheet reconciliations, enhancing working capital efficiency.

Education:
Master of Business Administration (MBA) – Finance | Dublin Business School (DBS), Dublin (2023 – 2025, NFQ Level 9)
Bachelor of Business Management (BBM) – Accounts & Finance | St. Aloysius College, Mangalore University (2011 – 2014, NFQ Level 8)`
  );

  const [jobDescription, setJobDescription] = useState(
    initialJobDesc ||
    `Financial Analyst & Fund Accountant (Dublin / Hybrid)
We are seeking an experienced Financial Analyst / Fund Accountant to support financial modeling, budgeting, and fund accounting operations in Dublin.
Key Requirements:
- 5+ years experience in corporate finance, financial analysis, NAV calculation, fund accounting, and statutory audit governance
- Proven capability in cash flow forecasting, variance analysis, balance sheet reconciliations, and portfolio valuations
- Proficiency in Advanced MS Excel (Macros, XLOOKUP), Power BI, and financial ERP systems (SAP FICO, QuickBooks)
- Master's (NFQ Level 9) or Bachelor's (NFQ Level 8) degree in Finance, Accounting, or related business discipline
- Immediate legal eligibility to work in Ireland (Stamp 1G / Stamp 4 / EU Citizen)`
  );

  const [jobTitle, setJobTitle] = useState('Financial Analyst (FP&A & Corporate Finance)');
  const [companyName, setCompanyName] = useState('Bank of Ireland / Stripe Ireland');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const [currentAnalysis, setCurrentAnalysis] = useState<ATSAnalysis | null>(
    savedAnalyses.length > 0 ? savedAnalyses[0] : null
  );

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploadingFile(true);

    try {
      const lowerName = file.name.toLowerCase();

      // 1. Text or Markdown files
      if (file.type === 'text/plain' || lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
        const text = await file.text();
        setResumeText(text);
        setUploadedFileName(file.name);
        return;
      }

      // 2. Client-side DOCX extraction
      if (lowerName.endsWith('.docx') || file.type.includes('wordprocessingml')) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const docxResult = await mammoth.extractRawText({ arrayBuffer });
          if (docxResult.value && docxResult.value.trim().length > 30) {
            setResumeText(docxResult.value.trim());
            setUploadedFileName(file.name);
            return;
          }
        } catch (docxErr) {
          console.warn('ATS docx parse note, falling back to server:', docxErr);
        }
      }

      // 3. Multi-layer Server parsing (PDF, DOCX, DOC, OCR)
      const res = await apiClient.parseResumeFile(file);
      if (res.text && res.text.trim().length > 0) {
        setResumeText(res.text.trim());
        setUploadedFileName(res.fileName || file.name);
      } else {
        throw new Error('Could not extract text from document. Please paste the CV text directly or upload a PDF/Word file.');
      }
    } catch (err: any) {
      console.error('ATS upload parsing error:', err);
      setError(err.message || 'Failed to read uploaded resume file. Please ensure it is a PDF, Word (.docx/.doc), or TXT file.');
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

  const handleClearResumeText = () => {
    setResumeText('');
    setUploadedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleScan = async () => {
    if (remainingQuota <= 0) {
      setError(`Daily AI generation limit reached for ${currentCredential.id}. Resets at midnight UTC.`);
      return;
    }
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both your CV text and the target Job Description.');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const res = await apiClient.checkATS({
        credentialId: currentCredential.id,
        resumeText,
        jobDescription,
        jobTitle,
        companyName
      });

      setCurrentAnalysis(res.analysis);
      onSaveAnalysis(res.analysis);
      onQuotaUsed(res.remainingQuota);
      if (res.analysis.overallScore >= 80) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
      }
    } catch (err: any) {
      setError(err.message || 'Error running ATS audit');
    } finally {
      setIsScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 70) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Title & Quota Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Irish & European ATS Compatibility Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulates Workday, Greenhouse, Taleo & Irish Recruiter filters: keyword density, NFQ qualification recognition, GDPR compliance & formatting standards.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono">
          {remainingQuota} AI Uses Left Today
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            
            {/* Quick Target Presets */}
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">Quick Target Presets:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setJobTitle('Financial Analyst (FP&A & Corporate Finance)');
                    setCompanyName('Bank of Ireland / Stripe Ireland');
                    setJobDescription(`Financial Analyst & FP&A Specialist (Dublin / Hybrid)
We are seeking an experienced Financial Analyst to lead financial modeling, budgeting, and performance analytics.
Key Requirements:
- 5+ years experience in corporate finance, financial modeling (DCF/LBO), and cash flow forecasting
- Advanced MS Excel (XLOOKUP, Pivot, financial models), Power BI, and SAP ERP
- Master's (NFQ Level 9) or Bachelor's (NFQ Level 8) in Finance or Accounting
- Full-time work eligibility in Ireland (Stamp 1G / Stamp 4 / EU Citizen)`);
                  }}
                  className={`text-left p-2 rounded-lg border text-xs transition-all ${
                    jobTitle.toLowerCase().includes('financial analyst')
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <span>📊</span>
                    <span>Financial Analyst</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setJobTitle('Fund Accountant (NAV & Portfolio Valuation)');
                    setCompanyName('State Street Ireland / BNY Mellon');
                    setJobDescription(`Fund Accountant (NAV & Asset Valuations - Dublin IFSC)
We are seeking a Fund Accountant to manage Net Asset Value (NAV) computations and mutual fund reconciliations.
Key Requirements:
- 5+ years experience in fund accounting, NAV calculations, portfolio pricing, and custody reconciliations
- Strong understanding of UCITS, AIFMD, and Central Bank of Ireland statutory reporting
- Advanced Excel and financial reporting systems
- Master's or Bachelor's degree in Finance/Accounting and Stamp 1G/Stamp 4 work authorization`);
                  }}
                  className={`text-left p-2 rounded-lg border text-xs transition-all ${
                    jobTitle.toLowerCase().includes('fund')
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <span>🏛️</span>
                    <span>Fund Accountant</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                  placeholder="e.g. Full Stack Engineer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Company</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                  placeholder="e.g. Stripe Ireland"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Candidate CV Text / Document</span>
                </label>
                {resumeText && (
                  <button
                    type="button"
                    onClick={handleClearResumeText}
                    className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>

              {/* Upload Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-2.5 text-center cursor-pointer transition-all mb-2 ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-50'
                    : uploadedFileName
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-slate-300 hover:border-emerald-400 bg-slate-50/70 hover:bg-emerald-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {isUploadingFile ? (
                  <div className="flex items-center justify-center gap-2 py-0.5 text-xs text-emerald-700 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Parsing resume file (PDF / Word / Text)...</span>
                  </div>
                ) : uploadedFileName ? (
                  <div className="flex items-center justify-between text-xs text-emerald-900 px-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold truncate">{uploadedFileName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono shrink-0">
                      Uploaded
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Drop existing CV (PDF, Word .docx/.doc, TXT) or click to upload</span>
                  </div>
                )}
              </div>

              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your CV content or upload a document above..."
                className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none font-mono bg-slate-50/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Target Irish Job Description</label>
                <span className="text-[11px] text-slate-400">Requirements & keywords</span>
              </div>
              <textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description from LinkedIn/IrishJobs/Workday..."
                className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none bg-slate-50/50"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleScan}
              disabled={isScanning || remainingQuota <= 0}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-xs ${
                isScanning || remainingQuota <= 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning ATS Filters & Keywords...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Run Comprehensive ATS Audit (1 Use)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Audit Results */}
        <div className="lg:col-span-7 space-y-4">
          {currentAnalysis ? (
            <div className="space-y-4">
              
              {/* Scorecard Hero */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{currentAnalysis.jobTitle}</h3>
                    <p className="text-xs text-slate-500">{currentAnalysis.companyName} • Analyzed {new Date(currentAnalysis.analyzedAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  
                  {/* Big Overall Gauge */}
                  <div className="flex items-center gap-2">
                    <div className={`px-4 py-2 rounded-xl border text-center font-bold ${getScoreColor(currentAnalysis.overallScore)}`}>
                      <span className="text-2xl">{currentAnalysis.overallScore}</span>
                      <span className="text-xs text-slate-500 font-normal"> / 100</span>
                      <span className="block text-[10px] uppercase tracking-wider font-semibold">Overall ATS Score</span>
                    </div>
                  </div>
                </div>

                {/* Sub Score Breakdown */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-base font-bold text-slate-900">{currentAnalysis.keywordMatchScore}%</span>
                    <span className="block text-[11px] text-slate-500">Keyword Match</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-base font-bold text-slate-900">{currentAnalysis.formatStructureScore}%</span>
                    <span className="block text-[11px] text-slate-500">Format & Structure</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-base font-bold text-emerald-800">{currentAnalysis.irishMarketComplianceScore}%</span>
                    <span className="block text-[11px] text-slate-500">Irish Compliance</span>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Keywords */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Matched ATS Keywords ({currentAnalysis.matchedKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {currentAnalysis.matchedKeywords.map((kw, i) => (
                      <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Critical Missing Keywords to Add ({currentAnalysis.missingKeywords.length})
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 mb-2">
                    Add these terms in your Skills or Experience bullets to boost pass rates:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentAnalysis.missingKeywords.map((kw, i) => (
                      <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Irish Market Checklist Audits */}
              {currentAnalysis.formatCritiques && currentAnalysis.formatCritiques.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Irish Recruiter & Layout Verification
                  </h4>
                  <div className="space-y-2">
                    {currentAnalysis.formatCritiques.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                        {item.status === 'pass' ? (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : item.status === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <strong className="text-slate-900 block">{item.aspect}</strong>
                          <span className="text-slate-600">{item.comment}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Improvements & Suggested Summary */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    High-Priority AI Action Items
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700 list-disc list-outside pl-4">
                    {currentAnalysis.actionableImprovements.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>

                {currentAnalysis.optimizedSummarySuggestion && (
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-800">
                        AI Recommended Irish Summary Re-Write:
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(currentAnalysis.optimizedSummarySuggestion!);
                          setCopiedSummary(true);
                          setTimeout(() => setCopiedSummary(false), 2000);
                        }}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        {copiedSummary ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
                      </button>
                    </div>
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed italic">
                      "{currentAnalysis.optimizedSummarySuggestion}"
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ready to Test Your ATS Compatibility</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Paste your CV text and target job description on the left. Click "Run Comprehensive ATS Audit" to see your score, keyword matches, and Irish compliance breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
