export const DEFAULT_STORE_SETTINGS = {
  brandName: "LOST LABEL",
  tagline: "STREETWEAR • ESTD. 2026",
  upiId: "lostlabel@upi",
  upiName: "LOST LABEL STREETWEAR",
  deliveryFee: 99,
  freeDeliveryThreshold: 1999,
  contactPhone: "+91 98765 43210",
  email: "concierge@lostlabel.com",
  instagramUrl: "https://instagram.com/lostlabel.in",
  address: "Studio 04, Underground Atelier, Indiranagar, Bengaluru, KA 560038, India"
};

export const SAMPLE_PRODUCTS = [
  {
    name: "Lost Label Oversized Heavyweight Black Tee",
    slug: "lost-label-oversized-heavyweight-black-tee",
    category: "T-Shirts",
    price: 1899,
    compareAtPrice: 2499,
    description: "Engineered from 280 GSM luxury combed French Terry cotton. Features an architectural drop-shoulder silhouette, thick ribbed collar, and high-density puffed screenprint of the ornamental Lost Label gothic monogram and Estd. 2026 seal.",
    featured: true,
    isActive: true,
    stock: 45,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Noir Black", "Washed Charcoal"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
        publicId: "sample_black_tee_front",
        width: 1200,
        height: 1500,
        format: "jpg"
      },
      {
        url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
        publicId: "sample_black_tee_back",
        width: 1200,
        height: 1500,
        format: "jpg"
      }
    ],
    variants: [
      { id: "v1_s_black", size: "S", color: "Noir Black", stock: 10, sku: "LL-TEE-01-S-BLK" },
      { id: "v1_m_black", size: "M", color: "Noir Black", stock: 15, sku: "LL-TEE-01-M-BLK" },
      { id: "v1_l_black", size: "L", color: "Noir Black", stock: 12, sku: "LL-TEE-01-L-BLK" },
      { id: "v1_xl_black", size: "XL", color: "Noir Black", stock: 8, sku: "LL-TEE-01-XL-BLK" }
    ],
    tags: ["Heavyweight", "Oversized", "Drop Shoulder", "280 GSM", "Best Seller"]
  },
  {
    name: "Lost Label Heavyweight Monogram Hoodie",
    slug: "lost-label-heavyweight-monogram-hoodie",
    category: "Hoodies",
    price: 3499,
    compareAtPrice: 4299,
    description: "450 GSM ultra-heavyweight brushed fleece. Double-layered structured hood without drawstrings for a clean architectural profile. Tonal gothic LL crosshair embroidery on the chest and raw reverse-terry ribbing.",
    featured: true,
    isActive: true,
    stock: 28,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Shadow Black", "Bone White"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
        publicId: "sample_hoodie_front",
        width: 1200,
        height: 1500,
        format: "jpg"
      },
      {
        url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop",
        publicId: "sample_hoodie_model",
        width: 1200,
        height: 1500,
        format: "jpg"
      }
    ],
    variants: [
      { id: "v2_m_black", size: "M", color: "Shadow Black", stock: 8, sku: "LL-HD-01-M-BLK" },
      { id: "v2_l_black", size: "L", color: "Shadow Black", stock: 12, sku: "LL-HD-01-L-BLK" },
      { id: "v2_xl_black", size: "XL", color: "Shadow Black", stock: 5, sku: "LL-HD-01-XL-BLK" },
      { id: "v2_xxl_black", size: "XXL", color: "Shadow Black", stock: 3, sku: "LL-HD-01-XXL-BLK" }
    ],
    tags: ["Heavyweight", "450 GSM", "Winter Drop", "Fleece"]
  },
  {
    name: "Lost Label Signature Cream Acid Tee",
    slug: "lost-label-signature-cream-acid-tee",
    category: "T-Shirts",
    price: 1999,
    compareAtPrice: 2599,
    description: "Hand-treated vintage acid wash delivering unique warm cream and parchment tones. Distressed raw hem accents, ribbed 1.25-inch crewneck, and the iconic starburst emblem in metallic graphite.",
    featured: true,
    isActive: true,
    stock: 35,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Warm Cream", "Off-White"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop",
        publicId: "sample_cream_tee_1",
        width: 1200,
        height: 1500,
        format: "jpg"
      },
      {
        url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
        publicId: "sample_cream_tee_2",
        width: 1200,
        height: 1500,
        format: "jpg"
      }
    ],
    variants: [
      { id: "v3_s_crm", size: "S", color: "Warm Cream", stock: 8, sku: "LL-TEE-02-S-CRM" },
      { id: "v3_m_crm", size: "M", color: "Warm Cream", stock: 12, sku: "LL-TEE-02-M-CRM" },
      { id: "v3_l_crm", size: "L", color: "Warm Cream", stock: 10, sku: "LL-TEE-02-L-CRM" },
      { id: "v3_xl_crm", size: "XL", color: "Warm Cream", stock: 5, sku: "LL-TEE-02-XL-CRM" }
    ],
    tags: ["Acid Wash", "Vintage Cream", "Limited Run"]
  },
  {
    name: "Lost Label Modular Tactical Street Jacket",
    slug: "lost-label-modular-tactical-street-jacket",
    category: "Jackets",
    price: 5999,
    compareAtPrice: 7499,
    description: "Water-repellent ripstop shell reinforced with Fidlock-style magnetic quick-release chest buckles. Detachable utility holster pocket and internal carry harness for high-mobility streetwear ergonomics.",
    featured: true,
    isActive: true,
    stock: 14,
    sizes: ["M", "L", "XL"],
    colors: ["Pitch Black"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
        publicId: "sample_jacket_1",
        width: 1200,
        height: 1500,
        format: "jpg"
      }
    ],
    variants: [
      { id: "v4_m_blk", size: "M", color: "Pitch Black", stock: 4, sku: "LL-JKT-01-M-BLK" },
      { id: "v4_l_blk", size: "L", color: "Pitch Black", stock: 6, sku: "LL-JKT-01-L-BLK" },
      { id: "v4_xl_blk", size: "XL", color: "Pitch Black", stock: 4, sku: "LL-JKT-01-XL-BLK" }
    ],
    tags: ["Outerwear", "Tactical", "Ripstop", "Modular"]
  },
  {
    name: "Lost Label Wide-Leg Pleated Cargo Pants",
    slug: "lost-label-wide-leg-pleated-cargo-pants",
    category: "Pants",
    price: 3299,
    compareAtPrice: 3999,
    description: "Heavyweight 340 GSM cotton twill cut with architectural knee darts for an effortless billowing stack over high-top sneakers. Features 8 3D pleated pockets and concealed cinch ankle toggles.",
    featured: false,
    isActive: true,
    stock: 22,
    sizes: ["30", "32", "34", "36"],
    colors: ["Matte Black", "Graphite Grey"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
        publicId: "sample_pants_1",
        width: 1200,
        height: 1500,
        format: "jpg"
      }
    ],
    variants: [
      { id: "v5_30_blk", size: "30", color: "Matte Black", stock: 5, sku: "LL-PNT-01-30-BLK" },
      { id: "v5_32_blk", size: "32", color: "Matte Black", stock: 8, sku: "LL-PNT-01-32-BLK" },
      { id: "v5_34_blk", size: "34", color: "Matte Black", stock: 6, sku: "LL-PNT-01-34-BLK" },
      { id: "v5_36_blk", size: "36", color: "Matte Black", stock: 3, sku: "LL-PNT-01-36-BLK" }
    ],
    tags: ["Wide Leg", "Pleated", "Cargos", "Twill"]
  },
  {
    name: "Lost Label Gothic Distressed Knit Beanie",
    slug: "lost-label-gothic-distressed-knit-beanie",
    category: "Accessories",
    price: 999,
    compareAtPrice: 1499,
    description: "100% thick rib-knit yarn with subtle artisan edge fraying. Adorned with a custom brushed-metal Lost Label 2026 star emblem pin.",
    featured: false,
    isActive: true,
    stock: 50,
    sizes: ["One Size"],
    colors: ["Onyx Black", "Chalk White"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1200&auto=format&fit=crop",
        publicId: "sample_beanie_1",
        width: 1200,
        height: 1500,
        format: "jpg"
      }
    ],
    variants: [
      { id: "v6_os_blk", size: "One Size", color: "Onyx Black", stock: 35, sku: "LL-ACC-01-OS-BLK" },
      { id: "v6_os_wht", size: "One Size", color: "Chalk White", stock: 15, sku: "LL-ACC-01-OS-WHT" }
    ],
    tags: ["Accessories", "Beanie", "Distressed Knit"]
  }
];
