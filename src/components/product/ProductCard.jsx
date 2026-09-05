import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { getOptimizedImageUrl, getThumbnailUrl } from "../../services/cloudinaryService";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const mainImage = product.images?.[0]?.url || "/logo.jpg";
  const hoverImage = product.images?.[1]?.url || mainImage;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0], product.colors?.[0], 1);
  };

  return (
    <div
      className="group relative flex flex-col text-left transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#111] border border-[#222] group-hover:border-[#3a3a3a] transition-colors duration-300"
      >
        <img
          src={getOptimizedImageUrl(isHovered ? hoverImage : mainImage, { width: 600 })}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="px-2 py-0.5 bg-[#070707]/90 border border-[#333] text-[#e8e4d9] text-[9px] uppercase tracking-widest font-semibold backdrop-blur-sm">
              Featured Drop
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-red-950/80 border border-red-800/60 text-red-300 text-[9px] uppercase tracking-widest font-semibold backdrop-blur-sm">
              Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-[#1f1f1f] text-[#888] text-[9px] uppercase tracking-widest">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 bg-[#e8e4d9] text-[#070707] text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-white transition-colors flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="pt-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="font-editorial text-[10px] tracking-[0.25em] text-[#777] uppercase block mb-1">
            {product.category || "Collection"}
          </span>
          <Link
            to={`/product/${product.slug}`}
            className="font-cinzel text-xs sm:text-sm text-[#e8e4d9] group-hover:text-white transition-colors line-clamp-1 uppercase tracking-wider font-semibold"
          >
            {product.name}
          </Link>
        </div>

        {/* Sizes and Price */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#181818]">
          <div className="flex items-center gap-1.5">
            {product.sizes?.slice(0, 4).map((s) => (
              <span
                key={s}
                className="text-[9px] text-[#888] font-mono px-1.5 py-0.5 border border-[#222] bg-[#0c0c0c]"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-[11px] text-[#666] line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
            <span className="text-xs font-semibold text-[#e8e4d9]">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
