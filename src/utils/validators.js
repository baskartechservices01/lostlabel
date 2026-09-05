export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\+]/g, "");
  // Indian phone: 10 digits or 12 with 91 prefix
  return /^(91)?[6-9]\d{9}$/.test(cleaned);
};

export const isValidPincode = (pincode) => {
  if (!pincode) return false;
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
};

export const isValidUTR = (utr) => {
  if (!utr) return false;
  const cleaned = utr.trim();
  // Standard Indian banking UTR is typically 12-16 characters alphanumeric
  return /^[a-zA-Z0-9]{8,22}$/.test(cleaned);
};
