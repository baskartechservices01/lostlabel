import React from "react";
import { Check, Clock, AlertTriangle, Package, Truck, CheckCircle2 } from "lucide-react";

export default function OrderTimeline({ orderStatus, paymentStatus }) {
  const steps = [
    { key: "placed", label: "Order Placed", desc: "Order recorded in atelier system" },
    { key: "submitted", label: "Payment Submitted", desc: "UTR submitted, awaiting audit" },
    { key: "verified", label: "Payment Verified", desc: "Payment verified by admin" },
    { key: "processing", label: "Processing", desc: "Curating garments & quality audit" },
    { key: "packed", label: "Packed", desc: "Sealed in protective atelier packaging" },
    { key: "shipped", label: "Shipped", desc: "Handed over to priority courier" },
    { key: "out_for_delivery", label: "Out for Delivery", desc: "With local delivery personnel" },
    { key: "delivered", label: "Delivered", desc: "Package received" }
  ];

  // Map backend orderStatus & paymentStatus to timeline step index
  const getActiveStepIndex = () => {
    if (orderStatus === "cancelled" || paymentStatus === "rejected") return -1;
    if (orderStatus === "delivered") return 7;
    if (orderStatus === "out_for_delivery") return 6;
    if (orderStatus === "shipped") return 5;
    if (orderStatus === "packed") return 4;
    if (orderStatus === "processing") return 3;
    if (paymentStatus === "verified" || orderStatus === "confirmed") return 2;
    if (paymentStatus === "submitted") return 1;
    return 0; // pending
  };

  const activeIndex = getActiveStepIndex();
  const isRejected = paymentStatus === "rejected";
  const isCancelled = orderStatus === "cancelled";

  if (isRejected || isCancelled) {
    return (
      <div className="p-6 bg-rose-950/20 border border-rose-900/50 text-left space-y-2">
        <div className="flex items-center gap-3 text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h4 className="font-cinzel text-sm uppercase tracking-wider font-bold">
            {isRejected ? "Payment Verification Rejected" : "Order Cancelled"}
          </h4>
        </div>
        <p className="text-xs text-rose-300/80">
          {isRejected
            ? "The submitted UTR could not be reconciled with banking records. Please contact concierge support."
            : "This order has been cancelled."}
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 text-left">
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#222]">
        {steps.map((step, index) => {
          const isDone = index < activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.key} className="relative flex items-start gap-4">
              {/* Node indicator */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 ${
                  isDone
                    ? "bg-[#e8e4d9] text-[#070707] font-bold shadow-[0_0_15px_rgba(232,228,217,0.3)]"
                    : isCurrent
                    ? "bg-[#111] border-2 border-[#e8e4d9] text-[#e8e4d9] ring-4 ring-[#e8e4d9]/10 animate-pulse"
                    : "bg-[#141414] border border-[#262626] text-[#555]"
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : index + 1}
              </div>

              {/* Step info */}
              <div>
                <h5
                  className={`font-cinzel text-xs uppercase tracking-wider ${
                    isCurrent
                      ? "text-[#e8e4d9] font-bold"
                      : isDone
                      ? "text-[#b3b0a6]"
                      : "text-[#555]"
                  }`}
                >
                  {step.label}
                </h5>
                <p className="text-[11px] text-[#777] mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
