import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import { getStoreSettings } from "../services/settingsService";
import { isValidEmail, isValidPhone, isValidPincode } from "../utils/validators";
import AddressForm from "../components/checkout/AddressForm";
import OrderSummary from "../components/checkout/OrderSummary";
import UpiPaymentModal from "../components/checkout/UpiPaymentModal";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, isFreeDelivery, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    apartment: "",
    address: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [storeSettings, setStoreSettings] = useState({});

  useEffect(() => {
    getStoreSettings().then(setStoreSettings);
  }, []);

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="min-h-screen bg-[#070707] text-[#e8e4d9] pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="font-cinzel text-2xl uppercase">No Items to Checkout</h2>
        <p className="text-xs text-[#777]">Your shopping bag is empty.</p>
        <Link to="/shop" className="px-6 py-3 bg-[#e8e4d9] text-[#070707] text-xs uppercase font-bold tracking-widest">
          Explore Drops
        </Link>
      </div>
    );
  }

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required.";
    if (!isValidPhone(formData.phone)) errs.phone = "Enter a valid 10-digit mobile number.";
    if (!isValidEmail(formData.email)) errs.email = "Enter a valid email address.";
    if (!formData.apartment.trim()) errs.apartment = "Flat/House number is required.";
    if (!formData.address.trim()) errs.address = "Street address is required.";
    if (!formData.city.trim()) errs.city = "City is required.";
    if (!formData.state.trim()) errs.state = "State is required.";
    if (!isValidPincode(formData.pincode)) errs.pincode = "Enter a valid 6-digit Indian pincode.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderPayload = {
        customerId: user?.uid || "guest",
        customerName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        shippingAddress: {
          apartment: formData.apartment.trim(),
          address: formData.address.trim(),
          area: formData.area.trim(),
          landmark: formData.landmark?.trim() || "",
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim()
        },
        items: items.map((i) => ({
          productId: i.productId,
          slug: i.slug,
          name: i.name,
          image: i.image,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
          sku: i.sku || ""
        })),
        subtotal,
        deliveryFee,
        total
      };

      const orderResult = await createOrder(orderPayload);
      clearCart();
      setCreatedOrder(orderResult);
      setShowPaymentModal(true);
    } catch (err) {
      alert(err.message || "Failed to initialize order.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmitted = () => {
    setShowPaymentModal(false);
    navigate(`/order-success/${createdOrder.orderNumber}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#070707] text-[#e8e4d9] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-8 text-left">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#777] hover:text-[#e8e4d9]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Browsing</span>
        </Link>

        <div className="border-b border-[#1c1c1c] pb-6">
          <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
            ATELIER DISPATCH
          </span>
          <h1 className="font-cinzel text-3xl font-bold tracking-wider text-[#e8e4d9] uppercase mt-1">
            Express Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Address form */}
            <div className="lg:col-span-7 bg-[#0c0c0c] border border-[#222] p-6 sm:p-8">
              <AddressForm
                formData={formData}
                onChange={handleFieldChange}
                errors={errors}
              />

              <div className="pt-8">
                <Button
                  type="submit"
                  variant="primary"
                  size="xl"
                  loading={loading}
                  className="w-full"
                >
                  Generate UPI QR & Pay
                </Button>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-5">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                isFreeDelivery={isFreeDelivery}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Dynamic UPI QR Modal */}
      {createdOrder && (
        <Modal
          isOpen={showPaymentModal}
          onClose={() => navigate(`/order-success/${createdOrder.orderNumber}`)}
          title="Direct UPI Payment"
        >
          <UpiPaymentModal
            order={createdOrder}
            storeSettings={storeSettings}
            onPaymentSubmitted={handlePaymentSubmitted}
            onClose={() => navigate(`/order-success/${createdOrder.orderNumber}`)}
          />
        </Modal>
      )}
    </div>
  );
}
