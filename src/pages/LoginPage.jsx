import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", loginData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", String(res.data.userId));
      localStorage.setItem("name", res.data.name || "");
      localStorage.setItem("email", res.data.email || "");

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register", signupData);
      alert("Registration successful! Please log in.");
      setMode("login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/auth/forgot-password", {
        email: forgotEmail,
      });
      alert("Password reset link sent");
      setShowForgot(false);
      setForgotEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020b2d] px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-6 text-center">
          <img
            src="/logo.png"
            alt="FinTrack"
            className="mx-auto mb-3 h-16 w-16 rounded-2xl object-cover shadow-xl shadow-emerald-500/20"
          />

          <h1 className="text-3xl font-bold">FinTrack</h1>
          <p className="text-sm text-white/60">Premium Finance OS</p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-xl py-2 ${
              mode === "login" ? "bg-gradient-to-r from-cyan-500 to-blue-500" : ""
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-xl py-2 ${
              mode === "signup" ? "bg-gradient-to-r from-cyan-500 to-blue-500" : ""
            }`}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.form
              key="login"
              onSubmit={handleLoginSubmit}
              className="space-y-4"
            >
              <InputField
                icon={<Mail size={16} />}
                name="email"
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
              />
              <InputField
                icon={<Lock size={16} />}
                name="password"
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
              />

              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-sm text-cyan-300"
              >
                Forgot password?
              </button>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              onSubmit={handleSignupSubmit}
              className="space-y-4"
            >
              <InputField
                icon={<User size={16} />}
                name="name"
                placeholder="Name"
                value={signupData.name}
                onChange={handleSignupChange}
              />
              <InputField
                icon={<Mail size={16} />}
                name="email"
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={handleSignupChange}
              />
              <InputField
                icon={<Lock size={16} />}
                name="password"
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
              />
              <InputField
                icon={<Lock size={16} />}
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
              />

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {showForgot && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-3xl bg-[#11182f] p-6">
            <h3 className="text-lg font-semibold">Reset Password</h3>

            <form onSubmit={handleForgotPassword} className="mt-4 space-y-4">
              <InputField
                icon={<Mail size={16} />}
                type="email"
                placeholder="Enter email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3"
              >
                {loading ? "Sending..." : "Send Link"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ icon, ...props }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
      {icon}
      <input
        {...props}
        className="w-full bg-transparent outline-none"
        required
      />
    </div>
  );
}