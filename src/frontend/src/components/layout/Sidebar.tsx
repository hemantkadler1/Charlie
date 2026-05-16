import type { UserRole } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BedDouble,
  Building2,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  ListOrdered,
  Receipt,
  Settings,
  Stethoscope,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

const NAV_CONFIG: Partial<
  Record<
    UserRole,
    {
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      to: string;
    }[]
  >
> = {
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
    { label: "Doctors", icon: Stethoscope, to: "/admin/doctors" },
    { label: "Receptionists", icon: UserCog, to: "/admin/receptionists" },
    { label: "Departments", icon: Building2, to: "/admin/departments" },
    { label: "Rooms & Beds", icon: BedDouble, to: "/admin/rooms" },
    { label: "Analytics", icon: BarChart3, to: "/admin/analytics" },
    { label: "Settings", icon: Settings, to: "/admin/settings" },
    {
      label: "Hospital Settings",
      icon: Building2,
      to: "/admin/hospital-settings",
    },
  ],
  doctor: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/doctor" },
    { label: "My Patients", icon: Users, to: "/doctor/patients" },
    { label: "Appointments", icon: Calendar, to: "/doctor/appointments" },
    {
      label: "Prescriptions",
      icon: ClipboardList,
      to: "/doctor/prescriptions",
    },
    { label: "Reports", icon: FileText, to: "/doctor/reports" },
  ],
  receptionist: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/receptionist" },
    { label: "Register Patient", icon: UserPlus, to: "/receptionist/register" },
    { label: "Book Appointment", icon: Calendar, to: "/receptionist/book" },
    { label: "Queue", icon: ListOrdered, to: "/receptionist/queue" },
    { label: "Billing", icon: Receipt, to: "/receptionist/billing" },
  ],
  patient: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/patient" },
    { label: "Appointments", icon: Calendar, to: "/patient/appointments" },
    {
      label: "Prescriptions",
      icon: ClipboardList,
      to: "/patient/prescriptions",
    },
    { label: "Billing", icon: CreditCard, to: "/patient/billing" },
  ],
};

export function Sidebar() {
  const { user } = useAuthStore();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  if (!user) return null;

  const navItems = NAV_CONFIG[user.role] ?? [];

  return (
    <aside
      data-ocid="sidebar"
      className="w-60 flex flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground font-display leading-none">
            MediCore Pro
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            St. Mary's General
          </p>
        </div>
      </div>

      {/* Role label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.to || currentPath.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-smooth ${
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              data-ocid={`sidebar.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          MediCore Pro v2.4.1
        </p>
      </div>
    </aside>
  );
}
