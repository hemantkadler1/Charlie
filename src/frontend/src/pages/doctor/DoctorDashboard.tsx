import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_APPOINTMENTS,
  MOCK_PATIENTS,
  MOCK_PRESCRIPTIONS,
} from "@/lib/mock-data";
import { useAuthStore } from "@/store/auth-store";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  UserPlus,
  Users,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  Confirmed: "bg-primary/20 text-primary border-primary/30",
  "Checked-In": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Scheduled: "bg-muted text-muted-foreground border-border",
  Completed: "bg-accent/20 text-accent border-accent/30",
  Cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const TYPE_ICONS: Record<string, string> = {
  "Follow-up": "🔁",
  Consultation: "🩺",
  Emergency: "🚨",
  "Post-Op": "🏥",
  "Check-up": "✅",
};

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const todayAppts = MOCK_APPOINTMENTS.filter((a) => a.date === "2026-05-16");
  const waitingCount = todayAppts.filter(
    (a) => a.status === "Checked-In" || a.status === "Confirmed",
  ).length;
  const myPatients = MOCK_PATIENTS.filter((p) => p.doctorId === "d1");
  const recentPatients = myPatients.slice(0, 4);

  return (
    <div className="space-y-6" data-ocid="doctor.dashboard.page">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Good morning, {user?.name ?? "Doctor"} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button
          data-ocid="doctor.new_prescription.button"
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          asChild
        >
          <Link to="/doctor/prescriptions">+ New Prescription</Link>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          data-ocid="doctor.stat.appointments"
          label="Today's Appointments"
          value={todayAppts.length}
          icon={Calendar}
          accentColor="text-primary"
        />
        <StatCard
          data-ocid="doctor.stat.waiting"
          label="Waiting Patients"
          value={waitingCount}
          icon={Clock}
          trend={{ value: "2 checked-in", up: false }}
          accentColor="text-accent"
        />
        <StatCard
          data-ocid="doctor.stat.total_patients"
          label="Total Patients"
          value={myPatients.length}
          icon={Users}
          trend={{ value: "+2 this week", up: true }}
          accentColor="text-emerald-400"
        />
        <StatCard
          data-ocid="doctor.stat.pending_reports"
          label="Reports Pending"
          value={3}
          icon={AlertCircle}
          trend={{ value: "2 urgent", up: false }}
          accentColor="text-destructive"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's schedule */}
        <div className="xl:col-span-2 glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">
                Today's Schedule
              </h3>
              <p className="text-xs text-muted-foreground">
                {todayAppts.length} appointments scheduled
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary hover:text-primary"
              asChild
            >
              <Link to="/doctor/appointments">View all</Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {todayAppts.map((appt, i) => (
              <div
                key={appt.id}
                data-ocid={`doctor.schedule.item.${i + 1}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">
                    {TYPE_ICONS[appt.type] ?? "🩺"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {appt.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appt.type} · {appt.time} · Token #{appt.token}
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

        {/* Quick actions + recent patients */}
        <div className="space-y-4">
          <div className="glass-elevated rounded-xl p-5 shadow-glass-sm">
            <h3 className="font-semibold text-foreground mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: "Write Prescription",
                  icon: ClipboardList,
                  to: "/doctor/prescriptions",
                  ocid: "doctor.quick.prescription",
                },
                {
                  label: "View Lab Reports",
                  icon: Activity,
                  to: "/doctor/reports",
                  ocid: "doctor.quick.reports",
                },
                {
                  label: "My Patients",
                  icon: Users,
                  to: "/doctor/patients",
                  ocid: "doctor.quick.patients",
                },
                {
                  label: "Appointments",
                  icon: CheckCircle2,
                  to: "/doctor/appointments",
                  ocid: "doctor.quick.appointments",
                },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  data-ocid={action.ocid}
                  className="w-full justify-start gap-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary"
                  asChild
                >
                  <Link to={action.to}>
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Recent Patients</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary hover:text-primary"
                asChild
              >
                <Link to="/doctor/patients">See all</Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {recentPatients.map((p, i) => (
                <div
                  key={p.id}
                  data-ocid={`doctor.recent_patients.item.${i + 1}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {p.name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {p.condition}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border border-primary/30 text-primary bg-primary/10 flex-shrink-0"
                  >
                    {p.bloodGroup}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
