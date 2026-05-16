import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/auth-store";
import { useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Moon, Search, Sun } from "lucide-react";
import { toast } from "sonner";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-primary/20 text-primary border-primary/30",
  doctor:
    "bg-emerald-500/20 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  receptionist: "bg-accent/20 text-accent border-accent/30",
  patient: "bg-blue-500/20 text-blue-600 border-blue-400/30 dark:text-blue-400",
  superAdmin:
    "bg-violet-500/20 text-violet-700 border-violet-500/30 dark:text-violet-400",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const roleLabel =
    user.role === "superAdmin"
      ? "Super Admin"
      : user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <header
      data-ocid="navbar"
      className="h-16 bg-card border-b border-border flex items-center px-6 gap-4 flex-shrink-0 shadow-xs"
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            data-ocid="navbar.search_input"
            type="text"
            placeholder="Search patients, doctors..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          data-ocid="navbar.theme_toggle"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground transition-smooth"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label="View notifications"
          data-ocid="navbar.notifications_button"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-ocid="navbar.user_menu"
              className="flex items-center gap-2.5 pl-2 pr-1 py-1.5 rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                {getInitials(user.name)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground leading-none">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user.specialty ?? roleLabel}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={`text-xs border ${ROLE_COLORS[user.role] ?? ""}`}
                >
                  {roleLabel}
                </Badge>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              data-ocid="navbar.profile_link"
              onClick={() => toast.info("Profile settings coming soon")}
            >
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              data-ocid="navbar.logout_button"
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
