import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  User, 
  FolderGit2, 
  Wrench, 
  Briefcase, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Mail, 
  Settings, 
  LogOut, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Upload, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  Star, 
  AlertCircle,
  Clock,
  ExternalLink,
  Tag,
  Youtube,
  DollarSign,
  MessageSquare,
  Github,
  Sparkles,
  CheckCircle,
  Send
} from 'lucide-react';
import type { 
  PortfolioData, 
  Project, 
  Skill, 
  Experience, 
  Education, 
  Certification, 
  Article, 
  ContactMessage, 
  SiteSettings,
  AnalyticsMetrics,
  ProjectCategory,
  SkillCategory,
  ExperienceCategory,
  Course,
  StudentWork
} from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../Toast.tsx';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onDataRefresh: () => void;
}

type TabType = 
  | 'analytics' 
  | 'profile' 
  | 'projects' 
  | 'skills' 
  | 'experience' 
  | 'education' 
  | 'certifications' 
  | 'blog' 
  | 'academy'
  | 'messages' 
  | 'settings';

export function AdminDashboard({ isOpen, onClose, data, onDataRefresh }: AdminDashboardProps) {
  const { logout, user } = useAuth();
  const { success, error: toastError } = useToast();
  const { courses, updateCourse, deleteCourse, allWorks, reviewStudentWork, addCourse } = useStudentAuth();

  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Academy management state
  const [academySubTab, setAcademySubTab] = useState<'courses' | 'works'>('courses');
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    category: 'Robotics & Automation',
    tagline: '',
    description: '',
    level: 'Beginner',
    price: 0,
    originalPrice: 999,
    previewYoutubeVideoId: 'gfDE2a7MKjA',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    lectures: [
      {
        id: 'lec-1',
        title: 'Introduction & Setup',
        durationMinutes: 15,
        youtubeVideoId: 'gfDE2a7MKjA',
        description: 'Environment and architecture setup.',
        orderIndex: 1,
        freePreview: true
      }
    ],
    notes: [],
    tags: ['Robotics', 'Python'],
    studentsCount: 1,
    rating: 4.9,
    reviewsCount: 1,
    certificateOffered: true,
    updatedAt: new Date().toISOString()
  });

  const [selectedWorkForReview, setSelectedWorkForReview] = useState<StudentWork | null>(null);
  const [reviewGrade, setReviewGrade] = useState('Distinction (100%)');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'submitted' | 'reviewed' | 'approved'>('approved');

  // Active editor states
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(data.settings);
  const [messages, setMessages] = useState<ContactMessage[]>(data.messages || []);

  // Modals for add/edit items
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<Experience> | null>(null);
  const [editingEducation, setEditingEducation] = useState<Partial<Education> | null>(null);
  const [editingCertification, setEditingCertification] = useState<Partial<Certification> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMetrics();
      loadMessages();
      setSettingsForm(data.settings);
    }
  }, [isOpen, data]);

  const loadMetrics = async () => {
    try {
      const res = await api.getAnalytics();
      if (res) {
        setMetrics(res);
      } else {
        setMetrics({ total: 0, breakdown: {}, recentEvents: [] });
      }
    } catch {
      setMetrics({ total: 0, breakdown: {}, recentEvents: [] });
    }
  };

  const loadMessages = async () => {
    try {
      const res = await api.getMessages();
      if (res && Array.isArray(res)) {
        setMessages(res);
      }
    } catch {
      // graceful fallback
    }
  };

  if (!isOpen) return null;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateSettings(settingsForm);
      success('Settings updated successfully');
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File, target: 'profile' | 'resume' | 'project' | 'cert') => {
    try {
      const res = await api.uploadFile(file);
      if (target === 'profile') {
        setSettingsForm(prev => ({ ...prev, profileImage: res.url }));
        success('Profile image uploaded');
      } else if (target === 'resume') {
        setSettingsForm(prev => ({ ...prev, resumeUrl: res.url, resumeLastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }));
        success('Resume PDF uploaded');
      } else if (target === 'project' && editingProject) {
        setEditingProject(prev => ({ ...prev, thumbnail: res.url, heroImage: res.url }));
        success('Project image uploaded');
      } else if (target === 'cert' && editingCertification) {
        setEditingCertification(prev => ({ ...prev, certificateFileUrl: res.url }));
        success('Certificate file uploaded');
      }
    } catch (err: any) {
      toastError(err.message || 'Upload failed');
    }
  };

  // CRUD Handlers for Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;
    setIsSaving(true);
    try {
      const payload: any = {
        ...editingProject,
        slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        technologies: Array.isArray(editingProject.technologies) 
          ? editingProject.technologies 
          : typeof editingProject.technologies === 'string'
            ? (editingProject.technologies as string).split(',').map(s => s.trim()).filter(Boolean)
            : ['TypeScript']
      };

      if (editingProject.id) {
        await api.updateProject(editingProject.id, payload);
        success('Project updated');
      } else {
        await api.createProject(payload);
        success('Project published');
      }
      setEditingProject(null);
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      success('Project removed');
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete');
    }
  };

  // CRUD Handlers for Skills
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.name) return;
    try {
      if (editingSkill.id) {
        await api.updateSkill(editingSkill.id, editingSkill);
        success('Skill updated');
      } else {
        await api.createSkill(editingSkill);
        success('Skill added');
      }
      setEditingSkill(null);
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to save skill');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await api.deleteSkill(id);
      success('Skill deleted');
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete skill');
    }
  };

  // CRUD Handlers for Experience
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience?.organization || !editingExperience?.position) return;
    try {
      const payload: any = {
        ...editingExperience,
        technologies: Array.isArray(editingExperience.technologies)
          ? editingExperience.technologies
          : typeof editingExperience.technologies === 'string'
            ? (editingExperience.technologies as string).split(',').map(s => s.trim()).filter(Boolean)
            : []
      };
      if (editingExperience.id) {
        await api.updateExperience(editingExperience.id, payload);
        success('Experience updated');
      } else {
        await api.createExperience(payload);
        success('Experience entry created');
      }
      setEditingExperience(null);
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to save experience');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Delete this experience entry?')) return;
    try {
      await api.deleteExperience(id);
      success('Experience removed');
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete');
    }
  };

  // CRUD Handlers for Education
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEducation?.institution || !editingEducation?.degree) return;
    try {
      const payload: any = {
        ...editingEducation,
        achievements: Array.isArray(editingEducation.achievements)
          ? editingEducation.achievements
          : typeof editingEducation.achievements === 'string'
            ? (editingEducation.achievements as string).split('\n').map(s => s.trim()).filter(Boolean)
            : []
      };
      if (editingEducation.id) {
        await api.updateEducation(editingEducation.id, payload);
        success('Education updated');
      } else {
        await api.createEducation(payload);
        success('Education entry added');
      }
      setEditingEducation(null);
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to save education');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Delete education item?')) return;
    try {
      await api.deleteEducation(id);
      success('Education entry removed');
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete');
    }
  };

  // CRUD Handlers for Certification
  const handleSaveCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCertification?.name) return;
    try {
      const payload: any = {
        ...editingCertification,
        relatedSkills: Array.isArray(editingCertification.relatedSkills)
          ? editingCertification.relatedSkills
          : typeof editingCertification.relatedSkills === 'string'
            ? (editingCertification.relatedSkills as string).split(',').map(s => s.trim()).filter(Boolean)
            : []
      };
      if (editingCertification.id) {
        await api.updateCertification(editingCertification.id, payload);
        success('Certification updated');
      } else {
        await api.createCertification(payload);
        success('Certification added');
      }
      setEditingCertification(null);
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to save certification');
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await api.deleteCertification(id);
      success('Certification removed');
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete');
    }
  };

  // CRUD Handlers for Blog Article
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle?.content) return;
    try {
      const payload: any = {
        ...editingArticle,
        slug: editingArticle.slug || editingArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tags: Array.isArray(editingArticle.tags)
          ? editingArticle.tags
          : typeof editingArticle.tags === 'string'
            ? (editingArticle.tags as string).split(',').map(s => s.trim()).filter(Boolean)
            : ['Engineering'],
        publishedDate: editingArticle.publishedDate || new Date().toISOString().split('T')[0],
        readingTimeMinutes: editingArticle.readingTimeMinutes || Math.max(1, Math.ceil((editingArticle.content || '').split(/\s+/).length / 200))
      };

      if (editingArticle.id) {
        await api.updateArticle(editingArticle.id, payload);
        success('Article updated');
      } else {
        await api.createArticle(payload);
        success('Article created');
      }
      setEditingArticle(null);
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to save article');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await api.deleteArticle(id);
      success('Article removed');
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete');
    }
  };

  // Message Actions
  const handleMarkMessageRead = async (id: string, read: boolean) => {
    try {
      await api.updateMessageStatus(id, read);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read } : m));
      success(`Message marked as ${read ? 'read' : 'unread'}`);
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to update message');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this contact message?')) return;
    try {
      await api.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      success('Message deleted');
      onDataRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete message');
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 backdrop-blur-md overflow-hidden">
      <div 
        className="w-full h-full sm:h-[95vh] sm:w-[96vw] max-w-7xl bg-neutral-900 border border-neutral-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-neutral-100">
                  Yash Gayake CMS & Admin Control
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  FIRESTORE PERSISTENCE: CONNECTED
                </span>
                {user?.email && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {user.email} ({user.role?.toUpperCase()})
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Full-stack content management, telemetry analytics & live Firebase Firestore database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              title="Log Out"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 text-xs font-mono border border-neutral-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Exit Admin</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Body with Sidebar Tabs */}
        <div className="flex flex-1 overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-56 shrink-0 border-r border-neutral-800 bg-neutral-950/50 p-3 overflow-y-auto space-y-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>About & Profile</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4" />
                <span>Projects ({data.projects.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'skills'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4" />
                <span>Skills ({data.skills.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'experience'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Experience ({data.experience.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'education'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4" />
                <span>Education ({data.education.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('certifications')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'certifications'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4" />
                <span>Certifications ({data.certifications.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'blog'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Blog ({data.articles.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('academy')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'academy'
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Youtube className="w-4 h-4 text-rose-400" />
                <span>Courses & Pricing ({courses.length})</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-500/20 text-rose-300 font-bold uppercase">
                YOUTUBE
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Inbox</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-full bg-cyan-500 text-neutral-950 font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Resume & System</span>
              </div>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-neutral-900/60">
            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="space-y-6 max-w-5xl">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100">
                    Analytics & Telemetry Foundation
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Privacy-friendly visitor interactions, resume downloads & conversions
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <span className="text-[11px] font-mono uppercase text-neutral-400">Total Page Views</span>
                    <p className="text-2xl font-extrabold text-neutral-100 mt-1">
                      {metrics?.pageViews || 0}
                    </p>
                    <span className="text-[10px] font-mono text-cyan-400">Real-time session tracker</span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <span className="text-[11px] font-mono uppercase text-neutral-400">Project Deep Dives</span>
                    <p className="text-2xl font-extrabold text-neutral-100 mt-1">
                      {metrics?.projectViews || 0}
                    </p>
                    <span className="text-[10px] font-mono text-cyan-400">Project modal views</span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <span className="text-[11px] font-mono uppercase text-neutral-400">Resume Downloads</span>
                    <p className="text-2xl font-extrabold text-neutral-100 mt-1">
                      {metrics?.resumeDownloads || 0}
                    </p>
                    <span className="text-[10px] font-mono text-emerald-400">PDF conversion rate</span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <span className="text-[11px] font-mono uppercase text-neutral-400">Contact Messages</span>
                    <p className="text-2xl font-extrabold text-neutral-100 mt-1">
                      {metrics?.contactSubmissions || messages.length}
                    </p>
                    <span className="text-[10px] font-mono text-amber-300">Inbound inquiries</span>
                  </div>
                </div>

                {/* Popular Projects & External clicks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="p-5 rounded-xl bg-neutral-950/40 border border-neutral-800">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold mb-3">
                      Most Viewed Projects
                    </h4>
                    <div className="space-y-2">
                      {metrics?.popularProjects && metrics.popularProjects.length > 0 ? (
                        metrics.popularProjects.map((p: { title: string; views: number }, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 text-xs">
                            <span className="text-neutral-200 font-medium truncate">{p.title}</span>
                            <span className="font-mono text-cyan-400 font-bold">{p.views} views</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-neutral-500">Live views will register as visitors browse project details.</p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-neutral-950/40 border border-neutral-800">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold mb-3">
                      External Referrals & Social
                    </h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900">
                        <span className="text-neutral-300">GitHub Profile Clicks</span>
                        <span className="font-mono text-cyan-400 font-bold">{metrics?.externalClicks?.github || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900">
                        <span className="text-neutral-300">LinkedIn Profile Clicks</span>
                        <span className="font-mono text-cyan-400 font-bold">{metrics?.externalClicks?.linkedin || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE / ABOUT CMS TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100">
                    Profile & About Configuration
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Editable identity, biography, and professional direction
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={settingsForm.name}
                      onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={settingsForm.professionalTitle}
                      onChange={e => setSettingsForm({ ...settingsForm, professionalTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">Hero Supporting Text</label>
                  <input
                    type="text"
                    value={settingsForm.supportingText}
                    onChange={e => setSettingsForm({ ...settingsForm, supportingText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">About Bio Narrative</label>
                  <textarea
                    rows={4}
                    value={settingsForm.bio}
                    onChange={e => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">Geographic Location</label>
                    <input
                      type="text"
                      value={settingsForm.location}
                      onChange={e => setSettingsForm({ ...settingsForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                    />
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-3">
                  <span className="text-xs font-mono uppercase text-neutral-300 block">Profile Image</span>
                  <div className="flex items-center gap-4">
                    {settingsForm.profileImage ? (
                      <img
                        src={settingsForm.profileImage}
                        alt="Profile"
                        className="w-16 h-16 rounded-xl object-cover border border-neutral-700"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-neutral-500 font-mono">
                        None
                      </div>
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 border border-neutral-800 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload Profile Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profile')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold"
                  >
                    {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* PROJECTS CMS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100">
                      Projects Management
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      Add, update architectures, set problem/solution pairs, and toggle featured status
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingProject({
                      title: '',
                      category: 'Development',
                      featured: false,
                      technologies: ['TypeScript', 'React'],
                      features: ['Custom system engine'],
                      shortDescription: '',
                      overview: '',
                      problem: '',
                      solution: '',
                      architecture: ''
                    })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                {/* Project List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects.map(proj => (
                    <div
                      key={proj.id}
                      className="p-5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-900 text-cyan-400 border border-neutral-800 font-semibold">
                            {proj.category}
                          </span>
                          {proj.featured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              Featured
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-neutral-100 mb-1">{proj.title}</h4>
                        <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{proj.shortDescription}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80">
                        <span className="text-[11px] font-mono text-neutral-500">
                          {proj.technologies.slice(0, 3).join(', ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingProject(proj)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                            title="Edit project"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-neutral-800"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit/Add Project Modal */}
                {editingProject && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md">
                    <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <h4 className="text-sm font-bold text-neutral-100">
                          {editingProject.id ? 'Edit Engineering Project' : 'Publish New Project'}
                        </h4>
                        <button onClick={() => setEditingProject(null)} className="text-neutral-400 hover:text-neutral-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Title *</label>
                            <input
                              type="text"
                              required
                              value={editingProject.title || ''}
                              onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Category</label>
                            <select
                              value={editingProject.category || 'Development'}
                              onChange={e => setEditingProject({ ...editingProject, category: e.target.value as ProjectCategory })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            >
                              {['Development', 'AI/ML', 'Blockchain', 'Automation', 'Robotics', 'Cybersecurity'].map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Short Description</label>
                          <input
                            type="text"
                            value={editingProject.shortDescription || ''}
                            onChange={e => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Problem Statement</label>
                            <textarea
                              rows={2}
                              value={editingProject.problem || ''}
                              onChange={e => setEditingProject({ ...editingProject, problem: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Engineered Solution</label>
                            <textarea
                              rows={2}
                              value={editingProject.solution || ''}
                              onChange={e => setEditingProject({ ...editingProject, solution: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Architecture Description</label>
                          <input
                            type="text"
                            value={editingProject.architecture || ''}
                            onChange={e => setEditingProject({ ...editingProject, architecture: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Technologies (comma separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : editingProject.technologies || ''}
                            onChange={e => setEditingProject({ ...editingProject, technologies: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">GitHub Repo URL</label>
                            <input
                              type="url"
                              value={editingProject.githubUrl || ''}
                              onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Live Demo URL</label>
                            <input
                              type="url"
                              value={editingProject.liveDemoUrl || ''}
                              onChange={e => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>
                        </div>

                        {/* Image file upload */}
                        <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                          <span className="font-mono text-neutral-400">Project Thumbnail / Diagram</span>
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-mono text-[11px] border border-neutral-800">
                            <Upload className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'project')}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="proj-featured"
                            checked={Boolean(editingProject.featured)}
                            onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })}
                            className="rounded border-neutral-800 bg-neutral-950 text-cyan-500"
                          />
                          <label htmlFor="proj-featured" className="text-neutral-300 font-medium">
                            Mark as Featured Project on Home Grid
                          </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                          <button
                            type="button"
                            onClick={() => setEditingProject(null)}
                            className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-2 rounded-lg bg-cyan-500 text-neutral-950 font-semibold"
                          >
                            Save Project
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SKILLS CMS TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100">
                      Skills & Technical Competencies
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      Categorized discipline catalog. Strictly free from fake proficiency metrics.
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingSkill({ name: '', category: 'Programming' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.skills.map(skill => (
                    <div
                      key={skill.id}
                      className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 block uppercase">
                          {skill.category}
                        </span>
                        <span className="text-xs font-bold text-neutral-200">
                          {skill.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingSkill(skill)}
                          className="p-1 text-neutral-400 hover:text-neutral-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skill Modal */}
                {editingSkill && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
                      <h4 className="text-sm font-bold text-neutral-100">
                        {editingSkill.id ? 'Edit Skill' : 'Add Technical Skill'}
                      </h4>
                      <form onSubmit={handleSaveSkill} className="space-y-3 text-xs">
                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Skill Name *</label>
                          <input
                            type="text"
                            required
                            value={editingSkill.name || ''}
                            onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Category</label>
                          <select
                            value={editingSkill.category || 'Programming'}
                            onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value as SkillCategory })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          >
                            {['Programming', 'Development', 'Tools', 'Systems', 'Automation & Robotics', 'Cybersecurity'].map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setEditingSkill(null)}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-neutral-950 font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EXPERIENCE CMS TAB */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100">
                      Experience & Activity Logs
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      Internships, robotics competitions, engineering project teams
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingExperience({
                      organization: '',
                      position: '',
                      category: 'Internship',
                      startDate: '',
                      endDate: '',
                      current: false,
                      description: '',
                      technologies: []
                    })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {data.experience.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-900 text-cyan-400 border border-neutral-800 font-semibold">
                            {item.category}
                          </span>
                          <span className="font-bold text-neutral-200">{item.position}</span>
                          <span className="text-neutral-500">at {item.organization}</span>
                        </div>
                        <p className="text-neutral-400 max-w-xl">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingExperience(item)}
                          className="p-1 text-neutral-400 hover:text-neutral-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(item.id)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experience Modal */}
                {editingExperience && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-neutral-100">
                        {editingExperience.id ? 'Edit Experience' : 'Add Experience Entry'}
                      </h4>
                      <form onSubmit={handleSaveExperience} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Organization *</label>
                            <input
                              type="text"
                              required
                              value={editingExperience.organization || ''}
                              onChange={e => setEditingExperience({ ...editingExperience, organization: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Position / Role *</label>
                            <input
                              type="text"
                              required
                              value={editingExperience.position || ''}
                              onChange={e => setEditingExperience({ ...editingExperience, position: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Category</label>
                            <select
                              value={editingExperience.category || 'Internship'}
                              onChange={e => setEditingExperience({ ...editingExperience, category: e.target.value as ExperienceCategory })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            >
                              {['Internship', 'Competition', 'Project/Activity', 'Other'].map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Duration (e.g. 2024 - 2025)</label>
                            <input
                              type="text"
                              value={editingExperience.startDate || ''}
                              onChange={e => setEditingExperience({ ...editingExperience, startDate: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={editingExperience.description || ''}
                            onChange={e => setEditingExperience({ ...editingExperience, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setEditingExperience(null)}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-neutral-950 font-semibold"
                          >
                            Save Experience
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EDUCATION CMS TAB */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100">
                      Education Records
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      Curriculum, degree program, and academic milestones
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingEducation({
                      institution: '',
                      degree: '',
                      branch: 'Automation & Robotics',
                      startYear: '2023',
                      endYear: '2027',
                      description: '',
                      achievements: []
                    })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {data.education.map(edu => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-start justify-between gap-4 text-xs"
                    >
                      <div>
                        <span className="font-bold text-neutral-100">{edu.degree}</span>
                        <p className="text-cyan-400 font-medium">{edu.institution} ({edu.startYear} - {edu.endYear})</p>
                        <p className="text-neutral-400 mt-1">{edu.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setEditingEducation(edu)} className="p-1 text-neutral-400 hover:text-neutral-200">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteEducation(edu.id)} className="p-1 text-rose-400 hover:text-rose-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Education Modal */}
                {editingEducation && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-neutral-100">
                        {editingEducation.id ? 'Edit Education' : 'Add Education Record'}
                      </h4>
                      <form onSubmit={handleSaveEducation} className="space-y-3">
                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Institution *</label>
                          <input
                            type="text"
                            required
                            value={editingEducation.institution || ''}
                            onChange={e => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Degree *</label>
                          <input
                            type="text"
                            required
                            value={editingEducation.degree || ''}
                            onChange={e => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Branch</label>
                            <input
                              type="text"
                              value={editingEducation.branch || ''}
                              onChange={e => setEditingEducation({ ...editingEducation, branch: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Years (e.g. 2023 - 2027)</label>
                            <input
                              type="text"
                              value={`${editingEducation.startYear || '2023'} - ${editingEducation.endYear || '2027'}`}
                              onChange={e => {
                                const parts = e.target.value.split('-');
                                setEditingEducation({ 
                                  ...editingEducation, 
                                  startYear: parts[0]?.trim() || '', 
                                  endYear: parts[1]?.trim() || '' 
                                });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Coursework Description</label>
                          <textarea
                            rows={3}
                            value={editingEducation.description || ''}
                            onChange={e => setEditingEducation({ ...editingEducation, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setEditingEducation(null)}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-neutral-950 font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CERTIFICATIONS CMS TAB */}
            {activeTab === 'certifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100">
                      Certifications & Credentials
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      Verified credentials, issuers, and direct PDF evidence
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingCertification({
                      name: '',
                      issuingOrganization: '',
                      issueDate: '2025',
                      credentialId: '',
                      credentialUrl: '',
                      relatedSkills: []
                    })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Certification</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {data.certifications.map(cert => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-start justify-between gap-4 text-xs"
                    >
                      <div>
                        <span className="font-bold text-neutral-100">{cert.name}</span>
                        <p className="text-cyan-400 font-medium">{cert.issuingOrganization} • {cert.issueDate}</p>
                        {cert.credentialId && (
                          <p className="text-neutral-500 font-mono text-[11px]">ID: {cert.credentialId}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setEditingCertification(cert)} className="p-1 text-neutral-400 hover:text-neutral-200">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCertification(cert.id)} className="p-1 text-rose-400 hover:text-rose-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cert Modal */}
                {editingCertification && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-neutral-100">
                        {editingCertification.id ? 'Edit Credential' : 'Add Certification Record'}
                      </h4>
                      <form onSubmit={handleSaveCertification} className="space-y-3">
                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Certification Name *</label>
                          <input
                            type="text"
                            required
                            value={editingCertification.name || ''}
                            onChange={e => setEditingCertification({ ...editingCertification, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Issuing Organization</label>
                            <input
                              type="text"
                              value={editingCertification.issuingOrganization || ''}
                              onChange={e => setEditingCertification({ ...editingCertification, issuingOrganization: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Issue Date</label>
                            <input
                              type="text"
                              value={editingCertification.issueDate || ''}
                              onChange={e => setEditingCertification({ ...editingCertification, issueDate: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Credential URL</label>
                          <input
                            type="url"
                            value={editingCertification.credentialUrl || ''}
                            onChange={e => setEditingCertification({ ...editingCertification, credentialUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setEditingCertification(null)}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-neutral-950 font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BLOG CMS TAB */}
            {activeTab === 'blog' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100">
                      Technical Blog CMS
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      Markdown writeups, architecture notes, and publishing controls
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingArticle({
                      title: '',
                      excerpt: '',
                      content: '# Article Title\n\nWrite technical content in Markdown here...',
                      category: 'Robotics',
                      tags: ['Robotics', 'Firmware'],
                      published: true,
                      publishedDate: new Date().toISOString().split('T')[0],
                      readingTimeMinutes: 5
                    })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Write Article</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {data.articles.map(article => (
                    <div
                      key={article.id}
                      className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-start justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-900 text-cyan-400 border border-neutral-800 font-semibold">
                            {article.category}
                          </span>
                          <span className="font-bold text-neutral-100">{article.title}</span>
                        </div>
                        <p className="text-neutral-400 line-clamp-2 max-w-xl">{article.excerpt}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setEditingArticle(article)} className="p-1 text-neutral-400 hover:text-neutral-200">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteArticle(article.id)} className="p-1 text-rose-400 hover:text-rose-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Article Editor Modal */}
                {editingArticle && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md">
                    <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <h4 className="text-sm font-bold text-neutral-100">
                          {editingArticle.id ? 'Edit Technical Article' : 'Draft New Technical Article'}
                        </h4>
                        <button onClick={() => setEditingArticle(null)} className="text-neutral-400 hover:text-neutral-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveArticle} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Title *</label>
                            <input
                              type="text"
                              required
                              value={editingArticle.title || ''}
                              onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-neutral-300 mb-1">Category</label>
                            <input
                              type="text"
                              value={editingArticle.category || 'Engineering'}
                              onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Excerpt / Summary</label>
                          <textarea
                            rows={2}
                            value={editingArticle.excerpt || ''}
                            onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-neutral-300 mb-1">Markdown Body *</label>
                          <textarea
                            rows={10}
                            required
                            value={editingArticle.content || ''}
                            onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 font-mono"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                          <button
                            type="button"
                            onClick={() => setEditingArticle(null)}
                            className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-cyan-500 text-neutral-950 font-semibold"
                          >
                            Publish Article
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES INBOX TAB */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <span>Contact &amp; Feedback Inbox</span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      Forwarding automatically to: <span className="text-cyan-400 font-semibold">yashgayake900@gmail.com</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await api.testEmailNotification();
                        if (res.success) {
                          success(res.note || 'Test alert sent to yashgayake900@gmail.com!');
                        } else {
                          toastError(res.note || 'Could not complete test email dispatch.');
                        }
                      } catch (err: any) {
                        toastError(err.message || 'Failed to trigger test email.');
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Alert to Gmail</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        msg.read
                          ? 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400'
                          : 'bg-neutral-950 border-cyan-500/40 text-neutral-200 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          {!msg.read && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                          )}
                          <span className="font-bold text-neutral-100">{msg.name}</span>
                          <span className="text-neutral-500 font-mono">({msg.email})</span>
                          {msg.category && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-800/40 text-cyan-300">
                              {msg.category}
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-neutral-300">{msg.subject}</p>
                        <p className="text-neutral-400 line-clamp-1">{msg.message}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        <span className="text-[11px] font-mono text-neutral-500">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleMarkMessageRead(msg.id, !msg.read);
                          }}
                          className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono"
                        >
                          {msg.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteMessage(msg.id);
                          }}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {messages.length === 0 && (
                    <div className="p-8 rounded-xl bg-neutral-950/40 border border-neutral-800 text-center text-xs text-neutral-500">
                      No contact messages received yet.
                    </div>
                  )}
                </div>

                {/* Message Detail Modal */}
                {selectedMessage && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-neutral-100">
                            {selectedMessage.subject}
                          </h4>
                          {selectedMessage.category && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                              {selectedMessage.category}
                            </span>
                          )}
                        </div>
                        <button onClick={() => setSelectedMessage(null)} className="text-neutral-400 hover:text-neutral-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between text-neutral-400 font-mono gap-1">
                          <span>From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;</span>
                          <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-neutral-800">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-semibold transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply via Gmail</span>
                          </a>

                          <button
                            onClick={() => {
                              handleMarkMessageRead(selectedMessage.id, !selectedMessage.read);
                              setSelectedMessage(prev => prev ? { ...prev, read: !prev.read } : null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 font-mono"
                          >
                            {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                          </button>
                        </div>

                        <button
                          onClick={() => setSelectedMessage(null)}
                          className="px-4 py-1.5 rounded-lg bg-cyan-500 text-neutral-950 font-semibold"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS CMS TAB */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100">
                    Resume Document & Integration Settings
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Direct resume upload, official GitHub API integration, and metadata
                  </p>
                </div>

                {/* Resume Upload Box */}
                <div className="p-5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-200 font-semibold">
                        Curriculum Vitae (PDF)
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Current file: {settingsForm.resumeUrl || 'None uploaded yet'}
                      </p>
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New PDF</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'resume')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-mono text-neutral-400 mb-1">Resume Document URL</label>
                      <input
                        type="text"
                        value={settingsForm.resumeUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, resumeUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-neutral-400 mb-1">Last Updated Stamp</label>
                      <input
                        type="text"
                        value={settingsForm.resumeLastUpdated || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, resumeLastUpdated: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Social & Integrations */}
                <div className="p-5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-200 font-semibold">
                    Social Channels & External Links
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-mono text-neutral-400 mb-1">GitHub Profile URL</label>
                      <input
                        type="url"
                        value={settingsForm.githubUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-neutral-400 mb-1">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={settingsForm.linkedinUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold"
                  >
                    Save All Settings
                  </button>
                </div>
              </form>
            )}

            {/* ACADEMY & COURSES PRICING CMS TAB */}
            {activeTab === 'academy' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-rose-500" />
                      <span>Academy, Course Curriculum & Student Works</span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      Manage course pricing (₹ INR), update YouTube links, and review student practical submissions in Firestore.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddCourseModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Course</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        window.location.hash = '#academy';
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500/15 via-cyan-500/15 to-rose-500/15 hover:from-rose-500/25 hover:to-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                      <span>Open Student Portal</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tab navigation */}
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                  <button
                    onClick={() => setAcademySubTab('courses')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                      academySubTab === 'courses'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Courses & Pricing ({courses.length})</span>
                  </button>

                  <button
                    onClick={() => setAcademySubTab('works')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                      academySubTab === 'works'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                    }`}
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Student Works Submissions ({allWorks.length})</span>
                  </button>
                </div>

                {/* SUBTAB 1: COURSES MANAGEMENT */}
                {academySubTab === 'courses' && (
                  <div className="space-y-4">
                    {courses.map(course => (
                      <div
                        key={course.id}
                        className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                                {course.category}
                              </span>
                              <span className="text-[10px] font-mono text-neutral-400">
                                {course.lectures.length} Lectures • {course.level}
                              </span>
                              {course.price === 0 ? (
                                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 font-bold">
                                  FREE
                                </span>
                              ) : (
                                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-amber-500/15 text-amber-400 font-bold">
                                  ₹{course.price}
                                </span>
                              )}
                            </div>
                            <h4 className="text-base font-bold text-neutral-100">{course.title}</h4>
                            <p className="text-xs text-neutral-400">{course.tagline}</p>
                          </div>

                          <button
                            onClick={() => {
                              if (confirm(`Delete course "${course.title}"?`)) {
                                deleteCourse(course.id);
                                success('Course deleted');
                              }
                            }}
                            className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors shrink-0"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Course Configuration Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-900 text-xs font-mono">
                          <div>
                            <label className="block text-neutral-400 mb-1 text-[11px] uppercase">
                              Course Price (₹ INR, 0 for Free)
                            </label>
                            <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-800">
                              <span className="text-neutral-400">₹</span>
                              <input
                                type="number"
                                defaultValue={course.price}
                                onBlur={e => {
                                  const newPrice = Number(e.target.value);
                                  if (newPrice !== course.price) {
                                    updateCourse({ ...course, price: newPrice });
                                    success(`Price for "${course.title}" set to ₹${newPrice}`);
                                  }
                                }}
                                className="w-full bg-transparent text-neutral-100 font-mono text-xs focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-neutral-400 mb-1 text-[11px] uppercase">
                              Original Strikethrough Price (₹)
                            </label>
                            <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-800">
                              <span className="text-neutral-400">₹</span>
                              <input
                                type="number"
                                defaultValue={course.originalPrice || 999}
                                onBlur={e => {
                                  const newOrig = Number(e.target.value);
                                  updateCourse({ ...course, originalPrice: newOrig });
                                  success('Original price updated');
                                }}
                                className="w-full bg-transparent text-neutral-100 font-mono text-xs focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-neutral-400 mb-1 text-[11px] uppercase">
                              Demo YouTube Video ID
                            </label>
                            <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-800">
                              <Youtube className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <input
                                type="text"
                                defaultValue={course.previewYoutubeVideoId}
                                placeholder="e.g. gfDE2a7MKjA"
                                onBlur={e => {
                                  const newId = e.target.value.trim();
                                  if (newId && newId !== course.previewYoutubeVideoId) {
                                    updateCourse({ ...course, previewYoutubeVideoId: newId });
                                    success('YouTube demo video ID updated');
                                  }
                                }}
                                className="w-full bg-transparent text-neutral-100 font-mono text-xs focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* YouTube video preview banner */}
                        <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Youtube className="w-4 h-4 text-rose-400" />
                            <span>
                              Preview embed:{' '}
                              <span className="text-neutral-200">
                                youtube.com/watch?v={course.previewYoutubeVideoId}
                              </span>
                            </span>
                          </div>
                          <span className="text-[11px] text-cyan-400">
                            Auto-saved to Firestore
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SUBTAB 2: STUDENT WORKS & ASSIGNMENTS REVIEW */}
                {academySubTab === 'works' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center gap-3">
                      <FolderGit2 className="w-5 h-5 shrink-0 text-cyan-400" />
                      <span>
                        Student practical submissions are synced in real-time with Firestore. You can grade projects and write feedback that students will see immediately in their portal.
                      </span>
                    </div>

                    {allWorks.length > 0 ? (
                      <div className="space-y-4">
                        {allWorks.map(work => (
                          <div
                            key={work.id}
                            className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-sm"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                                    {work.courseTitle}
                                  </span>
                                  <span className="text-[10px] font-mono text-neutral-400">
                                    Student: <span className="text-neutral-200 font-bold">{work.studentName}</span> ({work.studentEmail})
                                  </span>
                                </div>
                                <h4 className="text-base font-bold text-neutral-100 mt-1">{work.title}</h4>
                                <p className="text-xs text-neutral-300 mt-1">{work.description}</p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {work.status === 'approved' && (
                                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>APPROVED</span>
                                  </span>
                                )}
                                {work.status === 'reviewed' && (
                                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span>REVIEWED</span>
                                  </span>
                                )}
                                {work.status === 'submitted' && (
                                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700 font-bold flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>PENDING REVIEW</span>
                                  </span>
                                )}

                                <button
                                  onClick={() => {
                                    setSelectedWorkForReview(work);
                                    setReviewGrade(work.grade || 'Distinction (100%)');
                                    setReviewFeedback(work.instructorFeedback || 'Outstanding implementation! Clean architecture and verified working hardware/software prototype.');
                                    setReviewStatus((work.status === 'approved' ? 'approved' : 'reviewed') as any);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-colors"
                                >
                                  Review & Grade
                                </button>
                              </div>
                            </div>

                            {/* Project Links & Feedback Preview */}
                            <div className="pt-3 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                              <div className="flex items-center gap-3">
                                {work.repoUrl && (
                                  <a
                                    href={work.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-neutral-300 hover:text-cyan-400"
                                  >
                                    <Github className="w-3.5 h-3.5" />
                                    <span>Repository</span>
                                  </a>
                                )}
                                {work.projectUrl && (
                                  <a
                                    href={work.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-cyan-400 hover:underline"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Live URL</span>
                                  </a>
                                )}
                              </div>

                              {work.instructorFeedback && (
                                <div className="text-[11px] text-neutral-400 italic">
                                  Grade: <span className="text-amber-400 font-bold">{work.grade}</span> • "{work.instructorFeedback}"
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                        <FolderGit2 className="w-8 h-8 text-neutral-500 mx-auto" />
                        <h4 className="text-sm font-bold text-neutral-200">No student submissions yet</h4>
                        <p className="text-xs font-mono text-neutral-400">
                          When students submit their projects from the Student Portal, they will appear here in real-time.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Add New Course Modal */}
                {isAddCourseModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 w-full max-w-lg space-y-4 text-xs font-mono shadow-2xl">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-sm font-bold text-neutral-100">Add New Engineering Course</h4>
                        </div>
                        <button
                          onClick={() => setIsAddCourseModalOpen(false)}
                          className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!newCourse.title?.trim()) return;

                          const courseToAdd: Course = {
                            id: `course-${Date.now().toString(36)}`,
                            title: newCourse.title.trim(),
                            slug: newCourse.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                            tagline: newCourse.tagline?.trim() || 'Comprehensive hands-on engineering masterclass',
                            description: newCourse.description?.trim() || 'Learn practical robotics, automation, and full-stack development with hands-on labs.',
                            instructorName: 'Yash Gayake',
                            instructorTitle: 'Robotics & Full-Stack Systems Engineer',
                            category: (newCourse.category as any) || 'Robotics & Automation',
                            level: (newCourse.level as any) || 'Beginner',
                            price: Number(newCourse.price) || 0,
                            originalPrice: Number(newCourse.originalPrice) || 999,
                            thumbnail: newCourse.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
                            previewYoutubeVideoId: newCourse.previewYoutubeVideoId || 'gfDE2a7MKjA',
                            lectures: [
                              {
                                id: 'lec-1',
                                title: '01: Introduction & Architecture Setup',
                                durationMinutes: 18,
                                youtubeVideoId: newCourse.previewYoutubeVideoId || 'gfDE2a7MKjA',
                                description: 'Overview of system design, hardware pinouts, and code workspace.',
                                orderIndex: 1,
                                freePreview: true
                              },
                              {
                                id: 'lec-2',
                                title: '02: Sensor Integration & Logic Implementation',
                                durationMinutes: 24,
                                youtubeVideoId: 'gfDE2a7MKjA',
                                description: 'Connecting sensors, calibrating readings, and writing control algorithms.',
                                orderIndex: 2,
                                freePreview: false
                              }
                            ],
                            notes: [],
                            tags: ['Robotics', 'Python', 'Engineering'],
                            studentsCount: 1,
                            rating: 4.9,
                            reviewsCount: 1,
                            certificateOffered: true,
                            updatedAt: new Date().toISOString()
                          };

                          await addCourse(courseToAdd);
                          success(`Course "${courseToAdd.title}" created successfully!`);
                          setIsAddCourseModalOpen(false);
                          setNewCourse({
                            title: '',
                            price: 0,
                            originalPrice: 999,
                            previewYoutubeVideoId: 'gfDE2a7MKjA'
                          });
                        }}
                        className="space-y-3"
                      >
                        <div>
                          <label className="block text-neutral-300 mb-1 font-semibold">Course Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Autonomous Mobile Robotics with ROS 2"
                            value={newCourse.title || ''}
                            onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 mb-1 font-semibold">Tagline *</label>
                          <input
                            type="text"
                            placeholder="e.g. Master SLAM navigation, LIDAR sensor fusion, and ROS 2"
                            value={newCourse.tagline || ''}
                            onChange={e => setNewCourse({ ...newCourse, tagline: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-neutral-300 mb-1 font-semibold">Price (₹, 0=Free)</label>
                            <input
                              type="number"
                              value={newCourse.price ?? 0}
                              onChange={e => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                          <div>
                            <label className="block text-neutral-300 mb-1 font-semibold">Demo YouTube Video ID</label>
                            <input
                              type="text"
                              placeholder="e.g. gfDE2a7MKjA"
                              value={newCourse.previewYoutubeVideoId || ''}
                              onChange={e => setNewCourse({ ...newCourse, previewYoutubeVideoId: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-neutral-300 mb-1 font-semibold">Category</label>
                          <select
                            value={newCourse.category || 'Robotics & Hardware'}
                            onChange={e => setNewCourse({ ...newCourse, category: e.target.value as any })}
                            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500"
                          >
                            <option value="Robotics & Hardware">Robotics & Hardware</option>
                            <option value="Python Automation">Python Automation</option>
                            <option value="Web & Cloud Development">Web & Cloud Development</option>
                            <option value="AI & Machine Learning">AI & Machine Learning</option>
                          </select>
                        </div>

                        <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-800">
                          <button
                            type="button"
                            onClick={() => setIsAddCourseModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-neutral-400 hover:text-neutral-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold"
                          >
                            Publish Course to Firestore
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Review Student Work Modal */}
                {selectedWorkForReview && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 w-full max-w-lg space-y-4 text-xs font-mono shadow-2xl">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <h4 className="text-sm font-bold text-neutral-100">Review Student Submission</h4>
                        </div>
                        <button
                          onClick={() => setSelectedWorkForReview(null)}
                          className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                        <p className="text-neutral-200 font-bold">{selectedWorkForReview.title}</p>
                        <p className="text-[11px] text-cyan-400">{selectedWorkForReview.courseTitle}</p>
                        <p className="text-neutral-400 text-[11px]">By {selectedWorkForReview.studentName} ({selectedWorkForReview.studentEmail})</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-neutral-300 mb-1 font-semibold">Award Grade</label>
                          <select
                            value={reviewGrade}
                            onChange={e => setReviewGrade(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500"
                          >
                            <option value="Distinction (100%)">Distinction (100%)</option>
                            <option value="Grade A+ (95%)">Grade A+ (95%)</option>
                            <option value="Grade A (90%)">Grade A (90%)</option>
                            <option value="Grade B+ (85%)">Grade B+ (85%)</option>
                            <option value="Satisfactory (80%)">Satisfactory (80%)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-neutral-300 mb-1 font-semibold">Review Status</label>
                          <select
                            value={reviewStatus}
                            onChange={e => setReviewStatus(e.target.value as any)}
                            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500"
                          >
                            <option value="approved">Approved</option>
                            <option value="reviewed">Reviewed (Needs Minor Polish)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-neutral-300 mb-1 font-semibold">
                            Instructor Feedback (Yash Gayake) *
                          </label>
                          <textarea
                            rows={3}
                            value={reviewFeedback}
                            onChange={e => setReviewFeedback(e.target.value)}
                            placeholder="Write constructive evaluation and praise for student's work..."
                            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500 resize-none"
                          />
                        </div>

                        <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-800">
                          <button
                            type="button"
                            onClick={() => setSelectedWorkForReview(null)}
                            className="px-4 py-2 rounded-xl text-neutral-400 hover:text-neutral-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await reviewStudentWork(
                                selectedWorkForReview.id,
                                reviewFeedback.trim(),
                                reviewGrade,
                                reviewStatus
                              );
                              success(`Work for ${selectedWorkForReview.studentName} updated in Firestore!`);
                              setSelectedWorkForReview(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold"
                          >
                            Save Review to Database
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
