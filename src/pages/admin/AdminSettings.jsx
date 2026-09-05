import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getStoreSettings, updateStoreSettings } from "../../services/settingsService";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    brandName: "LOST LABEL",
    upiId: "lostlabel@upi",
    upiName: "LOST LABEL STREETWEAR",
    deliveryFee: 99,
    freeDeliveryThreshold: 1999,
    contactPhone: "+91 98765 43210",
    email: "concierge@lostlabel.com",
    instagramUrl: "https://instagram.com/lostlabel.in",
    address: "Studio 04, Indiranagar, Bengaluru, KA 560038, India"
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getStoreSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStoreSettings({
        ...settings,
        deliveryFee: Number(settings.deliveryFee),
        freeDeliveryThreshold: Number(settings.freeDeliveryThreshold)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert("Failed to save settings: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Atelier Settings">
      <div className="max-w-3xl space-y-6 text-left">
        <div className="pb-4 border-b border-[#1c1c1c]">
          <h2 className="font-cinzel text-lg font-bold uppercase tracking-wider text-[#e8e4d9]">
            Store Configuration
          </h2>
          <p className="text-xs text-[#777]">
            Configure live UPI payment credentials, delivery thresholds, and contact information.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Store settings successfully updated in Firestore!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* UPI Settings Box */}
          <div className="p-6 bg-[#0c0c0c] border border-[#222] space-y-4">
            <h3 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9] pb-2 border-b border-[#1c1c1c]">
              Direct UPI Payment Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Merchant UPI ID"
                name="upiId"
                value={settings.upiId}
                onChange={handleChange}
                placeholder="lostlabel@upi"
                required
              />

              <Input
                label="Payee Account Name"
                name="upiName"
                value={settings.upiName}
                onChange={handleChange}
                placeholder="LOST LABEL STREETWEAR"
                required
              />
            </div>
            <p className="text-[11px] text-[#666]">
              Used to generate dynamic QR codes and mobile UPI intent links for customer checkouts.
            </p>
          </div>

          {/* Delivery Configuration */}
          <div className="p-6 bg-[#0c0c0c] border border-[#222] space-y-4">
            <h3 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9] pb-2 border-b border-[#1c1c1c]">
              Logistics & Delivery Fees
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Standard Delivery Fee (₹)"
                name="deliveryFee"
                type="number"
                value={settings.deliveryFee}
                onChange={handleChange}
                placeholder="99"
                required
              />

              <Input
                label="Free Delivery Threshold (₹)"
                name="freeDeliveryThreshold"
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={handleChange}
                placeholder="1999"
                required
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-6 bg-[#0c0c0c] border border-[#222] space-y-4">
            <h3 className="font-cinzel text-xs uppercase tracking-widest text-[#e8e4d9] pb-2 border-b border-[#1c1c1c]">
              Public Atelier Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Support Phone"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />

              <Input
                label="Support Email"
                name="email"
                type="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="concierge@lostlabel.com"
              />
            </div>

            <Input
              label="Official Instagram URL"
              name="instagramUrl"
              value={settings.instagramUrl}
              onChange={handleChange}
              placeholder="https://instagram.com/lostlabel.in"
            />

            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8e8b83] mb-1.5">
                Physical Atelier / Studio Address
              </label>
              <textarea
                name="address"
                rows={2}
                value={settings.address}
                onChange={handleChange}
                className="w-full bg-[#0e0e0e] border border-[#262626] p-3 text-sm text-[#e8e4d9] focus:outline-none focus:border-[#e8e4d9]"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={saving}>
            Save Atelier Settings
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
