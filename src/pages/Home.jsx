import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Flame, Shield, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "../components/common/Icons";
import LostLabelScene from "../components/3d/LostLabelScene";
import ProductCard from "../components/product/ProductCard";
import { getProducts } from "../services/productService";


export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ onlyActive: true, sortBy: "featured" }).then((prods) => {
      setFeaturedProducts(prods.slice(0, 4));
      setLoading(false);
    });
  }, []);

  const categories = [
    {
      name: "T-Shirts",
      tag: "280 GSM French Terry",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: "Hoodies",
      tag: "450 GSM Structured Fleece",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: "Jackets",
      tag: "Tactical Ripstop Outerwear",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: "Pants",
      tag: "Architectural Cargo Cuts",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="w-full bg-[#070707] text-[#e8e4d9] overflow-hidden">
      {/* 1. Full-screen 3D WebGL Hero */}
      <LostLabelScene />

      {/* 2. SECTION 1: Featured Collection */}
      <section id="featured" className="py-24 px-6 max-w-7xl mx-auto text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#1c1c1c] pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8e4d9]" />
              <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
                CURATED RELEASE
              </span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wider text-[#e8e4d9] uppercase">
              Featured Drops
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e8e4d9] hover:text-white group"
          >
            <span>View Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-[#111] animate-pulse border border-[#222]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id || prod.slug} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 3. SECTION 2: Editorial Drop Spotlight */}
      <section className="relative py-20 bg-[#0a0a0a] border-y border-[#181818]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <div className="relative aspect-[4/5] bg-[#141414] border border-[#242424] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop"
              alt="Editorial drop model"
              className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="font-editorial text-[9px] tracking-[0.3em] text-[#8e8b83]">
                SERIES 01 // NOIR
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#e8e4d9] uppercase mt-1">
                Architectural Fleece
              </h3>
            </div>
          </div>

          <div className="space-y-6 lg:pl-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#222]">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-editorial text-[10px] tracking-[0.25em] text-[#b3b0a6]">
                LIMITED EDITION DROP
              </span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-[#e8e4d9] uppercase leading-tight">
              NOT MADE TO BLEND IN.
            </h2>

            <p className="text-sm text-[#8e8b83] font-light leading-relaxed">
              Every garment in the Lost Label atelier is crafted from premium heavyweight raw fibers,
              sculpted with relaxed architectural shoulders and reinforced with precision crosshair stitchwork.
              A synthesis of underground digital subculture and timeless luxury tailoring.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-[#e8e4d9] text-[#070707] font-semibold text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors"
              >
                Shop The Drop
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border border-[#2a2a2a] text-[#e8e4d9] hover:border-[#8e8b83] font-medium text-xs tracking-[0.2em] uppercase transition-colors"
              >
                Atelier Manifesto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: Shop Categories Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-left">
        <div className="mb-12 border-b border-[#1c1c1c] pb-6">
          <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
            DISCOVER SILHOUETTES
          </span>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wider text-[#e8e4d9] uppercase mt-1">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.name}`}
              className="group relative aspect-[3/4] bg-[#111] border border-[#222] overflow-hidden flex flex-col justify-end p-6"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="relative z-10 space-y-1">
                <span className="font-mono text-[10px] text-[#8e8b83] uppercase">
                  {cat.tag}
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#e8e4d9] uppercase group-hover:text-white flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. SECTION 4: Brand Story Statement */}
      <section className="py-24 bg-[#050505] border-y border-[#181818] relative">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full p-1 border border-[#262626]">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
          </div>

          <span className="font-editorial text-xs tracking-[0.35em] text-[#8e8b83] uppercase block">
            THE LOST LABEL PHILOSOPHY
          </span>

          <blockquote className="font-cinzel text-2xl sm:text-4xl text-[#e8e4d9] font-medium leading-relaxed uppercase tracking-wider">
            "We do not design clothes for conformity. We construct armor for identity."
          </blockquote>

          <p className="text-xs sm:text-sm text-[#777] max-w-xl mx-auto leading-relaxed">
            LOST LABEL was founded in 2026 with a solitary doctrine: to bridge avant-garde
            architectural draping with raw streetwear durability. Every collection is produced in strictly limited quantities.
          </p>
        </div>
      </section>

      {/* 6. SECTION 5: Instagram Community Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#1c1c1c] pb-6 gap-4">
          <div>
            <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
              COMMUNITY CURATION
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wider text-[#e8e4d9] uppercase mt-1">
              Follow On Instagram
            </h2>
          </div>

          <a
            href="https://instagram.com/lostlabel.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e8e4d9] hover:text-white"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>@lostlabel.in</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=400&auto=format&fit=crop"
          ].map((imgUrl, i) => (
            <a
              key={i}
              href="https://instagram.com/lostlabel.in"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square bg-[#111] overflow-hidden group border border-[#222]"
            >
              <img
                src={imgUrl}
                alt="Instagram post preview"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <InstagramIcon className="w-6 h-6 text-white" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
