import React from "react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getThumbnailUrl } from "../../services/cloudinaryService";
import Badge from "../common/Badge";

export default function OrderReceipt({ order }) {
  if (!order) return null;

  return (
    <div className="bg-[#0c0c0c] border border-[#222] p-6 sm:p-8 text-left space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1c1c1c] gap-4">
        <div>
          <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83] block">
            OFFICIAL ORDER ARCHIVE
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-[#e8e4d9] uppercase">
            {order.orderNumber}
          </h2>
          <p className="text-xs text-[#666] mt-1">{formatDate(order.createdAt)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={order.paymentStatus === "verified" ? "verified" : order.paymentStatus === "submitted" ? "submitted" : "pending"}>
            Payment: {order.paymentStatus}
          </Badge>
          <Badge variant="default">
            Status: {order.orderStatus.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      {/* Items list */}
      <div>
        <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#8e8b83] mb-4">
          Items Ordered
        </h4>
        <div className="divide-y divide-[#181818]">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-14 bg-[#141414] border border-[#222] overflow-hidden flex-shrink-0">
                  <img
                    src={getThumbnailUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-[#e8e4d9]">{item.name}</p>
                  <p className="text-[10px] text-[#777] uppercase font-mono">
                    Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-[#e8e4d9]">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Breakdown & Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#1c1c1c] text-xs">
        <div>
          <h4 className="font-cinzel text-[11px] uppercase tracking-widest text-[#8e8b83] mb-2">
            Shipping Destination
          </h4>
          <div className="text-[#b3b0a6] space-y-0.5 leading-relaxed">
            <p className="font-semibold text-[#e8e4d9]">{order.customerName}</p>
            <p>{order.shippingAddress?.apartment}, {order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.area}, {order.shippingAddress?.city}</p>
            <p>{order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            <p className="text-[#777] pt-1">Phone: {order.phone}</p>
            <p className="text-[#777]">Email: {order.email}</p>
          </div>
        </div>

        <div className="space-y-2 text-[#8e8b83]">
          <h4 className="font-cinzel text-[11px] uppercase tracking-widest text-[#8e8b83] mb-2">
            Payment Summary
          </h4>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-[#e8e4d9]">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="text-[#e8e4d9]">
              {order.deliveryFee === 0 ? "FREE" : formatCurrency(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-sm text-[#e8e4d9] pt-2 border-t border-[#181818]">
            <span>Total Paid / Due</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          {order.transactionId && (
            <div className="pt-2 text-[11px] text-[#777]">
              <span>UTR Reference: </span>
              <span className="text-[#e8e4d9] font-mono">{order.transactionId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
