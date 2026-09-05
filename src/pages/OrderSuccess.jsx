import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck, QrCode } from "lucide-react";
import { getOrderByNumber } from "../services/orderService";
import { getStoreSettings } from "../services/settingsService";
import { formatCurrency } from "../utils/formatters";
import OrderReceipt from "../components/order/OrderReceipt";
import UpiPaymentModal from "../components/checkout/UpiPaymentModal";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";


export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [storeSettings, setStoreSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    Promise.all([
      getOrderByNumber(orderNumber),
      getStoreSettings()
    ]).then(([orderData, settings]) => {
      setOrder(orderData);
      setStoreSettings(settings);
      setLoading(false);

      if (orderData?.paymentStatus === "verified") {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    });
  }, [orderNumber]);

  const refreshOrder = async () => {
    const updated = await getOrderByNumber(orderNumber);
    setOrder(updated);
    if (updated?.paymentStatus === "verified") {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center text-[#8e8b83]">
        <p className="font-cinzel text-xs tracking-widest uppercase">Retrieving Order Archive...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center text-[#e8e4d9] space-y-4">
        <h2 className="font-cinzel text-2xl uppercase">Order Record Not Found</h2>
        <Link to="/shop" className="px-6 py-3 bg-[#e8e4d9] text-[#070707] text-xs uppercase font-bold">
          Return to Atelier
        </Link>
      </div>
    );
  }

  const isPending = order.paymentStatus === "pending";
  const isSubmitted = order.paymentStatus === "submitted";
  const isVerified = order.paymentStatus === "verified";

  return (
    <div className="w-full min-h-screen bg-[#070707] text-[#e8e4d9] pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-8 text-center sm:text-left">
        {/* Status Callout */}
        <div className="p-8 bg-[#0c0c0c] border border-[#222] text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            {isVerified ? (
              <CheckCircle2 className="w-14 h-14 text-emerald-400" />
            ) : isSubmitted ? (
              <Clock className="w-14 h-14 text-blue-400 animate-pulse" />
            ) : (
              <QrCode className="w-14 h-14 text-amber-400" />
            )}
          </div>

          <div className="space-y-1">
            <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
              LOST LABEL ATELIER CONFIRMATION
            </span>
            <h1 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wider text-[#e8e4d9] uppercase">
              {isVerified
                ? "Payment Verified • Order Confirmed"
                : isSubmitted
                ? "Payment Submitted — Awaiting Verification"
                : "Order Received — Complete UPI Payment"}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-[#8e8b83] max-w-lg mx-auto">
            {isVerified
              ? "Your payment is verified and your garments are entering fulfillment."
              : isSubmitted
              ? `UTR ${order.transactionId || ""} has been recorded. Our atelier admins reconcile UPI transactions within 1-2 hours.`
              : "Please scan the UPI QR code below with your UPI app and submit your transaction ID to confirm the order."}
          </p>

          {isPending && (
            <div className="pt-2">
              <Button variant="primary" size="lg" onClick={() => setShowPayModal(true)}>
                Scan UPI QR & Submit UTR
              </Button>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link
              to="/track-order"
              className="inline-flex items-center gap-1.5 text-[#e8e4d9] hover:underline underline-offset-4 uppercase tracking-widest"
            >
              <span>Track Order Live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[#444]">•</span>
            <Link
              to="/shop"
              className="text-[#8e8b83] hover:text-[#e8e4d9] uppercase tracking-widest"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Detailed Order Receipt */}
        <OrderReceipt order={order} />
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <Modal
          isOpen={showPayModal}
          onClose={() => setShowPayModal(false)}
          title="Direct UPI Payment"
        >
          <UpiPaymentModal
            order={order}
            storeSettings={storeSettings}
            onPaymentSubmitted={() => {
              setShowPayModal(false);
              refreshOrder();
            }}
            onClose={() => setShowPayModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
