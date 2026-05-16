import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  BarChart3,
  Building2,
  CalendarCheck,
  DollarSign,
  Stethoscope,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

const PLATFORM_STATS = [
  {
    label: "Total Patients",
    value: "24,391",
    sub: "Across all hospitals",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Total Revenue",
    value: "$4.28M",
    sub: "+12.4% this quarter",
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Total Appointments",
    value: "87,642",
    sub: "+2,314 this month",
    icon: CalendarCheck,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    label: "Active Hospitals",
    value: "11",
    sub: "1 currently inactive",
    icon: Building2,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Active Doctors",
    value: "634",
    sub: "Across 8 specialties",
    icon: Stethoscope,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Active Staff",
    value: "1,482",
    sub: "Receptionists, nurses, lab",
    icon: UserCheck,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
  },
];

const HOSPITAL_BREAKDOWN = [
  {
    id: "h1",
    name: "St. Mary's General Hospital",
    city: "Chicago, IL",
    patients: 6842,
    appointments: 23410,
    revenue: "$1,240,000",
    status: "Active",
  },
  {
    id: "h2",
    name: "Riverside Medical Center",
    city: "Boston, MA",
    patients: 4917,
    appointments: 18220,
    revenue: "$894,000",
    status: "Active",
  },
  {
    id: "h3",
    name: "Northside Pediatric Clinic",
    city: "Seattle, WA",
    patients: 1843,
    appointments: 7340,
    revenue: "$284,000",
    status: "Active",
  },
  {
    id: "h4",
    name: "Metro Heart Institute",
    city: "New York, NY",
    patients: 7201,
    appointments: 25100,
    revenue: "$1,580,000",
    status: "Active",
  },
  {
    id: "h5",
    name: "Lakewood Community Hospital",
    city: "Denver, CO",
    patients: 1240,
    appointments: 5820,
    revenue: "$196,000",
    status: "Inactive",
  },
  {
    id: "h6",
    name: "Sunvalley Orthopedic Center",
    city: "Phoenix, AZ",
    patients: 2348,
    appointments: 7752,
    revenue: "$386,000",
    status: "Active",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Active:
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  Inactive: "bg-muted text-muted-foreground border-border",
};

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-violet-500" />
            <h1 className="text-2xl font-bold text-foreground font-display">
              Cross-Hospital Analytics
            </h1>
          </div>
          <p className="text-muted-foreground">
            Aggregated performance metrics across all registered hospitals
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-400"
        >
          <Activity className="w-3.5 h-3.5 mr-1.5" />
          Live Data
        </Badge>
      </div>

      {/* Stat cards */}
      <div
        data-ocid="super-admin.analytics.stats"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {PLATFORM_STATS.map((stat, i) => (
          <Card
            key={stat.label}
            data-ocid={`super-admin.analytics.item.${i + 1}`}
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
              <p className="text-sm font-medium text-foreground mt-0.5">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Per-hospital breakdown table */}
      <Card
        data-ocid="super-admin.analytics.breakdown.card"
        className="border-border"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Per-Hospital Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Hospital
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Patients
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Appointments
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Revenue
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {HOSPITAL_BREAKDOWN.map((h, i) => (
                  <tr
                    key={h.id}
                    data-ocid={`super-admin.analytics.breakdown.item.${i + 1}`}
                    className="hover:bg-muted/30 transition-smooth"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {h.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {h.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-foreground">
                      {h.patients.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-foreground">
                      {h.appointments.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {h.revenue}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${STATUS_COLORS[h.status]}`}
                      >
                        {h.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
