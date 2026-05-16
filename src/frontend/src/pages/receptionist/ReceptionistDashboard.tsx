import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_APPOINTMENTS,
  MOCK_BILLING,
  MOCK_PATIENTS,
} from "@/lib/mock-data";
import { useAuthStore } from "@/store/auth-store";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  ListOrdered,
  Receipt,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_STYLES: Record<string, string> = {
  Confirmed: "bg-primary/20 text-primary border-primary/30",
  "Checked-In": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Scheduled: "bg-muted text-muted-foreground border-border",
  Completed: "bg-accent/20 text-accent border-accent/30",
  Cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

export default function ReceptionistDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const todayAppts = MOCK_APPOINTMENTS.filter((a) => a.date === "2026-05-16");
  const waiting = todayAppts.filter(
    (a) => a.status === "Checked-In" || a.status === "Scheduled",
  );
  const registeredToday = MOCK_PATIENTS.filter(
    (p) => p.admittedDate === "2026-05-16",
  );
  const revenueToday = MOCK_BILLING.filter(
    (b) => b.date === "2026-05-16",
  ).reduce((s, b) => s + b.total, 0);

  const [apptStatuses, setApptStatuses] = useState<Record<string, string>>(() =>
    Object.fromEntries(todayAppts.map((a) => [a.id, a.status])),
  );

  function handleCheckIn(id: string, name: string) {
    setApptStatuses((prev) => ({ ...prev, [id]: "Checked-In" }));
    toast.success(`${name} checked in successfully`);
  }

  function handleCancel(id: string, name: string) {
    setApptStatuses((prev) => ({ ...prev, [id]: "Cancelled" }));
    toast.error(`Appointment for ${name} cancelled`);
  }

  const QUICK_ACTIONS = [
    {
      label: "Register Patient",
      icon: UserPlus,
      ocid: "receptionist.quick.register.button",
      path: "/receptionist/register" as const,
      accent: true,
    },
    {
      label: "Book Appointment",
      icon: Calendar,
      ocid: "receptionist.quick.book.button",
      path: "/receptionist/book" as const,
      accent: false,
    },
    {
      label: "Queue",
      icon: ListOrdered,
      ocid: "receptionist.quick.queue.button",
      path: "/receptionist/queue" as const,
      accent: false,
    },
    {
      label: "Billing",
      icon: Receipt,
      ocid: "receptionist.quick.billing.button",
      path: "/receptionist/billing" as const,
      accent: false,
    },
  ];

  return (
    <div className="space-y-6" data-ocid="receptionist.dashboard.page">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Welcome, {user?.name ?? "Receptionist"}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Front desk operations —{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            data-ocid="receptionist.header.register_button"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
            onClick={() => navigate({ to: "/receptionist/register" })}
          >
            <UserPlus className="w-4 h-4" />
            Register Patient
          </Button>
          <Button
            type="button"
            variant="outline"
            data-ocid="receptionist.header.book_button"
            className="gap-2"
            onClick={() => navigate({ to: "/receptionist/book" })}
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          data-ocid="receptionist.stat.registered_today"
          label="Registered Today"
          value={registeredToday.length}
          icon={UserPlus}
          trend={{ value: "+2 from yesterday", up: true }}
          accentColor="text-primary"
        />
        <StatCard
          data-ocid="receptionist.stat.appointments_today"
          label="Appointments Today"
          value={todayAppts.length}
          icon={Calendar}
          accentColor="text-accent"
        />
        <StatCard
          data-ocid="receptionist.stat.in_queue"
          label="Patients in Queue"
          value={waiting.length}
          icon={ListOrdered}
          accentColor="text-emerald-400"
        />
        <StatCard
          data-ocid="receptionist.stat.revenue_today"
          label="Revenue Today"
          value={revenueToday > 0 ? `$${revenueToday.toLocaleString()}` : "$0"}
          icon={DollarSign}
          accentColor="text-primary"
        />
      </div>

      {/* Quick Actions */}
      <div className="glass-elevated rounded-xl p-5 shadow-glass-sm">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant={action.accent ? "default" : "outline"}
              data-ocid={action.ocid}
              className={
                action.accent
                  ? "h-auto py-4 flex-col gap-2.5 bg-accent hover:bg-accent/90 text-accent-foreground"
                  : "h-auto py-4 flex-col gap-2.5 border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-smooth"
              }
              onClick={() => navigate({ to: action.path })}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">
              Today's Appointments
            </h3>
            <p className="text-xs text-muted-foreground">
              {todayAppts.length} scheduled — {waiting.length} in queue
            </p>
          </div>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="divide-y divide-border">
          {todayAppts.map((appt, i) => {
            const status = apptStatuses[appt.id] ?? appt.status;
            const isActive = status !== "Cancelled" && status !== "Completed";
            const isEmergency = appt.type === "Emergency";
            return (
              <div
                key={appt.id}
                data-ocid={`receptionist.appt.item.${i + 1}`}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors ${
                  isEmergency ? "border-l-2 border-l-destructive" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isEmergency ? "bg-destructive/20" : "bg-muted"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      isEmergency ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    #{appt.token}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground truncate">
                      {appt.patientName}
                    </p>
                    {isEmergency && (
                      <Badge
                        className="text-xs bg-destructive/20 text-destructive border-destructive/30 border"
                        variant="outline"
                      >
                        URGENT
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {appt.doctorName} — {appt.time} — {appt.type}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-xs border ${STATUS_STYLES[status] ?? ""}`}
                  >
                    {status}
                  </Badge>
                  {isActive && (
                    <>
                      <button
                        type="button"
                        data-ocid={`receptionist.appt.checkin.${i + 1}`}
                        title="Check In"
                        onClick={() => handleCheckIn(appt.id, appt.patientName)}
                        className="text-muted-foreground hover:text-emerald-400 transition-smooth"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        data-ocid={`receptionist.appt.cancel.${i + 1}`}
                        title="Cancel"
                        onClick={() => handleCancel(appt.id, appt.patientName)}
                        className="text-muted-foreground hover:text-destructive transition-smooth"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing Summary */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Billing Summary</h3>
            <p className="text-xs text-muted-foreground">
              Recent billing records
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            data-ocid="receptionist.billing.generate_button"
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs"
            onClick={() => navigate({ to: "/receptionist/billing" })}
          >
            <Receipt className="w-3.5 h-3.5 mr-1" />
            Generate Invoice
          </Button>
        </div>
        <div className="divide-y divide-border">
          {MOCK_BILLING.slice(0, 4).map((bill, i) => (
            <div
              key={bill.id}
              data-ocid={`receptionist.billing.item.${i + 1}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {bill.patientName}
                </p>
                <p className="text-xs text-muted-foreground">{bill.date}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <p className="text-sm font-bold text-foreground">
                  ${bill.total.toLocaleString()}
                </p>
                <Badge
                  variant="outline"
                  className={`text-xs border ${
                    bill.status === "Paid"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : bill.status === "Partial"
                        ? "bg-primary/20 text-primary border-primary/30"
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
