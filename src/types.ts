/**
 * Types and interfaces for Yash Gayake's Personal Portfolio Platform
 */

export interface SiteSettings {
  name: string;
  professionalTitle: string;
  bio: string;
  supportingText: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  resumeLastUpdated: string;
  profileImage: string;
  location: string;
  seoTitle: string;
  seoDescription: string;
  githubUsername: string;
  focusedAreas: string[];
  technicalInterests: string[];
}

export type SkillCategory = 
  | 'Programming' 
  | 'Development' 
  | 'Tools' 
  | 'Systems' 
  | 'Automation & Robotics' 
  | 'Cybersecurity';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon?: string;
  description?: string;
  orderIndex: number;
}

export type ProjectCategory = 
  | 'Development' 
  | 'AI/ML' 
  | 'Blockchain' 
  | 'Automation' 
  | 'Robotics' 
  | 'Cybersecurity';

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  technologies: string[];
  category: ProjectCategory;
  thumbnail: string;
  heroImage?: string;
  architecture?: string;
  gallery?: string[];
  challenges?: string;
  whatILearned?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ExperienceCategory = 
  | 'Internship' 
  | 'Competition' 
  | 'Project/Activity' 
  | 'Other';

export interface Experience {
  id: string;
  organization: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  technologies: string[];
  organizationUrl?: string;
  documentUrl?: string;
  category: ExperienceCategory;
  orderIndex: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  branch: string;
  startYear: string;
  endYear: string;
  description: string;
  achievements: string[];
  orderIndex: number;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateFileUrl?: string;
  relatedSkills: string[];
  orderIndex: number;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  evidenceUrl?: string;
  orderIndex: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedDate: string;
  updatedDate: string;
  readingTimeMinutes: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
  emailForwarded?: boolean;
  createdAt: string;
  read: boolean;
}

export type AnalyticsEventType = 
  | 'page_view' 
  | 'project_view' 
  | 'resume_download' 
  | 'github_click' 
  | 'linkedin_click' 
  | 'contact_submit' 
  | 'blog_view';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  path?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface AnalyticsMetrics {
  pageViews?: number;
  projectViews?: number;
  resumeDownloads?: number;
  contactSubmissions?: number;
  externalClicks?: {
    github: number;
    linkedin: number;
  };
  popularProjects?: Array<{ title: string; views: number }>;
  total?: number;
  breakdown?: Record<string, number>;
  recentEvents?: any[];
}

export interface PortfolioData {
  settings: SiteSettings;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  articles: Article[];
  messages: ContactMessage[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
  isFeatured?: boolean;
}

export interface DatabaseData {
  settings: SiteSettings;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  articles: Article[];
  contactMessages: ContactMessage[];
  analyticsEvents: AnalyticsEvent[];
}

// ----------------------------------------------------
// Yash Gayake Academy & Learning Management Types
// ----------------------------------------------------

export interface Lecture {
  id: string;
  title: string;
  durationMinutes: number;
  youtubeVideoId: string; // e.g. "gfDE2a7MKjA" or YouTube full URL/ID
  description?: string;
  notesMarkdown?: string;
  downloadableResourceUrl?: string;
  orderIndex: number;
  freePreview?: boolean;
}

export interface NoteResource {
  id: string;
  title: string;
  description: string;
  category: 'Python' | 'Robotics' | 'Web Dev' | 'Linux & Security' | 'DSA' | 'General';
  price: number; // 0 for free, or currency amount (e.g. 199 INR / $2.99)
  pagesCount: number;
  previewSnippet: string;
  downloadUrl: string;
  tags: string[];
  featured?: boolean;
  downloadsCount: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  instructorName: string;
  instructorTitle: string;
  category: 'Python' | 'Robotics & Automation' | 'Web Development' | 'Linux & DevOps' | 'Cybersecurity' | 'DSA';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number; // 0 = Free, > 0 = Paid (e.g. 499 INR / $9.99)
  originalPrice?: number;
  thumbnail: string;
  youtubePlaylistUrl?: string;
  previewYoutubeVideoId: string; // Demonstration / Intro video ID
  lectures: Lecture[];
  notes: NoteResource[];
  tags: string[];
  featured?: boolean;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  certificateOffered: boolean;
  updatedAt: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  enrolledCourseIds: string[];
  purchasedNoteIds: string[];
  completedLectureIds: Record<string, string[]>; // courseId -> list of completed lectureIds
  certificates: Certificate[];
  joinedDate: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  issuedAt: string;
  verificationCode: string;
  grade?: string;
}

export interface StudentWork {
  id: string;
  studentUid: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  projectUrl?: string;
  repoUrl?: string;
  previewImageUrl?: string;
  submittedAt: string;
  status: 'submitted' | 'reviewed' | 'approved';
  instructorFeedback?: string;
  grade?: string;
}


