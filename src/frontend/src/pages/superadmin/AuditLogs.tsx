import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";

type AuditStatus = "success" | "warning" | "danger";

interface AuditEntry {
  id: string;
  timestamp: string;
  hospital: string;
  user: string;
  role: string;
  action: string;
  status: AuditStatus;
}

const AUDIT_LOGS: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2026-05-16 09:14:22",
    hospital: "St. Mary's General Hospital",
    user: "Dr. Sarah Chen",
    role: "Doctor",
    action: "Patient registered",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2026-05-16 09:02:11",
    hospital: "Metro Heart Institute",
    user: "James Whitfield",
    role: "Receptionist",
    action: "Appointment booked",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2026-05-16 08:55:04",
    hospital: "Riverside Medical Center",
    user: "Admin Rivera",
    role: "Admin",
    action: "User suspended",
    status: "warning",
  },
  {
    id: "4",
    timestamp: "2026-05-15 17:40:33",
    hospital: "Platform",
    user: "superadmin",
    role: "Super Admin",
    action: "Hospital activated",
    status: "success",
  },
  {
    id: "5",
    timestamp: "2026-05-15 15:22:18",
    hospital: "Platform",
    user: "superadmin",
    role: "Super Admin",
    action: "Admin credentials reset",
    status: "warning",
  },
  {
    id: "6",
    timestamp: "2026-05-15 13:08:57",
    hospital: "Northside Pediatric Clinic",
    user: "Dr. Amir Hassan",
    role: "Doctor",
    action: "Prescription created",
    status: "success",
  },
  {
    id: "7",
    timestamp: "2026-05-15 12:34:01",
    hospital: "Lakewood Community Hospital",
    user: "Billing Mgr.",
    role: "Admin",
    action: "Billing module disabled",
    status: "danger",
  },
  {
    id: "8",
    timestamp: "2026-05-15 10:17:44",
    hospital: "Metro Heart Institute",
    user: "Dr. Priya Nair",
    role: "Doctor",
    action: "Patient registered",
    status: "success",
  },
  {
    id: "9",
    timestamp: "2026-05-14 16:50:09",
    hospital: "Sunvalley Orthopedic Center",
    user: "Admin Taylor",
    role: "Admin",
    action: "Department added",
    status: "success",
  },
  {
    id: "10",
    timestamp: "2026-05-14 14:29:33",
    hospital: "Platform",
    user: "superadmin",
    role: "Super Admin",
    action: "Hospital deactivated",
    status: "danger",
  },
  {
    id: "11",
    timestamp: "2026-05-14 11:03:21",
    hospital: "St. Mary's General Hospital",
    user: "Reception Lee",
    role: "Receptionist",
    action: "Appointment booked",
    status: "success",
  },
  {
    id: "12",
    timestamp: "2026-05-13 15:44:52",
    hospital: "Riverside Medical Center",
    user: "Admin Rivera",
    role: "Admin",
    action: "Admin credentials reset",
    status: "warning",
  },
];

const HOSPITALS = [
  "All Hospitals",
  "Platform",
  "St. Mary's General Hospital",
  "Riverside Medical Center",
  "Northside Pediatric Clinic",
  "Metro Heart Institute",
  "Lakewood Community Hospital",
  "Sunvalley Orthopedic Center",
];
const ACTION_TYPES = [
  "All Actions",
  "Patient registered",
  "Appointment booked",
  "User suspended",
  "Hospital activated",
  "Hospital deactivated",
  "Admin credentials reset",
  "Prescription created",
  "Billing module disabled",
  "Department added",
];

const STATUS_CONFIG: Record<
  AuditStatus,
  { icon: React.ReactNode; badge: string }
> = {
  success: {
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    badge:
      "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  },
  warning: {
    icon: <Clock className="w-4 h-4 text-amber-500" />,
    badge:
      "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400",
  },
  danger: {
    icon: <AlertCircle className="w-4 h-4 text-destructive" />,
    badge: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("All Hospitals");
  const [actionFilter, setActionFilter] = useState("All Actions");

  const filtered = AUDIT_LOGS.filter((entry) => {
    const matchSearch =
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      entry.action.toLowerCase().includes(search.toLowerCase()) ||
      entry.hospital.toLowerCase().includes(search.toLowerCase());
    const matchHospital =
      hospitalFilter === "All Hospitals" || entry.hospital === hospitalFilter;
    const matchAction =
      actionFilter === "All Actions" || entry.action === actionFilter;
    return matchSearch && matchHospital && matchAction;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-violet-500" />
            <h1 className="text-2xl font-bold text-foreground font-display">
              Audit Logs
            </h1>
          </div>
          <p className="text-muted-foreground">
            Complete trail of platform and hospital-level events
          </p>
        </div>
        <Badge variant="outline" className="border-border">
          {filtered.length} events
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="super-admin.audit-logs.search_input"
            placeholder="Search user, action, hospital…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30"
          />
        </div>
        <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
          <SelectTrigger
            data-ocid="super-admin.audit-logs.hospital_select"
            className="w-56 bg-muted/30"
          >
            <SelectValue placeholder="Filter by hospital" />
          </SelectTrigger>
          <SelectContent>
            {HOSPITALS.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger
            data-ocid="super-admin.audit-logs.action_select"
            className="w-56 bg-muted/30"
          >
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            {ACTION_TYPES.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card data-ocid="super-admin.audit-logs.card" className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            Event Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div
              data-ocid="super-admin.audit-logs.empty_state"
              className="text-center py-16 text-muted-foreground"
            >
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No events found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Timestamp
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Hospital
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Action
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((entry, i) => (
                    <tr
                      key={entry.id}
                      data-ocid={`super-admin.audit-logs.item.${i + 1}`}
                      className="hover:bg-muted/30 transition-smooth"
                    >
                      <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {entry.timestamp}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-foreground font-medium truncate max-w-[160px] block">
                          {entry.hospital}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-foreground whitespace-nowrap">
                        {entry.user}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-muted-foreground">
                          {entry.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-foreground whitespace-nowrap">
                        {entry.action}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {STATUS_CONFIG[entry.status].icon}
                          <Badge
                            variant="outline"
                            className={`text-xs border capitalize ${STATUS_CONFIG[entry.status].badge}`}
                          >
                            {entry.status}
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
