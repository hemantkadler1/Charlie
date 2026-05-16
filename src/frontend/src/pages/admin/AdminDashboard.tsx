import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_HOSPITALS,
  MOCK_PATIENTS,
  STATS,
} from "@/lib/mock-data";
import { useAuthStore } from "@/store/auth-store";
import {
  Activity,
  BedDouble,
  Calendar,
  DollarSign,
  Plus,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const STATUS_STYLES: Record<string, string> = {
  Admitted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Discharged: "bg-muted text-muted-foreground border-border",
  "In-Progress": "bg-accent/20 text-accent border-accent/30",
  Scheduled: "bg-primary/20 text-primary border-primary/30",
  Confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Checked-In": "bg-accent/20 text-accent border-accent/30",
  Completed: "bg-muted text-muted-foreground border-border",
  Cancelled: "bg-destructive/20 text-destructive border-destructive/30",
  Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Busy: "bg-accent/20 text-accent border-accent/30",
  "On Leave": "bg-destructive/20 text-destructive border-destructive/30",
};

const WEEKLY_REVENUE = [
  { day: "Mon", revenue: 14200 },
  { day: "Tue", revenue: 18500 },
  { day: "Wed", revenue: 12800 },
  { day: "Thu", revenue: 21400 },
  { day: "Fri", revenue: 19700 },
  { day: "Sat", revenue: 9300 },
  { day: "Sun", revenue: 6200 },
];

const PATIENT_FLOW = [
  { hour: "8am", patients: 4 },
  { hour: "9am", patients: 9 },
  { hour: "10am", patients: 14 },
  { hour: "11am", patients: 12 },
  { hour: "12pm", patients: 7 },
  { hour: "1pm", patients: 5 },
  { hour: "2pm", patients: 11 },
  { hour: "3pm", patients: 16 },
  { hour: "4pm", patients: 10 },
  { hour: "5pm", patients: 6 },
];

const DEPT_DISTRIBUTION = [
  { name: "Cardiology", value: 28, fill: "#3b82f6" },
  { name: "Orthopedics", value: 35, fill: "#f97316" },
  { name: "Neurology", value: 19, fill: "#8b5cf6" },
  { name: "Pediatrics", value: 22, fill: "#10b981" },
  { name: "Surgery", value: 18, fill: "#f59e0b" },
  { name: "Dermatology", value: 14, fill: "#ec4899" },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const hospitalName =
    MOCK_HOSPITALS.find((h) => h.id === user?.hospitalId)?.name ??
    "MediCore Pro";
  const todayAppts = MOCK_APPOINTMENTS.filter((a) => a.date === "2026-05-16");
  const doctors = MOCK_DOCTORS;

  return (
    <div className="space-y-6" data-ocid="admin.dashboard.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Healthcare Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {hospitalName} — Real-time overview ·{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <Button
          type="button"
          data-ocid="admin.add_patient.primary_button"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
          onClick={() =>
            toast.info(
              "Patient registration is available via the Receptionist module",
            )
          }
        >
          <Plus className="w-4 h-4" />
          Add New Patient
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          data-ocid="admin.stat.total_patients"
          label="Total Patients"
          value={STATS.totalPatients}
          icon={Users}
          trend={{ value: "+8 this week", up: true }}
          accentColor="text-primary"
        />
        <StatCard
          data-ocid="admin.stat.appointments"
          label="Appointments Today"
          value={todayAppts.length}
          icon={Calendar}
          trend={{ value: "+5 from last week", up: true }}
          accentColor="text-accent"
        />
        <StatCard
          data-ocid="admin.stat.doctors"
          label="Doctors on Duty"
          value={
            MOCK_DOCTORS.filter(
              (d) => d.status === "Active" || d.status === "Busy",
            ).length
          }
          icon={Stethoscope}
          trend={{ value: "2 on leave today", up: false }}
          accentColor="text-primary"
        />
        <StatCard
          data-ocid="admin.stat.revenue"
          label="Revenue Today"
          value="$21,400"
          icon={DollarSign}
          trend={{ value: "+12.4% vs yesterday", up: true }}
          accentColor="text-emerald-400"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly revenue bar chart */}
        <div className="xl:col-span-2 glass-elevated rounded-xl p-5 shadow-glass-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Weekly Revenue</h3>
              <p className="text-xs text-muted-foreground">
                Mon – Sun breakdown
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY_REVENUE} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,24,48,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dept distribution pie */}
        <div className="glass-elevated rounded-xl p-5 shadow-glass-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">
              Department Distribution
            </h3>
            <p className="text-xs text-muted-foreground">
              Active patients by dept
            </p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={DEPT_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {DEPT_DISTRIBUTION.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(20,24,48,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {DEPT_DISTRIBUTION.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: d.fill }}
                />
                <span className="text-xs text-muted-foreground truncate">
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily patient flow line chart */}
      <div className="glass-elevated rounded-xl p-5 shadow-glass-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">
              Daily Patient Flow
            </h3>
            <p className="text-xs text-muted-foreground">
              Hourly patient volume today
            </p>
          </div>
          <Activity className="w-4 h-4 text-accent" />
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={PATIENT_FLOW}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="hour"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(20,24,48,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
              formatter={(v: number) => [v, "Patients"]}
            />
            <Line
              type="monotone"
              dataKey="patients"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={{ fill: "#f97316", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: appointments + doctor availability */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent appointments */}
        <div className="xl:col-span-2 glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">
                Today's Appointments
              </h3>
              <p className="text-xs text-muted-foreground">
                {todayAppts.length} scheduled for today
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              data-ocid="admin.appointments.add_button"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs"
              onClick={() => toast.info("Opening appointment booking…")}
            >
              <Plus className="w-3 h-3 mr-1" /> Book
            </Button>
          </div>
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                {["Token", "Patient", "Doctor", "Time", "Type", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {todayAppts.map((appt, i) => (
                <tr
                  key={appt.id}
                  data-ocid={`admin.appointments.item.${i + 1}`}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    #{appt.token.toString().padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {appt.patientName}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {appt.doctorName}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {appt.time}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {appt.type}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs border ${STATUS_STYLES[appt.status] ?? ""}`}
                    >
                      {appt.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Doctor availability panel */}
        <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              Doctor Availability
            </h3>
            <span className="text-xs text-muted-foreground">
              {doctors.filter((d) => d.status === "Active").length} active
            </span>
          </div>
          <div className="divide-y divide-border">
            {doctors.map((doctor, i) => (
              <div
                key={doctor.id}
                data-ocid={`admin.doctors.item.${i + 1}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {doctor.name.split(" ").slice(-1)[0][0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doctor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs border flex-shrink-0 ml-2 ${STATUS_STYLES[doctor.status] ?? ""}`}
                >
                  {doctor.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Beds Occupied",
            value: `${STATS.bedsOccupied}/${STATS.bedsTotal}`,
            icon: BedDouble,
            color: "text-accent",
          },
          {
            label: "Monthly Revenue",
            value: `$${(STATS.revenueThisMonth / 1000).toFixed(0)}k`,
            icon: DollarSign,
            color: "text-emerald-400",
          },
          {
            label: "Total Patients",
            value: STATS.totalPatients,
            icon: Users,
            color: "text-primary",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="glass rounded-xl p-4 flex items-center gap-4 shadow-glass-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={`text-xl font-bold font-display ${item.color}`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
