import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Target,
  Landmark,
  Repeat,
  FileText,
  Bell,
  Search,
  LogOut,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ShieldAlert,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AnimatedBackground from "../ui/AnimatedBackground";
import GlassCard from "../ui/GlassCard";
import useDashboardData from "../../features/dashboard/useDashboardData";
import useBudgetData from "../../features/budget/useBudgetData";
import calculateFinancialHealth from "../../utils/calculateFinancialHealth";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "../../utils/notificationSocket";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Income", icon: ArrowDownCircle, path: "/income" },
  { name: "Expenses", icon: ArrowUpCircle, path: "/expenses" },
  { name: "Transactions", icon: Receipt, path: "/transactions" },
  { name: "Budget", icon: Wallet, path: "/budget" },
  { name: "Goals", icon: Target, path: "/goals" },
  { name: "Accounts", icon: Landmark, path: "/accounts" },
  { name: "Recurring", icon: Repeat, path: "/recurring" },
  { name: "Reports", icon: FileText, path: "/reports" },
  { name: "Settings", icon: ShieldAlert, path: "/settings" },
];

function SidebarItem({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
          isActive
  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg border border-cyan-400/20 backdrop-blur-xl"
  : "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1"
        }`
      }
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{item.name}</span>
    </NavLink>
  );
}

function getNotificationMeta(type) {
  switch ((type || "").toLowerCase()) {
    case "warning":
      return {
        icon: AlertTriangle,
        iconClass: "bg-amber-500/10 text-amber-300",
      };
    case "success":
      return {
        icon: CheckCircle2,
        iconClass: "bg-emerald-500/10 text-emerald-300",
      };
    case "reminder":
      return {
        icon: Clock3,
        iconClass: "bg-cyan-500/10 text-cyan-300",
      };
    case "security":
    case "danger":
      return {
        icon: ShieldAlert,
        iconClass: "bg-rose-500/10 text-rose-300",
      };
    default:
      return {
        icon: Bell,
        iconClass: "bg-white/10 text-white/70",
      };
  }
}

function formatNotificationTime(createdAt) {
  if (!createdAt) return "Recently";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Recently";

  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { summaryQuery } = useDashboardData();
  const { alertsQuery } = useBudgetData();

  const summary = summaryQuery.data || {};
  const alerts = alertsQuery.data || {};

  const { score: financialHealth, message: healthMessage, colorClass } =
    calculateFinancialHealth(summary, alerts);

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const userId = localStorage.getItem("userId");
  
  // Get user data from localStorage
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};
  const name = parsedUser?.name || "";
  const email = parsedUser?.email || "";

  const initials = name
    ? name
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 15000,
  });

  const unreadCountQuery = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 15000,
  });

  const markOneReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });

  const notifications = Array.isArray(notificationsQuery.data)
    ? notificationsQuery.data
    : [];

  const unreadCount = unreadCountQuery.data?.count ?? 0;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const client = connectNotificationSocket(userId, (newNotification) => {
      queryClient.setQueryData(["notifications"], (oldData = []) => [
        newNotification,
        ...oldData,
      ]);

      queryClient.setQueryData(["notifications-unread-count"], (oldData) => ({
        count: (oldData?.count || 0) + 1,
      }));

      toast.success(newNotification.title || "New notification");
    });

    return () => {
      if (client) {
        disconnectNotificationSocket();
      }
    };
  }, [userId, queryClient]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead && !notification.read) {
      markOneReadMutation.mutate(notification.id);
    }
  };

  const handleMarkAllRead = () => {
    if (notifications.length > 0) {
      markAllReadMutation.mutate();
    }
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith("/expenses")) return "Expenses";
    if (location.pathname.startsWith("/transactions")) return "Transactions";
    if (location.pathname.startsWith("/income")) return "Income";
    if (location.pathname.startsWith("/budget")) return "Budget";
    if (location.pathname.startsWith("/goals")) return "Goals";
    if (location.pathname.startsWith("/accounts")) return "Accounts";
    if (location.pathname.startsWith("/recurring")) return "Recurring";
    if (location.pathname.startsWith("/reports")) return "Reports";
    return "Dashboard Overview";
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  navigate("/login");
};

 return (
  
   

    <div className="relative z-10 min-h-screen bg-transparent text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-2xl lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="FinTrack"
                className="h-11 w-11 rounded-2xl object-cover shadow-lg shadow-emerald-500/20 transition duration-300 hover:scale-105"
              />
              <div>
                <h1 className="text-lg font-semibold tracking-tight">FinTrack</h1>
                <p className="text-xs text-white/50">Premium Finance OS</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => (
              <SidebarItem key={item.name} item={item} />
            ))}
          </nav>

          <div className="p-4">
            <GlassCard className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
              <p className="text-sm font-semibold">Financial Health</p>

              <p className={`mt-1 text-2xl font-bold ${colorClass}`}>
                {summaryQuery.isLoading || alertsQuery.isLoading
                  ? "..."
                  : `${financialHealth}%`}
              </p>

              <p className="mt-2 text-xs text-white/60">
                {summaryQuery.isLoading || alertsQuery.isLoading
                  ? "Calculating..."
                  : healthMessage}
              </p>

              <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all"
                  style={{ width: `${financialHealth}%` }}
                />
              </div>
            </GlassCard>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1020]/80 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
              <div>
                <p className="text-sm text-white/50">Welcome back</p>
                <h2 className="text-xl font-semibold tracking-tight">
                  {getPageTitle()}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/60 md:flex">
                  <Search size={16} />
                  <span className="text-sm">Search</span>
                </div>

                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications((prev) => !prev)}
                    className="relative rounded-2xl border border-white/10 bg-white/5 p-3 text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-[360px] overflow-hidden rounded-3xl border border-white/10 bg-[#11182f] shadow-2xl">
                      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                        <div>
                          <h3 className="text-sm font-semibold">Notifications</h3>
                          <p className="mt-1 text-xs text-white/45">
                            Recent account updates
                          </p>
                        </div>

                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
                          disabled={markAllReadMutation.isPending}
                        >
                          {markAllReadMutation.isPending
                            ? "Updating..."
                            : "Mark all read"}
                        </button>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notificationsQuery.isLoading ? (
                          <div className="px-4 py-8 text-center text-sm text-white/50">
                            Loading notifications...
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-white/50">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((item) => {
                            const { icon: Icon, iconClass } = getNotificationMeta(
                              item.type
                            );

                            const unread =
                              item.isRead === false || item.read === false;

                            return (
                              <button
                                key={item.id}
                                onClick={() => handleNotificationClick(item)}
                                className="block w-full border-b border-white/5 px-4 py-4 text-left transition hover:bg-white/5"
                              >
                                <div className="flex gap-3">
                                  <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
                                  >
                                    <Icon size={16} />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                      <p className="text-sm font-semibold text-white">
                                        {item.title}
                                      </p>
                                      {unread && (
                                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />
                                      )}
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-white/60">
                                      {item.message}
                                    </p>

                                    <p className="mt-2 text-[11px] text-white/35">
                                      {formatNotificationTime(item.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>

                      <div className="border-t border-white/10 px-4 py-3 text-center">
                        <button className="text-xs font-medium text-cyan-300 transition hover:text-cyan-200">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-teal-500 text-sm font-semibold text-white">
                    {initials}
                  </div>

                  <div className="hidden text-left md:block">
                    <div className="text-sm font-medium text-white">
                      {name || "User"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {email || "Workspace"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
        </div>

);
}