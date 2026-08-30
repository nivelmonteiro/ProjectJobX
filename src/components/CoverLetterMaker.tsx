import React, { useState, useEffect } from 'react';
import { UserCredential, TailoredCoverLetter } from '../types';
import { apiClient } from '../utils/apiClient';
import { exportCoverLetterToPDF } from '../utils/pdfExport';
import { IRISH_VISA_OPTIONS, IRISH_LOCATIONS } from './ResumeMaker';
import confetti from 'canvas-confetti';
import { 
  Mail, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  Building2, 
  ShieldCheck,
  Edit3,
  Eye,
  User
} from 'lucide-react';

interface CoverLetterMakerProps {
  currentCredential: UserCredential;
  remainingQuota: number;
  onQuotaUsed: (newRemaining: number) => void;
  savedLetters: TailoredCoverLetter[];
  onSaveLetter: (letter: TailoredCoverLetter) => void;
}

export const CoverLetterMaker: React.FC<CoverLetterMakerProps> = ({
  currentCredential,
  remainingQuota,
  onQuotaUsed,
  savedLetters,
  onSaveLetter
}) => {
  const [candidateName, setCandidateName] = useState(currentCredential.name || 'Nivel Monteiro');
  const [candidateVisa, setCandidateVisa] = useState(currentCredential.visaStatus || 'Stamp 1G');
  const [candidatePhone, setCandidatePhone] = useState(currentCredential.phone || '+353 89 984 7924');
  const [candidateEmail, setCandidateEmail] = useState(currentCredential.email || 'nivelmonteiro@outlook.com');
  const [candidateLocation, setCandidateLocation] = useState(currentCredential.location || 'Dublin');

  const [jobTitle, setJobTitle] = useState('Financial Analyst (FP&A & Corporate Finance)');
  const [companyName, setCompanyName] = useState('Bank of Ireland / Stripe Ireland');
  const [companyLocation, setCompanyLocation] = useState('Dublin, Ireland');
  const [hiringManager, setHiringManager] = useState('Hiring Manager & Finance Leadership');
  const [tone, setTone] = useState('Professional & Impactful');
  const [keyPoints, setKeyPoints] = useState('8+ years progressive corporate financial modeling, NAV accounting, variance forecasting, and MBA from Dublin Business School (NFQ Level 9).');
  const [jobDescription, setJobDescription] = useState('Financial Analyst to lead corporate financial modeling, multi-scenario budgeting, variance analysis, cash flow forecasting, and executive reporting in Dublin.');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [currentLetter, setCurrentLetter] = useState<TailoredCoverLetter | null>(
    savedLetters.length > 0 ? savedLetters[0] : null
  );

  useEffect(() => {
    setCandidateName(currentCredential.name);
    setCandidateVisa(currentCredential.visaStatus);
    setCandidatePhone(currentCredential.phone);
    setCandidateEmail(currentCredential.email);
    setCandidateLocation(currentCredential.location);
  }, [currentCredential.id]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    const tailoredProfile: UserCredential = {
      ...currentCredential,
      name: candidateName.trim() || currentCredential.name,
      visaStatus: candidateVisa as any,
      email: candidateEmail.trim() || currentCredential.email,
      phone: candidatePhone.trim() || currentCredential.phone,
      location: candidateLocation as any
    };

    try {
      const res = await apiClient.makeCoverLetter({
        credentialId: currentCredential.id,
        userProfile: tailoredProfile,
        jobTitle,
        companyName,
        companyLocation,
        jobDescription,
        tone,
        keyPoints
      });

      setCurrentLetter(res.coverLetter);
      onSaveLetter(res.coverLetter);
      onQuotaUsed(res.remainingQuota);
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.85 } });
    } catch (err: any) {
      setError(err.message || 'Error generating cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!currentLetter) return;
    exportCoverLetterToPDF(
      currentLetter,
      candidateName,
      candidatePhone,
      candidateEmail,
      candidateLocation
    );
    confetti({ particleCount: 35, spread: 45 });
  };

  const handleCopyText = () => {
    if (!currentLetter) return;
    const text = currentLetter.fullFormattedText || `${candidateName}\n${candidateLocation} | ${candidatePhone} | ${candidateEmail}\n\n${new Date().toLocaleDateString('en-IE')}\n\n${currentLetter.hiringManager}\n${currentLetter.targetCompany}\n${currentLetter.companyAddressOrLocation}\n\nDear ${currentLetter.hiringManager},\n\n${currentLetter.openingParagraph}\n\n${currentLetter.bodyParagraphs?.join('\n\n')}\n\n${currentLetter.workAuthorizationStatement}\n\n${currentLetter.closingParagraph}\n\n${currentLetter.signOff}\n\n${candidateName}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Irish Cover Letter Guidance Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-700" />
            Tailored Irish Cover Letter Generator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Irish market standard 1-page structure: succinct 3-4 paragraphs, clear motivation for Ireland/company, explicit Stamp/work right declaration, and professional sign-offs.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono">
          {remainingQuota} AI Uses Left Today
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            
            {/* Candidate Name & Visa / Stamp Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50 font-semibold"
                  placeholder="e.g. Nivel Monteiro"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Irish Work Eligibility</label>
                <select
                  value={candidateVisa}
                  onChange={(e) => setCandidateVisa(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-emerald-50/40 text-emerald-950 font-medium"
                >
                  {IRISH_VISA_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Target Presets */}
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">Quick Target Presets:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setJobTitle('Financial Analyst (FP&A & Corporate Finance)');
                    setCompanyName('Bank of Ireland / Stripe Ireland');
                    setCompanyLocation('Dublin, Ireland');
                    setHiringManager('Hiring Manager & Finance Leadership');
                    setKeyPoints('8+ years progressive corporate financial modeling, NAV accounting, variance forecasting, and MBA from Dublin Business School (NFQ Level 9).');
                    setJobDescription('Financial Analyst to lead corporate financial modeling, multi-scenario budgeting, variance analysis, cash flow forecasting, and executive reporting in Dublin.');
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
                    setCompanyLocation('Dublin IFSC, Ireland');
                    setHiringManager('Fund Administration Hiring Team');
                    setKeyPoints('8+ years accounting experience, mutual fund valuations, NAV computation, asset reconciliations, and Dublin Business School MBA (NFQ Level 9).');
                    setJobDescription('Fund Accountant to manage Net Asset Value (NAV) computation, portfolio valuations, cash & custody reconciliations, and statutory audit support under CBI regulations.');
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
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Role</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                  placeholder="e.g. Lead Product Manager"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Office / Location in Ireland</label>
                <input
                  type="text"
                  value={companyLocation}
                  onChange={(e) => setCompanyLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                  placeholder="e.g. Dublin 2, Ireland"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Hiring Manager / Team</label>
                <input
                  type="text"
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                  placeholder="e.g. Talent Acquisition Lead"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Tone & Communication Style</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
              >
                <option value="Professional, Confident & Direct">Professional, Confident & Direct</option>
                <option value="Executive & Strategic Leader">Executive & Strategic Leader</option>
                <option value="Enthusiastic High-Growth Tech">Enthusiastic High-Growth Tech</option>
                <option value="Formal Irish Corporate (Is mise le meas)">Formal Irish Corporate (Is mise le meas)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Key Strengths & Synergies to Highlight</label>
              <textarea
                rows={3}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Mention specific projects, metrics, or reasons for choosing this company in Ireland..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Job Description Snippet</label>
              <textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key responsibilities or tech stack requirements..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none bg-slate-50/50"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || remainingQuota <= 0}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-xs ${
                isGenerating || remainingQuota <= 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting Irish Cover Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Tailored Cover Letter (1 Use)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview & Editor */}
        <div className="lg:col-span-7 space-y-4">
          {currentLetter ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Action bar */}
              <div className="px-5 py-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{currentLetter.targetCompany}</span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs text-slate-600">{currentLetter.targetRole}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200/70 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isEditing ? 'Preview' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={handleCopyText}
                    className="p-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200/70 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
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

              {/* Letter Content */}
              {!isEditing ? (
                <div className="p-6 sm:p-8 space-y-4 text-slate-800 text-xs sm:text-[13px] leading-relaxed max-h-[750px] overflow-y-auto font-sans">
                  
                  {/* Candidate Header */}
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="text-base font-bold text-slate-900">{currentCredential.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentCredential.location} • {currentCredential.phone} • {currentCredential.email}
                    </p>
                  </div>

                  {/* Date & Recipient */}
                  <div className="text-xs space-y-1 text-slate-600">
                    <p>{new Date(currentLetter.createdAt).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-semibold text-slate-900">{currentLetter.hiringManager}</p>
                    <p>{currentLetter.targetCompany}</p>
                    <p>{currentLetter.companyAddressOrLocation}</p>
                  </div>

                  {/* Salutation */}
                  <p className="font-bold text-slate-900 pt-2">Dear {currentLetter.hiringManager},</p>

                  {/* Opening */}
                  <p className="text-slate-700">{currentLetter.openingParagraph}</p>

                  {/* Body */}
                  {currentLetter.bodyParagraphs?.map((p, idx) => (
                    <p key={idx} className="text-slate-700">{p}</p>
                  ))}

                  {/* Work Authorization Statement */}
                  {currentLetter.workAuthorizationStatement && (
                    <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-900 text-xs font-medium">
                      {currentLetter.workAuthorizationStatement}
                    </div>
                  )}

                  {/* Closing */}
                  <p className="text-slate-700">{currentLetter.closingParagraph}</p>

                  {/* Sign Off */}
                  <div className="pt-3 space-y-1">
                    <p className="font-medium text-slate-900">{currentLetter.signOff || 'Kind regards,'}</p>
                    <p className="font-bold text-slate-900">{currentCredential.name}</p>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="p-6 space-y-3 text-xs max-h-[750px] overflow-y-auto">
                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Opening Paragraph</label>
                    <textarea
                      rows={3}
                      value={currentLetter.openingParagraph}
                      onChange={(e) => setCurrentLetter({ ...currentLetter, openingParagraph: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Body Paragraphs</label>
                    {currentLetter.bodyParagraphs?.map((bp, bpIdx) => (
                      <textarea
                        key={bpIdx}
                        rows={3}
                        value={bp}
                        onChange={(e) => {
                          const newBP = [...currentLetter.bodyParagraphs];
                          newBP[bpIdx] = e.target.value;
                          setCurrentLetter({ ...currentLetter, bodyParagraphs: newBP });
                        }}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white mb-2"
                      />
                    ))}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Work Authorization Statement</label>
                    <input
                      type="text"
                      value={currentLetter.workAuthorizationStatement}
                      onChange={(e) => setCurrentLetter({ ...currentLetter, workAuthorizationStatement: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Closing Paragraph</label>
                    <textarea
                      rows={2}
                      value={currentLetter.closingParagraph}
                      onChange={(e) => setCurrentLetter({ ...currentLetter, closingParagraph: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ready to Create Your Irish Cover Letter</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Enter target company details and click "Generate". We'll craft a high-impact, professional Irish cover letter ready for PDF export.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
