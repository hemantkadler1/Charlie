import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search, Shield, UserX, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PlatformUser {
  id: string;
  name: string;
  hospital: string;
  role: string;
  email: string;
  status: "Active" | "Suspended";
}

const ALL_USERS: PlatformUser[] = [
  {
    id: "u1",
    name: "Dr. Sarah Chen",
    hospital: "St. Mary's General Hospital",
    role: "Doctor",
    email: "s.chen@stmary.com",
    status: "Active",
  },
  {
    id: "u2",
    name: "James Whitfield",
    hospital: "Metro Heart Institute",
    role: "Receptionist",
    email: "j.whitfield@metroheart.com",
    status: "Active",
  },
  {
    id: "u3",
    name: "Admin Rivera",
    hospital: "Riverside Medical Center",
    role: "Admin",
    email: "a.rivera@riverside.com",
    status: "Active",
  },
  {
    id: "u4",
    name: "Dr. Amir Hassan",
    hospital: "Northside Pediatric Clinic",
    role: "Doctor",
    email: "a.hassan@northside.com",
    status: "Active",
  },
  {
    id: "u5",
    name: "Billing Mgr. Torres",
    hospital: "Lakewood Community Hospital",
    role: "Admin",
    email: "b.torres@lakewood.com",
    status: "Suspended",
  },
  {
    id: "u6",
    name: "Dr. Priya Nair",
    hospital: "Metro Heart Institute",
    role: "Doctor",
    email: "p.nair@metroheart.com",
    status: "Active",
  },
  {
    id: "u7",
    name: "Admin Taylor",
    hospital: "Sunvalley Orthopedic Center",
    role: "Admin",
    email: "a.taylor@sunvalley.com",
    status: "Active",
  },
  {
    id: "u8",
    name: "Reception Lee",
    hospital: "St. Mary's General Hospital",
    role: "Receptionist",
    email: "r.lee@stmary.com",
    status: "Active",
  },
  {
    id: "u9",
    name: "Dr. Marcus Webb",
    hospital: "Riverside Medical Center",
    role: "Doctor",
    email: "m.webb@riverside.com",
    status: "Suspended",
  },
  {
    id: "u10",
    name: "Nurse Amara Diallo",
    hospital: "Northside Pediatric Clinic",
    role: "Nurse",
    email: "a.diallo@northside.com",
    status: "Active",
  },
  {
    id: "u11",
    name: "Dr. Elena Voronova",
    hospital: "Metro Heart Institute",
    role: "Doctor",
    email: "e.voronova@metroheart.com",
    status: "Active",
  },
  {
    id: "u12",
    name: "Pharmacist Kim",
    hospital: "St. Mary's General Hospital",
    role: "Pharmacist",
    email: "k.nam@stmary.com",
    status: "Active",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Active:
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  Suspended: "bg-destructive/10 text-destructive border-destructive/30",
};

const ROLE_COLORS: Record<string, string> = {
  Doctor: "bg-primary/10 text-primary border-primary/30",
  Admin:
    "bg-violet-500/10 text-violet-700 border-violet-500/30 dark:text-violet-400",
  Receptionist:
    "bg-teal-500/10 text-teal-700 border-teal-500/30 dark:text-teal-400",
  Nurse: "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:text-blue-400",
  Pharmacist:
    "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400",
};

export default function UserOversight() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<PlatformUser[]>(ALL_USERS);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((u) => u.id)));
    }
  };

  const handleBulkSuspend = () => {
    if (selected.size === 0) return;
    setUsers((prev) =>
      prev.map((u) =>
        selected.has(u.id) ? { ...u, status: "Suspended" as const } : u,
      ),
    );
    toast.warning(`${selected.size} user(s) suspended`, {
      description: "Their access has been revoked across all modules.",
    });
    setSelected(new Set());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-violet-500" />
            <h1 className="text-2xl font-bold text-foreground font-display">
              User Oversight
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage and monitor all users across every hospital
          </p>
        </div>
        {selected.size > 0 && (
          <Button
            type="button"
            variant="destructive"
            data-ocid="super-admin.user-oversight.bulk_suspend_button"
            onClick={handleBulkSuspend}
            className="gap-2"
          >
            <UserX className="w-4 h-4" />
            Suspend {selected.size} Selected
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="super-admin.user-oversight.search_input"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-muted/30"
        />
      </div>

      {/* Table */}
      <Card
        data-ocid="super-admin.user-oversight.card"
        className="border-border"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              All Platform Users
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {filtered.length} users
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div
              data-ocid="super-admin.user-oversight.empty_state"
              className="text-center py-16 text-muted-foreground"
            >
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No users found</p>
              <p className="text-sm mt-1">Try adjusting your search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-3 w-10">
                      <Checkbox
                        data-ocid="super-admin.user-oversight.select_all_checkbox"
                        checked={
                          selected.size === filtered.length &&
                          filtered.length > 0
                        }
                        onCheckedChange={toggleAll}
                        aria-label="Select all"
                      />
                    </th>
                    <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Hospital
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Email
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((user, i) => (
                    <tr
                      key={user.id}
                      data-ocid={`super-admin.user-oversight.item.${i + 1}`}
                      className="hover:bg-muted/30 transition-smooth"
                    >
                      <td className="px-6 py-3.5">
                        <Checkbox
                          data-ocid={`super-admin.user-oversight.checkbox.${i + 1}`}
                          checked={selected.has(user.id)}
                          onCheckedChange={() => toggleSelect(user.id)}
                          aria-label={`Select ${user.name}`}
                        />
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <span className="font-medium text-foreground whitespace-nowrap">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs max-w-[180px] truncate">
                        {user.hospital}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={`text-xs border ${ROLE_COLORS[user.role] ?? "bg-muted text-muted-foreground border-border"}`}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {user.status === "Suspended" && (
                            <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs border ${STATUS_COLORS[user.status]}`}
                          >
                            {user.status}
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
