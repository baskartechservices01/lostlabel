import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, ExternalLink, ShieldCheck, Truck } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getThumbnailUrl } from "../../services/cloudinaryService";
import Button from "../common/Button";
import Badge from "../common/Badge";

export default function OrderVerificationModal({
  order,
  onVerify,
  onReject,
  onUpdateStatus,
  onClose
}) {
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!order) return null;

  const handleVerify = async () => {
    setLoading(true);
    try {
      await onVerify(order.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await onReject(order.id, rejectReason);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const fulfillmentOptions = [
    { label: "Confirmed", value: "confirmed" },
    { label: "Processing", value: "processing" },
    { label: "Packed", value: "packed" },
    { label: "Shipped", value: "shipped" },
    { label: "Out for Delivery", value: "out_for_delivery" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1f1f1f] gap-2">
        <div>
          <span className="font-editorial text-[9px] tracking-[0.25em] text-[#777]">
            ORDER RECORD
          </span>
          <h3 className="font-cinzel text-xl font-bold tracking-widest text-[#e8e4d9]">
            {order.orderNumber}
          </h3>
          <p className="text-xs text-[#666]">{formatDate(order.createdAt)}</p>
        </div>

        <div className="flex gap-2">
          <Badge variant={order.paymentStatus === "verified" ? "verified" : order.paymentStatus === "submitted" ? "submitted" : "pending"}>
            Payment: {order.paymentStatus}
          </Badge>
          <Badge variant="default">
            Status: {order.orderStatus}
          </Badge>
        </div>
      </div>

      {/* Payment Proof Audit Box */}
      <div className="p-4 bg-[#111] border border-[#262626] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9]">
            UPI Payment Verification
          </h4>
          <span className="font-bold text-sm text-[#e8e4d9]">
            {formatCurrency(order.total)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[#777]">Submitted UTR / Ref:</span>
            <p className="font-mono text-sm text-[#e8e4d9] font-bold mt-0.5">
              {order.transactionId || "— No UTR submitted yet —"}
            </p>
          </div>
          <div>
            <span className="text-[#777]">Customer Phone:</span>
            <p className="font-mono text-sm text-[#e8e4d9] mt-0.5">{order.phone}</p>
          </div>
        </div>

        {/* Screenshot Proof */}
        {order.paymentProofUrl ? (
          <div className="pt-2 border-t border-[#1a1a1a]">
            <span className="text-[11px] text-[#8e8b83] block mb-2">Uploaded Screenshot:</span>
            <a
              href={order.paymentProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block relative max-w-xs border border-[#333] hover:border-[#e8e4d9] transition-colors"
            >
              <img
                src={order.paymentProofUrl}
                alt="Payment Proof"
                className="w-full max-h-48 object-cover"
              />
              <span className="absolute bottom-1 right-1 px-2 py-0.5 bg-black/80 text-[10px] text-white flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> View Full
              </span>
            </a>
          </div>
        ) : (
          <p className="text-[11px] text-[#666] italic">No image screenshot attached.</p>
        )}

        {/* Verify / Reject Quick Action Buttons */}
        {order.paymentStatus !== "verified" && (
          <div className="pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleVerify}
              icon={CheckCircle2}
            >
              Verify Payment
            </Button>

            {!showRejectInput ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowRejectInput(true)}
                icon={XCircle}
              >
                Reject Payment
              </Button>
            ) : (
              <div className="flex items-center gap-2 w-full mt-2">
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection (e.g. invalid UTR)"
                  className="bg-[#0e0e0e] border border-red-800 text-xs px-3 py-2 flex-1 text-white"
                />
                <Button variant="danger" size="sm" onClick={handleReject} loading={loading}>
                  Confirm Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fulfillment Status Updater */}
      <div className="p-4 bg-[#0c0c0c] border border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="font-medium text-[#b3b0a6] uppercase tracking-wider">
          Fulfillment Status:
        </span>
        <select
          value={order.orderStatus}
          onChange={(e) => onUpdateStatus(order.id, e.target.value)}
          className="bg-[#141414] border border-[#282828] text-xs px-3 py-2 text-[#e8e4d9] uppercase tracking-wider focus:outline-none focus:border-[#e8e4d9]"
        >
          {fulfillmentOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Customer & Shipping Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-[#0a0a0a] border border-[#1c1c1c] space-y-1">
          <h5 className="font-cinzel text-[10px] tracking-widest text-[#777] uppercase mb-2">
            Customer Contact
          </h5>
          <p className="font-semibold text-[#e8e4d9]">{order.customerName}</p>
          <p className="text-[#888]">{order.email}</p>
          <p className="text-[#888]">{order.phone}</p>
        </div>

        <div className="p-4 bg-[#0a0a0a] border border-[#1c1c1c] space-y-1">
          <h5 className="font-cinzel text-[10px] tracking-widest text-[#777] uppercase mb-2">
            Shipping Address
          </h5>
          <p className="text-[#888]">{order.shippingAddress?.apartment}, {order.shippingAddress?.address}</p>
          <p className="text-[#888]">{order.shippingAddress?.area}, {order.shippingAddress?.city}</p>
          <p className="text-[#888]">{order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
        </div>
      </div>

      {/* Items in this order */}
      <div className="space-y-2">
        <h5 className="font-cinzel text-[10px] tracking-widest text-[#777] uppercase">
          Garments ({order.items?.length || 0})
        </h5>
        <div className="divide-y divide-[#181818] border-t border-b border-[#181818]">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img src={getThumbnailUrl(item.image)} alt="" className="w-8 h-10 object-cover" />
                <div>
                  <p className="text-[#e8e4d9] font-medium">{item.name}</p>
                  <p className="text-[10px] text-[#666] uppercase">{item.size} • {item.color} • Qty {item.quantity}</p>
                </div>
              </div>
              <span className="text-[#e8e4d9] font-mono">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
