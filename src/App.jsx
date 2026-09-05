import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/layout/Layout";
import Loader from "./components/common/Loader";

// Lazy-loaded pages for optimal Netlify bundle performance
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));

// Admin lazy pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Admin Protected Route Guard
function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader text="AUTHENTICATING ATELIER ACCESS" />;
  }

  if (!user && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<Loader text="LOADING LOST LABEL" />}>
            <Routes>
              {/* Public Storefront Routes with Layout */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/shop"
                element={
                  <Layout>
                    <Shop />
                  </Layout>
                }
              />
              <Route
                path="/product/:slug"
                element={
                  <Layout>
                    <ProductDetails />
                  </Layout>
                }
              />
              <Route
                path="/cart"
                element={
                  <Layout>
                    <CartPage />
                  </Layout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <Layout>
                    <CheckoutPage />
                  </Layout>
                }
              />
              <Route
                path="/order-success/:orderNumber"
                element={
                  <Layout>
                    <OrderSuccess />
                  </Layout>
                }
              />
              <Route
                path="/track-order"
                element={
                  <Layout>
                    <TrackOrder />
                  </Layout>
                }
              />
              <Route
                path="/about"
                element={
                  <Layout>
                    <About />
                  </Layout>
                }
              />
              <Route
                path="/contact"
                element={
                  <Layout>
                    <Contact />
                  </Layout>
                }
              />
              <Route
                path="/privacy"
                element={
                  <Layout>
                    <PolicyPage />
                  </Layout>
                }
              />
              <Route
                path="/terms"
                element={
                  <Layout>
                    <PolicyPage />
                  </Layout>
                }
              />
              <Route
                path="/shipping"
                element={
                  <Layout>
                    <PolicyPage />
                  </Layout>
                }
              />
              <Route
                path="/returns"
                element={
                  <Layout>
                    <PolicyPage />
                  </Layout>
                }
              />

              {/* Admin Portal Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedAdminRoute>
                    <AdminProducts />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedAdminRoute>
                    <AdminOrders />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedAdminRoute>
                    <AdminSettings />
                  </ProtectedAdminRoute>
                }
              />

              {/* Fallback 404 */}
              <Route
                path="*"
                element={
                  <Layout>
                    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 space-y-4">
                      <h2 className="font-cinzel text-4xl uppercase tracking-widest text-[#e8e4d9]">
                        404 • VOID
                      </h2>
                      <p className="text-xs text-[#777]">The coordinate you requested does not exist in the atelier archive.</p>
                      <a
                        href="/"
                        className="px-6 py-3 bg-[#e8e4d9] text-[#070707] text-xs uppercase font-bold tracking-widest"
                      >
                        Return Home
                      </a>
                    </div>
                  </Layout>
                }
              />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
