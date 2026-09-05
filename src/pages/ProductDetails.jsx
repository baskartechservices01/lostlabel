import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Plus, Minus, ArrowLeft, Truck, ShieldCheck, RefreshCw, Sparkles, Box } from "lucide-react";
import { getProductBySlug } from "../services/productService";
import { formatCurrency } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import ProductGallery from "../components/product/ProductGallery";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";


export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProductBySlug(slug).then((prod) => {
      setProduct(prod);
      if (prod) {
        setSelectedSize(prod.sizes?.[0] || "Standard");
        setSelectedColor(prod.colors?.[0] || "Standard");
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center pt-24 text-[#8e8b83]">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-2 border-[#e8e4d9] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-cinzel text-xs tracking-widest uppercase">Loading Drop Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center pt-24 text-[#e8e4d9] space-y-4">
        <h2 className="font-cinzel text-2xl uppercase">Piece Not Found</h2>
        <p className="text-xs text-[#777]">This drop may have concluded or has been archived.</p>
        <Link to="/shop" className="px-6 py-3 bg-[#e8e4d9] text-[#070707] text-xs uppercase tracking-widest font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = (product.stock || 0) <= 0;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate("/checkout");
  };

  return (
    <div className="w-full min-h-screen bg-[#070707] text-[#e8e4d9] pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        {/* Breadcrumb */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#777] hover:text-[#e8e4d9] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
        </Link>

        {/* Main Grid: Left Gallery, Right Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Gallery - 7 cols */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Details - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2 border-b border-[#1c1c1c] pb-6">
              <div className="flex items-center gap-2">
                <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
                  {product.category || "STREETWEAR"}
                </span>
                {product.featured && <Badge variant="ivory">Featured Drop</Badge>}
                {isOutOfStock && <Badge variant="low_stock">Sold Out</Badge>}
              </div>

              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wider text-[#e8e4d9] uppercase leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xl sm:text-2xl font-bold text-[#e8e4d9]">
                  {formatCurrency(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-[#666] line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                    <span className="text-xs text-red-400 font-semibold uppercase">
                      Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#b3b0a6] leading-relaxed font-light">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="uppercase tracking-widest text-[#8e8b83] text-[11px]">
                    Select Size
                  </span>
                  <span className="text-[11px] text-[#666] uppercase cursor-pointer hover:text-white">
                    Size Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-xs font-mono transition-all duration-200 border ${
                        selectedSize === s
                          ? "bg-[#e8e4d9] text-[#070707] font-bold border-[#e8e4d9] shadow-md"
                          : "bg-[#111] text-[#8e8b83] border-[#262626] hover:text-[#e8e4d9] hover:border-[#444]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="uppercase tracking-widest text-[#8e8b83] text-[11px] block">
                  Color: <strong className="text-[#e8e4d9]">{selectedColor}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3.5 py-1.5 text-xs transition-colors border ${
                        selectedColor === c
                          ? "bg-[#1f1f1f] text-[#e8e4d9] border-[#e8e4d9]"
                          : "bg-[#111] text-[#777] border-[#262626] hover:text-[#e8e4d9]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4 border-t border-[#1c1c1c]">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-widest text-[#8e8b83]">Quantity</span>
                <div className="inline-flex items-center border border-[#2a2a2a] bg-[#111]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock}
                    className="px-3 py-1.5 text-[#888] hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1 text-xs font-mono text-[#e8e4d9]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    disabled={isOutOfStock}
                    className="px-3 py-1.5 text-[#888] hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[11px] text-[#666]">
                  {isOutOfStock ? "Out of stock" : `${product.stock} units left in atelier`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="w-full"
                >
                  {addedAnimation ? "Added to Bag ✓" : "Add to Bag"}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Atelier Perks */}
            <div className="space-y-3 pt-6 border-t border-[#1c1c1c] text-xs text-[#777]">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#e8e4d9]" />
                <span>Complimentary Express Shipping on orders over ₹1,999</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#e8e4d9]" />
                <span>Official Lost Label Authenticity Guarantee & Certificate</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-[#e8e4d9]" />
                <span>7-Day Hassle-Free Size Exchange Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
