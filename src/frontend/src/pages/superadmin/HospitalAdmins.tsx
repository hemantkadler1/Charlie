import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  UserCog,
} from "lucide-react";
import { useState } from "react";

const HOSPITAL_ADMINS = [
  {
    id: "a1",
    name: "Dr. Evelyn Reed",
    email: "ereed@stmarys.com",
    hospital: "St. Mary's General Hospital",
    hospitalId: "h1",
    status: "Active",
    since: "Jan 2024",
    lastLogin: "2 hours ago",
  },
  {
    id: "a2",
    name: "Dr. Samuel Park",
    email: "spark@riverside.com",
    hospital: "Riverside Medical Center",
    hospitalId: "h2",
    status: "Active",
    since: "Mar 2024",
    lastLogin: "1 day ago",
  },
  {
    id: "a3",
    name: "Dr. Nina Watts",
    email: "nwatts@northside.com",
    hospital: "Northside Pediatric Clinic",
    hospitalId: "h3",
    status: "Active",
    since: "Jun 2024",
    lastLogin: "3 days ago",
  },
  {
    id: "a4",
    name: "Dr. Leonard Fox",
    email: "lfox@metroheart.com",
    hospital: "Metro Heart Institute",
    hospitalId: "h4",
    status: "Active",
    since: "Nov 2023",
    lastLogin: "5 hours ago",
  },
  {
    id: "a5",
    name: "Dr. Carla Mendez",
    email: "cmendez@lakewood.com",
    hospital: "Lakewood Community Hospital",
    hospitalId: "h5",
    status: "Suspended",
    since: "Aug 2024",
    lastLogin: "2 weeks ago",
  },
  {
    id: "a6",
    name: "Dr. Aaron Kim",
    email: "akim@sunvalley.com",
    hospital: "Sunvalley Orthopedic Center",
    hospitalId: "h6",
    status: "Active",
    since: "Oct 2024",
    lastLogin: "1 hour ago",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Active:
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  Suspended: "bg-destructive/10 text-destructive border-destructive/30",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function HospitalAdmins() {
  const [search, setSearch] = useState("");

  const filtered = HOSPITAL_ADMINS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.hospital.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Hospital Admins
          </h1>
          <p className="text-muted-foreground mt-0.5">
            Manage administrator accounts across all hospitals
          </p>
        </div>
        <Button
          type="button"
          data-ocid="super-admin.admins.add_button"
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Admins",
            value: HOSPITAL_ADMINS.length,
            icon: UserCog,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Active",
            value: HOSPITAL_ADMINS.filter((a) => a.status === "Active").length,
            icon: Shield,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Suspended",
            value: HOSPITAL_ADMINS.filter((a) => a.status === "Suspended")
              .length,
            icon: UserCog,
            color: "text-destructive",
            bg: "bg-destructive/10",
          },
        ].map((s, i) => (
          <Card
            key={s.label}
            data-ocid={`super-admin.admins.stat.${i + 1}`}
            className="border-border"
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}
              >
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground font-display">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="super-admin.admins.search_input"
          placeholder="Search admins…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-muted/30"
        />
      </div>

      {/* Admins table */}
      <Card data-ocid="super-admin.admins.card" className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            All Hospital Admins
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div
            data-ocid="super-admin.admins.list"
            className="divide-y divide-border"
          >
            {filtered.map((admin, i) => (
              <div
                key={admin.id}
                data-ocid={`super-admin.admins.item.${i + 1}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-smooth"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                  {getInitials(admin.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {admin.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" /> {admin.email}
                    </span>
                  </div>
                </div>

                {/* Hospital */}
                <div className="hidden md:flex items-center gap-1.5 min-w-0 max-w-[200px]">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">
                    {admin.hospital}
                  </span>
                </div>

                {/* Meta */}
                <div className="hidden lg:block text-right">
                  <p className="text-xs text-muted-foreground">Last login</p>
                  <p className="text-xs font-medium text-foreground">
                    {admin.lastLogin}
                  </p>
                </div>

                {/* Status */}
                <Badge
                  variant="outline"
                  className={`text-xs border shrink-0 ${STATUS_COLORS[admin.status]}`}
                >
                  {admin.status}
                </Badge>

                {/* Actions */}
                <button
                  type="button"
                  data-ocid={`super-admin.admins.actions.${i + 1}.button`}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
                  aria-label="Admin actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              data-ocid="super-admin.admins.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <UserCog className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-medium">No admins found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
