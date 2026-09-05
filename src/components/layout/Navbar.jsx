import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, Shield, User, Compass } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Collection", path: "/shop" },
    { name: "Brand Story", path: "/about" },
    { name: "Track Order", path: "/track-order" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-[#070707]/90 backdrop-blur-md border-b border-[#1f1f1f] py-3.5 shadow-xl"
            : "bg-gradient-to-b from-[#070707]/80 via-[#070707]/30 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-[#e8e4d9] p-1.5 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo & Editorial Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#262626] group-hover:border-[#e8e4d9] transition-colors duration-300">
              <img
                src="/logo.jpg"
                alt="LOST LABEL Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-cinzel text-base sm:text-lg font-bold tracking-[0.25em] text-[#e8e4d9] group-hover:text-white transition-colors">
                LOST LABEL
              </span>
              <span className="font-editorial text-[9px] tracking-[0.35em] text-[#8e8b83]">
                ESTD. 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs uppercase tracking-[0.22em] transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-[#e8e4d9] font-semibold border-b border-[#e8e4d9] pb-0.5"
                    : "text-[#8e8b83] hover:text-[#e8e4d9]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              to="/shop"
              className="text-[#8e8b83] hover:text-[#e8e4d9] transition-colors p-1"
              title="Search Catalog"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Admin or Account shortcut */}
            {isAdmin ? (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/40 border border-amber-800/50 text-amber-300 text-[10px] tracking-widest uppercase hover:bg-amber-900/40 transition-colors"
                title="Admin Dashboard"
              >
                <Shield className="w-3 h-3" />
                <span>Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-[#8e8b83] hover:text-[#e8e4d9] transition-colors p-1"
                title="Admin Portal"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* Cart Button with Count Pill */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#e8e4d9] hover:text-white transition-colors"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#e8e4d9] text-[#070707] text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-[#0c0c0c] border-r border-[#262626] p-6 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#1f1f1f]">
                <div className="flex items-center gap-3">
                  <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full" />
                  <span className="font-cinzel text-sm font-bold tracking-widest text-[#e8e4d9]">
                    LOST LABEL
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#8e8b83] hover:text-[#e8e4d9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-sm font-medium tracking-[0.2em] uppercase text-[#b3b0a6] hover:text-[#e8e4d9]"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-400/90 pt-4 border-t border-[#1f1f1f]"
                >
                  Admin Management
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1f1f1f] text-left">
              <p className="font-editorial text-[10px] tracking-[0.25em] text-[#666]">
                LOST LABEL STREETWEAR • 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
