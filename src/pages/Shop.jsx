import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/product/ProductGrid";
import { getProducts } from "../services/productService";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ onlyActive: true }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#070707] text-[#e8e4d9] pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        {/* Header */}
        <div className="border-b border-[#1c1c1c] pb-8">
          <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
            ATELIER CATALOGUE
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-[#e8e4d9] uppercase mt-1">
            The Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#777] max-w-md mt-2">
            Limited drops, heavyweight fabrics, and architectural cuts. All garments crafted in 2026.
          </p>
        </div>

        {/* Product Grid with live filtering */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="aspect-[3/4] bg-[#111] animate-pulse border border-[#222]" />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} initialCategory={initialCat} />
        )}
      </div>
    </div>
  );
}
