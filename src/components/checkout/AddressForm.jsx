import React from "react";
import Input from "../common/Input";

export default function AddressForm({ formData, onChange, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-[#1c1c1c] pb-3">
        <h3 className="font-cinzel text-sm uppercase tracking-widest text-[#e8e4d9]">
          1. Delivery Contact
        </h3>
        <p className="text-xs text-[#777] mt-0.5">
          Order updates and shipping tracking links will be sent here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder="e.g. Aryan Sharma"
          required
        />

        <Input
          label="Mobile Number (10 Digits)"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="9876543210"
          type="tel"
          maxLength={10}
          required
        />
      </div>

      <Input
        label="Email Address"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="aryan@gmail.com"
        type="email"
        required
      />

      <div className="border-b border-[#1c1c1c] pb-3 pt-4">
        <h3 className="font-cinzel text-sm uppercase tracking-widest text-[#e8e4d9]">
          2. Shipping Address
        </h3>
        <p className="text-xs text-[#777] mt-0.5">
          Direct atelier courier delivery destination.
        </p>
      </div>

      <Input
        label="Flat, Apartment or House No."
        name="apartment"
        value={formData.apartment}
        onChange={handleChange}
        error={errors.apartment}
        placeholder="Apt 402, Skyline Residency"
        required
      />

      <Input
        label="Street Address / Road"
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        placeholder="12th Main, 4th Cross"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Area / Locality"
          name="area"
          value={formData.area}
          onChange={handleChange}
          placeholder="Indiranagar"
          required
        />

        <Input
          label="Landmark (Optional)"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
          placeholder="Opposite Metro Station"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
          placeholder="Bengaluru"
          required
        />

        <Input
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          error={errors.state}
          placeholder="Karnataka"
          required
        />

        <Input
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          error={errors.pincode}
          placeholder="560038"
          maxLength={6}
          required
        />
      </div>
    </div>
  );
}
