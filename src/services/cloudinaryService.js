/**
 * LOST LABEL - Cloudinary Media Service
 * Handles client-safe unsigned uploads and responsive CDN optimization.
 * Secrets are never exposed to frontend code.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

/**
 * Upload an image using an unsigned upload preset restricted to product folders
 */
export const uploadProductImage = async (file, productId = "catalog") => {
  if (!file) throw new Error("No file selected for upload.");

  // If Cloudinary is not configured yet, generate a local preview URL
  if (!isCloudinaryConfigured) {
    console.warn("Cloudinary not configured in .env. Returning local preview data.");
    const previewUrl = URL.createObjectURL(file);
    return {
      url: previewUrl,
      publicId: `local_${Date.now()}_${file.name}`,
      width: 1200,
      height: 1500,
      format: file.type.split("/")[1] || "jpg",
      isLocalFallback: true
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `lost-label/products/${productId}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Cloudinary image upload failed.");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format
  };
};

/**
 * Upload payment verification proof (UTR screenshot) to protected folder
 */
export const uploadPaymentProof = async (file) => {
  if (!file) throw new Error("No file provided for payment proof.");

  if (!isCloudinaryConfigured) {
    const previewUrl = URL.createObjectURL(file);
    return {
      url: previewUrl,
      publicId: `proof_local_${Date.now()}`,
      isLocalFallback: true
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "lost-label/payment-proofs");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Payment proof upload failed.");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id
  };
};

/**
 * Generate an optimized Cloudinary delivery URL with responsive widths and auto WebP/AVIF
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return "/logo.jpg";
  if (!url.includes("res.cloudinary.com")) return url;

  const { width = 800, quality = "auto", format = "auto", crop = "limit" } = options;
  const transformations = `f_${format},q_${quality},w_${width},c_${crop}`;

  // Insert transformations right after /upload/
  return url.replace("/upload/", `/upload/${transformations}/`);
};

/**
 * Thumbnail shortcut for cart, product cards and admin tables
 */
export const getThumbnailUrl = (url) => {
  return getOptimizedImageUrl(url, { width: 300, crop: "fill" });
};
