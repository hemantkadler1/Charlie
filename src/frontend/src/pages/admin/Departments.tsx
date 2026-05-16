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
import { MOCK_DEPARTMENTS } from "@/lib/mock-data";
import type { Department } from "@/lib/types";
import {
  Activity,
  BedDouble,
  Edit2,
  Plus,
  Stethoscope,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

const DEPT_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Cardiology: Activity,
  Neurology: Activity,
  Orthopedics: BedDouble,
  Pediatrics: Users,
  "General Surgery": Stethoscope,
  Dermatology: Activity,
};

const DEPT_COLORS: Record<string, string> = {
  Cardiology: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  Neurology: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  Orthopedics: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  Pediatrics: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  "General Surgery": "from-red-500/20 to-red-600/10 border-red-500/30",
  Dermatology: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
};

const ICON_COLORS: Record<string, string> = {
  Cardiology: "text-blue-400",
  Neurology: "text-purple-400",
  Orthopedics: "text-orange-400",
  Pediatrics: "text-emerald-400",
  "General Surgery": "text-red-400",
  Dermatology: "text-pink-400",
};

type FormState = {
  name: string;
  head: string;
  doctors: string;
  patients: string;
  rooms: string;
};
const EMPTY_FORM: FormState = {
  name: "",
  head: "",
  doctors: "",
  patients: "",
  rooms: "",
};

export default function Departments() {
  const [departments, setDepartments] =
    useState<Department[]>(MOCK_DEPARTMENTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }
  function openEdit(d: Department) {
    setEditingId(d.id);
    setForm({
      name: d.name,
      head: d.head,
      doctors: String(d.doctors),
      patients: String(d.patients),
      rooms: String(d.rooms),
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editingId) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingId
            ? {
                ...d,
                name: form.name,
                head: form.head,
                doctors: Number(form.doctors) || d.doctors,
                patients: Number(form.patients) || d.patients,
                rooms: Number(form.rooms) || d.rooms,
              }
            : d,
        ),
      );
    } else {
      setDepartments((prev) => [
        ...prev,
        {
          id: `dep${Date.now()}`,
          name: form.name,
          head: form.head,
          doctors: Number(form.doctors) || 0,
          patients: Number(form.patients) || 0,
          rooms: Number(form.rooms) || 0,
          status: "Active",
        },
      ]);
    }
    setDialogOpen(false);
    setForm(EMPTY_FORM);
  }

  function handleDelete(id: string) {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="space-y-6" data-ocid="admin.departments.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Departments
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {departments.length} active departments ·{" "}
            {departments.reduce((s, d) => s + d.patients, 0)} total patients
          </p>
        </div>
        <Button
          data-ocid="admin.departments.add_button"
          onClick={openAdd}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
        >
          <Plus className="w-4 h-4" /> Add Department
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Departments",
            value: departments.length,
            color: "text-primary",
          },
          {
            label: "Total Doctors",
            value: departments.reduce((s, d) => s + d.doctors, 0),
            color: "text-accent",
          },
          {
            label: "Total Patients",
            value: departments.reduce((s, d) => s + d.patients, 0),
            color: "text-emerald-400",
          },
          {
            label: "Total Rooms",
            value: departments.reduce((s, d) => s + d.rooms, 0),
            color: "text-purple-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-elevated rounded-xl p-4 text-center shadow-glass-sm"
          >
            <p className={`text-2xl font-bold font-display ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Department cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {departments.map((dept, i) => {
          const IconComp = DEPT_ICONS[dept.name] ?? Activity;
          const gradient =
            DEPT_COLORS[dept.name] ??
            "from-primary/20 to-primary/10 border-primary/30";
          const iconColor = ICON_COLORS[dept.name] ?? "text-primary";
          return (
            <div
              key={dept.id}
              data-ocid={`admin.departments.item.${i + 1}`}
              className={`glass-elevated rounded-xl p-5 shadow-glass-sm bg-gradient-to-br border ${gradient} transition-smooth hover:scale-[1.01]`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-background/40 flex items-center justify-center">
                    <IconComp className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground font-display">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Head: {dept.head}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs border ${dept.status === "Active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-destructive/20 text-destructive border-destructive/30"}`}
                >
                  {dept.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Doctors", value: dept.doctors, icon: Stethoscope },
                  { label: "Patients", value: dept.patients, icon: Users },
                  { label: "Rooms", value: dept.rooms, icon: BedDouble },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-background/20 rounded-lg p-2.5 text-center"
                  >
                    <stat.icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground font-display">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid={`admin.departments.edit_button.${i + 1}`}
                  onClick={() => openEdit(dept)}
                  className="flex-1 text-xs border-border hover:border-primary hover:text-primary"
                >
                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid={`admin.departments.delete_button.${i + 1}`}
                  onClick={() => setDeleteId(dept.id)}
                  className="flex-1 text-xs border-border hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="admin.departments.dialog"
          className="bg-card border-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId ? "Edit Department" : "Add Department"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="dept-name">Department Name</Label>
                <Input
                  id="dept-name"
                  data-ocid="admin.departments.name.input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Radiology"
                  className="bg-background border-border"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="dept-head">Head Physician</Label>
                <Input
                  id="dept-head"
                  data-ocid="admin.departments.head.input"
                  value={form.head}
                  onChange={(e) => setForm({ ...form, head: e.target.value })}
                  placeholder="Dr. Name"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dept-doctors">Doctors</Label>
                <Input
                  id="dept-doctors"
                  type="number"
                  data-ocid="admin.departments.doctors.input"
                  value={form.doctors}
                  onChange={(e) =>
                    setForm({ ...form, doctors: e.target.value })
                  }
                  placeholder="0"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dept-rooms">Rooms</Label>
                <Input
                  id="dept-rooms"
                  type="number"
                  data-ocid="admin.departments.rooms.input"
                  value={form.rooms}
                  onChange={(e) => setForm({ ...form, rooms: e.target.value })}
                  placeholder="0"
                  className="bg-background border-border"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                data-ocid="admin.departments.cancel_button"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="admin.departments.submit_button"
                onClick={handleSave}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {editingId ? "Save Changes" : "Add Department"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent
          data-ocid="admin.departments.confirm_dialog"
          className="bg-card border-border max-w-sm"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Remove Department
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm mt-2">
            Removing a department will not delete associated doctors or
            patients. This action is reversible by re-adding the department.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              data-ocid="admin.departments.delete_cancel_button"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              data-ocid="admin.departments.confirm_button"
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
