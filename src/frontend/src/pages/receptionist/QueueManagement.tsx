import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_APPOINTMENTS, MOCK_DOCTORS } from "@/lib/mock-data";
import type { Appointment } from "@/lib/types";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  ListOrdered,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_STYLES: Record<string, string> = {
  Waiting: "bg-accent/20 text-accent border-accent/30",
  "In Consultation": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Completed: "bg-muted text-muted-foreground border-border",
  Cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

type QueueStatus = "Waiting" | "In Consultation" | "Completed" | "Cancelled";

function mapApptStatus(status: Appointment["status"]): QueueStatus {
  if (status === "Checked-In") return "In Consultation";
  if (status === "Completed" || status === "Cancelled") return status;
  return "Waiting";
}

export default function QueueManagement() {
  const todayAppts = MOCK_APPOINTMENTS.filter((a) => a.date === "2026-05-16");
  const [queueStatuses, setQueueStatuses] = useState<
    Record<string, QueueStatus>
  >(() =>
    Object.fromEntries(todayAppts.map((a) => [a.id, mapApptStatus(a.status)])),
  );

  const enriched = todayAppts.map((a) => ({
    ...a,
    queueStatus: queueStatuses[a.id] ?? mapApptStatus(a.status),
    doctor: MOCK_DOCTORS.find((d) => d.id === a.doctorId),
  }));

  const waiting = enriched.filter((a) => a.queueStatus === "Waiting");
  const inConsultation = enriched.filter(
    (a) => a.queueStatus === "In Consultation",
  );
  const completed = enriched.filter((a) => a.queueStatus === "Completed");

  function callNext() {
    const next = waiting[0];
    if (!next) {
      toast.info("No more patients in queue");
      return;
    }
    setQueueStatuses((prev) => ({ ...prev, [next.id]: "In Consultation" }));
    toast.success(`Calling ${next.patientName} — Token #${next.token}`);
  }

  function markComplete(id: string, name: string) {
    setQueueStatuses((prev) => ({ ...prev, [id]: "Completed" }));
    toast.success(`Consultation completed for ${name}`);
  }

  function cancelAppointment(id: string, name: string) {
    setQueueStatuses((prev) => ({ ...prev, [id]: "Cancelled" }));
    toast.error(`Appointment cancelled for ${name}`);
  }

  return (
    <div className="space-y-6" data-ocid="queue.page">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <ListOrdered className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">
              Queue Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Live patient queue — today's appointments
            </p>
          </div>
        </div>
        <Button
          type="button"
          data-ocid="queue.call_next.button"
          disabled={waiting.length === 0}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
          onClick={callNext}
        >
          <ChevronRight className="w-4 h-4" />
          Call Next Patient
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          data-ocid="queue.stat.waiting"
          label="Total Waiting"
          value={waiting.length}
          icon={Clock}
          accentColor="text-accent"
        />
        <StatCard
          data-ocid="queue.stat.in_consultation"
          label="In Consultation"
          value={inConsultation.length}
          icon={Users}
          accentColor="text-emerald-400"
        />
        <StatCard
          data-ocid="queue.stat.completed"
          label="Completed Today"
          value={completed.length}
          icon={CheckCircle2}
          accentColor="text-primary"
        />
      </div>

      {/* Queue Table */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Patient Queue</h3>
          <Badge variant="outline" className="text-xs">
            {enriched.length} total
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Token
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Patient
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Time
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Doctor
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enriched.map((appt, i) => {
                const isEmergency = appt.type === "Emergency";
                const isActive =
                  appt.queueStatus === "Waiting" ||
                  appt.queueStatus === "In Consultation";
                return (
                  <tr
                    key={appt.id}
                    data-ocid={`queue.item.${i + 1}`}
                    className={`hover:bg-muted/20 transition-colors ${
                      isEmergency ? "border-l-2 border-l-destructive" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isEmergency ? "bg-destructive/20" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`text-xs font-bold ${
                            isEmergency ? "text-destructive" : "text-foreground"
                          }`}
                        >
                          {appt.token}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">
                          {appt.patientName}
                        </span>
                        {isEmergency && (
                          <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {appt.time}
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-foreground font-medium">
                          {appt.doctorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appt.doctor?.specialty}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${
                          isEmergency
                            ? "bg-destructive/20 text-destructive border-destructive/30"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {appt.type}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${STATUS_STYLES[appt.queueStatus] ?? ""}`}
                      >
                        {appt.queueStatus}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {appt.queueStatus === "In Consultation" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            data-ocid={`queue.complete.${i + 1}`}
                            className="text-xs gap-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                            onClick={() =>
                              markComplete(appt.id, appt.patientName)
                            }
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Complete
                          </Button>
                        )}
                        {isActive && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            data-ocid={`queue.cancel.${i + 1}`}
                            className="text-xs gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              cancelAppointment(appt.id, appt.patientName)
                            }
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
