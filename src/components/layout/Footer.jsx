import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { InstagramIcon } from "../common/Icons";


export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#1a1a1a] text-[#8e8b83] pt-16 pb-12">
      {/* Brand Pillars Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-16 pb-12 border-b border-[#181818] grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4">
          <Truck className="w-6 h-6 text-[#e8e4d9]" />
          <div>
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9]">
              Express Delivery
            </h4>
            <p className="text-[11px] text-[#666]">Free on orders above ₹1,999 across India</p>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-4">
          <ShieldCheck className="w-6 h-6 text-[#e8e4d9]" />
          <div>
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9]">
              Direct UPI Payments
            </h4>
            <p className="text-[11px] text-[#666]">Instant verification & zero gateway markups</p>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-4">
          <RefreshCw className="w-6 h-6 text-[#e8e4d9]" />
          <div>
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9]">
              7-Day Size Exchange
            </h4>
            <p className="text-[11px] text-[#666]">Hassle-free replacement on all drops</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        {/* Brand identity column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="LOST LABEL" className="w-10 h-10 rounded-full border border-[#222]" />
            <div>
              <h3 className="font-cinzel text-base tracking-[0.25em] text-[#e8e4d9]">
                LOST LABEL
              </h3>
              <p className="font-editorial text-[9px] tracking-[0.3em] text-[#666]">
                STREETWEAR • ESTD. 2026
              </p>
            </div>
          </div>
          <p className="text-xs text-[#777] leading-relaxed">
            Identity is not chosen to blend in. We craft heavyweight architectural silhouettes for the underground culture.
          </p>
          <div className="pt-2">
            <a
              href="https://instagram.com/lostlabel.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-[#e8e4d9] hover:text-white transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
              <span className="tracking-wider">@lostlabel.in</span>

              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Drops / Categories */}
        <div>
          <h4 className="font-cinzel text-xs tracking-[0.2em] text-[#e8e4d9] uppercase mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/shop?category=T-Shirts" className="hover:text-[#e8e4d9] transition-colors">Heavyweight T-Shirts</Link></li>
            <li><Link to="/shop?category=Hoodies" className="hover:text-[#e8e4d9] transition-colors">Architectural Hoodies</Link></li>
            <li><Link to="/shop?category=Jackets" className="hover:text-[#e8e4d9] transition-colors">Tactical Jackets</Link></li>
            <li><Link to="/shop?category=Pants" className="hover:text-[#e8e4d9] transition-colors">Cargo & Pleated Pants</Link></li>
            <li><Link to="/shop?category=Accessories" className="hover:text-[#e8e4d9] transition-colors">Accessories</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-cinzel text-xs tracking-[0.2em] text-[#e8e4d9] uppercase mb-4">
            Customer Atelier
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/track-order" className="hover:text-[#e8e4d9] transition-colors">Track Your Order</Link></li>
            <li><Link to="/shipping" className="hover:text-[#e8e4d9] transition-colors">Shipping Policy</Link></li>
            <li><Link to="/returns" className="hover:text-[#e8e4d9] transition-colors">Returns & Exchange</Link></li>
            <li><Link to="/contact" className="hover:text-[#e8e4d9] transition-colors">Direct Concierge</Link></li>
            <li><Link to="/admin/login" className="hover:text-[#e8e4d9] transition-colors">Admin Portal</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-cinzel text-xs tracking-[0.2em] text-[#e8e4d9] uppercase mb-4">
            Underground Dispatch
          </h4>
          <p className="text-xs text-[#777] mb-3 leading-relaxed">
            Gain early access to secret drops and private archive sales.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("You are now registered for Lost Label private drops.");
            }}
            className="space-y-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full bg-[#111] border border-[#262626] px-3.5 py-2.5 text-xs text-[#e8e4d9] placeholder-[#555] focus:outline-none focus:border-[#e8e4d9]"
            />
            <button
              type="submit"
              className="w-full bg-[#e8e4d9] text-[#070707] py-2.5 text-[11px] font-semibold tracking-widest uppercase hover:bg-white transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright bottom */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[#151515] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#555] gap-4">
        <p>© 2026 LOST LABEL STREETWEAR. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-[#888]">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#888]">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
