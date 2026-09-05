import React, { useState } from "react";
import { Upload, X, Trash2, Plus, AlertCircle } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import { uploadProductImage, isCloudinaryConfigured } from "../../services/cloudinaryService";

export default function ProductForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "T-Shirts",
    price: initialData?.price || "",
    compareAtPrice: initialData?.compareAtPrice || "",
    description: initialData?.description || "",
    stock: initialData?.stock || 25,
    featured: initialData?.featured || false,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    sizes: initialData?.sizes || ["S", "M", "L", "XL"],
    colors: initialData?.colors || ["Noir Black"],
    tags: initialData?.tags?.join(", ") || "Heavyweight, Streetwear",
    images: initialData?.images || []
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categories = ["T-Shirts", "Shirts", "Hoodies", "Jackets", "Pants", "Accessories"];
  const standardSizes = ["XS", "S", "M", "L", "XL", "XXL", "30", "32", "34", "36", "One Size"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size]
      };
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadPromises = files.map((file) =>
        uploadProductImage(file, formData.slug || "new-item")
      );
      const uploadedResults = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedResults]
      }));
    } catch (err) {
      setError(err.message || "Failed to upload product image.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        stock: Number(formData.stock || 0),
        tags: tagsArray
      };

      await onSave(payload);
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-4xl mx-auto">
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic details */}
      <div className="bg-[#0c0c0c] border border-[#222] p-6 space-y-4">
        <h3 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9] pb-2 border-b border-[#1c1c1c]">
          General Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product Title"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Lost Label Acid Washed Tee"
            required
          />

          <div>
            <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8e8b83] mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-[#0e0e0e] border border-[#262626] px-4 py-3 text-sm text-[#e8e4d9] focus:outline-none focus:border-[#e8e4d9]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Price (₹ INR)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="1999"
            required
          />

          <Input
            label="Compare-at Price (₹ INR)"
            name="compareAtPrice"
            type="number"
            value={formData.compareAtPrice}
            onChange={handleChange}
            placeholder="2499 (Optional)"
          />

          <Input
            label="Inventory Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="50"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8e8b83] mb-1.5">
            Product Story / Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Architectural drop-shoulder fit, 280 GSM luxury combed French Terry..."
            className="w-full bg-[#0e0e0e] border border-[#262626] p-4 text-sm text-[#e8e4d9] placeholder-[#555] focus:outline-none focus:border-[#e8e4d9]"
          />
        </div>
      </div>

      {/* Media Uploads */}
      <div className="bg-[#0c0c0c] border border-[#222] p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1c1c1c]">
          <h3 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9]">
            Cloudinary Media Pipeline
          </h3>
          {!isCloudinaryConfigured && (
            <span className="text-[10px] text-amber-400 font-mono">
              [Development Mode: Cloudinary keys optional]
            </span>
          )}
        </div>

        {/* Existing Images */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {formData.images.map((img, idx) => (
            <div key={idx} className="relative aspect-[3/4] bg-[#141414] border border-[#262626] overflow-hidden group">
              <img src={img.url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-black/80 text-rose-400 hover:text-rose-200 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Upload Box */}
          <label className="aspect-[3/4] border-2 border-dashed border-[#262626] hover:border-[#8e8b83] transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center">
            <Upload className="w-6 h-6 text-[#777] mb-2" />
            <span className="text-xs text-[#b3b0a6] uppercase tracking-wider font-medium">
              {uploading ? "Uploading..." : "+ Add Images"}
            </span>
            <span className="text-[10px] text-[#555] mt-1">PNG, JPG, WebP up to 10MB</span>
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={uploading}
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Sizes and Toggles */}
      <div className="bg-[#0c0c0c] border border-[#222] p-6 space-y-4">
        <h3 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9] pb-2 border-b border-[#1c1c1c]">
          Sizes & Visibility
        </h3>

        <div>
          <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8e8b83] mb-2">
            Available Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {standardSizes.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-1.5 text-xs font-mono transition-colors border ${
                  formData.sizes.includes(size)
                    ? "bg-[#e8e4d9] text-[#070707] font-bold border-[#e8e4d9]"
                    : "bg-[#111] text-[#777] border-[#262626] hover:text-[#e8e4d9]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Tags (Comma separated)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Oversized, Heavyweight, Acid Wash"
        />

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-[#b3b0a6]">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 accent-[#e8e4d9]"
            />
            <span>Mark as Featured Drop</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-[#b3b0a6]">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 accent-[#e8e4d9]"
            />
            <span>Active on Storefront</span>
          </label>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={saving}>
          Save Product
        </Button>
      </div>
    </form>
  );
}
