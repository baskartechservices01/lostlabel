import React from "react";
import { useLocation } from "react-router-dom";

export default function PolicyPage() {
  const location = useLocation();
  const path = location.pathname.replace("/", "");

  const contentMap = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "DATA CONFIDENTIALITY ATELIER",
      body: `At LOST LABEL, we treat your personal data with utmost discretion. We do not sell, rent, or trade your contact or delivery credentials with unauthorized third parties. Information collected during checkout (name, shipping destination, email, phone) is utilized strictly for order fulfillment, courier updates, and direct payment audit verification.`
    },
    terms: {
      title: "Terms of Service",
      subtitle: "TERMS OF USE & PURCHASE",
      body: `By placing an order on LOST LABEL, you agree to our direct UPI payment verification protocol. Order confirmation is subject to valid UTR submission and bank reconciliation. All drops are limited releases, and intellectual property including logos, trademarks, and garment graphics remain the exclusive property of LOST LABEL ESTD. 2026.`
    },
    shipping: {
      title: "Shipping & Dispatch",
      subtitle: "PRIORITY COURIER LOGISTICS",
      body: `All orders are dispatched via priority express logistics across India within 24–48 hours of payment verification. Standard transit times range between 3 to 5 business days depending on destination pincode. Complimentary shipping applies to all orders meeting or exceeding ₹1,999.`
    },
    returns: {
      title: "Returns & Exchanges",
      subtitle: "7-DAY ATELIER GUARANTEE",
      body: `We provide a 7-day size exchange guarantee on all unworn garments with original tags intact. Because all releases are produced in strictly numbered batches, refunds are processed only in the event of manufacturing defects verified by our quality control team.`
    }
  };

  const current = contentMap[path] || contentMap.privacy;

  return (
    <div className="w-full min-h-screen bg-[#070707] text-[#e8e4d9] pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8 text-left">
        <div className="border-b border-[#1c1c1c] pb-6">
          <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
            {current.subtitle}
          </span>
          <h1 className="font-cinzel text-3xl font-bold tracking-wider text-[#e8e4d9] uppercase mt-1">
            {current.title}
          </h1>
          <p className="text-xs text-[#666] mt-1">Last Updated: 2026 Edition</p>
        </div>

        <div className="p-8 bg-[#0c0c0c] border border-[#222] text-sm text-[#b3b0a6] leading-relaxed font-light space-y-4">
          <p>{current.body}</p>
          <div className="p-4 bg-[#141414] border border-[#262626] text-xs text-[#777]">
            <p><strong>Note for Client:</strong> This policy text can be updated with your exact legal terms via the atelier settings or code archive.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
