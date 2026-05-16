import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/useTheme";
import type { UserRole } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  Moon,
  Shield,
  Stethoscope,
  Sun,
  Users,
} from "lucide-react";
import { useState } from "react";

interface RoleOption {
  role: UserRole;
  label: string;
  description: string;
  color: string;
  defaultUser: string;
}

const ROLES: RoleOption[] = [
  {
    role: "admin",
    label: "Administrator",
    description: "Full system access",
    color: "border-primary/60 bg-primary/10",
    defaultUser: "Dr. Evelyn Reed",
  },
  {
    role: "doctor",
    label: "Doctor",
    description: "Patient care & records",
    color: "border-emerald-500/60 bg-emerald-500/10",
    defaultUser: "Dr. Marcus Chen",
  },
  {
    role: "receptionist",
    label: "Receptionist",
    description: "Front desk operations",
    color: "border-accent/60 bg-accent/10",
    defaultUser: "Sarah Johnson",
  },
  {
    role: "patient",
    label: "Patient",
    description: "Personal health portal",
    color: "border-blue-400/60 bg-blue-400/10",
    defaultUser: "James Wilson",
  },
];

const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: "/admin",
  doctor: "/doctor",
  receptionist: "/receptionist",
  patient: "/patient",
  superAdmin: "/super-admin",
};

export default function LoginPage() {
  const { login, loginWithCredentials } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("admin@medicore.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setLoginError("");
    const r = ROLES.find((r) => r.role === role);
    if (r) setEmail(`${r.role}@medicore.com`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    await new Promise((res) => setTimeout(res, 800));
    // Check super admin credentials
    const emailUsername = email.split("@")[0];
    if (loginWithCredentials(emailUsername, password)) {
      navigate({ to: "/super-admin" });
      return;
    }
    login(selectedRole);
    navigate({ to: ROLE_REDIRECTS[selectedRole] });
  };

  const _selectedRoleData = ROLES.find((r) => r.role === selectedRole)!;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Theme toggle - top right corner */}
      <button
        type="button"
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        data-ocid="login.theme_toggle"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground transition-smooth"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </button>

      {/* Left panel — hero */}
      <div className="hidden lg:flex lg:w-[55%] flex-col relative overflow-hidden bg-card border-r border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(/assets/generated/hospital-hero.dim_1200x600.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 p-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground font-display">
                MediCore Pro
              </p>
              <p className="text-xs text-muted-foreground">
                St. Mary's General Hospital
              </p>
            </div>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-foreground font-display leading-tight mb-4">
              Enterprise Healthcare
              <span className="block text-primary">Management System</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Streamline patient care, appointments, billing, and analytics —
              all in one unified platform.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { icon: Users, label: "Active Patients", value: "2,847" },
                { icon: Activity, label: "Daily Appointments", value: "120+" },
                { icon: Shield, label: "Data Security", value: "HIPAA" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4">
                  <stat.icon className="w-5 h-5 text-accent mb-2" />
                  <p className="text-xl font-bold text-foreground font-display">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MediCore Pro. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground font-display">
              MediCore Pro
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground font-display mb-1">
            Sign in
          </h2>
          <p className="text-muted-foreground mb-8">
            Select your role and enter your credentials
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {ROLES.map((r) => (
              <button
                key={r.role}
                type="button"
                data-ocid={`login.role_${r.role}.button`}
                onClick={() => handleRoleSelect(r.role)}
                className={`text-left p-3 rounded-xl border-2 transition-smooth ${
                  selectedRole === r.role
                    ? `${r.color} border-opacity-100`
                    : "border-border bg-muted/20 hover:border-border hover:bg-muted/40"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">
                  {r.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.description}
                </p>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-muted/30"
                data-ocid="login.email_input"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/30 pr-10"
                  data-ocid="login.password_input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Demo: any credentials work — role determines dashboard
            </p>
            {loginError && (
              <p
                data-ocid="login.error_state"
                className="text-xs text-destructive font-medium"
              >
                {loginError}
              </p>
            )}

            <Button
              type="submit"
              data-ocid="login.submit_button"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
              disabled={isLoading}
            >
              {isLoading ? "Signing in…" : "Sign in to Dashboard"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-smooth"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
