import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AnimatedBackground from "../components/ui/AnimatedBackground";

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

    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e) => {

    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

  const res = await api.post(
    "/api/auth/login",
    loginData
  );

  localStorage.setItem(
    "user",
    JSON.stringify({
      name:
        res.data.name ||
        loginData.email.split("@")[0],

      email:
        res.data.email ||
        loginData.email,
    })
  );

  navigate("/verify-otp", {
    state: {
      email: loginData.email,
    },
  });

} catch (err) {

  alert(
    err.response?.data?.message ||
    "Invalid email or password"
  );

} finally {

  setLoading(false);
}
  };

  const handleSignupSubmit = async (e) => {

    e.preventDefault();

    if (
      signupData.password !==
      signupData.confirmPassword
    ) {

      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      await api.post(
        "/api/auth/register",
        signupData
      );

      alert(
        "Registration successful! Please verify your email."
      );

      setMode("login");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      await api.post(
        "/api/auth/forgot-password",
        {
          email: forgotEmail,
        }
      );

      alert("Password reset link sent");

      setShowForgot(false);

      setForgotEmail("");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to send reset email"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#020617]
        text-white
      "
    >

      <AnimatedBackground />

      {/* GLOWS */}

      <div
        className="
          absolute
          left-[-250px]
          top-[5%]
          h-[650px]
          w-[650px]
          rounded-full
          bg-cyan-500/10
          blur-[240px]
        "
      />

      <div
        className="
          absolute
          bottom-[-250px]
          right-[-200px]
          h-[650px]
          w-[650px]
          rounded-full
          bg-violet-500/15
          blur-[180px]
        "
      />

      {/* GRID */}

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          min-h-screen
          max-w-7xl
          grid-cols-1
          items-center
          gap-16
          px-6
          lg:grid-cols-2
        "
      >

        {/* LEFT */}

        <motion.div
          initial={{
            opacity: 0,
            x: -40,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          transition={{
            duration: 1,
          }}

          className="
  hidden
  lg:flex
  flex-col
  items-center
  justify-center -translate-y-6
  text-center
  pr-10
"
        >

          {/* LOGO */}

          <img
            src="/logo.png"
            alt="FinTrack Logo"

            className="
              mb-1
              w-[460px]
              object-contain
              drop-shadow-[0_0_45px_rgba(34,211,238,0.22)]
            "
          />

          {/* TAG */}

          <p
            className="
              mb-6
              text-sm
              font-semibold
              uppercase
              tracking-[0.45em]
              text-cyan-400
            "
          >
            AI Powered Finance OS
          </p>

          {/* HEADING */}

          <h1
            className="
              max-w-[700px]
              text-7xl
              font-black
              leading-[1.05]
              tracking-tight
              text-white
            "
          >

            Manage Your

            <br />

            <span
              className="
                bg-gradient-to-r
                from-cyan-400
                via-blue-400
                to-violet-400
                bg-clip-text
                text-transparent
              "
            >
              Financial Future
            </span>

          </h1>

          {/* DESCRIPTION */}

          <p
            className="
              mt-8
              max-w-[650px]
              text-lg
              leading-9
              text-white/60
            "
          >

            Track expenses,
            analyze insights,
            manage budgets,
            and interact with your
            personal AI-powered
            finance assistant.

          </p>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.9,
          }}

          className="
            flex
            justify-center
            lg:justify-end
          "
        >

          <div
            className="
              relative
              w-full
              max-w-[420px]
              overflow-hidden
              rounded-[36px]
              border border-white/10
              bg-white/[0.05]
             px-8 py-7
              backdrop-blur-3xl
              shadow-[0_0_100px_rgba(34,211,238,0.12)]
            "
          >

            {/* CARD GLOW */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-cyan-500/5
                via-transparent
                to-violet-500/5
              "
            />

            <div className="relative z-10">

              {/* LOGO */}

              <div
                className="
                  mb-10
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >

                <img
                  src="/logo.png"
                  alt="FinTrack"

                  className="
                    mb-5
                    w-[500px]
                    object-contain
                  "
                />

                <h1
                  className="
                    text-5xl
                    font-black
                    text-white
                  "
                >
                  FinTrack
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    text-white/50
                  "
                >
                  Premium AI Finance Platform
                </p>

              </div>

              {/* TABS */}

              <div
                className="
                  mb-8
                  grid
                  grid-cols-2
                  rounded-2xl
                  bg-white/5
                  p-1
                "
              >

                <button
                  type="button"
                  onClick={() => setMode("login")}

                  className={`
                    rounded-xl
                    py-3
                    font-medium
                    transition-all
                    duration-300

                    ${
                      mode === "login"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg"
                        : "text-white/60 hover:text-white"
                    }
                  `}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => setMode("signup")}

                  className={`
                    rounded-xl
                    py-3
                    font-medium
                    transition-all
                    duration-300

                    ${
                      mode === "signup"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg"
                        : "text-white/60 hover:text-white"
                    }
                  `}
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
                      icon={<Mail size={18} />}
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                    />

                    <InputField
                      icon={<Lock size={18} />}
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                    />

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setShowForgot(true)
                        }

                        className="
                          text-sm
                          text-cyan-300
                        "
                      >
                        Forgot password?
                      </button>

                      <button
                        type="button"

                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          border border-cyan-400/20
                          bg-cyan-500/10
                          text-cyan-300
                        "
                      >
                        <Mic size={18} />
                      </button>

                    </div>

                    <button
                      type="submit"

                      className="
                        w-full
                        rounded-2xl
                        bg-gradient-to-r
                        from-cyan-500
                        to-blue-500
                        py-4
                        font-semibold
                        shadow-lg
                        transition-all
                        duration-300
                        hover:scale-[1.02]
                        hover:shadow-cyan-500/20
                      "
                    >
                      {loading
                        ? "Logging in..."
                        : "Login"}
                    </button>

                  </motion.form>

                ) : (

                  <motion.form
                    key="signup"
                    onSubmit={handleSignupSubmit}
                    className="space-y-4"
                  >

                    <InputField
                      icon={<User size={18} />}
                      name="name"
                      placeholder="Name"
                      value={signupData.name}
                      onChange={handleSignupChange}
                    />

                    <InputField
                      icon={<Mail size={18} />}
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                    />

                    <InputField
                      icon={<Lock size={18} />}
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                    />

                    <InputField
                      icon={<Lock size={18} />}
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                    />

                    <button
                      type="submit"

                      className="
                        w-full
                        rounded-2xl
                        bg-gradient-to-r
                        from-cyan-500
                        to-blue-500
                        py-4
                        font-semibold
                        shadow-lg
                        transition-all
                        duration-300
                        hover:scale-[1.02]
                      "
                    >
                      {loading
                        ? "Creating..."
                        : "Create Account"}
                    </button>

                  </motion.form>

                )}

              </AnimatePresence>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}

function InputField({
  icon,
  ...props
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border border-white/10
        bg-white/5
        px-4
        py-4
        transition-all
        duration-300
        focus-within:border-cyan-400
        focus-within:ring-2
        focus-within:ring-cyan-400/20
      "
    >

      <div className="text-cyan-300">
        {icon}
      </div>

      <input
        {...props}

        className="
          w-full
          bg-transparent
          text-white
          outline-none
          placeholder:text-white/40
        "

        required
      />

    </div>
  );
}