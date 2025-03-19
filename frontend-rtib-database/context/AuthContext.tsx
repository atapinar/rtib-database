"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Cookies from 'js-cookie';

type User = FirebaseUser & {
  isAdmin?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Merge Firestore data with auth user
            const enhancedUser = {
              ...firebaseUser,
              isAdmin: userData.isAdmin || false,
            } as User;
            setUser(enhancedUser);
            
            // Set the auth cookie when user is authenticated
            Cookies.set('authToken', firebaseUser.uid, { expires: 7 });
          } else {
            // Use default values if user doc doesn't exist
            setUser({
              ...firebaseUser,
              isAdmin: false,
            } as User);
            
            // Set the auth cookie when user is authenticated
            Cookies.set('authToken', firebaseUser.uid, { expires: 7 });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(firebaseUser as User);
          
          // Set the auth cookie when user is authenticated
          Cookies.set('authToken', firebaseUser.uid, { expires: 7 });
        }
      } else {
        setUser(null);
        // Remove the auth cookie when user is not authenticated
        Cookies.remove('authToken');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Cookie is set in the auth state change listener
    Cookies.set('authToken', userCredential.user.uid, { expires: 7 });
  };

  const logout = async () => {
    await signOut(auth);
    // Cookie is removed in the auth state change listener
    Cookies.remove('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 