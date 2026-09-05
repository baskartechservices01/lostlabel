import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginGoogle, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials or unauthorized.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginGoogle();
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#e8e4d9] flex flex-col items-center justify-center p-6 relative">
      <Link
        to="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#777] hover:text-[#e8e4d9]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Storefront</span>
      </Link>

      <div className="w-full max-w-md bg-[#0c0c0c] border border-[#222] p-8 sm:p-10 text-left space-y-6 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center">
            <Shield className="w-7 h-7 text-[#e8e4d9]" />
          </div>
          <span className="font-editorial text-[10px] tracking-[0.3em] text-[#8e8b83]">
            SECURE ACCESS
          </span>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#e8e4d9] uppercase">
            Atelier Portal
          </h1>
          <p className="text-xs text-[#666]">
            Authorized personnel only. Enforced by Firebase role governance.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Admin Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@lostlabel.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
          />

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Sign In to Dashboard
          </Button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#1c1c1c]"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-[#555]">Or</span>
          <div className="flex-grow border-t border-[#1c1c1c]"></div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleGoogleLogin}
          className="w-full"
        >
          Continue with Google
        </Button>

        <div className="p-3 bg-[#111] border border-[#222] text-[10px] text-[#666] text-center">
          <span>Demo quick-access: Use any email containing </span>
          <strong className="text-[#e8e4d9]">"admin"</strong>
          <span> (e.g. admin@lostlabel.com)</span>
        </div>
      </div>
    </div>
  );
}
