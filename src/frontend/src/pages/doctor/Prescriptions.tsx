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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_PATIENTS, MOCK_PRESCRIPTIONS } from "@/lib/mock-data";
import type { Medicine, Prescription } from "@/lib/types";
import { ClipboardList, Eye, Plus, Printer, Trash2, X } from "lucide-react";
import { useState } from "react";

const FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "Thrice daily",
  "Morning only",
  "Evening only",
  "As needed",
];
const DURATIONS = [
  "3 days",
  "5 days",
  "7 days",
  "10 days",
  "14 days",
  "30 days",
  "60 days",
  "90 days",
];

function emptyMedicine(): Medicine {
  return {
    name: "",
    dosage: "1 tablet",
    frequency: "Once daily",
    duration: "7 days",
  };
}

function PrescriptionCard({ rx }: { rx: Prescription }) {
  return (
    <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
      <div className="flex items-start justify-between px-5 py-4 border-b border-border gap-3">
        <div>
          <p className="font-semibold text-foreground">{rx.patientName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {rx.date} · {rx.doctorName}
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] border-primary/30 text-primary bg-primary/10 flex-shrink-0"
        >
          {rx.medicines.length} medicines
        </Badge>
      </div>
      <div className="px-5 py-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Diagnosis
        </p>
        <p className="text-sm text-foreground">{rx.diagnosis}</p>
      </div>
      <div className="px-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Medicines
        </p>
        <div className="space-y-1.5">
          {rx.medicines.map((m) => (
            <div key={m.name} className="flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <span className="font-medium text-foreground">{m.name}</span>
              <span className="text-muted-foreground text-xs">
                · {m.dosage} · {m.frequency} · {m.duration}
              </span>
            </div>
          ))}
        </div>
        {rx.notes && (
          <p className="text-xs text-muted-foreground mt-3 italic">
            📝 {rx.notes}
          </p>
        )}
      </div>
    </div>
  );
}

function PreviewCard({
  patientName,
  diagnosis,
  medicines,
  notes,
  nextVisit,
}: {
  patientName: string;
  diagnosis: string;
  medicines: Medicine[];
  notes: string;
  nextVisit: string;
}) {
  return (
    <div className="rounded-xl border border-primary/30 bg-card/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-foreground font-display">
            MediCore Hospital
          </h4>
          <p className="text-xs text-muted-foreground">
            Dr. Marcus Chen · Cardiology
          </p>
        </div>
        <ClipboardList className="w-6 h-6 text-primary" />
      </div>
      <Separator className="bg-border" />
      <div>
        <p className="text-xs text-muted-foreground">Patient</p>
        <p className="font-semibold text-foreground">{patientName || "—"}</p>
        {nextVisit && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Next Visit: {nextVisit}
          </p>
        )}
      </div>
      {diagnosis && (
        <div>
          <p className="text-xs text-muted-foreground">Diagnosis</p>
          <p className="text-sm text-foreground">{diagnosis}</p>
        </div>
      )}
      {medicines.filter((m) => m.name).length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Rx
          </p>
          <div className="space-y-2">
            {medicines
              .filter((m) => m.name)
              .map((m, i) => (
                <div key={`${m.name}-${i}`} className="text-sm">
                  <span className="font-semibold text-foreground">
                    {i + 1}. {m.name}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    — {m.dosage}, {m.frequency}, {m.duration}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
      {notes && (
        <div className="bg-muted/20 rounded-lg px-3 py-2">
          <p className="text-xs text-muted-foreground">Instructions</p>
          <p className="text-sm text-foreground">{notes}</p>
        </div>
      )}
    </div>
  );
}

export default function Prescriptions() {
  const [showForm, setShowForm] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [nextVisit, setNextVisit] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([emptyMedicine()]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectedPatient = MOCK_PATIENTS.find((p) => p.id === patientId);

  function addMedicineRow() {
    setMedicines((prev) => [...prev, emptyMedicine()]);
  }

  function removeMedicineRow(idx: number) {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateMedicine(idx: number, field: keyof Medicine, value: string) {
    setMedicines((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    );
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6" data-ocid="doctor.prescriptions.page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Prescriptions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MOCK_PRESCRIPTIONS.length} prescriptions issued
          </p>
        </div>
        <Button
          data-ocid="doctor.prescriptions.new.button"
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          onClick={() => setShowForm((v) => !v)}
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Hide Form" : "New Prescription"}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="glass-elevated rounded-xl shadow-glass-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              Create Prescription
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fill all fields then preview before printing
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-5">
            {/* Form left */}
            <div className="space-y-4">
              {/* Patient */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Patient
                </Label>
                <Select value={patientId} onValueChange={setPatientId}>
                  <SelectTrigger
                    data-ocid="doctor.rx.patient.select"
                    className="bg-muted/20 border-border"
                  >
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PATIENTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Diagnosis */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Diagnosis
                </Label>
                <Input
                  data-ocid="doctor.rx.diagnosis.input"
                  placeholder="e.g. Hypertension Stage 2"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="bg-muted/20 border-border"
                />
              </div>

              {/* Medicines */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Medicines
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    data-ocid="doctor.rx.add_medicine.button"
                    className="text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1"
                    onClick={addMedicineRow}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {medicines.map((m, idx) => (
                    <div
                      key={`${m.name}-${idx}`}
                      data-ocid={`doctor.rx.medicine.item.${idx + 1}`}
                      className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-border bg-muted/10"
                    >
                      <div className="col-span-2 flex items-center gap-2">
                        <Input
                          placeholder="Medicine name"
                          value={m.name}
                          onChange={(e) =>
                            updateMedicine(idx, "name", e.target.value)
                          }
                          className="bg-muted/20 border-border h-8 text-sm"
                        />
                        <Input
                          placeholder="Dosage"
                          value={m.dosage}
                          onChange={(e) =>
                            updateMedicine(idx, "dosage", e.target.value)
                          }
                          className="bg-muted/20 border-border h-8 text-sm w-28"
                        />
                        {medicines.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            data-ocid={`doctor.rx.remove_medicine.${idx + 1}`}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                            onClick={() => removeMedicineRow(idx)}
                            aria-label="Remove medicine"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      <Select
                        value={m.frequency}
                        onValueChange={(v) =>
                          updateMedicine(idx, "frequency", v)
                        }
                      >
                        <SelectTrigger className="bg-muted/20 border-border h-8 text-xs">
                          <SelectValue placeholder="Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {FREQUENCIES.map((f) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={m.duration}
                        onValueChange={(v) =>
                          updateMedicine(idx, "duration", v)
                        }
                      >
                        <SelectTrigger className="bg-muted/20 border-border h-8 text-xs">
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATIONS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Instructions / Notes
                </Label>
                <Textarea
                  data-ocid="doctor.rx.notes.textarea"
                  placeholder="e.g. Avoid strenuous activity. Low sodium diet."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-muted/20 border-border resize-none"
                  rows={3}
                />
              </div>

              {/* Next visit */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Next Visit Date
                </Label>
                <Input
                  type="date"
                  data-ocid="doctor.rx.next_visit.input"
                  value={nextVisit}
                  onChange={(e) => setNextVisit(e.target.value)}
                  className="bg-muted/20 border-border"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="doctor.rx.preview.button"
                  className="gap-2 border-primary/40 text-primary hover:bg-primary/10"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Eye className="w-4 h-4" /> Preview
                </Button>
                <Button
                  type="button"
                  data-ocid="doctor.rx.print.button"
                  className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4" /> Print / PDF
                </Button>
              </div>
            </div>

            {/* Preview right */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live Preview
              </p>
              <PreviewCard
                patientName={selectedPatient?.name ?? ""}
                diagnosis={diagnosis}
                medicines={medicines}
                notes={notes}
                nextVisit={nextVisit}
              />
            </div>
          </div>
        </div>
      )}

      {/* Prescription list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MOCK_PRESCRIPTIONS.map((rx, i) => (
          <div key={rx.id} data-ocid={`doctor.prescriptions.item.${i + 1}`}>
            <PrescriptionCard rx={rx} />
          </div>
        ))}
      </div>

      {/* Full-screen preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          data-ocid="doctor.rx.preview.dialog"
          className="max-w-lg glass-elevated"
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-foreground font-display">
                Prescription Preview
              </DialogTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                data-ocid="doctor.rx.preview.close_button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <PreviewCard
            patientName={selectedPatient?.name ?? ""}
            diagnosis={diagnosis}
            medicines={medicines}
            notes={notes}
            nextVisit={nextVisit}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="doctor.rx.preview.cancel_button"
              className="border-border text-muted-foreground"
              onClick={() => setPreviewOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              data-ocid="doctor.rx.preview.print_button"
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" /> Print / PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
