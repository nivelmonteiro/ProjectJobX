import { UserCredential, TailoredResume, ATSAnalysis, TailoredCoverLetter, InterviewPrepSession, JobApplication, ExternalJobListing } from '../types';

export interface UserDataPayload {
  resumes: TailoredResume[];
  coverLetters: TailoredCoverLetter[];
  atsAnalyses: ATSAnalysis[];
  interviewPreps: InterviewPrepSession[];
  jobApplications: JobApplication[];
}

export const apiClient = {
  async getCredentials(): Promise<{ credentials: UserCredential[]; maxAllowed: number; maxDailyPerUser: number }> {
    const res = await fetch('/api/auth/credentials');
    if (!res.ok) throw new Error('Failed to fetch credentials');
    return res.json();
  },

  async getQuota(credentialId: string): Promise<{ remaining: number; maxAllowed: number }> {
    try {
      const res = await fetch(`/api/quota?credentialId=${encodeURIComponent(credentialId)}`);
      if (res.ok) {
        return res.json();
      }
    } catch (e) {
      console.warn('Quota check fallback:', e);
    }
    return { remaining: 4, maxAllowed: 4 };
  },

  async login(credentialId: string, email?: string): Promise<{ credential: UserCredential; remainingQuota: number }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentialId, email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async updateProfile(profileData: Partial<UserCredential>): Promise<{ credential: UserCredential }> {
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async getUserData(credentialId: string): Promise<UserDataPayload> {
    try {
      const res = await fetch(`/api/user/data/${credentialId}`);
      if (res.ok) {
        return res.json();
      }
    } catch (e) {
      console.warn('Network load error, checking local store:', e);
    }
    // LocalStorage fallback
    const local = localStorage.getItem(`eirecareer_data_${credentialId}`);
    return local ? JSON.parse(local) : {
      resumes: [],
      coverLetters: [],
      atsAnalyses: [],
      interviewPreps: [],
      jobApplications: []
    };
  },

  async saveUserData(credentialId: string, data: UserDataPayload): Promise<void> {
    localStorage.setItem(`eirecareer_data_${credentialId}`, JSON.stringify(data));
    try {
      await fetch(`/api/user/data/${credentialId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.warn('Server save sync deferred:', e);
    }
  },

  async getExternalJobs(): Promise<{ jobs: ExternalJobListing[]; source: string }> {
    const res = await fetch('/api/external/jobs');
    if (!res.ok) throw new Error('Failed to fetch external jobs');
    return res.json();
  },

  async parseResumeFile(file: File): Promise<{ text: string; fileName: string; characterCount: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const fileBase64 = e.target?.result as string;
          const res = await fetch('/api/parse-resume-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileBase64,
              fileName: file.name,
              fileType: file.type
            })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to parse uploaded resume');
          }
          resolve(data);
        } catch (err) {
          reject(err);
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
    const res = await fetch('/api/ai/tailor-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate resume');
    }
    return data;
  },

  async checkATS(payload: {
    credentialId: string;
    resumeText: string;
    jobDescription: string;
    jobTitle?: string;
    companyName?: string;
  }): Promise<{ analysis: ATSAnalysis; remainingQuota: number }> {
    const res = await fetch('/api/ai/ats-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to analyze ATS compatibility');
    }
    return data;
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
    const res = await fetch('/api/ai/cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate cover letter');
    }
    return data;
  },

  async prepInterview(payload: {
    credentialId: string;
    jobTitle: string;
    companyName: string;
    jobDescription?: string;
    focusArea?: string;
  }): Promise<{ prepSession: InterviewPrepSession; remainingQuota: number }> {
    const res = await fetch('/api/ai/interview-prep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate interview prep');
    }
    return data;
  },

  async evaluateAnswer(payload: {
    credentialId: string;
    question: string;
    candidateAnswer: string;
    targetRole: string;
  }): Promise<{ evaluation: any; remainingQuota: number }> {
    const res = await fetch('/api/ai/evaluate-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to evaluate answer');
    }
    return data;
  }
};
