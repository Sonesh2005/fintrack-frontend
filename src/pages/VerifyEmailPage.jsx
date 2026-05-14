import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, Loader2 } from "lucide-react";
import api from "../api/axios";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const hasVerified = useRef(false);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token || hasVerified.current) return;

    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const response = await api.get(`/api/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(
          response.data?.message ||
            "Email verified successfully. You can now log in."
        );
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Verification failed or link expired.";

        if (
          errorMessage.toLowerCase().includes("already used") ||
          errorMessage.toLowerCase().includes("already verified")
        ) {
          setStatus("success");
          setMessage("Email already verified. You can now log in.");
        } else {
          setStatus("error");
          setMessage(errorMessage);
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020b2d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_25%)]" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/8 p-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">FinTrack</h1>
            <p className="mt-1 text-sm text-white/60">Email Verification</p>
          </div>

          <div className="space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-cyan-400" />
                <h2 className="text-2xl font-semibold">Verifying...</h2>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
                <h2 className="text-2xl font-semibold">Verification Successful</h2>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="mx-auto h-12 w-12 text-red-400" />
                <h2 className="text-2xl font-semibold">Verification Failed</h2>
              </>
            )}

            <p className="text-sm text-white/70">{message}</p>

            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
            >
              Go to Login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}