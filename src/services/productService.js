import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { SAMPLE_PRODUCTS, DEFAULT_STORE_SETTINGS } from "../utils/seedData";

const COLLECTION_NAME = "products";

const getLocalProducts = () => {
  const data = localStorage.getItem("lost_label_local_products");
  if (data) {
    try { return JSON.parse(data); } catch (e) {}
  }
  localStorage.setItem("lost_label_local_products", JSON.stringify(SAMPLE_PRODUCTS));
  return SAMPLE_PRODUCTS;
};

const setLocalProducts = (products) => {
  localStorage.setItem("lost_label_local_products", JSON.stringify(products));
};

/**
 * Fetch all products with optional filters
 */
export const getProducts = async ({ category, onlyActive = true, sortBy = "featured" } = {}) => {
  if (!isFirebaseConfigured) {
    let list = [...getLocalProducts()];
    if (onlyActive) list = list.filter(p => p.isActive !== false);
    if (category && category !== "All") list = list.filter(p => p.category === category);
    
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return list;
  }

  try {
    const productsRef = collection(db, COLLECTION_NAME);
    let q;

    if (onlyActive) {
      if (category && category !== "All") {
        q = query(productsRef, where("isActive", "==", true), where("category", "==", category));
      } else {
        q = query(productsRef, where("isActive", "==", true));
      }
    } else {
      if (category && category !== "All") {
        q = query(productsRef, where("category", "==", category));
      } else {
        q = query(productsRef);
      }
    }

    const snapshot = await getDocs(q);
    let items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // If Firestore has 0 products yet, return sample catalog so user sees the store
    if (items.length === 0 && onlyActive) {
      return SAMPLE_PRODUCTS;
    }

    // Sort in memory for consistency across compound queries
    if (sortBy === "price_asc") items.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") items.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    else items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return items;
  } catch (error) {
    console.warn("Error fetching products from Firestore, using local fallback:", error);
    return getLocalProducts();
  }
};

/**
 * Get single product by slug
 */
export const getProductBySlug = async (slug) => {
  if (!slug) return null;

  if (!isFirebaseConfigured) {
    const list = getLocalProducts();
    return list.find(p => p.slug === slug) || null;
  }

  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(productsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docData = snapshot.docs[0];
      return { id: docData.id, ...docData.data() };
    }
    // Check fallback sample products
    return SAMPLE_PRODUCTS.find(p => p.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return SAMPLE_PRODUCTS.find(p => p.slug === slug) || null;
  }
};

/**
 * Add a new product (Admin)
 */
export const createProduct = async (productData) => {
  const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const payload = {
    ...productData,
    slug,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  if (!isFirebaseConfigured) {
    const list = getLocalProducts();
    const newProduct = { ...payload, id: `prod_${Date.now()}`, createdAt: Date.now() };
    list.unshift(newProduct);
    setLocalProducts(list);
    return newProduct;
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
  return { id: docRef.id, ...payload };
};

/**
 * Update product (Admin)
 */
export const updateProduct = async (productId, updates) => {
  const payload = {
    ...updates,
    updatedAt: serverTimestamp()
  };

  if (!isFirebaseConfigured) {
    const list = getLocalProducts();
    const index = list.findIndex(p => p.id === productId || p.slug === productId);
    if (index !== -1) {
      list[index] = { ...list[index], ...payload, updatedAt: Date.now() };
      setLocalProducts(list);
      return list[index];
    }
    return null;
  }

  const docRef = doc(db, COLLECTION_NAME, productId);
  await updateDoc(docRef, payload);
  return { id: productId, ...payload };
};

/**
 * Delete product (Admin)
 */
export const deleteProduct = async (productId) => {
  if (!isFirebaseConfigured) {
    const list = getLocalProducts();
    const filtered = list.filter(p => p.id !== productId && p.slug !== productId);
    setLocalProducts(filtered);
    return true;
  }

  const docRef = doc(db, COLLECTION_NAME, productId);
  await deleteDoc(docRef);
  return true;
};

/**
 * One-click seeder to populate Firestore with sample products and store settings
 */
export const seedProductsToFirestore = async () => {
  if (!isFirebaseConfigured) {
    localStorage.setItem("lost_label_local_products", JSON.stringify(SAMPLE_PRODUCTS));
    localStorage.setItem("lost_label_store_settings", JSON.stringify(DEFAULT_STORE_SETTINGS));
    return { success: true, count: SAMPLE_PRODUCTS.length, message: "Local mock storage seeded." };
  }

  const results = [];
  for (const prod of SAMPLE_PRODUCTS) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...prod,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    results.push(docRef.id);
  }

  return {
    success: true,
    count: results.length,
    message: `Successfully seeded ${results.length} products to Firestore.`
  };
};
