import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  User,
  Shield,
  Bell,
  Moon,
  Globe,
  Sparkles,
  Database,
  Wifi,
  Lock,
  Brain,
  CheckCircle2,
} from "lucide-react";

import GlassCard from "../components/ui/GlassCard";

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange?.(!enabled)}
      className={`
        relative h-7 w-14 rounded-full transition-all duration-300 cursor-pointer
        ${enabled ? "bg-cyan-400/80" : "bg-white/10"}
      `}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`
          absolute top-1 h-5 w-5 rounded-full bg-white shadow-lg
          ${enabled ? "left-8" : "left-1"}
        `}
      />
    </button>
  );
}

function SettingRow({
  icon,
  title,
  description,
  right,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.05]">

      <div className="flex items-start gap-4">

        <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
          {icon}
        </div>

        <div>

          <h4 className="font-semibold text-white">
            {title}
          </h4>

          <p className="mt-1 text-sm text-white/50">
            {description}
          </p>

        </div>

      </div>

      {right}

    </div>
  );
}

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [settings, setSettings] = useState({
    twoFactor: false,
    biometric: false,
    sessionProtection: false,
    darkMode: true,
    notifications: true,
    smartInsights: true,
    predictiveAlerts: true,
    budgetRecommendations: true,
  });

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setProfileData({ name: parsedUser.name || "", email: parsedUser.email || "" });
    }

    // Load settings from localStorage
    const storedSettings = localStorage.getItem("appSettings");
    if (storedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(storedSettings) }));
    }
  }, []);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSaveChanges = () => {
    try {
      // Update user data
      localStorage.setItem("user", JSON.stringify(profileData));
      
      // Save settings
      localStorage.setItem("appSettings", JSON.stringify(settings));
      
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const initials = profileData.name
    ? profileData.name
        .trim()
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="relative space-y-8 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-[140px]" />

      </div>

      {/* HEADER */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <p className="text-sm text-white/50">
            System Control Center
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white">
            System Settings
          </h1>

        </div>

        <button
          onClick={handleSaveChanges}
          className="
            rounded-2xl
            bg-gradient-to-r
            from-cyan-400
            to-purple-500
            px-6
            py-4
            font-semibold
            text-white
            shadow-[0_0_30px_rgba(34,211,238,0.25)]
            transition-all
            duration-300
            hover:scale-[1.03]
            active:scale-95
            cursor-pointer
          "
        >
          Save Changes
        </button>

      </div>

      {/* TOP GRID */}
      <div className="grid gap-5 xl:grid-cols-3">

        {/* PROFILE */}
        <GlassCard
          className="
            border border-cyan-500/10
            bg-white/[0.03]
            p-7
            shadow-[0_0_40px_rgba(0,255,255,0.05)]
          "
        >

          <div className="flex items-center gap-4">

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-500 text-2xl font-bold text-white">
              {initials}
            </div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                {profileData.name || "User"}
              </h2>

              <p className="mt-1 text-white/50">
                Premium Workspace
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={profileData.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              className="
                w-full
                rounded-2xl
                border
                border-cyan-500/10
                bg-white/[0.04]
                px-4
                py-4
                text-white
                outline-none
                placeholder:text-white/30
                transition
                focus:border-cyan-500/30
              "
            />

            <input
              type="email"
              placeholder="Email Address"
              value={profileData.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              className="
                w-full
                rounded-2xl
                border
                border-cyan-500/10
                bg-white/[0.04]
                px-4
                py-4
                text-white
                outline-none
                placeholder:text-white/30
                transition
                focus:border-cyan-500/30
              "
            />

          </div>

        </GlassCard>

        {/* SECURITY */}
        <GlassCard
          className="
            border border-cyan-500/10
            bg-white/[0.03]
            p-7
            shadow-[0_0_40px_rgba(0,255,255,0.05)]
            xl:col-span-2
          "
        >

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
              <Shield size={18} />
            </div>

            <div>

              <p className="text-sm text-white/50">
                Protection Layer
              </p>

              <h3 className="text-lg font-semibold text-white">
                Security Settings
              </h3>

            </div>

          </div>

          <div className="mt-8 space-y-4">

            <SettingRow
              icon={<Lock size={18} />}
              title="Two Factor Authentication"
              description="Extra protection for your account"
              right={<Toggle enabled={settings.twoFactor} onChange={() => handleToggle("twoFactor")} />}
            />

            <SettingRow
              icon={<Shield size={18} />}
              title="Biometric Login"
              description="Secure access with biometrics"
              right={<Toggle enabled={settings.biometric} onChange={() => handleToggle("biometric")} />}
            />

            <SettingRow
              icon={<Database size={18} />}
              title="Session Protection"
              description="Automatically monitor suspicious logins"
              right={<Toggle enabled={settings.sessionProtection} onChange={() => handleToggle("sessionProtection")} />}
            />

          </div>

        </GlassCard>

      </div>

      {/* SECOND GRID */}
      <div className="grid gap-5 xl:grid-cols-2">

        {/* APP SETTINGS */}
        <GlassCard
          className="
            border border-cyan-500/10
            bg-white/[0.03]
            p-7
            shadow-[0_0_40px_rgba(0,255,255,0.05)]
          "
        >

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-300">
              <Moon size={18} />
            </div>

            <div>

              <p className="text-sm text-white/50">
                User Preferences
              </p>

              <h3 className="text-lg font-semibold text-white">
                App Preferences
              </h3>

            </div>

          </div>

          <div className="mt-8 space-y-4">

            <SettingRow
              icon={<Moon size={18} />}
              title="Dark Mode"
              description="Use futuristic dark interface"
              right={<Toggle enabled={settings.darkMode} onChange={() => handleToggle("darkMode")} />}
            />

            <SettingRow
              icon={<Bell size={18} />}
              title="Push Notifications"
              description="Get real-time finance alerts"
              right={<Toggle enabled={settings.notifications} onChange={() => handleToggle("notifications")} />}
            />

            <SettingRow
              icon={<Globe size={18} />}
              title="Language & Region"
              description="English (India)"
              right={
                <span className="text-sm text-cyan-300">
                  Active
                </span>
              }
            />

          </div>

        </GlassCard>

        {/* AI SETTINGS */}
        <GlassCard
          className="
            relative overflow-hidden
            border border-cyan-500/10
            bg-white/[0.03]
            p-7
            shadow-[0_0_40px_rgba(0,255,255,0.05)]
          "
        >

          <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
              <Brain size={18} />
            </div>

            <div>

              <p className="text-sm text-white/50">
                AI Configuration
              </p>

              <h3 className="text-lg font-semibold text-white">
                AI Assistant
              </h3>

            </div>

          </div>

          <div className="mt-8 space-y-4">

            <SettingRow
              icon={<Sparkles size={18} />}
              title="Smart Insights"
              description="AI-powered financial analysis"
              right={<Toggle enabled={settings.smartInsights} onChange={() => handleToggle("smartInsights")} />}
            />

            <SettingRow
              icon={<Bell size={18} />}
              title="Predictive Alerts"
              description="Forecast unusual spending patterns"
              right={<Toggle enabled={settings.predictiveAlerts} onChange={() => handleToggle("predictiveAlerts")} />}
            />

            <SettingRow
              icon={<Brain size={18} />}
              title="Budget Recommendations"
              description="Personalized saving strategies"
              right={<Toggle enabled={settings.budgetRecommendations} onChange={() => handleToggle("budgetRecommendations")} />}
            />

          </div>

        </GlassCard>

      </div>

      {/* STATUS PANEL */}
      <GlassCard
        className="
          border border-cyan-500/10
          bg-white/[0.03]
          p-7
          shadow-[0_0_40px_rgba(0,255,255,0.05)]
        "
      >

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300">
            <Wifi size={18} />
          </div>

          <div>

            <p className="text-sm text-white/50">
              System Monitoring
            </p>

            <h3 className="text-lg font-semibold text-white">
              System Status
            </h3>

          </div>

        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <StatusCard
            title="Backend"
            value="Online"
            color="emerald"
          />

          <StatusCard
            title="Database"
            value="Synced"
            color="cyan"
          />

          <StatusCard
            title="API Latency"
            value="42ms"
            color="purple"
          />

          <StatusCard
            title="Storage"
            value="68%"
            color="amber"
          />

        </div>

      </GlassCard>

    </div>
  );
}

function StatusCard({
  title,
  value,
  color,
}) {
  const colorMap = {
    emerald:
      "bg-emerald-500/10 text-emerald-300",
    cyan: "bg-cyan-500/10 text-cyan-300",
    purple:
      "bg-purple-500/10 text-purple-300",
    amber:
      "bg-amber-500/10 text-amber-300",
  };

  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      className="
        rounded-3xl
        border border-white/5
        bg-white/[0.03]
        p-5
      "
    >

      <div
        className={`inline-flex rounded-2xl p-3 ${colorMap[color]}`}
      >
        <CheckCircle2 size={18} />
      </div>

      <p className="mt-4 text-sm text-white/50">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-white">
        {value}
      </h3>

    </motion.div>
  );
}