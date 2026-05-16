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
import { MOCK_ROOMS } from "@/lib/mock-data";
import type { Room } from "@/lib/types";
import { BedDouble, Edit2, Plus, Wrench } from "lucide-react";
import { useState } from "react";

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Occupied: "bg-accent/20 text-accent border-accent/30",
  Maintenance: "bg-destructive/20 text-destructive border-destructive/30",
};

const TYPE_STYLES: Record<string, string> = {
  ICU: "bg-destructive/20 text-destructive border-destructive/30",
  General: "bg-primary/20 text-primary border-primary/30",
  Private: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Semi-Private": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const BED_COUNT: Record<string, number> = {
  ICU: 1,
  General: 4,
  Private: 1,
  "Semi-Private": 2,
};

type FormState = {
  number: string;
  type: string;
  floor: string;
  patientName: string;
  status: string;
};
const EMPTY_FORM: FormState = {
  number: "",
  type: "",
  floor: "",
  patientName: "",
  status: "Available",
};

export default function RoomsBeds() {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [filter, setFilter] = useState<"All" | Room["type"] | Room["status"]>(
    "All",
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const counts = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "Available").length,
    occupied: rooms.filter((r) => r.status === "Occupied").length,
    maintenance: rooms.filter((r) => r.status === "Maintenance").length,
  };

  const FILTERS: (typeof filter)[] = [
    "All",
    "Available",
    "Occupied",
    "Maintenance",
    "ICU",
    "General",
    "Private",
    "Semi-Private",
  ];

  const filtered =
    filter === "All"
      ? rooms
      : rooms.filter((r) => r.status === filter || r.type === filter);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }
  function openEdit(r: Room) {
    setEditingId(r.id);
    setForm({
      number: r.number,
      type: r.type,
      floor: String(r.floor),
      patientName: r.patientName ?? "",
      status: r.status,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.number.trim()) return;
    if (editingId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                number: form.number,
                type: (form.type as Room["type"]) || r.type,
                floor: Number(form.floor) || r.floor,
                status: (form.status as Room["status"]) || r.status,
                patientName: form.patientName || undefined,
                patientId: form.patientName ? r.patientId : undefined,
              }
            : r,
        ),
      );
    } else {
      setRooms((prev) => [
        ...prev,
        {
          id: `r${Date.now()}`,
          number: form.number,
          type: (form.type as Room["type"]) || "General",
          floor: Number(form.floor) || 1,
          status: (form.status as Room["status"]) || "Available",
          patientName: form.patientName || undefined,
        },
      ]);
    }
    setDialogOpen(false);
    setForm(EMPTY_FORM);
  }

  return (
    <div className="space-y-6" data-ocid="admin.rooms.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Rooms & Beds
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {counts.occupied} occupied · {counts.available} available ·{" "}
            {counts.maintenance} under maintenance
          </p>
        </div>
        <Button
          data-ocid="admin.rooms.add_button"
          onClick={openAdd}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
        >
          <Plus className="w-4 h-4" /> Add Room
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Rooms",
            value: counts.total,
            color: "text-foreground",
            bg: "bg-muted/30",
          },
          {
            label: "Available",
            value: counts.available,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Occupied",
            value: counts.occupied,
            color: "text-accent",
            bg: "bg-accent/10",
          },
          {
            label: "Maintenance",
            value: counts.maintenance,
            color: "text-destructive",
            bg: "bg-destructive/10",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`glass-elevated rounded-xl p-4 text-center shadow-glass-sm ${s.bg}`}
          >
            <p className={`text-3xl font-bold font-display ${s.color}`}>
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Occupancy bar */}
      <div className="glass-elevated rounded-xl p-4 shadow-glass-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Occupancy Rate
          </span>
          <span className="text-sm font-bold text-accent">
            {Math.round((counts.occupied / counts.total) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full transition-all"
            style={{ width: `${(counts.occupied / counts.total) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
          <span>{counts.occupied} beds occupied</span>
          <span>{counts.total} total beds</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2" data-ocid="admin.rooms.filter.tab">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            data-ocid={`admin.rooms.filter.${f.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Rooms grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((room, i) => (
          <div
            key={room.id}
            data-ocid={`admin.rooms.item.${i + 1}`}
            className="glass-elevated rounded-xl p-4 shadow-glass-sm hover:scale-[1.01] transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    room.status === "Available"
                      ? "bg-emerald-500/20"
                      : room.status === "Occupied"
                        ? "bg-accent/20"
                        : "bg-destructive/20"
                  }`}
                >
                  {room.status === "Maintenance" ? (
                    <Wrench className="w-4 h-4 text-destructive" />
                  ) : (
                    <BedDouble
                      className={`w-4 h-4 ${room.status === "Available" ? "text-emerald-400" : "text-accent"}`}
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground font-display">
                    {room.number}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Floor {room.floor}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                data-ocid={`admin.rooms.edit_button.${i + 1}`}
                onClick={() => openEdit(room)}
                className="h-7 w-7 text-muted-foreground hover:text-primary"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="outline"
                className={`text-xs border ${TYPE_STYLES[room.type] ?? ""}`}
              >
                {room.type}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs border ${STATUS_STYLES[room.status] ?? ""}`}
              >
                {room.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                {room.patientName ? (
                  <p className="text-sm text-foreground font-medium">
                    {room.patientName}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Unoccupied
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {BED_COUNT[room.type] ?? 1} bed
                  {(BED_COUNT[room.type] ?? 1) > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="admin.rooms.dialog"
          className="bg-card border-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId ? "Edit Room" : "Add Room"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="room-number">Room Number</Label>
                <Input
                  id="room-number"
                  data-ocid="admin.rooms.number.input"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  placeholder="G-104"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="room-floor">Floor</Label>
                <Input
                  id="room-floor"
                  type="number"
                  data-ocid="admin.rooms.floor.input"
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  placeholder="1"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Room Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger
                    data-ocid="admin.rooms.type.select"
                    className="bg-background border-border"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Semi-Private">Semi-Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger
                    data-ocid="admin.rooms.status.select"
                    className="bg-background border-border"
                  >
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="room-patient">Patient Name (if occupied)</Label>
                <Input
                  id="room-patient"
                  data-ocid="admin.rooms.patient.input"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  placeholder="Leave blank if unoccupied"
                  className="bg-background border-border"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                data-ocid="admin.rooms.cancel_button"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="admin.rooms.submit_button"
                onClick={handleSave}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {editingId ? "Save Changes" : "Add Room"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
