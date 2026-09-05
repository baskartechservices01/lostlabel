import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "../cart/CartDrawer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070707] text-[#e8e4d9]">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
