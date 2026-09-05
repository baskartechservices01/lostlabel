import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { DEFAULT_STORE_SETTINGS } from "../utils/seedData";

const SETTINGS_DOC_ID = "store";

export const getStoreSettings = async () => {
  if (!isFirebaseConfigured) {
    const local = localStorage.getItem("lost_label_store_settings");
    return local ? JSON.parse(local) : DEFAULT_STORE_SETTINGS;
  }

  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { ...DEFAULT_STORE_SETTINGS, ...snapshot.data() };
    } else {
      // Auto initialize default settings if empty
      await setDoc(docRef, DEFAULT_STORE_SETTINGS);
      return DEFAULT_STORE_SETTINGS;
    }
  } catch (error) {
    console.warn("Could not load settings from Firestore, using defaults:", error);
    return DEFAULT_STORE_SETTINGS;
  }
};

export const updateStoreSettings = async (settings) => {
  const payload = {
    ...settings,
    updatedAt: new Date()
  };

  if (!isFirebaseConfigured) {
    localStorage.setItem("lost_label_store_settings", JSON.stringify(payload));
    return payload;
  }

  const docRef = doc(db, "settings", SETTINGS_DOC_ID);
  await setDoc(docRef, payload, { merge: true });
  return payload;
};
