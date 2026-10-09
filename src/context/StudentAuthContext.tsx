import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile,
  signOut as fbSignOut
} from 'firebase/auth';
import type { StudentUser, Certificate, Course, NoteResource, StudentWork } from '../types.ts';
import { INITIAL_COURSES, ALL_NOTES_STORE } from '../data/academyData.ts';
import { firestoreService } from '../lib/firestoreService.ts';
import { auth, googleProvider } from '../lib/firebase.ts';
import { validateEmail } from '../utils/emailValidator.ts';

interface StudentCredential {
  email: string;
  name: string;
  phone?: string;
  passwordHash: string;
  studentId: string;
  createdAt: string;
}

interface StudentAuthContextType {
  student: StudentUser | null;
  isAuthenticated: boolean;
  courses: Course[];
  notesStore: NoteResource[];
  studentWorks: StudentWork[];
  allWorks: StudentWork[];
  isLoadingData: boolean;
  loginStudent: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (name: string, email: string, password?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  requestStudentPasswordResetOtp: (identifier: string) => Promise<{ success: boolean; message: string; maskedContact: string; otpCode?: string; registeredEmail?: string }>;
  verifyStudentOtpAndResetPassword: (identifier: string, otp: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logoutStudent: () => void;
  enrollInCourse: (courseId: string) => Promise<{ success: boolean; message?: string }>;
  purchaseNotes: (noteId: string) => Promise<{ success: boolean; message?: string }>;
  toggleLectureCompletion: (courseId: string, lectureId: string) => void;
  isLectureCompleted: (courseId: string, lectureId: string) => boolean;
  getCourseProgress: (courseId: string) => { completedCount: number; totalCount: number; percentage: number; isComplete: boolean };
  generateCertificate: (courseId: string, courseTitle: string) => Promise<Certificate | null>;
  updateCourse: (course: Course) => Promise<void>;
  addCourse: (course: Course) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  submitStudentWork: (data: { courseId: string; courseTitle: string; title: string; description: string; projectUrl?: string; repoUrl?: string; previewImageUrl?: string }) => Promise<StudentWork | null>;
  reviewStudentWork: (workId: string, feedback: string, grade?: string, status?: 'submitted' | 'reviewed' | 'approved') => Promise<void>;
  refreshAcademyData: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'yash_academy_student';
const COURSES_STORAGE_KEY = 'yash_academy_courses';
const CREDENTIALS_STORAGE_KEY = 'yash_academy_student_credentials';

async function hashStudentPassword(password: string): Promise<string> {
  const enc = new TextEncoder().encode(`yash_academy_salt_#2026_${password.trim()}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getStoredCredentials(): Record<string, StudentCredential> {
  try {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredCredential(cred: StudentCredential) {
  try {
    const existing = getStoredCredentials();
    existing[cred.email.toLowerCase()] = cred;
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to save student credential:', e);
  }
}

export function StudentAuthProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [notesStore, setNotesStore] = useState<NoteResource[]>(ALL_NOTES_STORE);
  const [studentWorks, setStudentWorks] = useState<StudentWork[]>([]);
  const [allWorks, setAllWorks] = useState<StudentWork[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Default student state is null: visitors must sign up or log in to create their profile
  const [student, setStudent] = useState<StudentUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Wipe out any stale or demo Alex/Guest sessions
        if (
          parsed &&
          parsed.email &&
          !parsed.email.includes('alex') &&
          !parsed.email.includes('guest.learner') &&
          parsed.id !== 'student-demo-01'
        ) {
          return parsed;
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn('Failed to load student state', e);
    }
    return null;
  });

  // Load courses and initial seed from Firestore on mount
  const refreshAcademyData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      // 1. Fetch courses from Firestore
      const dbCourses = await firestoreService.getCourses();
      if (dbCourses && dbCourses.length > 0) {
        setCourses(dbCourses);
      } else {
        // Seed initial courses if empty in database
        await firestoreService.seedInitialCoursesIfEmpty(INITIAL_COURSES);
        setCourses(INITIAL_COURSES);
      }

      // 2. Fetch notes from Firestore
      const dbNotes = await firestoreService.getNotes();
      if (dbNotes && dbNotes.length > 0) {
        setNotesStore(dbNotes);
      }

      // 3. Fetch all works for admin
      const worksList = await firestoreService.getAllStudentWorks();
      if (worksList) {
        setAllWorks(worksList);
      }

      // 4. If student is logged in, fetch their specific works
      if (student?.email) {
        const myWorks = await firestoreService.getStudentWorks(student.email);
        if (myWorks) {
          setStudentWorks(myWorks);
        }
      }
    } catch (err) {
      console.warn('Could not complete full Firestore sync (using local state):', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [student?.email]);

  useEffect(() => {
    refreshAcademyData();
  }, [refreshAcademyData]);

  // Save student to localStorage and Firestore when updated
  useEffect(() => {
    if (student) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(student));
      // Asynchronously sync to Firestore students collection
      firestoreService.saveStudentProfile(student).catch(e => {
        console.debug('Background student profile sync notice:', e);
      });
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [student]);

  const loginStudent = async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const emailValidation = validateEmail(cleanEmail);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error || 'Please enter a valid email address (e.g. yourname@gmail.com).');
    }

    if (!cleanPassword) {
      throw new Error('Please enter your account password.');
    }

    const credentials = getStoredCredentials();
    const localCred = credentials[cleanEmail];

    let fbSucceeded = false;
    let fbUid = '';

    // Attempt Firebase Auth sign-in
    try {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      fbSucceeded = true;
      fbUid = userCred.user.uid;
    } catch (fbErr: any) {
      if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
        throw new Error('Incorrect password. Please verify your password and try again.');
      } else if (fbErr.code === 'auth/user-not-found') {
        if (!localCred) {
          throw new Error('No student account found with this email. Please check your email or create an account first.');
        }
      } else if (fbErr.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please wait a moment and try again.');
      }
      // If operation-not-allowed or offline, verify against the secure credential vault
    }

    // If Firebase Auth did not complete or was disabled, verify strictly against stored hash
    if (!fbSucceeded) {
      if (!localCred) {
        throw new Error('No student account found with this email. Please check your email or click "Create Account" first.');
      }
      const inputHash = await hashStudentPassword(cleanPassword);
      if (localCred.passwordHash !== inputHash) {
        throw new Error('Incorrect password. Please verify your password and try again.');
      }
    }

    // Credentials strictly matched! Load student profile
    const studentId = fbUid || localCred?.studentId || `student-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '-')}`;
    let existingProfile = await firestoreService.getStudentProfile(studentId);
    if (!existingProfile) {
      existingProfile = await firestoreService.getStudentProfileByEmail(cleanEmail);
    }

    if (existingProfile) {
      setStudent(existingProfile);
      const myWorks = await firestoreService.getStudentWorks(existingProfile.email);
      if (myWorks) setStudentWorks(myWorks);
      return { success: true };
    }

    // If existing full profile was not yet in firestore, initialize with verified credential name
    const resolvedName = localCred?.name || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const studentUser: StudentUser = {
      id: studentId,
      name: resolvedName,
      email: cleanEmail,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      enrolledCourseIds: [],
      purchasedNoteIds: [],
      completedLectureIds: {},
      certificates: [],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setStudent(studentUser);
    firestoreService.saveStudentProfile(studentUser).catch(console.warn);
    return { success: true };
  };

  const registerStudent = async (name: string, email: string, password?: string, phone?: string) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const cleanPhone = (phone || '').trim().replace(/[^0-9+]/g, '');

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Please enter your full legal name for your verified certificates.');
    }

    const emailValidation = validateEmail(cleanEmail);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error || 'Please enter a valid email address (e.g. yourname@gmail.com).');
    }

    if (cleanPhone) {
      const digits = cleanPhone.replace(/[^0-9]/g, '');
      if (digits.length < 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Check if account already exists
    const credentials = getStoredCredentials();
    if (credentials[cleanEmail]) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const passwordHash = await hashStudentPassword(cleanPassword);
    let resolvedUid = `student-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    // Attempt Firebase Auth account creation
    try {
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      resolvedUid = userCred.user.uid;
      await updateProfile(userCred.user, { displayName: cleanName });
    } catch (fbErr: any) {
      if (fbErr.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (fbErr.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters with letters and numbers.');
      } else if (fbErr.code === 'auth/invalid-email') {
        throw new Error('The email address format is invalid.');
      }
      console.debug('Firebase Auth status notice:', fbErr.message);
    }

    // Save strictly hashed credential record with phone
    saveStoredCredential({
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone || undefined,
      passwordHash,
      studentId: resolvedUid,
      createdAt: new Date().toISOString()
    });

    const studentUser: StudentUser = {
      id: resolvedUid,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || undefined,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      enrolledCourseIds: [],
      purchasedNoteIds: [],
      completedLectureIds: {},
      certificates: [],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setStudent(studentUser);
    await firestoreService.saveStudentProfile(studentUser).catch(console.warn);
    return { success: true };
  };

  const requestStudentPasswordResetOtp = async (identifier: string) => {
    const cleanInput = identifier.trim().toLowerCase();
    const digitsOnly = cleanInput.replace(/[^0-9]/g, '');

    if (!cleanInput) {
      throw new Error('Please enter your registered email address or mobile number.');
    }

    const credentials = getStoredCredentials();
    // Search by email or phone
    const matchedCred = Object.values(credentials).find(c => {
      const emailMatches = c.email.toLowerCase() === cleanInput;
      const phoneDigits = (c.phone || '').replace(/[^0-9]/g, '');
      const phoneMatches = digitsOnly.length >= 10 && (phoneDigits === digitsOnly || phoneDigits.endsWith(digitsOnly));
      return emailMatches || phoneMatches;
    });

    if (!matchedCred) {
      throw new Error('No registered student account found with this email or mobile number. Please check or sign up first.');
    }

    // Mask contact for security preview
    const emailParts = matchedCred.email.split('@');
    const maskedEmail = emailParts[0].length > 2
      ? `${emailParts[0].substring(0, 2)}***@${emailParts[1]}`
      : `***@${emailParts[1]}`;
    const maskedPhone = matchedCred.phone
      ? `${matchedCred.phone.substring(0, 3)}****${matchedCred.phone.slice(-2)}`
      : undefined;

    const maskedContact = maskedPhone ? `${maskedEmail} / ${maskedPhone}` : maskedEmail;

    // Call backend OTP dispatcher
    try {
      const res = await fetch('/api/auth/student/forgot-password/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: matchedCred.email,
          registeredEmail: matchedCred.email,
          registeredPhone: matchedCred.phone,
          studentName: matchedCred.name
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Also keep local fallback in session storage
        sessionStorage.setItem(`student_otp_${matchedCred.email}`, JSON.stringify({
          code: data.otpCode,
          expiresAt: Date.now() + 10 * 60 * 1000
        }));

        return {
          success: true,
          message: `OTP sent to your registered contact (${maskedContact}).`,
          maskedContact,
          otpCode: data.otpCode,
          registeredEmail: matchedCred.email
        };
      } else {
        throw new Error(data.error || 'Failed to dispatch OTP. Please try again.');
      }
    } catch (err: any) {
      // Offline fallback
      const localOtp = String(Math.floor(100000 + Math.random() * 900000));
      sessionStorage.setItem(`student_otp_${matchedCred.email}`, JSON.stringify({
        code: localOtp,
        expiresAt: Date.now() + 10 * 60 * 1000
      }));
      return {
        success: true,
        message: `OTP generated for registered student (${maskedContact}).`,
        maskedContact,
        otpCode: localOtp,
        registeredEmail: matchedCred.email
      };
    }
  };

  const verifyStudentOtpAndResetPassword = async (
    identifier: string,
    otp: string,
    newPassword: string
  ) => {
    const cleanInput = identifier.trim().toLowerCase();
    const cleanOtp = otp.trim();
    const cleanPass = newPassword.trim();

    if (!cleanOtp) {
      throw new Error('Please enter the 6-digit OTP code.');
    }
    if (!cleanPass || cleanPass.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    const credentials = getStoredCredentials();
    const matchedCred = Object.values(credentials).find(c => {
      const emailMatches = c.email.toLowerCase() === cleanInput;
      const digitsOnly = cleanInput.replace(/[^0-9]/g, '');
      const phoneDigits = (c.phone || '').replace(/[^0-9]/g, '');
      const phoneMatches = digitsOnly.length >= 10 && (phoneDigits === digitsOnly || phoneDigits.endsWith(digitsOnly));
      return emailMatches || phoneMatches;
    });

    if (!matchedCred) {
      throw new Error('Student account not found.');
    }

    // Verify OTP via server or fallback
    let verified = false;
    try {
      const res = await fetch('/api/auth/student/forgot-password/verify-and-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: matchedCred.email,
          otp: cleanOtp
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        verified = true;
      }
    } catch {
      // Fallback
    }

    if (!verified) {
      const localStored = sessionStorage.getItem(`student_otp_${matchedCred.email}`);
      if (localStored) {
        const parsed = JSON.parse(localStored);
        if (parsed.code === cleanOtp && Date.now() <= parsed.expiresAt) {
          verified = true;
          sessionStorage.removeItem(`student_otp_${matchedCred.email}`);
        }
      }
    }

    if (!verified) {
      throw new Error('Invalid or expired OTP code. Please check and try again.');
    }

    // Update student credentials
    const newHash = await hashStudentPassword(cleanPass);
    matchedCred.passwordHash = newHash;
    saveStoredCredential(matchedCred);

    return {
      success: true,
      message: 'Student password reset successfully! You can now sign in.'
    };
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const cleanEmail = (fbUser.email || '').toLowerCase().trim();
      const displayName = fbUser.displayName || cleanEmail.split('@')[0];
      const avatar = fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`;

      let profile = await firestoreService.getStudentProfile(fbUser.uid);
      if (!profile) {
        profile = await firestoreService.getStudentProfileByEmail(cleanEmail);
      }

      if (!profile) {
        profile = {
          id: fbUser.uid,
          name: displayName,
          email: cleanEmail,
          avatarUrl: avatar,
          enrolledCourseIds: [],
          purchasedNoteIds: [],
          completedLectureIds: {},
          certificates: [],
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
        await firestoreService.saveStudentProfile(profile).catch(console.warn);
      } else {
        if (avatar && profile.avatarUrl !== avatar) {
          profile.avatarUrl = avatar;
          firestoreService.saveStudentProfile(profile).catch(console.warn);
        }
      }

      saveStoredCredential({
        email: cleanEmail,
        name: profile.name,
        passwordHash: 'GOOGLE_OAUTH_VERIFIED',
        studentId: fbUser.uid,
        createdAt: new Date().toISOString()
      });

      setStudent(profile);
      const myWorks = await firestoreService.getStudentWorks(profile.email);
      if (myWorks) setStudentWorks(myWorks);
      return { success: true };
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      return { success: false, error: err.message || 'Google sign-in was cancelled or failed' };
    }
  };

  const logoutStudent = () => {
    fbSignOut(auth).catch(() => {});
    setStudent(null);
    setStudentWorks([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const enrollInCourse = async (courseId: string) => {
    if (!student) {
      throw new Error('Please sign in or create an account to enroll in courses and track your progress!');
    }

    if (student.enrolledCourseIds.includes(courseId)) {
      return { success: true, message: 'Already enrolled in this course.' };
    }

    const updatedStudent: StudentUser = {
      ...student,
      enrolledCourseIds: [...student.enrolledCourseIds, courseId]
    };
    setStudent(updatedStudent);
    await firestoreService.saveStudentProfile(updatedStudent).catch(console.warn);

    return { success: true, message: 'Enrolled successfully! Ready to learn.' };
  };

  const purchaseNotes = async (noteId: string) => {
    if (!student) {
      throw new Error('Please sign in or create an account to unlock study notes!');
    }

    if (student.purchasedNoteIds.includes(noteId)) {
      return { success: true, message: 'You already own this note resource.' };
    }

    const updatedStudent: StudentUser = {
      ...student,
      purchasedNoteIds: [...student.purchasedNoteIds, noteId]
    };
    setStudent(updatedStudent);
    await firestoreService.saveStudentProfile(updatedStudent).catch(console.warn);

    return { success: true, message: 'Notes unlocked successfully! Ready to download.' };
  };

  const toggleLectureCompletion = (courseId: string, lectureId: string) => {
    if (!student) return;

    setStudent(prev => {
      if (!prev) return null;
      const currentList = prev.completedLectureIds[courseId] || [];
      const isAlreadyCompleted = currentList.includes(lectureId);
      
      const updatedList = isAlreadyCompleted
        ? currentList.filter(id => id !== lectureId)
        : [...currentList, lectureId];

      const newStudentState: StudentUser = {
        ...prev,
        completedLectureIds: {
          ...prev.completedLectureIds,
          [courseId]: updatedList
        }
      };

      // Check if course reached 100% completion
      const targetCourse = courses.find(c => c.id === courseId);
      if (targetCourse && targetCourse.lectures.length > 0) {
        const isNow100 = targetCourse.lectures.every(lec => updatedList.includes(lec.id));
        const alreadyHasCert = prev.certificates.some(cert => cert.courseId === courseId);
        
        if (isNow100 && !alreadyHasCert) {
          const newCert: Certificate = {
            id: `CERT-${Date.now().toString(36).toUpperCase()}`,
            courseId,
            courseTitle: targetCourse.title,
            studentName: prev.name,
            studentEmail: prev.email,
            issuedAt: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            verificationCode: `YG-${Math.floor(100000 + Math.random() * 900000)}`,
            grade: 'Distinction (100%)'
          };
          newStudentState.certificates = [...newStudentState.certificates, newCert];
          // Persist certificate to Firestore database
          firestoreService.saveStudentCertificate(newCert).catch(console.warn);
        }
      }

      return newStudentState;
    });
  };

  const isLectureCompleted = (courseId: string, lectureId: string) => {
    if (!student) return false;
    const list = student.completedLectureIds[courseId] || [];
    return list.includes(lectureId);
  };

  const getCourseProgress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course || course.lectures.length === 0) {
      return { completedCount: 0, totalCount: 0, percentage: 0, isComplete: false };
    }

    const totalCount = course.lectures.length;
    const completedList = student?.completedLectureIds[courseId] || [];
    const completedCount = completedList.filter(id => course.lectures.some(l => l.id === id)).length;
    const percentage = Math.round((completedCount / totalCount) * 100);
    const isComplete = percentage >= 100;

    return { completedCount, totalCount, percentage, isComplete };
  };

  const generateCertificate = async (courseId: string, courseTitle: string): Promise<Certificate | null> => {
    if (!student) return null;
    const existing = student.certificates.find(c => c.courseId === courseId);
    if (existing) return existing;

    const newCert: Certificate = {
      id: `CERT-${Date.now().toString(36).toUpperCase()}`,
      courseId,
      courseTitle,
      studentName: student.name,
      studentEmail: student.email,
      issuedAt: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      verificationCode: `YG-${Math.floor(100000 + Math.random() * 900000)}`,
      grade: 'Distinction (100%)'
    };

    setStudent(prev => prev ? { ...prev, certificates: [...prev.certificates, newCert] } : null);
    await firestoreService.saveStudentCertificate(newCert).catch(console.warn);
    return newCert;
  };

  // Student Project/Work Submissions to Firestore Database
  const submitStudentWork = async (data: {
    courseId: string;
    courseTitle: string;
    title: string;
    description: string;
    projectUrl?: string;
    repoUrl?: string;
    previewImageUrl?: string;
  }): Promise<StudentWork | null> => {
    if (!student) return null;

    const newWork: StudentWork = {
      id: `work_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentUid: student.id,
      studentName: student.name,
      studentEmail: student.email,
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      title: data.title,
      description: data.description,
      projectUrl: data.projectUrl,
      repoUrl: data.repoUrl,
      previewImageUrl: data.previewImageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };

    setStudentWorks(prev => [newWork, ...prev]);
    setAllWorks(prev => [newWork, ...prev]);

    // Persist to Firestore database
    await firestoreService.saveStudentWork(newWork).catch(console.warn);
    return newWork;
  };

  const reviewStudentWork = async (
    workId: string, 
    feedback: string, 
    grade?: string, 
    status: 'submitted' | 'reviewed' | 'approved' = 'reviewed'
  ) => {
    setAllWorks(prev => prev.map(w => w.id === workId ? { ...w, instructorFeedback: feedback, grade, status } : w));
    setStudentWorks(prev => prev.map(w => w.id === workId ? { ...w, instructorFeedback: feedback, grade, status } : w));
    await firestoreService.updateStudentWorkFeedback(workId, feedback, grade, status).catch(console.warn);
  };

  // Admin Course CRUD with Firestore persistence
  const updateCourse = async (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    await firestoreService.saveCourse(updatedCourse).catch(console.warn);
  };

  const addCourse = async (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
    await firestoreService.saveCourse(newCourse).catch(console.warn);
  };

  const deleteCourse = async (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    await firestoreService.deleteCourse(courseId).catch(console.warn);
  };

  return (
    <StudentAuthContext.Provider
      value={{
        student,
        isAuthenticated: !!student,
        courses,
        notesStore,
        studentWorks,
        allWorks,
        isLoadingData,
        loginStudent,
        registerStudent,
        requestStudentPasswordResetOtp,
        verifyStudentOtpAndResetPassword,
        loginWithGoogle,
        logoutStudent,
        enrollInCourse,
        purchaseNotes,
        toggleLectureCompletion,
        isLectureCompleted,
        getCourseProgress,
        generateCertificate,
        updateCourse,
        addCourse,
        deleteCourse,
        submitStudentWork,
        reviewStudentWork,
        refreshAcademyData
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
}
