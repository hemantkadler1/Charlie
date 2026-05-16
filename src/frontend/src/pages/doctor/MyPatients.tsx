import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  MOCK_APPOINTMENTS,
  MOCK_PATIENTS,
  MOCK_PRESCRIPTIONS,
} from "@/lib/mock-data";
import type { Patient } from "@/lib/types";
import {
  Activity,
  Calendar,
  Filter,
  Heart,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const STATUS_STYLES: Record<string, string> = {
  Admitted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Discharged: "bg-muted text-muted-foreground border-border",
  "In-Progress": "bg-accent/20 text-accent border-accent/30",
  Scheduled: "bg-primary/20 text-primary border-primary/30",
};

function PatientDetailSheet({
  patient,
  open,
  onClose,
}: {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!patient) return null;
  const rxHistory = MOCK_PRESCRIPTIONS.filter(
    (rx) => rx.patientId === patient.id,
  );
  const apptHistory = MOCK_APPOINTMENTS.filter(
    (a) => a.patientId === patient.id,
  );

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        data-ocid="doctor.patient_detail.sheet"
        className="w-full sm:max-w-xl overflow-y-auto glass-elevated"
      >
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-foreground font-display">
              Patient Profile
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              data-ocid="doctor.patient_detail.close_button"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-5">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {patient.name[0]}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {patient.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {patient.gender} · {patient.age} yrs · {patient.bloodGroup}
              </p>
              <Badge
                variant="outline"
                className={`text-xs mt-1 border ${STATUS_STYLES[patient.status] ?? ""}`}
              >
                {patient.status}
              </Badge>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Vitals & Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Contact & Info
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { icon: Phone, label: patient.phone },
                { icon: Mail, label: patient.email },
                { icon: MapPin, label: patient.address },
                {
                  icon: Heart,
                  label: `Emergency: ${patient.emergencyContact}`,
                },
                { icon: Activity, label: `Condition: ${patient.condition}` },
                { icon: Calendar, label: `Admitted: ${patient.admittedDate}` },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Prescription history */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Prescription History
            </h3>
            {rxHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No prescriptions on record.
              </p>
            ) : (
              <div className="space-y-3">
                {rxHistory.map((rx) => (
                  <div
                    key={rx.id}
                    className="rounded-lg border border-border bg-muted/10 p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {rx.date}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {rx.medicines.length} medicines
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {rx.diagnosis}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {rx.medicines.map((m) => (
                        <Badge
                          key={m.name}
                          variant="outline"
                          className="text-[10px] border-primary/30 text-primary bg-primary/10"
                        >
                          {m.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-border" />

          {/* Appointment history */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Appointment History
            </h3>
            {apptHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No appointments on record.
              </p>
            ) : (
              <div className="space-y-2">
                {apptHistory.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between text-sm rounded-lg border border-border bg-muted/10 px-3 py-2"
                  >
                    <div>
                      <span className="font-medium text-foreground">
                        {a.date}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {a.time} · {a.type}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] border border-border text-muted-foreground"
                    >
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function MyPatients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = MOCK_PATIENTS.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase()) ||
      p.bloodGroup.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openPatient(p: Patient) {
    setSelected(p);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-6" data-ocid="doctor.patients.page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            My Patients
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MOCK_PATIENTS.length} patients under your care
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="doctor.patients.search_input"
            placeholder="Search by name, condition, blood group…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/20 border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            data-ocid="doctor.patients.status.select"
            className="w-40 bg-muted/20 border-border"
          >
            <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Admitted">Admitted</SelectItem>
            <SelectItem value="In-Progress">In-Progress</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Discharged">Discharged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                {[
                  "Patient",
                  "Age",
                  "Blood Group",
                  "Last Visit",
                  "Diagnosis",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  data-ocid={`doctor.patients.item.${i + 1}`}
                  className="hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => openPatient(p)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && openPatient(p)
                  }
                  tabIndex={0}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {p.name[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.gender}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.age}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-primary/30 text-primary bg-primary/10"
                    >
                      {p.bloodGroup}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.admittedDate}
                  </td>
                  <td className="px-4 py-3 text-foreground max-w-[180px]">
                    <p className="truncate">{p.condition}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs border ${STATUS_STYLES[p.status] ?? ""}`}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      data-ocid={`doctor.patients.view.${i + 1}`}
                      className="text-xs text-primary hover:text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPatient(p);
                      }}
                    >
                      View <User className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div
                      data-ocid="doctor.patients.empty_state"
                      className="flex flex-col items-center gap-2"
                    >
                      <User className="w-10 h-10 text-muted-foreground/30" />
                      <p className="text-muted-foreground">
                        No patients match your search.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PatientDetailSheet
        patient={selected}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
