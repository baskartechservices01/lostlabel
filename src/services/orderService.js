import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { generateOrderNumber } from "../utils/formatters";

const ORDERS_COLLECTION = "orders";

const getLocalOrders = () => {
  const data = localStorage.getItem("lost_label_orders");
  return data ? JSON.parse(data) : [];
};

const setLocalOrders = (orders) => {
  localStorage.setItem("lost_label_orders", JSON.stringify(orders));
};

/**
 * Creates a new order in pending status
 */
export const createOrder = async (orderPayload) => {
  const orderNumber = generateOrderNumber();
  const newOrder = {
    ...orderPayload,
    orderNumber,
    paymentMethod: "UPI",
    paymentStatus: "pending",
    orderStatus: "pending_payment",
    transactionId: "",
    paymentProofUrl: "",
    paymentProofPublicId: "",
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured) {
    const orders = getLocalOrders();
    const mockOrder = { ...newOrder, id: `ord_${Date.now()}` };
    orders.unshift(mockOrder);
    setLocalOrders(orders);
    return mockOrder;
  }

  try {
    const payload = {
      ...newOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), payload);
    return { id: docRef.id, ...newOrder };
  } catch (error) {
    console.warn("Error creating order in Firestore, saving locally:", error);
    const orders = getLocalOrders();
    const mockOrder = { ...newOrder, id: `ord_${Date.now()}` };
    orders.unshift(mockOrder);
    setLocalOrders(orders);
    return mockOrder;
  }
};

/**
 * Submit UTR & optional payment screenshot proof
 */
export const submitPaymentProof = async ({ orderNumber, transactionId, paymentProofUrl = "", paymentProofPublicId = "" }) => {
  if (!orderNumber) throw new Error("Order number is required.");
  if (!transactionId || transactionId.trim().length < 6) {
    throw new Error("A valid UTR or Transaction ID is required.");
  }

  const updates = {
    paymentStatus: "submitted",
    transactionId: transactionId.trim(),
    paymentProofUrl,
    paymentProofPublicId,
    paymentSubmittedAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured) {
    const orders = getLocalOrders();
    const index = orders.findIndex(o => o.orderNumber === orderNumber);
    if (index === -1) throw new Error("Order not found.");
    orders[index] = { ...orders[index], ...updates };
    setLocalOrders(orders);
    return orders[index];
  }

  try {
    const q = query(collection(db, ORDERS_COLLECTION), where("orderNumber", "==", orderNumber));
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error("Order not found in database.");

    const orderDoc = snapshot.docs[0];
    await updateDoc(doc(db, ORDERS_COLLECTION, orderDoc.id), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { id: orderDoc.id, ...orderDoc.data(), ...updates };
  } catch (error) {
    console.error("Error submitting payment proof:", error);
    // Fallback local update
    const orders = getLocalOrders();
    const index = orders.findIndex(o => o.orderNumber === orderNumber);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      setLocalOrders(orders);
      return orders[index];
    }
    throw error;
  }
};

/**
 * Get order by orderNumber and verified Phone number for customer tracking
 */
export const getOrderByNumberAndPhone = async (orderNumber, phone) => {
  if (!orderNumber || !phone) return null;
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.replace(/[\s\-\+]/g, "").slice(-10);

  if (!isFirebaseConfigured) {
    const orders = getLocalOrders();
    return orders.find(o => 
      o.orderNumber.toUpperCase() === cleanOrderNum &&
      o.phone.replace(/[\s\-\+]/g, "").slice(-10) === cleanPhone
    ) || null;
  }

  try {
    const q = query(collection(db, ORDERS_COLLECTION), where("orderNumber", "==", cleanOrderNum));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const order = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    const orderPhone = (order.phone || "").replace(/[\s\-\+]/g, "").slice(-10);
    if (orderPhone === cleanPhone) {
      return order;
    }
    return null;
  } catch (error) {
    console.error("Error verifying order tracking:", error);
    const orders = getLocalOrders();
    return orders.find(o => o.orderNumber.toUpperCase() === cleanOrderNum) || null;
  }
};

/**
 * Get single order by orderNumber
 */
export const getOrderByNumber = async (orderNumber) => {
  if (!orderNumber) return null;
  const cleanOrderNum = orderNumber.trim().toUpperCase();

  if (!isFirebaseConfigured) {
    const orders = getLocalOrders();
    return orders.find(o => o.orderNumber.toUpperCase() === cleanOrderNum) || null;
  }

  try {
    const q = query(collection(db, ORDERS_COLLECTION), where("orderNumber", "==", cleanOrderNum));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    const orders = getLocalOrders();
    return orders.find(o => o.orderNumber.toUpperCase() === cleanOrderNum) || null;
  }
};

/**
 * Fetch all orders for Admin with optional status filter
 */
export const getOrders = async ({ statusFilter = "all" } = {}) => {
  if (!isFirebaseConfigured) {
    let orders = getLocalOrders();
    if (statusFilter !== "all") {
      orders = orders.filter(o => o.paymentStatus === statusFilter || o.orderStatus === statusFilter);
    }
    return orders;
  }

  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    let orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    if (statusFilter !== "all") {
      orders = orders.filter(o => o.paymentStatus === statusFilter || o.orderStatus === statusFilter);
    }
    return orders;
  } catch (error) {
    console.warn("Could not query orders from Firestore, using local fallback:", error);
    return getLocalOrders();
  }
};

/**
 * Admin: Verify payment -> transitions paymentStatus to 'verified' and orderStatus to 'confirmed'
 */
export const verifyPayment = async (orderId) => {
  const updates = {
    paymentStatus: "verified",
    orderStatus: "confirmed",
    verifiedAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured) {
    const orders = getLocalOrders();
    const index = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      setLocalOrders(orders);
      return orders[index];
    }
    return null;
  }

  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
  return { id: orderId, ...updates };
};

/**
 * Admin: Reject payment
 */
export const rejectPayment = async (orderId, reason = "") => {
  const updates = {
    paymentStatus: "rejected",
    rejectionReason: reason,
    rejectedAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured) {
    const orders = getLocalOrders();
    const index = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      setLocalOrders(orders);
      return orders[index];
    }
    return null;
  }

  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
  return { id: orderId, ...updates };
};

/**
 * Admin: Update fulfillment status
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  const validStatuses = [
    "pending_payment",
    "confirmed",
    "processing",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled"
  ];

  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid order status: ${newStatus}`);
  }

  const updates = {
    orderStatus: newStatus,
    statusUpdatedAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured) {
    const orders = getLocalOrders();
    const index = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      setLocalOrders(orders);
      return orders[index];
    }
    return null;
  }

  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
  return { id: orderId, ...updates };
};
