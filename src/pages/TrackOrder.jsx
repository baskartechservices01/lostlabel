import React, { useState } from "react";
import { Search, ShieldAlert, ArrowRight, Package } from "lucide-react";
import { getOrderByNumberAndPhone } from "../services/orderService";
import OrderTimeline from "../components/order/OrderTimeline";
import OrderReceipt from "../components/order/OrderReceipt";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setError("Both Order Number and Phone Number are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const found = await getOrderByNumberAndPhone(orderNumber, phone);
      if (!found) {
        setError("No matching order found. Please check your Order # (e.g. LL-2026-XXXX) and 10-digit mobile number.");
        setOrder(null);
      } else {
        setOrder(found);
      }
    } catch (err) {
      setError("Error locating order archive.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#070707] text-[#e8e4d9] pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8 text-left">
        <div className="border-b border-[#1c1c1c] pb-6">
          <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
            DISPATCH TRACKING
          </span>
          <h1 className="font-cinzel text-3xl font-bold tracking-wider text-[#e8e4d9] uppercase mt-1">
            Track Your Order
          </h1>
          <p className="text-xs text-[#777] mt-1">
            Enter your order number and phone number used during checkout to monitor live atelier progress.
          </p>
        </div>

        {/* Verification Query Form */}
        <form onSubmit={handleTrack} className="bg-[#0c0c0c] border border-[#222] p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Order Number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="e.g. LL-2026-1042"
              required
            />
            <Input
              label="Mobile Number (10 Digits)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              type="tel"
              maxLength={10}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Locate Dispatch
          </Button>
        </form>

        {/* Results Timeline and Receipt */}
        {order && (
          <div className="space-y-8 pt-4">
            <div className="bg-[#0c0c0c] border border-[#222] p-6 sm:p-8">
              <div className="border-b border-[#1c1c1c] pb-4 mb-4">
                <span className="font-editorial text-[9px] tracking-[0.25em] text-[#777]">
                  LIVE ATELIER STATUS
                </span>
                <h3 className="font-cinzel text-lg font-bold tracking-wider text-[#e8e4d9] uppercase">
                  Fulfillment Pipeline
                </h3>
              </div>

              <OrderTimeline
                orderStatus={order.orderStatus}
                paymentStatus={order.paymentStatus}
              />
            </div>

            <OrderReceipt order={order} />
          </div>
        )}
      </div>
    </div>
  );
}
