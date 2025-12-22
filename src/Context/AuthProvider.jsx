import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import app from "../Firebase/firebase.config";
import toast from "react-hot-toast";
import Loading from "../Components/Shared/Loading";

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendURL = "https://city-fix-server-one.vercel.app";

  
  const createUser = async (email, password) => {
  //setLoading(true);
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (err) {
    setLoading(false);
    throw err; 
  }
};


  
  const updateUserProfile = async (name, photoURL, role = "citizen") => {
    if (!auth.currentUser) return;

    await updateProfile(auth.currentUser, { displayName: name, photoURL });
    await auth.currentUser.reload();

    
    setUser({ ...auth.currentUser, role });
  };

  // GOOGLE LOGIN
  const GUser = async () => {
    //setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
    setLoading(false);
    return result;
  };

  // LOGIN
  const logInUser = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    setLoading(false);
    return result;
  };

  // LOGOUT
  const removeUser = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    toast.success("Logout successful!");
    setLoading(false);
  };

  const loadUserFromDB = async (uid) => {
    try {
      const res = await fetch(`${backendURL}/users/${uid}`);
      if (!res.ok) return; 

      const dbUser = await res.json();

      
      setUser({
        ...auth.currentUser,
        role: dbUser.role,
        name: dbUser.name,
        photoURL: dbUser.photoURL
      });

    } catch (err) {
      console.error("Failed to load user role:", err);
    }
  };

  // ON AUTH CHANGE
  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (currentUser) => {

    if (currentUser) {
      try {
        const res = await fetch(`https://city-fix-server-one.vercel.app/users/${currentUser.email}`);
        const dbUser = await res.json();

        
        setUser({
          ...currentUser,
          role: dbUser.role || "citizen",
          photoURL: dbUser.photo,
          name: dbUser.name
        });
      } catch (err) {
        console.log("Failed to load DB user:", err);
        setUser(currentUser);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  });

  return () => unsub();
}, []);


  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      createUser,
      updateUserProfile,
      GUser,
      logInUser,
      removeUser,
      loading,
      setLoading
    }}>
      {loading && !user ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;