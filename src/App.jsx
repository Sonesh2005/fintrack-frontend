import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ ADDED
import AnimatedBackground from "./components/ui/AnimatedBackground";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import IncomePage from "./pages/IncomePage";
import BudgetPage from "./pages/BudgetPage";
import RecurringPage from "./pages/RecurringPage";
import ReportsPage from "./pages/ReportsPage";
import GoalsPage from "./pages/GoalsPage";
import AccountsPage from "./pages/AccountsPage";
import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPassword";
import TransactionsPage from "./pages/TransactionsPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import SettingsPage from "./pages/SettingsPage";
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
  <>
    {/* LIVE GLOBAL BACKGROUND */}
    <AnimatedBackground />

    <div className="relative z-10">
      <BrowserRouter>
        {/* GLOBAL TOASTER */}
        <Toaster position="top-right" />

        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/verify-otp"
            element={<OtpVerificationPage />}
          />

          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <VerifyEmailPage />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
            
          >
            <Route
  path="settings"
  element={<SettingsPage />}
/>
            <Route index element={<Navigate to="/dashboard" replace />} />
           <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="income" element={<IncomePage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="recurring" element={<RecurringPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  </>
);
}