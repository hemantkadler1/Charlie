import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Building2,
  MapPin,
  Phone,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const HOSPITALS = [
  {
    id: "h1",
    name: "St. Mary's General Hospital",
    city: "Chicago, IL",
    phone: "+1 312-555-0100",
    users: 128,
    beds: 340,
    departments: 12,
    status: "Active",
    plan: "Enterprise",
    since: "Jan 2024",
  },
  {
    id: "h2",
    name: "Riverside Medical Center",
    city: "Boston, MA",
    phone: "+1 617-555-0200",
    users: 94,
    beds: 220,
    departments: 9,
    status: "Active",
    plan: "Professional",
    since: "Mar 2024",
  },
  {
    id: "h3",
    name: "Northside Pediatric Clinic",
    city: "Seattle, WA",
    phone: "+1 206-555-0300",
    users: 42,
    beds: 80,
    departments: 5,
    status: "Active",
    plan: "Standard",
    since: "Jun 2024",
  },
  {
    id: "h4",
    name: "Metro Heart Institute",
    city: "New York, NY",
    phone: "+1 212-555-0400",
    users: 210,
    beds: 480,
    departments: 15,
    status: "Active",
    plan: "Enterprise",
    since: "Nov 2023",
  },
  {
    id: "h5",
    name: "Lakewood Community Hospital",
    city: "Denver, CO",
    phone: "+1 720-555-0500",
    users: 67,
    beds: 140,
    departments: 7,
    status: "Inactive",
    plan: "Standard",
    since: "Aug 2024",
  },
  {
    id: "h6",
    name: "Sunvalley Orthopedic Center",
    city: "Phoenix, AZ",
    phone: "+1 602-555-0600",
    users: 55,
    beds: 100,
    departments: 4,
    status: "Active",
    plan: "Professional",
    since: "Oct 2024",
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

export default function Hospitals() {
  const [search, setSearch] = useState("");

  const filtered = HOSPITALS.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Hospitals
          </h1>
          <p className="text-muted-foreground mt-0.5">
            Manage all registered hospital accounts
          </p>
        </div>
        <Button
          type="button"
          data-ocid="super-admin.hospitals.add_button"
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Hospital
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="super-admin.hospitals.search_input"
          placeholder="Search hospitals…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-muted/30"
        />
      </div>

      {/* Hospital cards */}
      <div
        data-ocid="super-admin.hospitals.list"
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {filtered.map((h, i) => (
          <Card
            key={h.id}
            data-ocid={`super-admin.hospitals.item.${i + 1}`}
            className="border-border hover:shadow-elevated transition-smooth"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {h.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Since {h.since}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs border shrink-0 ${STATUS_COLORS[h.status]}`}
                >
                  {h.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {h.city}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  {h.phone}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: Users, value: h.users, label: "Users" },
                  { icon: Building2, value: h.beds, label: "Beds" },
                  { icon: TrendingUp, value: h.departments, label: "Depts" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center rounded-lg bg-muted/40 p-2"
                  >
                    <p className="text-base font-bold text-foreground font-display">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Badge
                  variant="outline"
                  className={`text-xs border ${PLAN_COLORS[h.plan]}`}
                >
                  {h.plan}
                </Badge>
                <button
                  type="button"
                  data-ocid={`super-admin.hospitals.manage.${i + 1}.button`}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-smooth"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Manage
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          data-ocid="super-admin.hospitals.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No hospitals found</p>
          <p className="text-sm mt-1">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}
