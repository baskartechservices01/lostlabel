import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export const loginWithEmail = async (email, password) => {
  if (!isFirebaseConfigured) {
    // Dev fallback login
    const isAdmin = email.toLowerCase().includes("admin");
    const mockUser = {
      uid: isAdmin ? "mock_admin_uid" : "mock_customer_uid",
      email,
      displayName: isAdmin ? "Lost Label Admin" : "Guest Customer",
      role: isAdmin ? "admin" : "customer"
    };
    localStorage.setItem("lost_label_mock_user", JSON.stringify(mockUser));
    return mockUser;
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  const role = await getUserRole(credential.user.uid, credential.user.email);
  return { ...credential.user, role };
};

export const registerWithEmail = async (email, password, displayName = "") => {
  if (!isFirebaseConfigured) {
    const mockUser = {
      uid: "mock_customer_" + Date.now(),
      email,
      displayName: displayName || "Streetwear Patron",
      role: "customer"
    };
    localStorage.setItem("lost_label_mock_user", JSON.stringify(mockUser));
    return mockUser;
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  // Create default customer profile in Firestore
  const userRef = doc(db, "users", credential.user.uid);
  await setDoc(userRef, {
    email: credential.user.email,
    displayName: displayName || "",
    role: "customer",
    createdAt: serverTimestamp()
  });

  return { ...credential.user, role: "customer" };
};

export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    const mockUser = {
      uid: "mock_google_customer",
      email: "streetwear@gmail.com",
      displayName: "Google Patron",
      role: "customer"
    };
    localStorage.setItem("lost_label_mock_user", JSON.stringify(mockUser));
    return mockUser;
  }

  const credential = await signInWithPopup(auth, googleProvider);
  const userRef = doc(db, "users", credential.user.uid);
  const userDoc = await getDoc(userRef);

  let role = "customer";
  if (userDoc.exists()) {
    role = userDoc.data().role || "customer";
  } else {
    // Default role for new Google users is customer
    await setDoc(userRef, {
      email: credential.user.email,
      displayName: credential.user.displayName || "",
      role: "customer",
      createdAt: serverTimestamp()
    });
  }

  return { ...credential.user, role };
};

export const logoutUser = async () => {
  if (!isFirebaseConfigured) {
    localStorage.removeItem("lost_label_mock_user");
    return true;
  }
  await signOut(auth);
  return true;
};

export const getUserRole = async (uid, email = "") => {
  if (!isFirebaseConfigured) {
    const mock = localStorage.getItem("lost_label_mock_user");
    if (mock) {
      try { return JSON.parse(mock).role || "customer"; } catch (e) {}
    }
    return email.toLowerCase().includes("admin") ? "admin" : "customer";
  }

  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().role || "customer";
    }

    // Default bootstrap admin emails
    if (email && (email === "admin@lostlabel.com" || email === "owner@lostlabel.com")) {
      return "admin";
    }
    return "customer";
  } catch (error) {
    console.warn("Error getting user role:", error);
    return "customer";
  }
};
