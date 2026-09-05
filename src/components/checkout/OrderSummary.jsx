import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { getThumbnailUrl } from "../../services/cloudinaryService";
import { ShieldCheck, Truck } from "lucide-react";

export default function OrderSummary({ items = [], subtotal, deliveryFee, total, isFreeDelivery }) {
  return (
    <div className="bg-[#0c0c0c] border border-[#222] p-6 text-left space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1a1a1a]">
        <h3 className="font-cinzel text-sm uppercase tracking-widest text-[#e8e4d9]">
          Order Summary
        </h3>
        <span className="text-xs text-[#777] font-mono">{items.length} items</span>
      </div>

      {/* Items list */}
      <div className="divide-y divide-[#181818] max-h-72 overflow-y-auto pr-1 no-scrollbar">
        {items.map((item) => (
          <div key={item.itemKey} className="py-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-14 bg-[#141414] border border-[#222] flex-shrink-0">
                <img
                  src={getThumbnailUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e8e4d9] text-[#070707] rounded-full text-[9px] font-bold flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div>
                <p className="font-medium text-[#e8e4d9] line-clamp-1">{item.name}</p>
                <p className="text-[10px] text-[#777] uppercase font-mono">
                  {item.size} • {item.color}
                </p>
              </div>
            </div>
            <span className="font-medium text-[#e8e4d9]">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Math breakdown */}
      <div className="space-y-2 pt-4 border-t border-[#1a1a1a] text-xs text-[#8e8b83]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-[#e8e4d9]">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Delivery Fee</span>
          </span>
          <span>
            {isFreeDelivery ? (
              <span className="text-emerald-400 font-semibold uppercase">FREE</span>
            ) : (
              formatCurrency(deliveryFee)
            )}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold text-[#e8e4d9] pt-3 border-t border-[#1f1f1f]">
          <span>Total Due</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="p-3 bg-[#111] border border-[#222] flex items-center gap-2.5 text-[11px] text-[#888]">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>Direct UPI QR payment • Zero convenience fees • Secure Verification</span>
      </div>
    </div>
  );
}
