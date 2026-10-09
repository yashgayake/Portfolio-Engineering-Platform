import type { 
  SiteSettings, 
  Skill, 
  Project, 
  Experience, 
  Education, 
  Certification, 
  Achievement, 
  Article, 
  ContactMessage, 
  AnalyticsEventType, 
  GitHubRepo,
  PortfolioData
} from '../types.ts';
import { firestoreService } from './firestoreService.ts';

const TOKEN_STORAGE_KEY = 'yash_portfolio_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const errData = await response.json();
      if (errData.error) errorMsg = errData.error;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

// Public & Admin API backed by Firestore & fallback backend
export const api = {
  getSettings: async (): Promise<SiteSettings> => {
    try {
      const fsSettings = await firestoreService.getSettings();
      if (fsSettings && fsSettings.name) return fsSettings;
    } catch {
      // fallback to backend
    }
    return request<SiteSettings>('/api/settings');
  },

  getSkills: async (): Promise<Skill[]> => {
    try {
      const fsSkills = await firestoreService.getSkills();
      if (fsSkills && fsSkills.length > 0) return fsSkills;
    } catch {
      // fallback
    }
    return request<Skill[]>('/api/skills');
  },

  getProjects: async (all = false): Promise<Project[]> => {
    try {
      const fsProjects = await firestoreService.getProjects();
      if (fsProjects && fsProjects.length > 0) {
        return all ? fsProjects : fsProjects.filter(p => p.published !== false);
      }
    } catch {
      // fallback
    }
    return request<Project[]>(`/api/projects${all ? '?all=true' : ''}`);
  },

  getProject: async (idOrSlug: string): Promise<Project> => {
    try {
      const fsProjects = await firestoreService.getProjects();
      const found = fsProjects?.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (found) return found;
    } catch {
      // fallback
    }
    return request<Project>(`/api/projects/${idOrSlug}`);
  },

  getExperience: async (): Promise<Experience[]> => {
    try {
      const fsExp = await firestoreService.getExperience();
      if (fsExp && fsExp.length > 0) return fsExp;
    } catch {
      // fallback
    }
    return request<Experience[]>('/api/experience');
  },

  getEducation: async (): Promise<Education[]> => {
    try {
      const fsEdu = await firestoreService.getEducation();
      if (fsEdu && fsEdu.length > 0) return fsEdu;
    } catch {
      // fallback
    }
    return request<Education[]>('/api/education');
  },

  getCertifications: async (): Promise<Certification[]> => {
    try {
      const fsCerts = await firestoreService.getCertifications();
      if (fsCerts && fsCerts.length > 0) return fsCerts;
    } catch {
      // fallback
    }
    return request<Certification[]>('/api/certifications');
  },

  getAchievements: async (): Promise<Achievement[]> => {
    try {
      const fsAch = await firestoreService.getAchievements();
      if (fsAch && fsAch.length > 0) return fsAch;
    } catch {
      // fallback
    }
    return request<Achievement[]>('/api/achievements');
  },

  getArticles: async (all = false): Promise<Article[]> => {
    try {
      const fsArticles = await firestoreService.getArticles();
      if (fsArticles && fsArticles.length > 0) {
        return all ? fsArticles : fsArticles.filter(a => a.published !== false);
      }
    } catch {
      // fallback
    }
    return request<Article[]>(`/api/articles${all ? '?all=true' : ''}`);
  },

  getArticle: async (idOrSlug: string): Promise<Article> => {
    try {
      const fsArticles = await firestoreService.getArticles();
      const found = fsArticles?.find(a => a.id === idOrSlug || a.slug === idOrSlug);
      if (found) return found;
    } catch {
      // fallback
    }
    return request<Article>(`/api/articles/${idOrSlug}`);
  },
  
  submitContact: async (data: { name: string; email: string; subject: string; message: string; category?: string; honeypot?: string }) => {
    // 1. Submit to Firestore messages collection
    try {
      await firestoreService.submitContactMessage(data);
    } catch (fsErr) {
      console.warn('Firestore direct contact submission error:', fsErr);
    }

    // 2. Also submit to backend route with automatic email dispatch to yashgayake900@gmail.com
    return request<{ 
      success: boolean; 
      message: string; 
      emailForwarded?: boolean; 
      recipient?: string;
      note?: string;
      methods?: string[];
    }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getEmailStatus: () => request<{ recipient: string; formSubmitActive: boolean; hasSmtp: boolean; hasWebhook: boolean; configuredServices: string[] }>('/api/admin/email-status'),

  testEmailNotification: () => request<{ success: boolean; recipient: string; methodsAttempted: string[]; successfulMethods: string[]; note?: string }>('/api/admin/test-email', {
    method: 'POST'
  }),

  trackEvent: (type: AnalyticsEventType, path?: string, metadata?: Record<string, unknown>) => 
    request<{ success: boolean }>('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ type, path: path || window.location.pathname, metadata })
    }).catch(err => {
      console.debug('Analytics error:', err);
    }),

  getGitHubRepos: () => request<{ repos: GitHubRepo[]; cached: boolean; fallback?: boolean; username: string }>('/api/github/repos'),
  getSupabaseStatus: () => request<{ configured: boolean; url: string | null; message: string }>('/api/supabase/status'),

  // Admin Auth
  login: (email: string, password: string) => 
    request<{ success: boolean; token: string; user: { email: string; role: string; name: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  getMe: () => request<{ authenticated: boolean; user?: { email: string; role: string; name: string } }>('/api/auth/me'),
  logout: () => request<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),

  // Admin CRUD Operations with dual Firestore + Backend persistence
  getAdminOverview: () => request<any>('/api/admin/overview'),
  
  updateSettings: async (settings: Partial<SiteSettings>) => {
    try {
      await firestoreService.updateSettings(settings);
    } catch (fsErr) {
      console.warn('Firestore updateSettings:', fsErr);
    }
    return request<{ success: boolean; settings: SiteSettings }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  // Projects
  createProject: async (project: Partial<Project>) => {
    try {
      await firestoreService.saveProject(project);
    } catch (fsErr) {
      console.warn('Firestore createProject:', fsErr);
    }
    return request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
  },

  updateProject: async (id: string, project: Partial<Project>) => {
    try {
      await firestoreService.saveProject({ ...project, id });
    } catch (fsErr) {
      console.warn('Firestore updateProject:', fsErr);
    }
    return request<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project)
    });
  },

  deleteProject: async (id: string) => {
    try {
      await firestoreService.deleteProject(id);
    } catch (fsErr) {
      console.warn('Firestore deleteProject:', fsErr);
    }
    return request<{ success: boolean }>(`/api/projects/${id}`, { method: 'DELETE' });
  },

  // Skills
  createSkill: async (skill: Partial<Skill>) => {
    try {
      await firestoreService.saveSkill(skill);
    } catch (fsErr) {
      console.warn('Firestore createSkill:', fsErr);
    }
    return request<Skill>('/api/skills', {
      method: 'POST',
      body: JSON.stringify(skill)
    });
  },

  updateSkill: async (id: string, skill: Partial<Skill>) => {
    try {
      await firestoreService.saveSkill({ ...skill, id });
    } catch (fsErr) {
      console.warn('Firestore updateSkill:', fsErr);
    }
    return request<Skill>(`/api/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(skill)
    });
  },

  deleteSkill: async (id: string) => {
    try {
      await firestoreService.deleteSkill(id);
    } catch (fsErr) {
      console.warn('Firestore deleteSkill:', fsErr);
    }
    return request<{ success: boolean }>(`/api/skills/${id}`, { method: 'DELETE' });
  },

  // Experience
  createExperience: async (exp: Partial<Experience>) => {
    try {
      await firestoreService.saveExperience(exp);
    } catch (fsErr) {
      console.warn('Firestore createExperience:', fsErr);
    }
    return request<Experience>('/api/experience', {
      method: 'POST',
      body: JSON.stringify(exp)
    });
  },

  updateExperience: async (id: string, exp: Partial<Experience>) => {
    try {
      await firestoreService.saveExperience({ ...exp, id });
    } catch (fsErr) {
      console.warn('Firestore updateExperience:', fsErr);
    }
    return request<Experience>(`/api/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exp)
    });
  },

  deleteExperience: async (id: string) => {
    try {
      await firestoreService.deleteExperience(id);
    } catch (fsErr) {
      console.warn('Firestore deleteExperience:', fsErr);
    }
    return request<{ success: boolean }>(`/api/experience/${id}`, { method: 'DELETE' });
  },

  // Education
  createEducation: async (edu: Partial<Education>) => {
    try {
      await firestoreService.saveEducation(edu);
    } catch (fsErr) {
      console.warn('Firestore createEducation:', fsErr);
    }
    return request<Education>('/api/education', {
      method: 'POST',
      body: JSON.stringify(edu)
    });
  },

  updateEducation: async (id: string, edu: Partial<Education>) => {
    try {
      await firestoreService.saveEducation({ ...edu, id });
    } catch (fsErr) {
      console.warn('Firestore updateEducation:', fsErr);
    }
    return request<Education>(`/api/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(edu)
    });
  },

  deleteEducation: async (id: string) => {
    try {
      await firestoreService.deleteEducation(id);
    } catch (fsErr) {
      console.warn('Firestore deleteEducation:', fsErr);
    }
    return request<{ success: boolean }>(`/api/education/${id}`, { method: 'DELETE' });
  },

  // Certifications
  createCertification: async (cert: Partial<Certification>) => {
    try {
      await firestoreService.saveCertification(cert);
    } catch (fsErr) {
      console.warn('Firestore createCertification:', fsErr);
    }
    return request<Certification>('/api/certifications', {
      method: 'POST',
      body: JSON.stringify(cert)
    });
  },

  updateCertification: async (id: string, cert: Partial<Certification>) => {
    try {
      await firestoreService.saveCertification({ ...cert, id });
    } catch (fsErr) {
      console.warn('Firestore updateCertification:', fsErr);
    }
    return request<Certification>(`/api/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cert)
    });
  },

  deleteCertification: async (id: string) => {
    try {
      await firestoreService.deleteCertification(id);
    } catch (fsErr) {
      console.warn('Firestore deleteCertification:', fsErr);
    }
    return request<{ success: boolean }>(`/api/certifications/${id}`, { method: 'DELETE' });
  },

  // Achievements
  createAchievement: async (ach: Partial<Achievement>) => {
    try {
      await firestoreService.saveAchievement(ach);
    } catch (fsErr) {
      console.warn('Firestore createAchievement:', fsErr);
    }
    return request<Achievement>('/api/achievements', {
      method: 'POST',
      body: JSON.stringify(ach)
    });
  },

  updateAchievement: async (id: string, ach: Partial<Achievement>) => {
    try {
      await firestoreService.saveAchievement({ ...ach, id });
    } catch (fsErr) {
      console.warn('Firestore updateAchievement:', fsErr);
    }
    return request<Achievement>(`/api/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ach)
    });
  },

  deleteAchievement: async (id: string) => {
    try {
      await firestoreService.deleteAchievement(id);
    } catch (fsErr) {
      console.warn('Firestore deleteAchievement:', fsErr);
    }
    return request<{ success: boolean }>(`/api/achievements/${id}`, { method: 'DELETE' });
  },

  // Articles
  createArticle: async (art: Partial<Article>) => {
    try {
      await firestoreService.saveArticle(art);
    } catch (fsErr) {
      console.warn('Firestore createArticle:', fsErr);
    }
    return request<Article>('/api/articles', {
      method: 'POST',
      body: JSON.stringify(art)
    });
  },

  updateArticle: async (id: string, art: Partial<Article>) => {
    try {
      await firestoreService.saveArticle({ ...art, id });
    } catch (fsErr) {
      console.warn('Firestore updateArticle:', fsErr);
    }
    return request<Article>(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(art)
    });
  },

  deleteArticle: async (id: string) => {
    try {
      await firestoreService.deleteArticle(id);
    } catch (fsErr) {
      console.warn('Firestore deleteArticle:', fsErr);
    }
    return request<{ success: boolean }>(`/api/articles/${id}`, { method: 'DELETE' });
  },

  // Firebase Session Sync
  syncFirebaseSession: (email: string, uid: string) => 
    request<{ success: boolean; token: string; user: { email: string; role: string; name: string } }>('/api/auth/firebase-session', {
      method: 'POST',
      body: JSON.stringify({ email, uid })
    }),

  // Messages
  getContactMessages: async (): Promise<ContactMessage[]> => {
    if (!getAdminToken()) {
      return [];
    }
    try {
      const fsMsgs = await firestoreService.getContactMessages();
      if (fsMsgs && fsMsgs.length >= 0) return fsMsgs;
    } catch {
      // fallback to backend
    }
    try {
      return await request<ContactMessage[]>('/api/admin/contact-messages');
    } catch {
      return [];
    }
  },

  getMessages: async (): Promise<ContactMessage[]> => {
    return api.getContactMessages();
  },

  markMessageRead: async (id: string, read = true) => {
    try {
      await firestoreService.markMessageRead(id, read);
    } catch (fsErr) {
      console.warn('Firestore markMessageRead:', fsErr);
    }
    return request<{ success: boolean }>(`/api/admin/contact-messages/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ read })
    });
  },

  updateMessageStatus: async (id: string, read = true) => {
    return api.markMessageRead(id, read);
  },

  deleteMessage: async (id: string) => {
    try {
      await firestoreService.deleteMessage(id);
    } catch (fsErr) {
      console.warn('Firestore deleteMessage:', fsErr);
    }
    return request<{ success: boolean }>(`/api/admin/contact-messages/${id}`, { method: 'DELETE' });
  },

  // Consolidated Portfolio Fetch with Auto-Seeding
  getPortfolio: async (): Promise<PortfolioData> => {
    const [settings, skills, projects, experience, education, certifications, achievements, articles] = await Promise.all([
      api.getSettings(),
      api.getSkills(),
      api.getProjects(true),
      api.getExperience(),
      api.getEducation(),
      api.getCertifications(),
      api.getAchievements(),
      api.getArticles(true)
    ]);

    let messages: ContactMessage[] = [];
    if (getAdminToken()) {
      try {
        messages = await api.getContactMessages();
      } catch {
        // not authenticated as admin
      }
    }

    const portfolio: PortfolioData = {
      settings,
      skills,
      projects,
      experience,
      education,
      certifications,
      achievements,
      articles,
      messages
    };

    // Auto-seed Firestore database if empty
    firestoreService.seedInitialDataIfEmpty(portfolio).catch(err => {
      console.debug('Seeding note:', err);
    });

    return portfolio;
  },

  // Analytics
  getAnalytics: async () => {
    if (!getAdminToken()) {
      return { total: 0, breakdown: {}, recentEvents: [] };
    }
    try {
      return await request<{ total: number; breakdown: Record<string, number>; recentEvents: any[] }>('/api/admin/analytics');
    } catch (err) {
      console.debug('Analytics not accessible:', err);
      return { total: 0, breakdown: {}, recentEvents: [] };
    }
  },

  // File Upload
  uploadFile: async (file: File): Promise<{ success: boolean; url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ success: boolean; url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: formData
    });
  },

  // Gemini AI Chat
  sendChatMessage: async (
    messages: { role: 'user' | 'model' | 'assistant'; content: string }[],
    model?: string,
    taskType?: 'fast' | 'general' | 'complex'
  ): Promise<{ reply: string; modelUsed: string }> => {
    return request<{ reply: string; modelUsed: string }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, model, taskType })
    });
  }
};
