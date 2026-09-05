import QRCode from "qrcode";

/**
 * Constructs standard UPI deep-link URI
 * Spec: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
 */
export const generateUpiPaymentUrl = ({ upiId, payeeName, amount, orderNumber }) => {
  if (!upiId) throw new Error("UPI ID is required to generate payment link.");
  
  const cleanUpi = upiId.trim();
  const cleanName = (payeeName || "Lost Label").trim();
  const formattedAmount = Number(amount || 0).toFixed(2);
  const cleanNote = (orderNumber || "Lost Label Order").trim();

  const params = new URLSearchParams({
    pa: cleanUpi,
    pn: cleanName,
    am: formattedAmount,
    cu: "INR",
    tn: cleanNote
  });

  return `upi://pay?${params.toString()}`;
};

/**
 * Generates high-resolution QR code data URL (Base64 PNG)
 */
export const generateQrCodeDataUrl = async (paymentUrl) => {
  try {
    const dataUrl = await QRCode.toDataURL(paymentUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: "#050505",
        light: "#FFFFFF"
      },
      errorCorrectionLevel: "H"
    });
    return dataUrl;
  } catch (error) {
    console.error("Error generating UPI QR code:", error);
    throw error;
  }
};

/**
 * Copy text helper with navigator clipboard fallback
 */
export const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};
