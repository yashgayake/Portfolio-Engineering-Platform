import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  writeBatch 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase.ts';
import type { 
  SiteSettings, 
  Project, 
  Skill, 
  Experience, 
  Education, 
  Certification, 
  Achievement, 
  Article, 
  ContactMessage, 
  PortfolioData,
  Course,
  NoteResource,
  StudentUser,
  Certificate,
  StudentWork
} from '../types.ts';

export const firestoreService = {
  // --- Settings ---
  getSettings: async (): Promise<SiteSettings | null> => {
    const path = 'settings/global';
    try {
      const snap = await getDoc(doc(db, 'settings', 'global'));
      if (snap.exists()) {
        return snap.data() as SiteSettings;
      }
      return null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  },

  updateSettings: async (data: Partial<SiteSettings>): Promise<void> => {
    const path = 'settings/global';
    try {
      await setDoc(doc(db, 'settings', 'global'), data, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  // --- Projects ---
  getProjects: async (): Promise<Project[]> => {
    const path = 'projects';
    try {
      const snap = await getDocs(collection(db, 'projects'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveProject: async (project: Partial<Project> & { id?: string }): Promise<string> => {
    const projectId = project.id || `proj_${Date.now()}`;
    const path = `projects/${projectId}`;
    try {
      await setDoc(doc(db, 'projects', projectId), { ...project, id: projectId }, { merge: true });
      return projectId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    const path = `projects/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- Skills ---
  getSkills: async (): Promise<Skill[]> => {
    const path = 'skills';
    try {
      const snap = await getDocs(collection(db, 'skills'));
      const skills = snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
      return skills.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveSkill: async (skill: Partial<Skill> & { id?: string }): Promise<string> => {
    const skillId = skill.id || `skill_${Date.now()}`;
    const path = `skills/${skillId}`;
    try {
      await setDoc(doc(db, 'skills', skillId), { ...skill, id: skillId }, { merge: true });
      return skillId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  deleteSkill: async (id: string): Promise<void> => {
    const path = `skills/${id}`;
    try {
      await deleteDoc(doc(db, 'skills', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- Experience ---
  getExperience: async (): Promise<Experience[]> => {
    const path = 'experience';
    try {
      const snap = await getDocs(collection(db, 'experience'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Experience));
      return list.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveExperience: async (exp: Partial<Experience> & { id?: string }): Promise<string> => {
    const expId = exp.id || `exp_${Date.now()}`;
    const path = `experience/${expId}`;
    try {
      await setDoc(doc(db, 'experience', expId), { ...exp, id: expId }, { merge: true });
      return expId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  deleteExperience: async (id: string): Promise<void> => {
    const path = `experience/${id}`;
    try {
      await deleteDoc(doc(db, 'experience', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- Education ---
  getEducation: async (): Promise<Education[]> => {
    const path = 'education';
    try {
      const snap = await getDocs(collection(db, 'education'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Education));
      return list.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveEducation: async (edu: Partial<Education> & { id?: string }): Promise<string> => {
    const eduId = edu.id || `edu_${Date.now()}`;
    const path = `education/${eduId}`;
    try {
      await setDoc(doc(db, 'education', eduId), { ...edu, id: eduId }, { merge: true });
      return eduId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  deleteEducation: async (id: string): Promise<void> => {
    const path = `education/${id}`;
    try {
      await deleteDoc(doc(db, 'education', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- Certifications ---
  getCertifications: async (): Promise<Certification[]> => {
    const path = 'certifications';
    try {
      const snap = await getDocs(collection(db, 'certifications'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certification));
      return list.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveCertification: async (cert: Partial<Certification> & { id?: string }): Promise<string> => {
    const certId = cert.id || `cert_${Date.now()}`;
    const path = `certifications/${certId}`;
    try {
      await setDoc(doc(db, 'certifications', certId), { ...cert, id: certId }, { merge: true });
      return certId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  deleteCertification: async (id: string): Promise<void> => {
    const path = `certifications/${id}`;
    try {
      await deleteDoc(doc(db, 'certifications', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- Achievements ---
  getAchievements: async (): Promise<Achievement[]> => {
    const path = 'achievements';
    try {
      const snap = await getDocs(collection(db, 'achievements'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Achievement));
      return list.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveAchievement: async (ach: Partial<Achievement> & { id?: string }): Promise<string> => {
    const achId = ach.id || `ach_${Date.now()}`;
    const path = `achievements/${achId}`;
    try {
      await setDoc(doc(db, 'achievements', achId), { ...ach, id: achId }, { merge: true });
      return achId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  deleteAchievement: async (id: string): Promise<void> => {
    const path = `achievements/${id}`;
    try {
      await deleteDoc(doc(db, 'achievements', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- Articles ---
  getArticles: async (): Promise<Article[]> => {
    const path = 'articles';
    try {
      const snap = await getDocs(collection(db, 'articles'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Article));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveArticle: async (art: Partial<Article> & { id?: string }): Promise<string> => {
    const artId = art.id || `art_${Date.now()}`;
    const path = `articles/${artId}`;
    try {
      await setDoc(doc(db, 'articles', artId), { ...art, id: artId }, { merge: true });
      return artId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  deleteArticle: async (id: string): Promise<void> => {
    const path = `articles/${id}`;
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- Contact Messages ---
  submitContactMessage: async (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'> & { senderUid?: string }): Promise<string> => {
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const path = `messages/${msgId}`;
    try {
      const record: ContactMessage = {
        id: msgId,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        createdAt: new Date().toISOString(),
        read: false
      };
      await setDoc(doc(db, 'messages', msgId), record);
      return msgId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  getContactMessages: async (): Promise<ContactMessage[]> => {
    // Only attempt to read messages from Firestore if user is authenticated
    if (!auth.currentUser) {
      return [];
    }
    const path = 'messages';
    try {
      const snap = await getDocs(collection(db, 'messages'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err: any) {
      if (err?.code === 'permission-denied' || err?.message?.includes('insufficient permissions')) {
        return [];
      }
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  markMessageRead: async (id: string, read = true): Promise<void> => {
    const path = `messages/${id}`;
    try {
      await updateDoc(doc(db, 'messages', id), { read });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  deleteMessage: async (id: string): Promise<void> => {
    const path = `messages/${id}`;
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- Seed Database if Empty ---
  seedInitialDataIfEmpty: async (initial: PortfolioData): Promise<boolean> => {
    try {
      const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
      if (settingsSnap.exists()) {
        return false; // already seeded
      }

      console.log('Seeding portfolio data to Firestore database...');
      const batch = writeBatch(db);

      // Seed settings
      batch.set(doc(db, 'settings', 'global'), initial.settings);

      // Seed skills
      initial.skills.forEach(s => {
        batch.set(doc(db, 'skills', s.id), s);
      });

      // Seed projects
      initial.projects.forEach(p => {
        batch.set(doc(db, 'projects', p.id), p);
      });

      // Seed experience
      initial.experience.forEach(e => {
        batch.set(doc(db, 'experience', e.id), e);
      });

      // Seed education
      initial.education.forEach(ed => {
        batch.set(doc(db, 'education', ed.id), ed);
      });

      // Seed certifications
      initial.certifications.forEach(c => {
        batch.set(doc(db, 'certifications', c.id), c);
      });

      // Seed achievements
      initial.achievements.forEach(a => {
        batch.set(doc(db, 'achievements', a.id), a);
      });

      // Seed articles
      initial.articles.forEach(art => {
        batch.set(doc(db, 'articles', art.id), art);
      });

      await batch.commit();
      console.log('Firestore database seeded successfully.');
      return true;
    } catch (error) {
      console.warn('Initial seeding encountered check/write limit:', error);
      return false;
    }
  },

  // --- ACADEMY: Courses ---
  getCourses: async (): Promise<Course[]> => {
    const path = 'courses';
    try {
      const snap = await getDocs(collection(db, 'courses'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveCourse: async (course: Partial<Course> & { id?: string }): Promise<string> => {
    const courseId = course.id || `course_${Date.now()}`;
    const path = `courses/${courseId}`;
    try {
      await setDoc(doc(db, 'courses', courseId), { ...course, id: courseId }, { merge: true });
      return courseId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  deleteCourse: async (id: string): Promise<void> => {
    const path = `courses/${id}`;
    try {
      await deleteDoc(doc(db, 'courses', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  seedInitialCoursesIfEmpty: async (initialCourses: Course[]): Promise<boolean> => {
    try {
      const snap = await getDocs(collection(db, 'courses'));
      if (!snap.empty) {
        return false;
      }
      console.log('Seeding initial academy courses to Firestore...');
      const batch = writeBatch(db);
      initialCourses.forEach(c => {
        batch.set(doc(db, 'courses', c.id), c);
      });
      await batch.commit();
      return true;
    } catch (error) {
      console.warn('Course initial seeding caught error:', error);
      return false;
    }
  },

  // --- ACADEMY: Lecture Notes & Resources ---
  getNotes: async (): Promise<NoteResource[]> => {
    const path = 'notes';
    try {
      const snap = await getDocs(collection(db, 'notes'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as NoteResource));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveNote: async (note: Partial<NoteResource> & { id?: string }): Promise<string> => {
    const noteId = note.id || `note_${Date.now()}`;
    const path = `notes/${noteId}`;
    try {
      await setDoc(doc(db, 'notes', noteId), { ...note, id: noteId }, { merge: true });
      return noteId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  deleteNote: async (id: string): Promise<void> => {
    const path = `notes/${id}`;
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- ACADEMY: Student Profiles & Persistence ---
  getStudentProfile: async (uid: string): Promise<StudentUser | null> => {
    const path = `students/${uid}`;
    try {
      const snap = await getDoc(doc(db, 'students', uid));
      if (snap.exists()) {
        return snap.data() as StudentUser;
      }
      return null;
    } catch {
      return null;
    }
  },

  getStudentProfileByEmail: async (email: string): Promise<StudentUser | null> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const q = query(collection(db, 'students'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as StudentUser;
      }
      return null;
    } catch {
      return null;
    }
  },

  saveStudentProfile: async (student: StudentUser): Promise<void> => {
    const path = `students/${student.id}`;
    try {
      await setDoc(doc(db, 'students', student.id), student, { merge: true });
    } catch (err) {
      console.debug('Firestore student save notice:', err);
    }
  },

  // --- ACADEMY: Certificates ---
  getStudentCertificates: async (studentUid: string): Promise<Certificate[]> => {
    const path = 'student_certificates';
    try {
      const q = query(collection(db, 'student_certificates'), where('studentEmail', '!=', ''));
      const snap = await getDocs(q);
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate));
      return all.filter(c => c.studentEmail.toLowerCase() === studentUid.toLowerCase() || c.id === studentUid);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveStudentCertificate: async (cert: Certificate): Promise<string> => {
    const certId = cert.id || `cert_${Date.now()}`;
    const path = `student_certificates/${certId}`;
    try {
      await setDoc(doc(db, 'student_certificates', certId), { ...cert, id: certId }, { merge: true });
      return certId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  verifyCertificate: async (verificationCode: string): Promise<Certificate | null> => {
    const path = 'student_certificates';
    try {
      const snap = await getDocs(collection(db, 'student_certificates'));
      const match = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as Certificate))
        .find(c => c.verificationCode.toLowerCase() === verificationCode.trim().toLowerCase());
      return match || null;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  // --- ACADEMY: Student Works & Portfolio Submissions ---
  getStudentWorks: async (studentEmailOrUid: string): Promise<StudentWork[]> => {
    const path = 'student_works';
    try {
      const snap = await getDocs(collection(db, 'student_works'));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentWork));
      return all.filter(w => 
        w.studentUid === studentEmailOrUid || 
        w.studentEmail.toLowerCase() === studentEmailOrUid.toLowerCase()
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  getAllStudentWorks: async (): Promise<StudentWork[]> => {
    const path = 'student_works';
    try {
      const snap = await getDocs(collection(db, 'student_works'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentWork));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  saveStudentWork: async (work: Partial<StudentWork> & { id?: string }): Promise<string> => {
    const workId = work.id || `work_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const path = `student_works/${workId}`;
    try {
      await setDoc(doc(db, 'student_works', workId), { 
        ...work, 
        id: workId, 
        submittedAt: work.submittedAt || new Date().toISOString(),
        status: work.status || 'submitted'
      }, { merge: true });
      return workId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  updateStudentWorkFeedback: async (workId: string, feedback: string, grade?: string, status: 'submitted' | 'reviewed' | 'approved' = 'reviewed'): Promise<void> => {
    const path = `student_works/${workId}`;
    try {
      await updateDoc(doc(db, 'student_works', workId), {
        instructorFeedback: feedback,
        grade: grade || '',
        status
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
};
