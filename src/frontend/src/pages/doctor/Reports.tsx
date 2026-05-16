import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MOCK_PATIENTS } from "@/lib/mock-data";
import { Download, Eye, FileText, FlaskConical, Search, X } from "lucide-react";
import { useState } from "react";

interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  date: string;
  status: "Pending" | "Ready" | "Reviewed";
  result?: string;
  notes?: string;
}

const MOCK_REPORTS: LabReport[] = [
  {
    id: "lr1",
    patientId: "p1",
    patientName: "Evelyn Reed",
    testType: "ECG",
    date: "2026-05-15",
    status: "Ready",
    result: "Atrial fibrillation detected. Rate: 82 bpm. QRS normal.",
    notes: "Recommend cardiology follow-up within 48 hours.",
  },
  {
    id: "lr2",
    patientId: "p1",
    patientName: "Evelyn Reed",
    testType: "Blood Panel",
    date: "2026-05-15",
    status: "Ready",
    result:
      "WBC: 7.2, RBC: 4.5, Hemoglobin: 13.8, Platelets: 245k. Within normal range.",
    notes: "Iron slightly low. Consider supplement.",
  },
  {
    id: "lr3",
    patientId: "p3",
    patientName: "John Williams",
    testType: "BP Monitoring",
    date: "2026-05-14",
    status: "Reviewed",
    result: "Avg 152/94 mmHg over 24 hrs. Hypertension Stage 2 confirmed.",
    notes: "Medication adjustment recommended.",
  },
  {
    id: "lr4",
    patientId: "p3",
    patientName: "John Williams",
    testType: "Lipid Profile",
    date: "2026-05-13",
    status: "Reviewed",
    result: "LDL: 145, HDL: 42, Triglycerides: 210. Dyslipidemia noted.",
    notes: "Statin therapy initiated.",
  },
  {
    id: "lr5",
    patientId: "p5",
    patientName: "Michael Torres",
    testType: "X-Ray Knee",
    date: "2026-05-14",
    status: "Ready",
    result:
      "Right knee: severe osteoarthritis, joint space narrowing. Left knee: mild changes.",
    notes: "Surgery scheduled for right knee.",
  },
  {
    id: "lr6",
    patientId: "p6",
    patientName: "Asha Patel",
    testType: "Ultrasound Abdomen",
    date: "2026-05-15",
    status: "Pending",
  },
  {
    id: "lr7",
    patientId: "p2",
    patientName: "Kenny Smith",
    testType: "MRI Femur",
    date: "2026-05-09",
    status: "Reviewed",
    result: "Displaced femoral fracture, post-surgical alignment satisfactory.",
    notes: "Physical therapy to commence next week.",
  },
  {
    id: "lr8",
    patientId: "p7",
    patientName: "David Nguyen",
    testType: "Chest X-Ray",
    date: "2026-05-16",
    status: "Pending",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground border-border",
  Ready: "bg-accent/20 text-accent border-accent/30",
  Reviewed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const TEST_TYPES = Array.from(new Set(MOCK_REPORTS.map((r) => r.testType)));

function ReportViewDialog({
  report,
  onClose,
}: { report: LabReport | null; onClose: () => void }) {
  if (!report) return null;
  const patient = MOCK_PATIENTS.find((p) => p.id === report.patientId);
  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="doctor.report_view.dialog"
        className="max-w-lg glass-elevated"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground font-display">
              Lab Report
            </DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-ocid="doctor.report_view.close_button"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{report.testType}</p>
              <p className="text-xs text-muted-foreground">
                {report.patientName} · {report.date}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`text-xs border ml-auto ${STATUS_STYLES[report.status] ?? ""}`}
            >
              {report.status}
            </Badge>
          </div>
          <Separator className="bg-border" />
          {patient && (
            <div className="text-sm space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Patient
              </p>
              <p className="text-foreground font-medium">
                {patient.name} · {patient.gender} · {patient.age} yrs ·{" "}
                {patient.bloodGroup}
              </p>
              <p className="text-muted-foreground">{patient.condition}</p>
            </div>
          )}
          {report.result ? (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Results
              </p>
              <p className="text-sm text-foreground rounded-lg bg-muted/20 border border-border px-3 py-2">
                {report.result}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Results not yet available.
            </p>
          )}
          {report.notes && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Clinician Notes
              </p>
              <p className="text-sm text-foreground rounded-lg bg-muted/20 border border-border px-3 py-2">
                {report.notes}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="doctor.report_view.cancel_button"
              className="border-border text-muted-foreground"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="button"
              data-ocid="doctor.report_view.download.button"
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => {
                alert("Mock PDF download — no file generated in demo mode.");
              }}
            >
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Reports() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewing, setViewing] = useState<LabReport | null>(null);

  const filtered = MOCK_REPORTS.filter((r) => {
    const matchSearch =
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.testType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchType = typeFilter === "all" || r.testType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const pending = MOCK_REPORTS.filter((r) => r.status === "Pending").length;
  const ready = MOCK_REPORTS.filter((r) => r.status === "Ready").length;

  return (
    <div className="space-y-6" data-ocid="doctor.reports.page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Lab Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MOCK_REPORTS.length} reports · {pending} pending · {ready} ready
            for review
          </p>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        {[
          {
            label: "Total Reports",
            value: MOCK_REPORTS.length,
            color: "bg-primary/10 text-primary",
          },
          {
            label: "Pending",
            value: pending,
            color: "bg-muted/40 text-muted-foreground",
          },
          { label: "Ready", value: ready, color: "bg-accent/10 text-accent" },
          {
            label: "Reviewed",
            value: MOCK_REPORTS.filter((r) => r.status === "Reviewed").length,
            color: "bg-emerald-500/10 text-emerald-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${s.color} glass-elevated`}
          >
            <span>{s.label}:</span>
            <span className="font-bold">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="doctor.reports.search_input"
            placeholder="Search by patient or test type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/20 border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            data-ocid="doctor.reports.status.select"
            className="w-36 bg-muted/20 border-border"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Ready">Ready</SelectItem>
            <SelectItem value="Reviewed">Reviewed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger
            data-ocid="doctor.reports.type.select"
            className="w-44 bg-muted/20 border-border"
          >
            <SelectValue placeholder="Test Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tests</SelectItem>
            {TEST_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                {["Patient", "Test Type", "Date", "Status", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r, i) => (
                <tr
                  key={r.id}
                  data-ocid={`doctor.reports.item.${i + 1}`}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {r.patientName[0]}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">
                        {r.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-foreground">{r.testType}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs border ${STATUS_STYLES[r.status] ?? ""}`}
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        data-ocid={`doctor.reports.view.${i + 1}`}
                        className="h-7 px-2.5 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => setViewing(r)}
                        disabled={r.status === "Pending"}
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        data-ocid={`doctor.reports.download.${i + 1}`}
                        className="h-7 px-2.5 text-xs gap-1.5 text-accent hover:text-accent hover:bg-accent/10"
                        onClick={() => {
                          alert(
                            "Mock PDF download — no file generated in demo mode.",
                          );
                        }}
                        disabled={r.status === "Pending"}
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div
                      data-ocid="doctor.reports.empty_state"
                      className="flex flex-col items-center gap-2"
                    >
                      <FlaskConical className="w-10 h-10 text-muted-foreground/30" />
                      <p className="text-muted-foreground">
                        No reports match your search.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReportViewDialog report={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
