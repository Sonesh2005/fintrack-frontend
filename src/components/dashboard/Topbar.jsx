import {
  Bell,
  Search,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";

import {
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {

  const [search, setSearch] =
    useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // USER DATA

  const [user, setUser] =
  useState({
    name: "",
    email: "",
  });

useEffect(() => {

  const storedUser =
    localStorage.getItem("user");

  if (storedUser) {

    const parsedUser =
      JSON.parse(storedUser);

    setUser(parsedUser);
  }

}, []);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileOpen(false);
    }
  };
  
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const initials =
  user?.name
    ? user.name
        .split(" ")
        .map(n => n.charAt(0).toUpperCase())
        .join("")
    : "U";

  /* SEARCH */

  const handleSearch = (
    e
  ) => {

    e.preventDefault();

    console.log(
      "Searching:",
      search
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (

    <div
      className="
        sticky
        top-0
        z-30
        border-b
        border-white/10
        bg-[#020617]/70
        backdrop-blur-xl
      "
    >

      <div
        className="
          flex
          flex-col
          gap-5
          px-8
          py-6
          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >

        {/* LEFT */}

        <div>

          <p className="text-cyan-400">
            AI Finance Platform
          </p>

          <h1
            className="
              text-4xl
              font-black
              tracking-tight
              text-white
            "
          >
            Dashboard
          </h1>

        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
          "
        >

          {/* SEARCH */}

          <form
            onSubmit={
              handleSearch
            }

            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border border-white/10
              bg-white/[0.04]
              px-5
              py-4
              backdrop-blur-xl
            "
          >

            <Search
              size={18}
              className="text-white/50"
            />

            <input
              type="text"

              placeholder="Search transactions..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              className="
                w-[240px]
                bg-transparent
                text-white
                outline-none
                placeholder:text-white/40
              "
            />

          </form>

          {/* AI BUTTON */}

          <button
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border border-cyan-500/20
              bg-cyan-500/10
              px-5
              py-4
              text-cyan-300
              transition
              hover:scale-[1.02]
            "
          >

            <Sparkles size={18} />

            AI Insights

          </button>

          {/* NOTIFICATION */}

          <button
            className="
              relative
              rounded-2xl
              border border-white/10
              bg-white/[0.04]
              p-4
            "
          >

            <Bell size={20} />

            <div
              className="
                absolute
                right-3
                top-3
                h-2
                w-2
                rounded-full
                bg-cyan-400
              "
            />

          </button>

          {/* PROFILE DROPDOWN */}

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="
                flex
                min-w-[220px]
                items-center
                justify-between
                gap-4
                rounded-2xl
                border border-white/10
                bg-white/[0.04]
                px-5
                py-3
                transition
                hover:border-cyan-400/30
                hover:bg-white/[0.06]
              "
            >
              <div className="flex items-center gap-4">
                {/* AVATAR */}
                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-cyan-500
                    to-purple-500
                    font-bold
                    text-white
                    text-sm
                  "
                >
                  {initials}
                </div>

                {/* USER INFO */}
                <div className="flex flex-col text-left">
                  <p className="font-semibold text-white text-sm">
                    {user?.name || "User"}
                  </p>
                  <p className="max-w-[120px] truncate text-xs text-white/50">
                    {user?.email || "workspace@app"}
                  </p>
                </div>
              </div>

              <ChevronDown
                size={16}
                className={`text-white/50 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* DROPDOWN MENU */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#020617]/95 backdrop-blur-xl shadow-xl z-50">
                {/* USER INFO SECTION */}
                <div className="border-b border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/50">Logged in as</p>
                  <p className="mt-2 font-semibold text-white">{user?.name || "User"}</p>
                  <p className="text-sm text-white/60">{user?.email || "workspace@app"}</p>
                </div>

                {/* MENU ITEMS */}
                <div className="p-2 space-y-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/80 hover:bg-white/10 transition text-sm">
                    <User size={16} />
                    View Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/80 hover:bg-white/10 transition text-sm">
                    <Settings size={16} />
                    Settings
                  </button>
                </div>

                {/* LOGOUT */}
                <div className="border-t border-white/10 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400/80 hover:bg-red-500/10 transition text-sm"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}