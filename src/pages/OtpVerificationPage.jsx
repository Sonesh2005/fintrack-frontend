import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import api from "../api/axios";
import AnimatedBackground from "../components/ui/AnimatedBackground";

export default function OtpVerificationPage() {

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] =
    useState(false);

  const [seconds, setSeconds] =
    useState(60);

  const navigate = useNavigate();

  const location = useLocation();

  const email =
    location.state?.email;

  useEffect(() => {

    if (seconds > 0) {

      const timer =
        setTimeout(() => {
          setSeconds(
            seconds - 1
          );
        }, 1000);

      return () =>
        clearTimeout(timer);
    }

  }, [seconds]);

  const handleChange = (
    value,
    index
  ) => {

    if (!/^\d?$/.test(value))
      return;

    const updated = [...otp];

    updated[index] = value;

    setOtp(updated);

    if (
      value &&
      index < 5
    ) {

      document
        .getElementById(
          `otp-${index + 1}`
        )
        ?.focus();
    }
  };

  const handleVerifyOtp =
    async (e) => {

      e.preventDefault();

      const finalOtp =
        otp.join("");

      if (
        finalOtp.length !== 6
      ) {

        toast.error(
          "Enter valid OTP"
        );

        return;
      }

      try {

        setLoading(true);

        const res =
          await api.post(
            `/api/auth/verify-login-otp?email=${email}&otp=${finalOtp}`
          );

       localStorage.setItem(
  "token",
  res.data.token
);
localStorage.setItem(
  "user",
  JSON.stringify({
    name: res.data.name,
    email: res.data.email,
  })
);

localStorage.setItem(
  "user",
  JSON.stringify({
    name:
      res.data.name ||
      email.split("@")[0],

    email:
      res.data.email ||
      email,
  })
);

console.log(res.data);

toast.success(
  "Login successful"
);

navigate("/dashboard");

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
            "Invalid OTP"
        );

      } finally {

        setLoading(false);
      }
    };

  const handleResendOtp =
    async () => {

      try {

        await api.post(
          `/api/auth/resend-otp?email=${email}`
        );

        toast.success(
          "OTP resent"
        );

        setSeconds(60);

      } catch {

        toast.error(
          "Failed to resend OTP"
        );
      }
    };

  return (

    <div
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#020617]
        px-6
        text-white
      "
    >

      {/* BACKGROUND */}

      <AnimatedBackground />

      {/* LEFT GLOW */}

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

      {/* RIGHT GLOW */}

      <div
        className="
          absolute
          bottom-[-250px]
          right-[-200px]
          h-[650px]
          w-[650px]
          rounded-full
          bg-violet-500/10
          blur-[240px]
        "
      />

      {/* CARD */}

      <motion.div

        initial={{
          opacity: 0,
          y: 30,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.7,
        }}

        className="
          relative
          z-10
          w-full
          max-w-[520px]
          overflow-hidden
          rounded-[36px]
          border border-white/10
          bg-white/[0.05]
          px-10
          py-9
          backdrop-blur-3xl
          shadow-[0_0_100px_rgba(34,211,238,0.12)]
        "
      >

        {/* INNER GRADIENT */}

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

          {/* ICON */}

          <div
            className="
              mx-auto
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              border border-cyan-400/20
              bg-cyan-500/10
              text-cyan-300
            "
          >

            <ShieldCheck size={42} />

          </div>

          {/* TITLE */}

          <h1
            className="
              mt-8
              text-center
              text-5xl
              font-black
            "
          >
            Verify OTP
          </h1>

          <p
            className="
              mt-4
              text-center
              leading-8
              text-white/60
            "
          >

            Enter the verification code
            sent to

            <br />

            <span className="text-cyan-300">
              {email}
            </span>

          </p>

          {/* OTP BOXES */}

          <form
            onSubmit={
              handleVerifyOtp
            }
          >

            <div
              className="
                mt-10
                flex
                justify-center
                gap-4
              "
            >

              {otp.map(
                (
                  digit,
                  index
                ) => (

                  <input
                    key={index}

                    id={`otp-${index}`}

                    value={digit}

                    onChange={(e) =>
                      handleChange(
                        e.target.value,
                        index
                      )
                    }

                    maxLength={1}

                    className="
                      h-16
                      w-16
                      rounded-2xl
                      border border-white/10
                      bg-white/5
                      text-center
                      text-2xl
                      font-bold
                      text-white
                      outline-none
                      transition-all
                      focus:border-cyan-400
                      focus:ring-2
                      focus:ring-cyan-400/20
                    "
                  />
                )
              )}

            </div>

            {/* BUTTON */}

            <button
              type="submit"

              disabled={loading}

              className="
                mt-10
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
                disabled:opacity-50
              "
            >

              {loading
                ? "Verifying..."
                : "Verify OTP"}

            </button>

          </form>

          {/* RESEND */}

          <div
            className="
              mt-6
              text-center
            "
          >

            {seconds > 0 ? (

              <p className="text-white/50">

                Resend OTP in{" "}

                <span className="text-cyan-300">
                  {seconds}s
                </span>

              </p>

            ) : (

              <button
                onClick={
                  handleResendOtp
                }

                className="
                  text-cyan-300
                  transition
                  hover:text-cyan-200
                "
              >

                Resend OTP

              </button>

            )}

          </div>

        </div>

      </motion.div>

    </div>
  );
}