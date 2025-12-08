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

  // CREATE USER
  const createUser = async (email, password) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  };

  
  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) return;

    await updateProfile(auth.currentUser, { displayName: name, photoURL });
    await auth.currentUser.reload();
    setUser({ ...auth.currentUser });
  };

  // GOOGLE LOGIN
  const GUser = async () => {
    setLoading(true);
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

  // ON AUTH CHANGE
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{
      user, setUser,
      createUser, updateUserProfile,
      GUser, logInUser, removeUser,
      loading, setLoading
    }}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;