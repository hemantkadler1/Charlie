import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Plus, Search, Trash2, UserCog } from "lucide-react";
import { useState } from "react";

interface Receptionist {
  id: string;
  name: string;
  email: string;
  phone: string;
  shift: "Morning" | "Evening" | "Night";
  status: "Active" | "On Leave" | "Inactive";
  joinDate: string;
  assignedCounter: string;
}

const INITIAL_RECEPTIONISTS: Receptionist[] = [
  {
    id: "rec1",
    name: "Sarah Johnson",
    email: "sjohnson@medicore.com",
    phone: "+1 555-2001",
    shift: "Morning",
    status: "Active",
    joinDate: "2023-03-15",
    assignedCounter: "Counter A",
  },
  {
    id: "rec2",
    name: "Maria Gonzalez",
    email: "mgonzalez@medicore.com",
    phone: "+1 555-2002",
    shift: "Evening",
    status: "Active",
    joinDate: "2022-09-01",
    assignedCounter: "Counter B",
  },
  {
    id: "rec3",
    name: "Kevin Patel",
    email: "kpatel@medicore.com",
    phone: "+1 555-2003",
    shift: "Night",
    status: "Active",
    joinDate: "2024-01-20",
    assignedCounter: "Counter C",
  },
  {
    id: "rec4",
    name: "Aiko Tanaka",
    email: "atanaka@medicore.com",
    phone: "+1 555-2004",
    shift: "Morning",
    status: "On Leave",
    joinDate: "2021-06-10",
    assignedCounter: "Counter A",
  },
  {
    id: "rec5",
    name: "Derek Williams",
    email: "dwilliams@medicore.com",
    phone: "+1 555-2005",
    shift: "Evening",
    status: "Active",
    joinDate: "2023-11-05",
    assignedCounter: "Counter D",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "On Leave": "bg-accent/20 text-accent border-accent/30",
  Inactive: "bg-muted text-muted-foreground border-border",
};

const SHIFT_STYLES: Record<string, string> = {
  Morning: "bg-primary/20 text-primary border-primary/30",
  Evening: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Night: "bg-muted text-muted-foreground border-border",
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  shift: string;
  assignedCounter: string;
};
const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  shift: "",
  assignedCounter: "",
};

export default function ManageReceptionists() {
  const [recs, setRecs] = useState<Receptionist[]>(INITIAL_RECEPTIONISTS);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = recs.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }
  function openEdit(r: Receptionist) {
    setEditingId(r.id);
    setForm({
      name: r.name,
      email: r.email,
      phone: r.phone,
      shift: r.shift,
      assignedCounter: r.assignedCounter,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editingId) {
      setRecs((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                ...form,
                shift: (form.shift as Receptionist["shift"]) || r.shift,
              }
            : r,
        ),
      );
    } else {
      const newRec: Receptionist = {
        id: `rec${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        shift: (form.shift as Receptionist["shift"]) || "Morning",
        status: "Active",
        joinDate: new Date().toISOString().split("T")[0],
        assignedCounter: form.assignedCounter || "Counter A",
      };
      setRecs((prev) => [...prev, newRec]);
    }
    setDialogOpen(false);
    setForm(EMPTY_FORM);
  }

  function handleDelete(id: string) {
    setRecs((prev) => prev.filter((r) => r.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="space-y-6" data-ocid="admin.receptionists.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Manage Receptionists
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {recs.length} front-desk staff across{" "}
            {new Set(recs.map((r) => r.shift)).size} shifts
          </p>
        </div>
        <Button
          data-ocid="admin.receptionists.add_button"
          onClick={openAdd}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
        >
          <Plus className="w-4 h-4" /> Add Receptionist
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="admin.receptionists.search_input"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email…"
          className="pl-9 bg-card border-border"
        />
      </div>

      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              {[
                "Staff Member",
                "Email",
                "Phone",
                "Shift",
                "Counter",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-muted-foreground"
                  data-ocid="admin.receptionists.empty_state"
                >
                  No staff found.
                </td>
              </tr>
            )}
            {paginated.map((rec, i) => (
              <tr
                key={rec.id}
                data-ocid={`admin.receptionists.item.${(page - 1) * PAGE_SIZE + i + 1}`}
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <UserCog className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {rec.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Since {rec.joinDate}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {rec.email}
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground font-mono">
                  {rec.phone}
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant="outline"
                    className={`text-xs border ${SHIFT_STYLES[rec.shift] ?? ""}`}
                  >
                    {rec.shift}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {rec.assignedCounter}
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant="outline"
                    className={`text-xs border ${STATUS_STYLES[rec.status] ?? ""}`}
                  >
                    {rec.status}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      data-ocid={`admin.receptionists.edit_button.${(page - 1) * PAGE_SIZE + i + 1}`}
                      onClick={() => openEdit(rec)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-ocid={`admin.receptionists.delete_button.${(page - 1) * PAGE_SIZE + i + 1}`}
                      onClick={() => setDeleteId(rec.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                data-ocid="admin.receptionists.pagination_prev"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                data-ocid="admin.receptionists.pagination_next"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="admin.receptionists.dialog"
          className="bg-card border-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId ? "Edit Receptionist" : "Add Receptionist"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="rec-name">Full Name</Label>
                <Input
                  id="rec-name"
                  data-ocid="admin.receptionists.name.input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="bg-background border-border"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="rec-email">Email</Label>
                <Input
                  id="rec-email"
                  type="email"
                  data-ocid="admin.receptionists.email.input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="staff@medicore.com"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rec-phone">Phone</Label>
                <Input
                  id="rec-phone"
                  data-ocid="admin.receptionists.phone.input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 555-0000"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Shift</Label>
                <Select
                  value={form.shift}
                  onValueChange={(v) => setForm({ ...form, shift: v })}
                >
                  <SelectTrigger
                    data-ocid="admin.receptionists.shift.select"
                    className="bg-background border-border"
                  >
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning (7am–3pm)</SelectItem>
                    <SelectItem value="Evening">Evening (3pm–11pm)</SelectItem>
                    <SelectItem value="Night">Night (11pm–7am)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="rec-counter">Assigned Counter</Label>
                <Input
                  id="rec-counter"
                  data-ocid="admin.receptionists.counter.input"
                  value={form.assignedCounter}
                  onChange={(e) =>
                    setForm({ ...form, assignedCounter: e.target.value })
                  }
                  placeholder="Counter A"
                  className="bg-background border-border"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                data-ocid="admin.receptionists.cancel_button"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="admin.receptionists.submit_button"
                onClick={handleSave}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {editingId ? "Save Changes" : "Add Receptionist"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent
          data-ocid="admin.receptionists.confirm_dialog"
          className="bg-card border-border max-w-sm"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Remove Staff Member
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm mt-2">
            This will permanently remove this receptionist from the system.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              data-ocid="admin.receptionists.delete_cancel_button"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              data-ocid="admin.receptionists.confirm_button"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
