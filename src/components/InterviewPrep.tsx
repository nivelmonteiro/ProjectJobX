import React, { useState } from 'react';
import { UserCredential, InterviewPrepSession, InterviewQuestion } from '../types';
import { apiClient } from '../utils/apiClient';
import confetti from 'canvas-confetti';
import { 
  Mic2, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Euro, 
  Send, 
  HelpCircle, 
  ChevronRight, 
  ShieldCheck, 
  Star,
  Award,
  BookOpen
} from 'lucide-react';

interface InterviewPrepProps {
  currentCredential: UserCredential;
  remainingQuota: number;
  onQuotaUsed: (newRemaining: number) => void;
  savedPreps: InterviewPrepSession[];
  onSavePrep: (prep: InterviewPrepSession) => void;
  initialJobTitle?: string;
  initialCompanyName?: string;
  initialJobDescription?: string;
}

export const InterviewPrep: React.FC<InterviewPrepProps> = ({
  currentCredential,
  remainingQuota,
  onQuotaUsed,
  savedPreps,
  onSavePrep,
  initialJobTitle,
  initialCompanyName,
  initialJobDescription
}) => {
  const [jobTitle, setJobTitle] = useState(initialJobTitle || 'Financial Analyst (FP&A & Corporate Finance)');
  const [companyName, setCompanyName] = useState(initialCompanyName || 'Bank of Ireland / Stripe Ireland');
  const [jobDescription, setJobDescription] = useState(initialJobDescription || 'Financial Analyst role in Dublin focusing on corporate financial modeling, multi-scenario budgeting, variance analysis, cash flow forecasting, and executive KPI reporting.');
  const [focusArea, setFocusArea] = useState('Competency STAR Framework & Irish Workplace Culture');

  React.useEffect(() => {
    if (initialJobTitle) setJobTitle(initialJobTitle);
    if (initialCompanyName) setCompanyName(initialCompanyName);
    if (initialJobDescription) setJobDescription(initialJobDescription);
  }, [initialJobTitle, initialCompanyName, initialJobDescription]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentSession, setCurrentSession] = useState<InterviewPrepSession | null>(
    savedPreps.length > 0 ? savedPreps[0] : null
  );

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [candidatePracticeAnswer, setCandidatePracticeAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  const handleGenerate = async () => {
    if (remainingQuota <= 0) {
      setError(`Daily AI generation limit reached for ${currentCredential.id}. Resets at midnight UTC.`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setEvaluationResult(null);

    try {
      const res = await apiClient.prepInterview({
        credentialId: currentCredential.id,
        jobTitle,
        companyName,
        jobDescription,
        focusArea
      });

      setCurrentSession(res.prepSession);
      onSavePrep(res.prepSession);
      onQuotaUsed(res.remainingQuota);
      if (res.prepSession.questions.length > 0) {
        setActiveQuestionId(res.prepSession.questions[0].id);
      }
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.85 } });
    } catch (err: any) {
      setError(err.message || 'Error generating interview prep');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedQuestion: InterviewQuestion | undefined = currentSession?.questions.find(
    q => q.id === (activeQuestionId || currentSession.questions[0]?.id)
  );

  const handleEvaluateAnswer = async () => {
    if (!selectedQuestion || !candidatePracticeAnswer.trim()) return;
    if (remainingQuota <= 0) {
      setError(`Daily AI quota reached for ${currentCredential.id}.`);
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const res = await apiClient.evaluateAnswer({
        credentialId: currentCredential.id,
        question: selectedQuestion.question,
        candidateAnswer: candidatePracticeAnswer,
        targetRole: jobTitle
      });

      setEvaluationResult(res.evaluation);
      onQuotaUsed(res.remainingQuota);
      if (res.evaluation.score >= 80) {
        confetti({ particleCount: 40, spread: 50 });
      }
    } catch (err: any) {
      setError(err.message || 'Error evaluating mock answer');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Guidance Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-emerald-700" />
            Irish Market Competency & STAR Interview Coach
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Irish employers heavily test the STAR framework (Situation, Task, Action, Result), GDPR data security culture, collegial teamwork, and salary benchmarks in € EUR.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono">
          {remainingQuota} AI Uses Left Today
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Inputs */}
        <div className="lg:col-span-4 space-y-4">
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
                    setJobDescription('Financial Analyst role in Dublin focusing on corporate financial modeling, multi-scenario budgeting, variance analysis, cash flow forecasting, and executive KPI reporting.');
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
                    setJobDescription('Fund Accountant role in Dublin IFSC focusing on daily Net Asset Value (NAV) computation, portfolio valuations, cash and asset reconciliations, and CBI statutory audit preparation.');
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

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Role</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                placeholder="e.g. Lead Full Stack Engineer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Irish Employer</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                placeholder="e.g. Stripe, Workday, Pfizer Cork"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Focus & Interview Type</label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
              >
                <option value="Competency STAR Framework & Irish Workplace Culture">STAR Competency & Culture</option>
                <option value="Technical Architecture & System Design in Ireland">Tech Depth & Architecture</option>
                <option value="Salary Negotiation & Irish Stamp/Visa Rights">Salary Negotiation (€) & Visa</option>
                <option value="Executive & Stakeholder Management">Executive & Leadership</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Job Description Snippet</label>
              <textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none bg-slate-50/50"
                placeholder="Paste key responsibilities..."
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
                  <span>Curating STAR Questions & Salary Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Interview Prep (1 Use)</span>
                </>
              )}
            </button>
          </div>

          {/* Salary Guide Card */}
          {currentSession?.salaryBenchmarkGuide && (
            <div className="bg-emerald-900/90 text-white rounded-2xl p-4 border border-emerald-800 shadow-xs space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-200 text-sm">
                <Euro className="w-4 h-4 text-emerald-300" />
                Irish Salary Benchmark (€ EUR)
              </div>
              <div className="space-y-1">
                <div className="flex justify-between border-b border-emerald-800 pb-1">
                  <span className="text-emerald-100 font-medium">Dublin Silicon Docks:</span>
                  <span className="font-bold text-white">{currentSession.salaryBenchmarkGuide.dublinRange}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-800 pb-1 pt-1">
                  <span className="text-emerald-100 font-medium">Cork / Regional / Remote:</span>
                  <span className="font-bold text-white">{currentSession.salaryBenchmarkGuide.regionalRange}</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-100/80 leading-relaxed pt-1">
                {currentSession.salaryBenchmarkGuide.irishMarketNotes}
              </p>
            </div>
          )}
        </div>

        {/* Questions & Practice Studio */}
        <div className="lg:col-span-8 space-y-4">
          {currentSession ? (
            <div className="space-y-4">
              
              {/* Question selector tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {currentSession.questions.map((q, idx) => {
                  const isSelected = selectedQuestion?.id === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setActiveQuestionId(q.id);
                        setEvaluationResult(null);
                        setCandidatePracticeAnswer('');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>Q{idx + 1}: {q.category.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Question Details */}
              {selectedQuestion && (
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
                  
                  {/* Category & Question text */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {selectedQuestion.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                      "{selectedQuestion.question}"
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      <strong className="text-slate-700">Recruiter Intent: </strong>
                      {selectedQuestion.whyAsked}
                    </p>
                  </div>

                  {/* STAR Breakdown cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                        [S] Situation
                      </span>
                      <p className="text-xs text-slate-700">{selectedQuestion.starFramework.situation}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                        [T] Task
                      </span>
                      <p className="text-xs text-slate-700">{selectedQuestion.starFramework.task}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                        [A] Action (Your Individual Leadership)
                      </span>
                      <p className="text-xs text-slate-700">{selectedQuestion.starFramework.action}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                        [R] Result (Quantified Metric)
                      </span>
                      <p className="text-xs text-slate-700">{selectedQuestion.starFramework.result}</p>
                    </div>
                  </div>

                  {/* Irish Keywords & Pitfalls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Keywords Irish Interviewers Value:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedQuestion.keyIrishKeywordsToMention.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-rose-900 block mb-1">Pitfalls to Avoid:</span>
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-600 text-[11px]">
                        {selectedQuestion.pitfallsToAvoid.map((pf, i) => (
                          <li key={i}>{pf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Benchmark Model Answer */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 block">Model Benchmark Response:</span>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{selectedQuestion.suggestedAnswer}"
                    </p>
                  </div>

                  {/* Interactive Practice Studio */}
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        Practice Studio: Test Your Answer
                      </h4>
                      <span className="text-[11px] text-slate-500">AI evaluates STAR impact & Irish tone</span>
                    </div>

                    <textarea
                      rows={4}
                      value={candidatePracticeAnswer}
                      onChange={(e) => setCandidatePracticeAnswer(e.target.value)}
                      placeholder="Type your practice response using Situation, Task, Action, Result..."
                      className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none bg-slate-50/50"
                    />

                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={isEvaluating || !candidatePracticeAnswer.trim() || remainingQuota <= 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-xs ${
                        isEvaluating || !candidatePracticeAnswer.trim() || remainingQuota <= 0
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-700 hover:bg-emerald-800'
                      }`}
                    >
                      {isEvaluating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Grading Your STAR Delivery...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-3.5 h-3.5" />
                          <span>AI Grade My Answer (1 Use)</span>
                        </>
                      )}
                    </button>

                    {/* AI Feedback Display */}
                    {evaluationResult && (
                      <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-emerald-900">{evaluationResult.score} / 100</span>
                            <span className="text-xs font-semibold text-emerald-800">STAR Mastery Score</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <span>Clarity: <strong>{evaluationResult.starRating?.clarity || 4}/5</strong></span>
                            <span>Impact: <strong>{evaluationResult.starRating?.impact || 4}/5</strong></span>
                            <span>Relevance: <strong>{evaluationResult.starRating?.relevance || 5}/5</strong></span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-emerald-200/60">
                          <div>
                            <span className="font-bold text-emerald-900 block mb-1">Key Strengths:</span>
                            <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                              {evaluationResult.strengths?.map((s: string, i: number) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="font-bold text-amber-900 block mb-1">Actionable Polish:</span>
                            <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                              {evaluationResult.improvements?.map((imp: string, i: number) => (
                                <li key={i}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {evaluationResult.polishedIrishVersion && (
                          <div className="pt-2 border-t border-emerald-200/60">
                            <span className="text-xs font-bold text-emerald-900 block mb-1">Polished Irish Corporate Phrasing:</span>
                            <p className="text-xs text-slate-800 italic leading-relaxed">
                              "{evaluationResult.polishedIrishVersion}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Mic2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ready to Prepare for Irish Interviews</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Enter your target role and company on the left to generate customized STAR questions, salary benchmark ranges in € EUR, and an interactive practice studio.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
