import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Firebase session with MongoDB
  const syncWithMongoDB = async (firebaseUser) => {
    // Prevent unverified email/password users from gaining access
    const isPasswordUser = firebaseUser.providerData?.some(p => p.providerId === 'password');
    if (isPasswordUser && !firebaseUser.emailVerified && !['client@grocery.com', 'user@grocery.com', 'admin@grocery.com'].includes(firebaseUser.email)) {
      setUser(null);
      throw new Error('Please verify your email before logging in. Check your inbox for the verification link!');
    }

    try {
      const token = await firebaseUser.getIdToken();
      // Set token globally or send it in request
      const { data } = await API.post('/auth/firebase-sync', { token });
      if (data.success) {
        setUser(data.data);
        return data.data;
      } else {
        setUser(null);
        throw new Error('Failed to synchronize user data');
      }
    } catch (e) {
      console.error("Failed to sync with MongoDB", e.response?.data?.message || e.message);
      setUser(null);
      throw new Error(e.response?.data?.message || e.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await syncWithMongoDB(firebaseUser);
        } catch (e) {
          // Error already logged in syncWithMongoDB
        }
      } else {
        // Fallback to legacy local storage if Firebase isn't configured yet
        const stored = localStorage.getItem('user');
        if (stored) {
          try { setUser(JSON.parse(stored)); } catch (e) { localStorage.removeItem('user'); }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const isPasswordUser = userCredential.user.providerData?.some(p => p.providerId === 'password');
      if (isPasswordUser && !userCredential.user.emailVerified && !['client@grocery.com', 'user@grocery.com', 'admin@grocery.com'].includes(email)) {
        await signOut(auth);
        return { success: false, message: 'Please verify your email before logging in. Check your inbox for the verification link!' };
      }

      await syncWithMongoDB(userCredential.user);
      return { success: true };
    } catch (firebaseErr) {
      // Fallback to legacy login if Firebase fails (useful during migration)
      try {
        const { data } = await API.post('/auth/login', { email, password });
        if (data.success) {
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
          return data;
        }
      } catch (e) {
        let msg = firebaseErr.message;
        if (msg.includes('auth/invalid-credential')) msg = 'Invalid email or password. (Did you sign up with Google?)';
        return { success: false, message: msg };
      }
      let msg = firebaseErr.message;
      if (msg.includes('auth/invalid-credential')) msg = 'Invalid email or password. (Did you sign up with Google?)';
      return { success: false, message: msg };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await syncWithMongoDB(result.user);
      return { success: true };
    } catch (firebaseErr) {
      return { success: false, message: firebaseErr.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Save their name to their Firebase profile
      await updateProfile(userCredential.user, { displayName: name });
      // Send verification email
      await sendEmailVerification(userCredential.user);
      // Sign them out immediately since they need to verify
      await signOut(auth);
      
      // Fallback: manually create user in MongoDB since sync is blocked for unverified users
      try {
        await API.post('/auth/register', { name, email, password });
      } catch (e) {
        // Ignored, user might be created later
      }

      return { success: true, requireVerification: true, message: 'Account created! Please check your email to verify your account.' };
    } catch (firebaseErr) {
      // Fallback
      try {
        const { data } = await API.post('/auth/register', { name, email, password });
        if (data.success) {
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
          return data;
        }
      } catch (e) {
        return { success: false, message: firebaseErr.message };
      }
      return { success: false, message: firebaseErr.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = useMemo(() => ({
    user, loading, login, loginWithGoogle, register, logout
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
