import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatters";
import CartItem from "../components/cart/CartItem";
import Button from "../components/common/Button";

export default function CartPage() {
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    isFreeDelivery,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#070707] text-[#e8e4d9] pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#111] border border-[#262626] flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-[#555]" />
        </div>
        <h2 className="font-cinzel text-2xl uppercase tracking-widest text-[#e8e4d9]">
          Your Bag is Empty
        </h2>
        <p className="text-xs text-[#777] max-w-sm">
          No garments currently in your collection. Explore our latest drops and architectural cuts.
        </p>
        <Link
          to="/shop"
          className="mt-4 px-8 py-4 bg-[#e8e4d9] text-[#070707] font-semibold text-xs tracking-widest uppercase hover:bg-white transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#070707] text-[#e8e4d9] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-8 text-left">
        <div className="flex items-center justify-between pb-6 border-b border-[#1c1c1c]">
          <div>
            <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
              ORDER SELECTION
            </span>
            <h1 className="font-cinzel text-3xl font-bold tracking-wider text-[#e8e4d9] uppercase mt-1">
              Shopping Bag ({items.length})
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="text-xs uppercase tracking-widest text-[#666] hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Free Shipping Alert */}
        <div className="p-4 bg-[#111] border border-[#222] flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Truck className="w-4 h-4 text-[#e8e4d9]" />
            {isFreeDelivery ? (
              <span className="text-emerald-400 font-medium">
                You have unlocked FREE Atelier Delivery!
              </span>
            ) : (
              <span className="text-[#8e8b83]">
                Add <strong className="text-[#e8e4d9]">{formatCurrency(amountNeededForFreeDelivery)}</strong> more to receive FREE delivery across India.
              </span>
            )}
          </div>
          <div className="hidden sm:block w-48 bg-[#222] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#e8e4d9] h-full"
              style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 bg-[#0c0c0c] border border-[#222] p-6 divide-y divide-[#1c1c1c]">
            {items.map((item) => (
              <CartItem
                key={item.itemKey}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Order Summary Checkout Card */}
          <div className="lg:col-span-4 bg-[#0c0c0c] border border-[#222] p-6 space-y-6">
            <h3 className="font-cinzel text-sm uppercase tracking-widest text-[#e8e4d9] pb-4 border-b border-[#1c1c1c]">
              Summary
            </h3>

            <div className="space-y-3 text-xs text-[#8e8b83]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#e8e4d9] font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {isFreeDelivery ? (
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#e8e4d9] pt-3 border-t border-[#1a1a1a]">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/checkout")}
              className="w-full"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
