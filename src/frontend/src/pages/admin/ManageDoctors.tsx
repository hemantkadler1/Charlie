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
import { MOCK_DEPARTMENTS, MOCK_DOCTORS } from "@/lib/mock-data";
import type { Doctor } from "@/lib/types";
import { Edit2, Plus, Search, Stethoscope, Trash2 } from "lucide-react";
import { useState } from "react";

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Busy: "bg-accent/20 text-accent border-accent/30",
  "On Leave": "bg-destructive/20 text-destructive border-destructive/30",
};

type FormState = {
  name: string;
  specialty: string;
  department: string;
  phone: string;
  email: string;
  license: string;
  experience: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  specialty: "",
  department: "",
  phone: "",
  email: "",
  license: "",
  experience: "",
};

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(doc: Doctor) {
    setEditingId(doc.id);
    setForm({
      name: doc.name,
      specialty: doc.specialty,
      department: doc.department,
      phone: doc.phone,
      email: doc.email,
      license: `LIC-${doc.id.toUpperCase()}`,
      experience: String(doc.experience),
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editingId) {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === editingId
            ? {
                ...d,
                ...form,
                experience: Number(form.experience) || d.experience,
              }
            : d,
        ),
      );
    } else {
      const newDoc: Doctor = {
        id: `d${Date.now()}`,
        name: form.name,
        specialty: form.specialty || "General",
        department: form.department || "General",
        phone: form.phone,
        email: form.email,
        status: "Active",
        patients: 0,
        experience: Number(form.experience) || 0,
      };
      setDoctors((prev) => [...prev, newDoc]);
    }
    setDialogOpen(false);
    setForm(EMPTY_FORM);
  }

  function handleDelete(id: string) {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="space-y-6" data-ocid="admin.doctors.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Manage Doctors
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {doctors.length} registered physicians across{" "}
            {MOCK_DEPARTMENTS.length} departments
          </p>
        </div>
        <Button
          data-ocid="admin.doctors.add_button"
          onClick={openAdd}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
        >
          <Plus className="w-4 h-4" /> Add Doctor
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="admin.doctors.search_input"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, specialty or department…"
          className="pl-9 bg-card border-border"
        />
      </div>

      {/* Table */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              {[
                "Doctor",
                "Specialty",
                "Department",
                "Phone",
                "Patients",
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
                  data-ocid="admin.doctors.empty_state"
                >
                  No doctors found matching your search.
                </td>
              </tr>
            )}
            {paginated.map((doc, i) => (
              <tr
                key={doc.id}
                data-ocid={`admin.doctors.item.${(page - 1) * PAGE_SIZE + i + 1}`}
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.experience} yrs exp.
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-foreground">
                  {doc.specialty}
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {doc.department}
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground font-mono">
                  {doc.phone}
                </td>
                <td className="px-5 py-4 text-sm text-right pr-8 text-foreground font-medium">
                  {doc.patients}
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant="outline"
                    className={`text-xs border ${STATUS_STYLES[doc.status] ?? ""}`}
                  >
                    {doc.status}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      data-ocid={`admin.doctors.edit_button.${(page - 1) * PAGE_SIZE + i + 1}`}
                      onClick={() => openEdit(doc)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-ocid={`admin.doctors.delete_button.${(page - 1) * PAGE_SIZE + i + 1}`}
                      onClick={() => setDeleteId(doc.id)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
              doctors
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                data-ocid="admin.doctors.pagination_prev"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                data-ocid="admin.doctors.pagination_next"
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
          data-ocid="admin.doctors.dialog"
          className="bg-card border-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId ? "Edit Doctor" : "Add New Doctor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="doc-name">Full Name</Label>
                <Input
                  id="doc-name"
                  data-ocid="admin.doctors.name.input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Dr. Jane Smith"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="doc-specialty">Specialty</Label>
                <Input
                  id="doc-specialty"
                  data-ocid="admin.doctors.specialty.input"
                  value={form.specialty}
                  onChange={(e) =>
                    setForm({ ...form, specialty: e.target.value })
                  }
                  placeholder="Cardiology"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="doc-dept">Department</Label>
                <Select
                  value={form.department}
                  onValueChange={(v) => setForm({ ...form, department: v })}
                >
                  <SelectTrigger
                    data-ocid="admin.doctors.department.select"
                    className="bg-background border-border"
                  >
                    <SelectValue placeholder="Select dept" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_DEPARTMENTS.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="doc-phone">Phone</Label>
                <Input
                  id="doc-phone"
                  data-ocid="admin.doctors.phone.input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 555-0000"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="doc-exp">Experience (yrs)</Label>
                <Input
                  id="doc-exp"
                  type="number"
                  data-ocid="admin.doctors.experience.input"
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                  placeholder="5"
                  className="bg-background border-border"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="doc-email">Email</Label>
                <Input
                  id="doc-email"
                  type="email"
                  data-ocid="admin.doctors.email.input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="doctor@medicore.com"
                  className="bg-background border-border"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="doc-license">License Number</Label>
                <Input
                  id="doc-license"
                  data-ocid="admin.doctors.license.input"
                  value={form.license}
                  onChange={(e) =>
                    setForm({ ...form, license: e.target.value })
                  }
                  placeholder="MD-12345"
                  className="bg-background border-border"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                data-ocid="admin.doctors.cancel_button"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="admin.doctors.submit_button"
                onClick={handleSave}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {editingId ? "Save Changes" : "Add Doctor"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent
          data-ocid="admin.doctors.confirm_dialog"
          className="bg-card border-border max-w-sm"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Remove Doctor</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm mt-2">
            Are you sure you want to remove this doctor from the system? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              data-ocid="admin.doctors.delete_cancel_button"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              data-ocid="admin.doctors.confirm_button"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Remove Doctor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
