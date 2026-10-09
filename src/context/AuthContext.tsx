import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase.ts';
import { api, getAdminToken, setAdminToken, clearAdminToken } from '../lib/api.ts';

export interface User {
  uid?: string;
  email: string;
  role: 'admin' | 'user' | 'collaborator';
  name: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = [
  'yashgayake900@gmail.com'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const isAdminUser = ADMIN_EMAILS.includes(fbUser.email?.toLowerCase() || '');
        const role = isAdminUser ? 'admin' : 'user';
        const profileUser: User = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          role,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          photoURL: fbUser.photoURL || undefined
        };
        setUser(profileUser);

        // Sync admin token to backend for full CMS access
        if (isAdminUser) {
          try {
            const syncRes = await api.syncFirebaseSession(profileUser.email, fbUser.uid);
            if (syncRes.success && syncRes.token) {
              setAdminToken(syncRes.token);
            }
          } catch {
            setAdminToken(`firebase-admin-${fbUser.uid}`);
          }
        }

        // Sync user to Firestore
        try {
          await setDoc(doc(db, 'users', fbUser.uid), {
            uid: fbUser.uid,
            displayName: profileUser.name,
            email: profileUser.email,
            photoURL: profileUser.photoURL || null,
            role,
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch {
          // ignore if offline or rule prevents write
        }
        setIsLoading(false);
      } else {
        // If not signed in via Firebase, check if there is an existing backend admin token
        const token = getAdminToken();
        if (token) {
          try {
            const res = await api.getMe();
            if (res.authenticated && res.user) {
              setUser({
                email: res.user.email,
                name: res.user.name,
                role: (res.user.role as any) || 'admin'
              });
            } else {
              clearAdminToken();
              setUser(null);
            }
          } catch {
            clearAdminToken();
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkAuth = async () => {
    if (auth.currentUser) return;
    const token = getAdminToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.authenticated && res.user) {
        setUser({
          email: res.user.email,
          name: res.user.name,
          role: (res.user.role as any) || 'admin'
        });
      } else {
        clearAdminToken();
        setUser(null);
      }
    } catch {
      clearAdminToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isAdminUser = ADMIN_EMAILS.includes(fbUser.email?.toLowerCase() || '');
      const role = isAdminUser ? 'admin' : 'user';
      const newUser: User = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        role,
        photoURL: fbUser.photoURL || undefined
      };
      setUser(newUser);
      if (isAdminUser) {
        try {
          const syncRes = await api.syncFirebaseSession(newUser.email, fbUser.uid);
          if (syncRes.success && syncRes.token) {
            setAdminToken(syncRes.token);
          }
        } catch {
          setAdminToken(`firebase-admin-${fbUser.uid}`);
        }
      }
      return { success: true };
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      return { success: false, error: err.message || 'Google sign-in failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.token) {
        setAdminToken(res.token);
        setUser({
          email: res.user.email,
          name: res.user.name,
          role: (res.user.role as any) || 'admin'
        });
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication error' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await api.logout();
    } catch {
      // ignore
    } finally {
      clearAdminToken();
      setUser(null);
      setFirebaseUser(null);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        signInWithGoogle,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
