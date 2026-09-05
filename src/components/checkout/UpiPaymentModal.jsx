import React, { useState, useEffect } from "react";
import { Copy, Check, QrCode, ArrowRight, Upload, AlertCircle } from "lucide-react";
import { generateUpiPaymentUrl, generateQrCodeDataUrl, copyToClipboard } from "../../services/paymentService";
import { uploadPaymentProof } from "../../services/cloudinaryService";
import { submitPaymentProof } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatters";
import Button from "../common/Button";

export default function UpiPaymentModal({
  order,
  storeSettings,
  onPaymentSubmitted,
  onClose
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [upiUrl, setUpiUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upiId = storeSettings.upiId || "lostlabel@upi";
  const payeeName = storeSettings.upiName || "LOST LABEL STREETWEAR";

  useEffect(() => {
    if (!order) return;
    try {
      const url = generateUpiPaymentUrl({
        upiId,
        payeeName,
        amount: order.total,
        orderNumber: order.orderNumber
      });
      setUpiUrl(url);
      generateQrCodeDataUrl(url).then(setQrCodeUrl);
    } catch (e) {
      console.error("Failed to generate UPI payment URL:", e);
    }
  }, [order, upiId, payeeName]);

  const handleCopyUpi = async () => {
    const success = await copyToClipboard(upiId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Screenshot must be under 5MB.");
        return;
      }
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!utr.trim() || utr.trim().length < 6) {
      setError("Please enter a valid 12-digit UTR or Transaction Reference number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let paymentProofUrl = "";
      let paymentProofPublicId = "";

      // Optional upload screenshot to Cloudinary
      if (screenshotFile) {
        const uploadRes = await uploadPaymentProof(screenshotFile);
        paymentProofUrl = uploadRes.url;
        paymentProofPublicId = uploadRes.publicId;
      }

      await submitPaymentProof({
        orderNumber: order.orderNumber,
        transactionId: utr.trim(),
        paymentProofUrl,
        paymentProofPublicId
      });

      if (onPaymentSubmitted) {
        onPaymentSubmitted();
      }
    } catch (err) {
      setError(err.message || "Failed to submit payment verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="text-center space-y-1">
        <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
          ORDER NO: {order.orderNumber}
        </span>
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#e8e4d9] uppercase">
          Pay {formatCurrency(order.total)}
        </h2>
        <p className="text-xs text-[#777]">
          Scan with any UPI App: GPay, PhonePe, Paytm, or BHIM
        </p>
      </div>

      {/* QR Code Presentation */}
      <div className="flex flex-col items-center justify-center p-6 bg-[#111] border border-[#262626] relative">
        <div className="w-56 h-56 bg-white p-3 rounded-none shadow-2xl flex items-center justify-center">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Lost Label UPI QR Code"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="animate-pulse flex items-center justify-center text-black text-xs font-mono">
              Generating Dynamic QR...
            </div>
          )}
        </div>

        {/* UPI Details & Copy */}
        <div className="mt-4 flex items-center gap-2 text-xs bg-[#0c0c0c] border border-[#2a2a2a] px-3.5 py-2 w-full max-w-xs justify-between">
          <div className="truncate">
            <span className="text-[#666] mr-1">UPI ID:</span>
            <span className="text-[#e8e4d9] font-mono">{upiId}</span>
          </div>
          <button
            onClick={handleCopyUpi}
            className="text-[#8e8b83] hover:text-[#e8e4d9] transition-colors p-1"
            title="Copy UPI ID"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Mobile App Intent Link */}
        {upiUrl && (
          <a
            href={upiUrl}
            className="mt-3 inline-flex sm:hidden items-center gap-2 text-xs uppercase tracking-widest text-[#e8e4d9] underline underline-offset-4"
          >
            <span>Open in UPI App</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* UTR & Screenshot Verification Form */}
      <form onSubmit={handleSubmitProof} className="space-y-4 pt-2">
        <div className="border-t border-[#1c1c1c] pt-4">
          <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9] mb-1">
            Submit Payment Proof
          </h4>
          <p className="text-xs text-[#777]">
            After making the payment, enter the 12-digit UTR/Ref number from your banking app.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8e8b83] mb-1.5">
            UTR / Transaction ID <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder="e.g. 425612349876"
            className="w-full bg-[#0e0e0e] border border-[#262626] px-4 py-3 text-sm text-[#e8e4d9] placeholder-[#555] font-mono focus:outline-none focus:border-[#e8e4d9]"
          />
        </div>

        {/* Optional Screenshot */}
        <div>
          <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8e8b83] mb-1.5">
            Payment Screenshot (Optional)
          </label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-[#141414] border border-[#262626] text-xs text-[#b3b0a6] hover:text-[#e8e4d9] hover:border-[#383838] transition-colors uppercase tracking-wider">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {screenshotFile && (
              <span className="text-xs text-emerald-400 truncate max-w-xs">
                {screenshotFile.name}
              </span>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full mt-4"
        >
          Confirm Payment & Submit
        </Button>
      </form>
    </div>
  );
}
