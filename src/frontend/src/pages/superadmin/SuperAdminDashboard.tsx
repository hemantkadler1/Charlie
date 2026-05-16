import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  Shield,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";

const PLATFORM_STATS = [
  {
    label: "Total Hospitals",
    value: "12",
    change: "+2 this month",
    icon: Building2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Active Users",
    value: "3,847",
    change: "+184 this week",
    icon: Users,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Platform Uptime",
    value: "99.9%",
    change: "Last 30 days",
    icon: Activity,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    label: "Support Tickets",
    value: "7",
    change: "3 pending",
    icon: AlertCircle,
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const HOSPITALS = [
  {
    id: "h1",
    name: "St. Mary's General Hospital",
    city: "Chicago, IL",
    users: 128,
    status: "Active",
    plan: "Enterprise",
  },
  {
    id: "h2",
    name: "Riverside Medical Center",
    city: "Boston, MA",
    users: 94,
    status: "Active",
    plan: "Professional",
  },
  {
    id: "h3",
    name: "Northside Pediatric Clinic",
    city: "Seattle, WA",
    users: 42,
    status: "Active",
    plan: "Standard",
  },
  {
    id: "h4",
    name: "Metro Heart Institute",
    city: "New York, NY",
    users: 210,
    status: "Active",
    plan: "Enterprise",
  },
  {
    id: "h5",
    name: "Lakewood Community Hospital",
    city: "Denver, CO",
    users: 67,
    status: "Inactive",
    plan: "Standard",
  },
];

const AUDIT_LOG = [
  {
    id: "audit-1",
    action: "Hospital created",
    actor: "superadmin",
    target: "Metro Heart Institute",
    time: "2 hours ago",
    type: "create",
  },
  {
    id: "audit-2",
    action: "Admin password reset",
    actor: "superadmin",
    target: "Dr. Evelyn Reed",
    time: "5 hours ago",
    type: "update",
  },
  {
    id: "audit-3",
    action: "Hospital deactivated",
    actor: "superadmin",
    target: "Lakewood Community Hospital",
    time: "1 day ago",
    type: "warning",
  },
  {
    id: "audit-4",
    action: "System config updated",
    actor: "superadmin",
    target: "Email notifications",
    time: "2 days ago",
    type: "update",
  },
  {
    id: "audit-5",
    action: "New hospital onboarded",
    actor: "superadmin",
    target: "Northside Pediatric Clinic",
    time: "3 days ago",
    type: "create",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Active:
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  Inactive: "bg-muted text-muted-foreground border-border",
};

const PLAN_COLORS: Record<string, string> = {
  Enterprise:
    "bg-violet-500/10 text-violet-700 border-violet-500/30 dark:text-violet-400",
  Professional: "bg-primary/10 text-primary border-primary/30",
  Standard: "bg-muted text-muted-foreground border-border",
};

const AUDIT_ICONS: Record<string, React.ReactNode> = {
  create: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  update: <Clock className="w-4 h-4 text-primary" />,
  warning: <AlertCircle className="w-4 h-4 text-accent" />,
};

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-violet-500" />
            <h1 className="text-2xl font-bold text-foreground font-display">
              Platform Overview
            </h1>
          </div>
          <p className="text-muted-foreground">
            Multi-hospital administration dashboard — developer access only
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-400"
        >
          <Globe className="w-3.5 h-3.5 mr-1.5" />
          12 Hospitals
        </Badge>
      </div>

      {/* Stats grid */}
      <div
        data-ocid="super-admin.dashboard.stats"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {PLATFORM_STATS.map((stat, i) => (
          <Card
            key={stat.label}
            data-ocid={`super-admin.stats.item.${i + 1}`}
            className="border-border"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground font-display">
                {stat.value}
              </p>
              <p className="text-sm text-foreground font-medium mt-0.5">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Hospitals table */}
        <Card
          data-ocid="super-admin.hospitals.card"
          className="xl:col-span-2 border-border"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Registered Hospitals
              </CardTitle>
              <button
                type="button"
                data-ocid="super-admin.hospitals.view_all_button"
                className="text-xs text-primary hover:underline font-medium"
              >
                Manage all →
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div
              data-ocid="super-admin.hospitals.list"
              className="divide-y divide-border"
            >
              {HOSPITALS.map((h, i) => (
                <div
                  key={h.id}
                  data-ocid={`super-admin.hospitals.item.${i + 1}`}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition-smooth"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {h.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {h.city} · {h.users} users
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs border ${PLAN_COLORS[h.plan]}`}
                    >
                      {h.plan}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs border ${STATUS_COLORS[h.status]}`}
                    >
                      {h.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit log */}
        <Card data-ocid="super-admin.audit.card" className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <UserCog className="w-4 h-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div
              data-ocid="super-admin.audit.list"
              className="divide-y divide-border"
            >
              {AUDIT_LOG.map((entry, i) => (
                <div
                  key={entry.id}
                  data-ocid={`super-admin.audit.item.${i + 1}`}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-muted/30 transition-smooth"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {AUDIT_ICONS[entry.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {entry.action}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {entry.target}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
