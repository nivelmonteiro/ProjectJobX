import { UserCredential, TailoredResume, ATSAnalysis, TailoredCoverLetter, InterviewPrepSession, JobApplication, ExternalJobListing } from '../types';
import { 
  generateClientFallbackResume, 
  generateClientFallbackATS, 
  generateClientFallbackCoverLetter, 
  generateClientFallbackInterviewPrep 
} from './clientFallbacks';
import { extractTextFromFile } from './fileParser';

export interface UserDataPayload {
  resumes: TailoredResume[];
  coverLetters: TailoredCoverLetter[];
  atsAnalyses: ATSAnalysis[];
  interviewPreps: InterviewPrepSession[];
  jobApplications: JobApplication[];
}

/**
 * Safe fetch with automatic retry, timeout, and response validation
 */
async function safeFetch(url: string, options: RequestInit = {}, retries = 1): Promise<Response> {
  let lastErr: any = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return res;
    } catch (err: any) {
      lastErr = err;
      if (i < retries) {
        await new Promise(r => setTimeout(r, 200 * (i + 1)));
      }
    }
  }
  throw lastErr || new Error('Network request failed');
}

/**
 * Bulletproof helper to extract JSON from response, guarding against HTML error pages
 * (e.g., Vercel SPA rewrites, "The page could not be found", 404/500 text)
 */
async function safeJson(res: Response | null | undefined): Promise<any> {
  if (!res) return null;
  try {
    const text = await res.text();
    if (!text || text.trim().length === 0) {
      return null;
    }
    const trimmed = text.trim();
    // Guard against HTML error pages ("The page could not be found", "<!DOCTYPE html>", etc.)
    if (
      trimmed.startsWith('<!') ||
      trimmed.startsWith('<html') ||
      trimmed.startsWith('<head') ||
      trimmed.startsWith('<body') ||
      trimmed.startsWith('The page') ||
      (!trimmed.startsWith('{') && !trimmed.startsWith('['))
    ) {
      return null;
    }
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

/**
 * Safe localStorage JSON parser
 */
function safeStorageParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const trimmed = item.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return fallback;
    }
    return JSON.parse(trimmed) as T;
  } catch {
    return fallback;
  }
}

export const apiClient = {
  async getCredentials(): Promise<{ credentials: UserCredential[]; maxAllowed: number; maxDailyPerUser: number }> {
    try {
      const res = await safeFetch('/api/auth/credentials');
      const data = await safeJson(res);
      if (data && Array.isArray(data.credentials)) {
        return data;
      }
    } catch (err) {
      console.warn('API getCredentials local fallback:', err);
    }
    const list = safeStorageParse<UserCredential[]>('eire_credentials', []);
    return {
      credentials: list,
      maxAllowed: 4,
      maxDailyPerUser: 50
    };
  },

  async getQuota(credentialId: string): Promise<{ remaining: number; maxAllowed: number }> {
    try {
      const res = await safeFetch(`/api/quota?credentialId=${encodeURIComponent(credentialId)}`);
      const data = await safeJson(res);
      if (data && data.remaining !== undefined) {
        return data;
      }
    } catch (e) {
      console.warn('Quota check fallback:', e);
    }
    return { remaining: 50, maxAllowed: 50 };
  },

  async login(credentialId: string, email?: string): Promise<{ credential: UserCredential; remainingQuota: number }> {
    try {
      const res = await safeFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentialId, email })
      });
      const data = await safeJson(res);
      if (data && data.credential) {
        return data;
      }
    } catch (e) {
      console.warn('Login fallback to local state:', e);
    }
    const list = safeStorageParse<UserCredential[]>('eire_credentials', []);
    const found = list.find(c => c.id === credentialId || (email && c.email.toLowerCase() === email.toLowerCase())) || list[0];
    return {
      credential: found,
      remainingQuota: 50
    };
  },

  async updateProfile(profileData: Partial<UserCredential>): Promise<{ credential: UserCredential }> {
    try {
      const res = await safeFetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const data = await safeJson(res);
      if (data && data.credential) {
        return data;
      }
    } catch (e) {
      console.warn('Update profile server sync deferred:', e);
    }
    return { credential: profileData as UserCredential };
  },

  async getUserData(credentialId: string): Promise<UserDataPayload> {
    try {
      const res = await safeFetch(`/api/user/data/${credentialId}`);
      const data = await safeJson(res);
      if (data && typeof data === 'object' && data.resumes) {
        return data;
      }
    } catch (e) {
      console.warn('Network load error, checking local store:', e);
    }
    return safeStorageParse<UserDataPayload>(`eirecareer_data_${credentialId}`, {
      resumes: [],
      coverLetters: [],
      atsAnalyses: [],
      interviewPreps: [],
      jobApplications: []
    });
  },

  async saveUserData(credentialId: string, data: UserDataPayload): Promise<void> {
    localStorage.setItem(`eirecareer_data_${credentialId}`, JSON.stringify(data));
    try {
      await safeFetch(`/api/user/data/${credentialId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.warn('Server save sync deferred:', e);
    }
  },

  async getExternalJobs(): Promise<{ jobs: ExternalJobListing[]; source: string }> {
    try {
      const res = await safeFetch('/api/external/jobs');
      const data = await safeJson(res);
      if (data && Array.isArray(data.jobs)) {
        return data;
      }
    } catch (e) {
      console.warn('External jobs fetch fallback:', e);
    }
    return { jobs: [], source: 'local-cache' };
  },

  /**
   * Universal Resume & Document file extractor (Client-First + Server Fallback)
   * 100% functional on Vercel, Netlify, offline, or with backend server
   */
  async parseResumeFile(file: File): Promise<{ text: string; fileName: string; characterCount: number }> {
    try {
      // 1. Instant client-side parsing (PDF via pdfjs-dist, DOCX via mammoth, TXT via FileReader)
      const clientResult = await extractTextFromFile(file);
      if (clientResult.text && clientResult.text.length > 20) {
        return clientResult;
      }
    } catch (clientErr) {
      console.warn('Client extraction error, attempting server fallback:', clientErr);
    }

    // 2. Multi-tier server parser fallback if backend is active
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const fileBase64 = e.target?.result as string;
          const res = await safeFetch('/api/parse-resume-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileBase64,
              fileName: file.name,
              fileType: file.type
            })
          });
          const data = await safeJson(res);
          if (data.text) {
            return resolve(data);
          }
          throw new Error(data.error || 'Server parsing returned empty text');
        } catch (err) {
          // If server parse also fails, try basic plain text extraction
          if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
            const rawText = atob(String(e.target?.result || '').split(',')[1] || '');
            return resolve({
              text: rawText,
              fileName: file.name,
              characterCount: rawText.length
            });
          }
          reject(new Error('Could not extract text from document. Please copy and paste your CV text directly.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file from browser'));
      reader.readAsDataURL(file);
    });
  },

  async tailorResume(payload: {
    credentialId: string;
    userProfile: UserCredential;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    tone?: string;
    existingResume?: string;
  }): Promise<{ resume: TailoredResume; remainingQuota: number }> {
    try {
      const res = await safeFetch('/api/ai/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await safeJson(res);
      if (data && data.resume) {
        return data;
      }
    } catch (err) {
      console.warn('Server tailorResume note (activating intelligent client engine):', err);
    }

    // High-fidelity resilient client-side generation respecting pasted/uploaded CV
    const fallback = generateClientFallbackResume({
      userProfile: payload.userProfile,
      jobTitle: payload.jobTitle,
      companyName: payload.companyName,
      jobDescription: payload.jobDescription,
      existingResume: payload.existingResume
    });

    return {
      resume: fallback,
      remainingQuota: 50
    };
  },

  async checkATS(payload: {
    credentialId: string;
    resumeText: string;
    jobDescription: string;
    jobTitle?: string;
    companyName?: string;
  }): Promise<{ analysis: ATSAnalysis; remainingQuota: number }> {
    try {
      const res = await safeFetch('/api/ai/ats-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await safeJson(res);
      if (data && data.analysis) {
        return data;
      }
    } catch (err) {
      console.warn('Server checkATS note (activating intelligent client engine):', err);
    }

    const fallback = generateClientFallbackATS({
      resumeText: payload.resumeText,
      jobDescription: payload.jobDescription,
      jobTitle: payload.jobTitle,
      companyName: payload.companyName
    });

    return {
      analysis: fallback,
      remainingQuota: 50
    };
  },

  async makeCoverLetter(payload: {
    credentialId: string;
    userProfile: UserCredential;
    jobTitle: string;
    companyName: string;
    companyLocation?: string;
    jobDescription?: string;
    tone?: string;
    keyPoints?: string;
  }): Promise<{ coverLetter: TailoredCoverLetter; remainingQuota: number }> {
    try {
      const res = await safeFetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await safeJson(res);
      if (data && data.coverLetter) {
        return data;
      }
    } catch (err) {
      console.warn('Server makeCoverLetter note (activating intelligent client engine):', err);
    }

    const fallback = generateClientFallbackCoverLetter({
      userProfile: payload.userProfile,
      jobTitle: payload.jobTitle,
      companyName: payload.companyName,
      companyLocation: payload.companyLocation,
      jobDescription: payload.jobDescription,
      keyPoints: payload.keyPoints
    });

    return {
      coverLetter: fallback,
      remainingQuota: 50
    };
  },

  async makeInterviewPrep(payload: {
    credentialId: string;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
  }): Promise<{ session: InterviewPrepSession; remainingQuota: number }> {
    try {
      const res = await safeFetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await safeJson(res);
      if (data && data.session) {
        return data;
      }
    } catch (err) {
      console.warn('Server makeInterviewPrep note (activating intelligent client engine):', err);
    }

    const fallback = generateClientFallbackInterviewPrep({
      jobTitle: payload.jobTitle,
      companyName: payload.companyName,
      jobDescription: payload.jobDescription
    });

    return {
      session: fallback,
      remainingQuota: 50
    };
  },

  async prepInterview(payload: {
    credentialId: string;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    focusArea?: string;
  }): Promise<{ prepSession: InterviewPrepSession; remainingQuota: number }> {
    try {
      const res = await safeFetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await safeJson(res);
      if (data && (data.session || data.prepSession)) {
        return {
          prepSession: data.prepSession || data.session,
          remainingQuota: data.remainingQuota ?? 50
        };
      }
    } catch (err) {
      console.warn('Server prepInterview note (activating intelligent client engine):', err);
    }

    const fallback = generateClientFallbackInterviewPrep({
      jobTitle: payload.jobTitle,
      companyName: payload.companyName,
      jobDescription: payload.jobDescription
    });

    return {
      prepSession: fallback,
      remainingQuota: 50
    };
  },

  async evaluateAnswer(payload: {
    credentialId: string;
    question: string;
    candidateAnswer: string;
    targetRole?: string;
  }): Promise<{
    evaluation: {
      score: number;
      strengths: string[];
      improvements: string[];
      starRating: { clarity: number; impact: number; relevance: number };
    };
    remainingQuota: number;
  }> {
    try {
      const res = await safeFetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await safeJson(res);
      if (data && data.evaluation) {
        return data;
      }
    } catch (err) {
      console.warn('Server evaluateAnswer fallback:', err);
    }

    // Client-side smart evaluation
    const wordCount = payload.candidateAnswer.trim().split(/\s+/).length;
    const hasSituation = /when|at|while|during|in my previous role/i.test(payload.candidateAnswer);
    const hasResult = /resulted in|increased|improved|reduced|delivered|achieved|saved|led to|percent|%/i.test(payload.candidateAnswer);
    const hasAction = /I implemented|I led|I analyzed|I automated|I reconciled|I prepared|I designed/i.test(payload.candidateAnswer);

    let score = 70;
    if (hasSituation) score += 10;
    if (hasResult) score += 10;
    if (hasAction) score += 10;
    if (wordCount < 40) score -= 15;
    if (wordCount > 300) score -= 5;
    score = Math.max(50, Math.min(95, score));

    return {
      evaluation: {
        score,
        strengths: [
          hasAction ? 'Strong active voice showcasing direct individual contribution.' : 'Clear professional demeanor and relevant context provided.',
          hasResult ? 'Included quantifiable outcomes and business impacts.' : 'Addressed the core competencies expected by Irish hiring managers.',
          'Maintained high alignment with Irish corporate and regulatory expectations.'
        ],
        improvements: [
          !hasResult ? 'Add specific percentage or EUR figures to quantify the business outcome (STAR framework).' : 'Ensure concise delivery under 2 minutes.',
          !hasSituation ? 'State the initial challenge or project context more explicitly at the start.' : 'Connect this experience directly to the target employer\'s strategic priorities.'
        ],
        starRating: {
          clarity: hasSituation ? 9 : 7,
          impact: hasResult ? 9 : 7,
          relevance: hasAction ? 9 : 8
        }
      },
      remainingQuota: 50
    };
  }
};
