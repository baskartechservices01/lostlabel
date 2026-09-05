import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Compass } from "lucide-react";

export default function About() {
  return (
    <div className="w-full min-h-screen bg-[#070707] text-[#e8e4d9] pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-16 text-left">
        {/* Header */}
        <div className="text-center space-y-4 border-b border-[#1c1c1c] pb-12">
          <div className="w-24 h-24 mx-auto rounded-full p-1 border border-[#262626]">
            <img src="/logo.jpg" alt="LOST LABEL" className="w-full h-full rounded-full object-cover" />
          </div>
          <span className="font-editorial text-xs tracking-[0.35em] text-[#8e8b83] uppercase block">
            ESTD. 2026 • THE MANIFESTO
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-widest text-[#e8e4d9] uppercase">
            LOST LABEL
          </h1>
          <p className="text-sm text-[#8e8b83] max-w-xl mx-auto font-light leading-relaxed">
            Not made to blend in. We construct heavyweight architectural garments for the uncompromising individual.
          </p>
        </div>

        {/* Narrative Sections */}
        <div className="space-y-12 text-sm text-[#b3b0a6] leading-relaxed font-light">
          <section className="space-y-4">
            <h2 className="font-cinzel text-xl text-[#e8e4d9] uppercase tracking-wider">
              1. The Doctrine of Individuality
            </h2>
            <p>
              In an era dominated by transient fast fashion and repetitive logos, LOST LABEL emerged in 2026
              as an underground countermeasure. We reject mass duplication. Our pieces serve as physical artifacts
              of identity—garments engineered to withstand trends and remain permanent fixtures in your wardrobe.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-cinzel text-xl text-[#e8e4d9] uppercase tracking-wider">
              2. Architectural Cuts & Heavyweight Draping
            </h2>
            <p>
              We prioritize structural integrity above all else. Our t-shirts are spun from custom 280 GSM combed
              French Terry cotton with dropped shoulders and thick ribbed collars. Our hoodies utilize 450 GSM
              double-faced fleece with clean drawstring-less contours. Every silhouette is calibrated to fall naturally
              and hold its architectural boxiness over years of wear.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-cinzel text-xl text-[#e8e4d9] uppercase tracking-wider">
              3. Strictly Numbered Archives
            </h2>
            <p>
              Every drop is produced in strictly finite quantities. Once a collection sells out, it enters
              the Lost Label vault. We do not restock historic releases, preserving the authenticity and rarity
              for those who recognized the vision from day one.
            </p>
          </section>
        </div>

        {/* Call to action */}
        <div className="p-8 bg-[#0c0c0c] border border-[#222] text-center space-y-4">
          <h3 className="font-cinzel text-xl uppercase tracking-wider text-[#e8e4d9]">
            Wear Your Identity
          </h3>
          <p className="text-xs text-[#777] max-w-md mx-auto">
            Discover the current drop before it enters the permanent archive.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#e8e4d9] text-[#070707] font-semibold text-xs tracking-widest uppercase hover:bg-white transition-colors"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
