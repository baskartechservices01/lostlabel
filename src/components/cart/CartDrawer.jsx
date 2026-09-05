import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatters";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    subtotal,
    deliveryFee,
    total,
    isFreeDelivery,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    updateQuantity,
    removeFromCart
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#0a0a0a] border-l border-[#222] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#1c1c1c] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#e8e4d9]" />
                  <h3 className="font-cinzel text-sm uppercase tracking-widest text-[#e8e4d9]">
                    Your Cart ({items.length})
                  </h3>
                </div>
                <button
                  onClick={closeCart}
                  className="text-[#8e8b83] hover:text-[#e8e4d9] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="px-6 py-3 bg-[#111] border-b border-[#1c1c1c]">
                <div className="flex items-center gap-2 text-xs text-[#b3b0a6] mb-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#e8e4d9]" />
                  {isFreeDelivery ? (
                    <span className="text-emerald-400 font-medium">
                      Unlocked FREE Delivery!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-[#e8e4d9]">{formatCurrency(amountNeededForFreeDelivery)}</strong> more for FREE delivery
                    </span>
                  )}
                </div>
                <div className="w-full bg-[#222] h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-[#e8e4d9] h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#242424] flex items-center justify-center">
                      <ShoppingBag className="w-7 h-7 text-[#555]" />
                    </div>
                    <h4 className="font-cinzel text-sm tracking-wider text-[#e8e4d9] uppercase">
                      Cart is empty
                    </h4>
                    <p className="text-xs text-[#777] max-w-xs">
                      Explore the latest drops and add pieces to your collection.
                    </p>
                    <button
                      onClick={() => {
                        closeCart();
                        navigate("/shop");
                      }}
                      className="mt-2 px-6 py-3 bg-[#e8e4d9] text-[#070707] text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  <div>
                    {items.map((item) => (
                      <CartItem
                        key={item.itemKey}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer / Summary */}
              {items.length > 0 && (
                <div className="p-6 border-t border-[#1c1c1c] bg-[#0c0c0c] space-y-4">
                  <div className="space-y-1.5 text-xs text-[#8e8b83]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#e8e4d9]">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>
                        {isFreeDelivery ? (
                          <span className="text-emerald-400 font-medium">FREE</span>
                        ) : (
                          formatCurrency(deliveryFee)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-[#e8e4d9] pt-2 border-t border-[#1f1f1f]">
                      <span>Estimated Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 bg-[#e8e4d9] text-[#070707] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#faf7f0] transition-colors flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(232,228,217,0.15)]"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={closeCart}
                      className="w-full py-3 text-xs uppercase tracking-widest text-[#777] hover:text-[#e8e4d9] transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
