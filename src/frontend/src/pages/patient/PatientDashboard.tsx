import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_APPOINTMENTS,
  MOCK_BILLING,
  MOCK_PRESCRIPTIONS,
} from "@/lib/mock-data";
import { useAuthStore } from "@/store/auth-store";
import { Calendar, ClipboardList, CreditCard, Heart } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  Confirmed: "bg-primary/20 text-primary border-primary/30",
  "Checked-In": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Scheduled: "bg-muted text-muted-foreground border-border",
  Completed: "bg-accent/20 text-accent border-accent/30",
  Cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

export default function PatientDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6" data-ocid="patient.dashboard.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">
          Hello, {user?.name ?? "Patient"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Your health portal overview
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          data-ocid="patient.stat.appointments"
          label="Upcoming Appointments"
          value={2}
          icon={Calendar}
          accentColor="text-primary"
        />
        <StatCard
          data-ocid="patient.stat.prescriptions"
          label="Active Prescriptions"
          value={MOCK_PRESCRIPTIONS.length}
          icon={ClipboardList}
          accentColor="text-accent"
        />
        <StatCard
          data-ocid="patient.stat.bills"
          label="Pending Bills"
          value={1}
          icon={CreditCard}
          trend={{ value: "$765 due", up: false }}
          accentColor="text-destructive"
        />
        <StatCard
          data-ocid="patient.stat.health"
          label="Health Score"
          value="Good"
          icon={Heart}
          accentColor="text-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Appointments */}
        <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">My Appointments</h3>
            <Button
              size="sm"
              data-ocid="patient.book_appointment.button"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs"
            >
              Book New
            </Button>
          </div>
          <div className="divide-y divide-border">
            {MOCK_APPOINTMENTS.slice(0, 3).map((appt, i) => (
              <div
                key={appt.id}
                data-ocid={`patient.appointments.item.${i + 1}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {appt.doctorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appt.type} — {appt.date} {appt.time}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs border flex-shrink-0 ${STATUS_STYLES[appt.status] ?? ""}`}
                >
                  {appt.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Prescriptions */}
        <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              Recent Prescriptions
            </h3>
          </div>
          <div className="divide-y divide-border">
            {MOCK_PRESCRIPTIONS.map((rx, i) => (
              <div
                key={rx.id}
                data-ocid={`patient.prescriptions.item.${i + 1}`}
                className="px-5 py-3.5 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {rx.diagnosis}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {rx.doctorName} — {rx.date}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border border-primary/30 bg-primary/10 text-primary flex-shrink-0"
                  >
                    {rx.medicines.length} medicines
                  </Badge>
                </div>
              </div>
            ))}
            <div
              data-ocid="patient.prescriptions.empty_state"
              className="px-5 py-8 text-center text-sm text-muted-foreground hidden"
            >
              No prescriptions yet
            </div>
          </div>
        </div>
      </div>

      {/* Billing */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Billing History</h3>
        </div>
        <div className="divide-y divide-border">
          {MOCK_BILLING.slice(0, 2).map((bill, i) => (
            <div
              key={bill.id}
              data-ocid={`patient.billing.item.${i + 1}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {bill.date}
                </p>
                <p className="text-xs text-muted-foreground">
                  Consultation + Lab + Medicines
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-foreground">
                  ${bill.total.toLocaleString()}
                </p>
                <Badge
                  variant="outline"
                  className={`text-xs border ${
                    bill.status === "Paid"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-accent/20 text-accent border-accent/30"
                  }`}
                >
                  {bill.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
