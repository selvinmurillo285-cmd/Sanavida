import React from 'react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile, PlanType } from '../types';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<any | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Listen to profile changes
        const profileRef = doc(db, 'users', currentUser.uid);
        const unsubProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile & { role?: string };
            setProfile(data);
            const isUserAdmin = data.role === 'admin' || currentUser.email === 'murilloselvin323@gmail.com';
            setIsAdmin(isUserAdmin);
            
            // Auto-upgrade admin to premium if they are on free
            if (isUserAdmin && data.currentPlan === 'free') {
              setDoc(profileRef, { currentPlan: 'premium' }, { merge: true });
            }
          } else {
            // Create profile if it doesn't exist
            const newProfile: UserProfile & { role: string; uid: string } = {
              uid: currentUser.uid,
              name: currentUser.displayName || 'Usuario',
              email: currentUser.email || '',
              goal: 'Equilibrio Hormonal y Salud',
              favorites: [],
              purchasedBooks: [],
              currentPlan: currentUser.email === 'murilloselvin323@gmail.com' ? 'premium' : 'free',
              role: currentUser.email === 'murilloselvin323@gmail.com' ? 'admin' : 'user'
            };
            setDoc(profileRef, newProfile).catch(err => handleFirestoreError(err, OperationType.CREATE, 'users'));
          }
        }, (err) => handleFirestoreError(err, OperationType.GET, 'users'));

        setLoading(false);
        return () => unsubProfile();
      } else {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    try {
      await setDoc(profileRef, updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
