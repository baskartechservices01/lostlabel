import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { InstagramIcon } from "../components/common/Icons";
import { getStoreSettings } from "../services/settingsService";

import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Contact() {
  const [settings, setSettings] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#070707] text-[#e8e4d9] pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto space-y-12 text-left">
        <div className="border-b border-[#1c1c1c] pb-6">
          <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
            ATELIER DIRECT
          </span>
          <h1 className="font-cinzel text-3xl font-bold tracking-wider text-[#e8e4d9] uppercase mt-1">
            Contact Concierge
          </h1>
          <p className="text-xs text-[#777] mt-1">
            Questions regarding drops, bespoke sizing, or order reconciliation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#0c0c0c] border border-[#222] space-y-6 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#e8e4d9] mt-0.5" />
                <div>
                  <h4 className="font-cinzel text-[11px] uppercase tracking-wider text-[#e8e4d9]">Email Concierge</h4>
                  <p className="text-[#888] mt-0.5 font-mono">{settings.email || "concierge@lostlabel.com"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#e8e4d9] mt-0.5" />
                <div>
                  <h4 className="font-cinzel text-[11px] uppercase tracking-wider text-[#e8e4d9]">Phone / WhatsApp</h4>
                  <p className="text-[#888] mt-0.5 font-mono">{settings.contactPhone || "+91 98765 43210"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <InstagramIcon className="w-4 h-4 text-[#e8e4d9] mt-0.5" />
                <div>
                  <h4 className="font-cinzel text-[11px] uppercase tracking-wider text-[#e8e4d9]">Official Instagram</h4>

                  <a
                    href={settings.instagramUrl || "https://instagram.com/lostlabel.in"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#e8e4d9] hover:underline mt-0.5 block"
                  >
                    @lostlabel.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#e8e4d9] mt-0.5" />
                <div>
                  <h4 className="font-cinzel text-[11px] uppercase tracking-wider text-[#e8e4d9]">Design Atelier</h4>
                  <p className="text-[#888] mt-0.5 leading-relaxed">
                    {settings.address || "Indiranagar, Bengaluru, KA 560038, India"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#0c0c0c] border border-[#222] p-6 sm:p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-cinzel text-lg uppercase text-[#e8e4d9]">Inquiry Received</h3>
                <p className="text-xs text-[#777] max-w-xs mx-auto">
                  Our atelier representative will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aryan Sharma"
                />

                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aryan@gmail.com"
                />

                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#8e8b83] mb-1.5">
                    Message / Inquiry Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter your inquiry regarding drops, payments, or orders..."
                    className="w-full bg-[#0e0e0e] border border-[#262626] p-4 text-sm text-[#e8e4d9] placeholder-[#555] focus:outline-none focus:border-[#e8e4d9]"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
