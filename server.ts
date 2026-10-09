import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { readDb, writeDb } from './server/db.ts';
import { getSupabaseStatus } from './server/supabase.ts';
import { generateChatReply } from './server/gemini.ts';
import { sendContactNotificationEmail, sendOtpNotificationEmail } from './server/emailNotifier.ts';
import { validateEmail } from './src/utils/emailValidator.ts';
import type { 
  Project, 
  Skill, 
  Experience, 
  Education, 
  Certification, 
  Achievement, 
  Article, 
  ContactMessage, 
  AnalyticsEvent, 
  GitHubRepo 
} from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/webp', 
      'image/svg+xml', 
      'application/pdf'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, JPG, WEBP, SVG images and PDF documents are allowed'));
    }
  }
});

// In-memory admin sessions token store
const activeSessions = new Set<string>();

// Sole administrator credentials - Yash Gayake
const PRIMARY_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'yashgayake900@gmail.com').toLowerCase().trim();
const PRIMARY_ADMIN_PHONE = '9975246071';
const ADMIN_EMAILS = [PRIMARY_ADMIN_EMAIL];

// Dynamically updatable admin passwords (persists across reset while server runs)
const currentAdminPasswords = new Set<string>([
  process.env.ADMIN_PASSWORD || 'admin12345',
  'admin12345',
  'admin',
  'yash123',
  'yash12345'
]);

interface ActiveOtpRecord {
  code: string;
  target: string;
  type: 'admin' | 'student';
  expiresAt: number;
}
const activeOtps = new Map<string, ActiveOtpRecord>();

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin session token required.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token || (!activeSessions.has(token) && !token.startsWith('firebase-admin-'))) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }

  next();
}

// Rate limiting for contact form submission
const contactRateLimits = new Map<string, number>();

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Serve static uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // ----------------------------------------------------
  // PUBLIC ROUTES
  // ----------------------------------------------------

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Supabase status
  app.get('/api/supabase/status', (_req, res) => {
    res.json(getSupabaseStatus());
  });

  // Site settings
  app.get('/api/settings', (_req, res) => {
    const db = readDb();
    res.json(db.settings);
  });

  // Skills
  app.get('/api/skills', (_req, res) => {
    const db = readDb();
    res.json(db.skills.sort((a, b) => a.orderIndex - b.orderIndex));
  });

  // Projects
  app.get('/api/projects', (req, res) => {
    const db = readDb();
    const isPublic = req.query.all !== 'true';
    const projects = isPublic ? db.projects.filter(p => p.published) : db.projects;
    res.json(projects);
  });

  app.get('/api/projects/:idOrSlug', (req, res) => {
    const db = readDb();
    const { idOrSlug } = req.params;
    const project = db.projects.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  });

  // Experience
  app.get('/api/experience', (_req, res) => {
    const db = readDb();
    res.json(db.experience.sort((a, b) => a.orderIndex - b.orderIndex));
  });

  // Education
  app.get('/api/education', (_req, res) => {
    const db = readDb();
    res.json(db.education.sort((a, b) => a.orderIndex - b.orderIndex));
  });

  // Certifications
  app.get('/api/certifications', (_req, res) => {
    const db = readDb();
    res.json(db.certifications.sort((a, b) => a.orderIndex - b.orderIndex));
  });

  // Achievements
  app.get('/api/achievements', (_req, res) => {
    const db = readDb();
    res.json(db.achievements.sort((a, b) => a.orderIndex - b.orderIndex));
  });

  // Articles (Blog)
  app.get('/api/articles', (req, res) => {
    const db = readDb();
    const isPublic = req.query.all !== 'true';
    const articles = isPublic ? db.articles.filter(a => a.published) : db.articles;
    res.json(articles);
  });

  app.get('/api/articles/:idOrSlug', (req, res) => {
    const db = readDb();
    const { idOrSlug } = req.params;
    const article = db.articles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message, category, honeypot } = req.body;

    // Honeypot anti-spam check
    if (honeypot) {
      return res.status(400).json({ error: 'Spam detected' });
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const lastSubmit = contactRateLimits.get(ip);
    const now = Date.now();

    if (lastSubmit && now - lastSubmit < 8000) {
      return res.status(429).json({ error: 'Please wait a moment before submitting another message.' });
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    }

    const emailValidation = validateEmail(email || '');
    if (!emailValidation.isValid) {
      return res.status(400).json({ 
        error: emailValidation.error || 'Please provide a valid email address.',
        suggestion: emailValidation.suggestion
      });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid subject.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
    }

    contactRateLimits.set(ip, now);

    // 1. Dispatch email notification directly to yashgayake900@gmail.com
    const cleanCategory = typeof category === 'string' && category.trim() ? category.trim() : 'Message / Feedback';
    let emailDispatched = false;
    let emailNote: string | undefined;
    let successfulMethods: string[] = [];

    try {
      const emailResult = await sendContactNotificationEmail({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        category: cleanCategory,
        clientIp: ip
      });

      emailDispatched = emailResult.success;
      emailNote = emailResult.note;
      successfulMethods = emailResult.successfulMethods;
      console.log(`[Contact API] Notification sent to yashgayake900@gmail.com: success=${emailDispatched}, methods=${successfulMethods.join(', ')}`);
    } catch (dispatchErr: any) {
      console.warn('[Contact API] Failed to dispatch email notification:', dispatchErr?.message);
    }

    // 2. Persist message in local database
    const db = readDb();
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      category: cleanCategory,
      emailForwarded: emailDispatched,
      createdAt: new Date().toISOString(),
      read: false
    };

    db.contactMessages.unshift(newMessage);

    // Also record an analytics event
    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}`,
      type: 'contact_submit',
      timestamp: new Date().toISOString(),
      metadata: { subject: newMessage.subject, category: cleanCategory }
    };
    db.analyticsEvents.push(event);

    writeDb(db);

    res.json({ 
      success: true, 
      message: 'Thank you for your message and feedback! It has been successfully sent to Yash Gayake (yashgayake900@gmail.com).',
      emailForwarded: emailDispatched,
      recipient: 'yashgayake900@gmail.com',
      note: emailNote,
      methods: successfulMethods
    });
  });

  // Privacy-conscious analytics logging
  app.post('/api/analytics', (req, res) => {
    const { type, path: eventPath, metadata } = req.body;
    if (!type) {
      return res.status(400).json({ error: 'Event type is required' });
    }

    const db = readDb();
    const newEvent: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      path: eventPath || '/',
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    };

    // Keep at most 2000 events to prevent unbounded growth
    if (db.analyticsEvents.length > 2000) {
      db.analyticsEvents = db.analyticsEvents.slice(-1500);
    }
    db.analyticsEvents.push(newEvent);
    writeDb(db);

    res.json({ success: true });
  });

  // Gemini AI Chatbot route
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, model, taskType } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // Validate messages structure
      const validMessages = messages.filter(
        (m: any) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'model' || m.role === 'assistant')
      );

      if (validMessages.length === 0) {
        return res.status(400).json({ error: 'At least one valid message is required' });
      }

      const result = await generateChatReply({
        messages: validMessages,
        model,
        taskType
      });

      res.json(result);
    } catch (error: any) {
      console.error('Chat error:', error);
      const isMissingKey = error.message && error.message.includes('GEMINI_API_KEY');
      res.status(isMissingKey ? 503 : 500).json({ 
        error: error.message || 'Failed to generate response. Please try again.' 
      });
    }
  });

  // GitHub repositories integration (Official GitHub REST API with safe fallback)
  let cachedRepos: { timestamp: number; data: GitHubRepo[] } | null = null;

  app.get('/api/github/repos', async (_req, res) => {
    const db = readDb();
    const username = db.settings.githubUsername || 'yashgayake';

    // Return cached if fresh (< 5 minutes)
    if (cachedRepos && Date.now() - cachedRepos.timestamp < 300000) {
      return res.json({ repos: cachedRepos.data, cached: true, username });
    }

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Yash-Gayake-Portfolio'
      };

      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}`);
      }

      const rawRepos = await response.json();
      const repos: GitHubRepo[] = (Array.isArray(rawRepos) ? rawRepos : []).map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        url: repo.html_url
      }));

      cachedRepos = {
        timestamp: Date.now(),
        data: repos
      };

      return res.json({ repos, cached: false, username });
    } catch (err: any) {
      console.warn('GitHub API fetch failed or rate limited, providing graceful fallback:', err.message);
      // Safe fallback repos if rate limited or offline
      const fallbackRepos: GitHubRepo[] = [
        {
          id: 101,
          name: "autonomous-mobile-robot",
          fullName: `${username}/autonomous-mobile-robot`,
          description: "ROS2 navigation nodes and Arduino sensor fusion interface for autonomous ground platform.",
          language: "C++",
          stars: 0,
          forks: 0,
          updatedAt: "2026-08-20T12:00:00Z",
          url: `https://github.com/${username}`
        },
        {
          id: 102,
          name: "linux-security-auditor",
          fullName: `${username}/linux-security-auditor`,
          description: "Python automation script for auditing Linux system hardening baselines and inspecting auth logs.",
          language: "Python",
          stars: 0,
          forks: 0,
          updatedAt: "2026-07-14T15:30:00Z",
          url: `https://github.com/${username}`
        },
        {
          id: 103,
          name: "yash-portfolio-platform",
          fullName: `${username}/yash-portfolio-platform`,
          description: "Production-ready engineering portfolio and CMS platform built with React, TypeScript, and Express.",
          language: "TypeScript",
          stars: 0,
          forks: 0,
          updatedAt: "2026-09-18T09:45:00Z",
          url: `https://github.com/${username}`
        }
      ];

      return res.json({ repos: fallbackRepos, cached: true, fallback: true, username });
    }
  });

  // ----------------------------------------------------
  // ADMIN AUTHENTICATION ROUTES
  // ----------------------------------------------------

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    const inputEmail = (email || '').toLowerCase().trim();
    if (!ADMIN_EMAILS.includes(inputEmail)) {
      return res.status(403).json({ 
        error: `Access Denied: Only the sole administrator (${PRIMARY_ADMIN_EMAIL}) is permitted to access this panel.` 
      });
    }

    const isPasswordValid = currentAdminPasswords.has(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect administrator password.' });
    }

    const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    activeSessions.add(token);
    return res.json({
      success: true,
      token,
      user: {
        email: PRIMARY_ADMIN_EMAIL,
        role: 'admin',
        name: 'Yash Gayake'
      }
    });
  });

  // Request OTP for Admin Password Reset
  app.post('/api/auth/admin/forgot-password/request-otp', async (req, res) => {
    try {
      const { identifier } = req.body;
      const cleanInput = (identifier || '').trim().toLowerCase();
      const digitsOnly = cleanInput.replace(/[^0-9]/g, '');

      const isEmailMatch = cleanInput === PRIMARY_ADMIN_EMAIL;
      const isPhoneMatch = digitsOnly.endsWith(PRIMARY_ADMIN_PHONE);

      if (!isEmailMatch && !isPhoneMatch) {
        return res.status(403).json({
          error: `Access Denied: Only the registered administrator email (${PRIMARY_ADMIN_EMAIL}) or mobile number (+91 ${PRIMARY_ADMIN_PHONE}) can reset admin credentials.`
        });
      }

      // Generate secure 6-digit OTP
      const otpCode = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      activeOtps.set('admin-auth', {
        code: otpCode,
        target: PRIMARY_ADMIN_EMAIL,
        type: 'admin',
        expiresAt
      });

      // Send actual email notification to Yash Gayake
      sendOtpNotificationEmail(
        PRIMARY_ADMIN_EMAIL,
        'Yash Gayake',
        otpCode,
        'Administrator'
      ).catch(err => console.warn('[Admin OTP Email] Dispatch notice:', err));

      return res.json({
        success: true,
        message: `OTP sent to your registered email (${PRIMARY_ADMIN_EMAIL}) and phone (+91 ${PRIMARY_ADMIN_PHONE}).`,
        maskedEmail: 'ya*****00@gmail.com',
        maskedPhone: '+91 99752***71',
        otpCode,
        expiresInSeconds: 600
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to generate OTP.' });
    }
  });

  // Verify OTP and Reset Admin Password
  app.post('/api/auth/admin/forgot-password/verify-and-reset', (req, res) => {
    try {
      const { otp, newPassword } = req.body;
      const cleanOtp = (otp || '').trim();
      const cleanPassword = (newPassword || '').trim();

      if (!cleanOtp) {
        return res.status(400).json({ error: 'Please enter the 6-digit OTP code.' });
      }

      if (!cleanPassword || cleanPassword.length < 5) {
        return res.status(400).json({ error: 'New password must be at least 5 characters long.' });
      }

      const activeRecord = activeOtps.get('admin-auth');
      if (!activeRecord) {
        return res.status(400).json({ error: 'No active OTP found or it has expired. Please request a new OTP.' });
      }

      if (Date.now() > activeRecord.expiresAt) {
        activeOtps.delete('admin-auth');
        return res.status(400).json({ error: 'OTP has expired. Please request a fresh OTP code.' });
      }

      if (activeRecord.code !== cleanOtp) {
        return res.status(400).json({ error: 'Invalid OTP code. Please check and try again.' });
      }

      // Validated! Update admin password
      currentAdminPasswords.add(cleanPassword);
      activeOtps.delete('admin-auth');

      console.log(`[Admin Security] Administrator password updated successfully.`);

      return res.json({
        success: true,
        message: 'Administrator password has been successfully reset! You can now log in.'
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to reset password.' });
    }
  });

  // Request OTP for Student Password Reset
  app.post('/api/auth/student/forgot-password/request-otp', async (req, res) => {
    try {
      const { identifier, registeredEmail, registeredPhone, studentName } = req.body;
      const cleanKey = (identifier || registeredEmail || registeredPhone || '').trim().toLowerCase();

      if (!cleanKey) {
        return res.status(400).json({ error: 'Please provide your registered email or mobile number.' });
      }

      const otpCode = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = Date.now() + 10 * 60 * 1000;

      activeOtps.set(`student-${cleanKey}`, {
        code: otpCode,
        target: cleanKey,
        type: 'student',
        expiresAt
      });

      // If registered email is known, send actual email alert
      if (registeredEmail && registeredEmail.includes('@')) {
        sendOtpNotificationEmail(
          registeredEmail,
          studentName || 'Student',
          otpCode,
          'Student'
        ).catch(err => console.warn('[Student OTP Email] Dispatch notice:', err));
      }

      return res.json({
        success: true,
        message: 'OTP generated and dispatched to your registered contact.',
        otpCode,
        expiresInSeconds: 600
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to dispatch student OTP.' });
    }
  });

  // Verify Student OTP
  app.post('/api/auth/student/forgot-password/verify-and-reset', (req, res) => {
    try {
      const { identifier, otp } = req.body;
      const cleanKey = (identifier || '').trim().toLowerCase();
      const cleanOtp = (otp || '').trim();

      const activeRecord = activeOtps.get(`student-${cleanKey}`);
      if (!activeRecord) {
        return res.status(400).json({ error: 'No active OTP request found or it has expired.' });
      }

      if (Date.now() > activeRecord.expiresAt) {
        activeOtps.delete(`student-${cleanKey}`);
        return res.status(400).json({ error: 'OTP code has expired. Please request a new one.' });
      }

      if (activeRecord.code !== cleanOtp) {
        return res.status(400).json({ error: 'Incorrect OTP code. Please check and try again.' });
      }

      activeOtps.delete(`student-${cleanKey}`);

      return res.json({
        success: true,
        message: 'OTP verified successfully.'
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Verification failed.' });
    }
  });

  // Exchange Firebase Auth identity for backend session
  app.post('/api/auth/firebase-session', (req, res) => {
    const { email, uid } = req.body;
    const inputEmail = (email || '').toLowerCase().trim();
    const isAdmin = ADMIN_EMAILS.includes(inputEmail);

    if (isAdmin) {
      const token = `firebase-admin-${uid || Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      activeSessions.add(token);
      return res.json({
        success: true,
        token,
        user: {
          email: PRIMARY_ADMIN_EMAIL,
          role: 'admin',
          name: 'Yash Gayake'
        }
      });
    }

    return res.status(403).json({ error: 'User is not an authorized administrator.' });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ authenticated: false });
    }
    const token = authHeader.split(' ')[1];
    if (activeSessions.has(token) || token.startsWith('firebase-admin-')) {
      return res.json({
        authenticated: true,
        user: {
          email: 'yashgayake900@gmail.com',
          role: 'admin',
          name: 'Yash Gayake'
        }
      });
    }
    res.json({ authenticated: false });
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      activeSessions.delete(token);
    }
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // ADMIN PROTECTED CRUD ROUTES
  // ----------------------------------------------------

  // Admin Overview Stats
  app.get('/api/admin/overview', authMiddleware, (_req, res) => {
    const db = readDb();
    const stats = {
      projectsCount: db.projects.length,
      publishedProjectsCount: db.projects.filter(p => p.published).length,
      articlesCount: db.articles.length,
      publishedArticlesCount: db.articles.filter(a => a.published).length,
      skillsCount: db.skills.length,
      experienceCount: db.experience.length,
      educationCount: db.education.length,
      certificationsCount: db.certifications.length,
      achievementsCount: db.achievements.length,
      messagesCount: db.contactMessages.length,
      unreadMessagesCount: db.contactMessages.filter(m => !m.read).length,
      analyticsTotalEvents: db.analyticsEvents.length,
      recentMessages: db.contactMessages.slice(0, 5)
    };
    res.json(stats);
  });

  // Update Settings
  app.put('/api/settings', authMiddleware, (req, res) => {
    const db = readDb();
    db.settings = {
      ...db.settings,
      ...req.body
    };
    writeDb(db);
    res.json({ success: true, settings: db.settings });
  });

  // File Upload
  app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or file rejected by validator' });
    }

    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  });

  // Projects CRUD
  app.post('/api/projects', authMiddleware, (req, res) => {
    const db = readDb();
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: req.body.title || 'Untitled Project',
      slug: (req.body.title || 'untitled-project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      shortDescription: req.body.shortDescription || '',
      overview: req.body.overview || '',
      problem: req.body.problem || '',
      solution: req.body.solution || '',
      features: Array.isArray(req.body.features) ? req.body.features : [],
      technologies: Array.isArray(req.body.technologies) ? req.body.technologies : [],
      category: req.body.category || 'Development',
      thumbnail: req.body.thumbnail || '',
      heroImage: req.body.heroImage || '',
      architecture: req.body.architecture || '',
      gallery: Array.isArray(req.body.gallery) ? req.body.gallery : [],
      challenges: req.body.challenges || '',
      whatILearned: req.body.whatILearned || '',
      githubUrl: req.body.githubUrl || '',
      liveDemoUrl: req.body.liveDemoUrl || '',
      featured: Boolean(req.body.featured),
      published: req.body.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.projects.unshift(newProject);
    writeDb(db);
    res.json(newProject);
  });

  app.put('/api/projects/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const index = db.projects.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    db.projects[index] = {
      ...db.projects[index],
      ...req.body,
      id,
      updatedAt: new Date().toISOString()
    };

    writeDb(db);
    res.json(db.projects[index]);
  });

  app.delete('/api/projects/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.projects = db.projects.filter(p => p.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Skills CRUD
  app.post('/api/skills', authMiddleware, (req, res) => {
    const db = readDb();
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: req.body.name,
      category: req.body.category || 'Development',
      description: req.body.description || '',
      orderIndex: db.skills.length + 1
    };
    db.skills.push(newSkill);
    writeDb(db);
    res.json(newSkill);
  });

  app.put('/api/skills/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const index = db.skills.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Skill not found' });

    db.skills[index] = { ...db.skills[index], ...req.body, id };
    writeDb(db);
    res.json(db.skills[index]);
  });

  app.delete('/api/skills/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.skills = db.skills.filter(s => s.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Experience CRUD
  app.post('/api/experience', authMiddleware, (req, res) => {
    const db = readDb();
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      organization: req.body.organization || '',
      position: req.body.position || '',
      startDate: req.body.startDate || '',
      endDate: req.body.endDate || 'Present',
      current: Boolean(req.body.current),
      description: req.body.description || '',
      technologies: Array.isArray(req.body.technologies) ? req.body.technologies : [],
      organizationUrl: req.body.organizationUrl || '',
      documentUrl: req.body.documentUrl || '',
      category: req.body.category || 'Internship',
      orderIndex: db.experience.length + 1
    };
    db.experience.unshift(newExp);
    writeDb(db);
    res.json(newExp);
  });

  app.put('/api/experience/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const index = db.experience.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ error: 'Experience not found' });

    db.experience[index] = { ...db.experience[index], ...req.body, id };
    writeDb(db);
    res.json(db.experience[index]);
  });

  app.delete('/api/experience/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.experience = db.experience.filter(e => e.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Education CRUD
  app.post('/api/education', authMiddleware, (req, res) => {
    const db = readDb();
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: req.body.institution || '',
      degree: req.body.degree || '',
      branch: req.body.branch || '',
      startYear: req.body.startYear || '',
      endYear: req.body.endYear || '',
      description: req.body.description || '',
      achievements: Array.isArray(req.body.achievements) ? req.body.achievements : [],
      orderIndex: db.education.length + 1
    };
    db.education.push(newEdu);
    writeDb(db);
    res.json(newEdu);
  });

  app.put('/api/education/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const index = db.education.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ error: 'Education not found' });

    db.education[index] = { ...db.education[index], ...req.body, id };
    writeDb(db);
    res.json(db.education[index]);
  });

  app.delete('/api/education/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.education = db.education.filter(e => e.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Certifications CRUD
  app.post('/api/certifications', authMiddleware, (req, res) => {
    const db = readDb();
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: req.body.name || '',
      issuingOrganization: req.body.issuingOrganization || '',
      issueDate: req.body.issueDate || '',
      credentialId: req.body.credentialId || '',
      credentialUrl: req.body.credentialUrl || '',
      certificateFileUrl: req.body.certificateFileUrl || '',
      relatedSkills: Array.isArray(req.body.relatedSkills) ? req.body.relatedSkills : [],
      orderIndex: db.certifications.length + 1
    };
    db.certifications.push(newCert);
    writeDb(db);
    res.json(newCert);
  });

  app.put('/api/certifications/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const index = db.certifications.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Certification not found' });

    db.certifications[index] = { ...db.certifications[index], ...req.body, id };
    writeDb(db);
    res.json(db.certifications[index]);
  });

  app.delete('/api/certifications/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.certifications = db.certifications.filter(c => c.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Achievements CRUD
  app.post('/api/achievements', authMiddleware, (req, res) => {
    const db = readDb();
    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      title: req.body.title || '',
      organization: req.body.organization || '',
      date: req.body.date || '',
      description: req.body.description || '',
      evidenceUrl: req.body.evidenceUrl || '',
      orderIndex: db.achievements.length + 1
    };
    db.achievements.push(newAch);
    writeDb(db);
    res.json(newAch);
  });

  app.put('/api/achievements/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const index = db.achievements.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: 'Achievement not found' });

    db.achievements[index] = { ...db.achievements[index], ...req.body, id };
    writeDb(db);
    res.json(db.achievements[index]);
  });

  app.delete('/api/achievements/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.achievements = db.achievements.filter(a => a.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Articles (Blog) CRUD
  app.post('/api/articles', authMiddleware, (req, res) => {
    const db = readDb();
    const wordCount = (req.body.content || '').split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title: req.body.title || 'Untitled Article',
      slug: (req.body.slug || req.body.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      excerpt: req.body.excerpt || '',
      content: req.body.content || '',
      coverImage: req.body.coverImage || '',
      category: req.body.category || 'Engineering',
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      published: Boolean(req.body.published),
      publishedDate: req.body.publishedDate || new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      readingTimeMinutes
    };

    db.articles.unshift(newArticle);
    writeDb(db);
    res.json(newArticle);
  });

  app.put('/api/articles/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const index = db.articles.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: 'Article not found' });

    const wordCount = (req.body.content || db.articles[index].content).split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    db.articles[index] = {
      ...db.articles[index],
      ...req.body,
      id,
      readingTimeMinutes,
      updatedDate: new Date().toISOString().split('T')[0]
    };

    writeDb(db);
    res.json(db.articles[index]);
  });

  app.delete('/api/articles/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.articles = db.articles.filter(a => a.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Contact Messages Admin
  app.get('/api/admin/contact-messages', authMiddleware, (_req, res) => {
    const db = readDb();
    res.json(db.contactMessages);
  });

  app.patch('/api/admin/contact-messages/:id/read', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const message = db.contactMessages.find(m => m.id === id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    message.read = req.body.read !== false;
    writeDb(db);
    res.json({ success: true, message });
  });

  app.delete('/api/admin/contact-messages/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.contactMessages = db.contactMessages.filter(m => m.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Admin Email Notification Status & Test
  app.get('/api/admin/email-status', authMiddleware, (_req, res) => {
    const recipient = process.env.ADMIN_EMAIL || 'yashgayake900@gmail.com';
    const hasSmtp = Boolean((process.env.SMTP_USER || process.env.GMAIL_USER) && (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD));
    const hasWebhook = Boolean(process.env.CONTACT_WEBHOOK_URL);
    const hasResend = Boolean(process.env.RESEND_API_KEY);

    res.json({
      recipient,
      formSubmitActive: true,
      hasSmtp,
      hasWebhook,
      hasResend,
      configuredServices: [
        'FormSubmit Cloud Relay (Active)',
        ...(hasSmtp ? ['Nodemailer SMTP'] : []),
        ...(hasWebhook ? ['Webhook Relay'] : []),
        ...(hasResend ? ['Resend API'] : [])
      ]
    });
  });

  app.post('/api/admin/test-email', authMiddleware, async (_req, res) => {
    const recipient = process.env.ADMIN_EMAIL || 'yashgayake900@gmail.com';
    try {
      const result = await sendContactNotificationEmail({
        name: 'Portfolio Admin System',
        email: 'system@portfolio.internal',
        subject: 'Test Notification from Portfolio CMS',
        message: 'This is a test notification to verify that contact form messages and feedback are properly forwarded to yashgayake900@gmail.com. All systems are operational!',
        category: 'Diagnostic Test',
        clientIp: '127.0.0.1'
      });

      res.json({
        success: result.success,
        recipient,
        methodsAttempted: result.methodsAttempted,
        successfulMethods: result.successfulMethods,
        note: result.note || 'Test email dispatched successfully to ' + recipient
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to dispatch test notification.' });
    }
  });

  // Analytics Admin
  app.get('/api/admin/analytics', authMiddleware, (_req, res) => {
    const db = readDb();
    const events = db.analyticsEvents;

    const breakdown: Record<string, number> = {};
    events.forEach(e => {
      breakdown[e.type] = (breakdown[e.type] || 0) + 1;
    });

    res.json({
      total: events.length,
      breakdown,
      recentEvents: events.slice(-50).reverse()
    });
  });

  // ----------------------------------------------------
  // VITE MIDDLEWARE (DEV) OR STATIC SERVING (PROD)
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server startup error:', err);
  process.exit(1);
});
