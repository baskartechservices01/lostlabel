import React, { createContext, useContext, useState, useEffect } from "react";
import { getStoreSettings } from "../services/settingsService";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "lost_label_cart_v1";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    deliveryFee: 99,
    freeDeliveryThreshold: 1999
  });

  // Load store delivery thresholds
  useEffect(() => {
    getStoreSettings().then(settings => {
      if (settings) {
        setStoreSettings({
          deliveryFee: Number(settings.deliveryFee || 99),
          freeDeliveryThreshold: Number(settings.freeDeliveryThreshold || 1999)
        });
      }
    });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    if (!product) return;
    const size = selectedSize || product.sizes?.[0] || "Standard";
    const color = selectedColor || product.colors?.[0] || "Standard";
    const itemKey = `${product.id || product.slug}_${size}_${color}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        const maxStock = updated[existingIndex].stock || 99;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        const imageUrl = product.images?.[0]?.url || product.images?.[0] || "/logo.jpg";
        return [
          ...prev,
          {
            itemKey,
            productId: product.id || product.slug,
            slug: product.slug,
            name: product.name,
            price: Number(product.price),
            image: imageUrl,
            size,
            color,
            quantity: Math.min(quantity, product.stock || 99),
            stock: product.stock || 99,
            sku: product.variants?.find(v => v.size === size && v.color === color)?.sku || ""
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (itemKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.itemKey === itemKey) {
          const maxStock = item.stock || 99;
          return { ...item, quantity: Math.min(newQuantity, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemKey) => {
    setItems((prev) => prev.filter((item) => item.itemKey !== itemKey));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= storeSettings.freeDeliveryThreshold && subtotal > 0;
  const deliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : storeSettings.deliveryFee;
  const total = subtotal + deliveryFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const amountNeededForFreeDelivery = Math.max(0, storeSettings.freeDeliveryThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        isFreeDelivery,
        freeDeliveryThreshold: storeSettings.freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
