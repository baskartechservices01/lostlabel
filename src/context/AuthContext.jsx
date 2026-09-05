import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../services/firebase";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logoutUser,
  getUserRole
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      const mock = localStorage.getItem("lost_label_mock_user");
      if (mock) {
        try {
          const parsed = JSON.parse(mock);
          setUser(parsed);
          setRole(parsed.role || "customer");
        } catch (e) {}
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRole = await getUserRole(firebaseUser.uid, firebaseUser.email);
        setUser(firebaseUser);
        setRole(userRole);
      } else {
        setUser(null);
        setRole("customer");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await loginWithEmail(email, password);
    setUser(res);
    setRole(res.role || "customer");
    return res;
  };

  const register = async (email, password, displayName) => {
    const res = await registerWithEmail(email, password, displayName);
    setUser(res);
    setRole(res.role || "customer");
    return res;
  };

  const loginGoogle = async () => {
    const res = await loginWithGoogle();
    setUser(res);
    setRole(res.role || "customer");
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setRole("customer");
  };

  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        loading,
        login,
        register,
        loginGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
