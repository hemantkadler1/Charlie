import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_APPOINTMENTS } from "@/lib/mock-data";
import type { Appointment } from "@/lib/types";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const STATUS_STYLES: Record<string, string> = {
  Confirmed: "bg-primary/20 text-primary border-primary/30",
  "Checked-In": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Scheduled: "bg-muted text-muted-foreground border-border",
  Completed: "bg-accent/20 text-accent border-accent/30",
  Cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const TYPE_COLORS: Record<string, string> = {
  Emergency: "bg-destructive",
  "Checked-In": "bg-emerald-400",
  Consultation: "bg-primary",
  "Follow-up": "bg-accent",
  "Post-Op": "bg-purple-400",
  "Check-up": "bg-muted-foreground",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function DoctorAppointments() {
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(4); // 0-indexed, May = 4
  const [selectedDate, setSelectedDate] = useState("2026-05-16");
  const [appointments, setAppointments] =
    useState<Appointment[]>(MOCK_APPOINTMENTS);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  type CalCell = { key: string; day: number | null };
  const cells: CalCell[] = [
    ...Array.from({ length: firstDay }, (_, i) => ({
      key: `pad-${viewYear}-${viewMonth}-${i}`,
      day: null as null,
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      key: `day-${i + 1}`,
      day: i + 1,
    })),
  ];
  while (cells.length % 7 !== 0)
    cells.push({
      key: `pad-${viewYear}-${viewMonth}-end-${cells.length}`,
      day: null,
    });

  function dateStr(day: number) {
    return `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
  }

  function apptsByDate(d: string) {
    return appointments.filter((a) => a.date === d);
  }

  const selectedAppts = apptsByDate(selectedDate);

  function markStatus(id: string, status: Appointment["status"]) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  }

  return (
    <div className="space-y-6" data-ocid="doctor.appointments.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">
          Appointments
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {appointments.length} total appointments
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 glass-elevated rounded-xl p-5 shadow-glass-sm">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-ocid="doctor.appointments.calendar.prev"
              onClick={prevMonth}
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-semibold text-foreground font-display">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-ocid="doctor.appointments.calendar.next"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Day header */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold text-muted-foreground py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map(({ key, day }) => {
              if (!day) return <div key={key} />;
              const ds = dateStr(day);
              const appts = apptsByDate(ds);
              const isSelected = ds === selectedDate;
              const isToday = ds === "2026-05-16";
              return (
                <button
                  key={key}
                  type="button"
                  data-ocid={`doctor.calendar.day.${day}`}
                  onClick={() => setSelectedDate(ds)}
                  className={`relative rounded-lg py-2 px-1 flex flex-col items-center gap-0.5 transition-colors text-sm font-medium min-h-[52px] ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isToday
                        ? "bg-primary/20 text-primary"
                        : "text-foreground hover:bg-muted/30"
                  }`}
                >
                  <span>{day}</span>
                  {appts.length > 0 && (
                    <div className="flex gap-0.5 flex-wrap justify-center">
                      {appts.slice(0, 3).map((a, i) => (
                        <span
                          key={`${a.type}-${i}`}
                          className={`w-1.5 h-1.5 rounded-full ${TYPE_COLORS[a.type] ?? "bg-muted-foreground"} ${isSelected ? "opacity-80" : ""}`}
                        />
                      ))}
                      {appts.length > 3 && (
                        <span
                          className={`text-[9px] font-bold ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                        >
                          +{appts.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border flex-wrap">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-muted-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: appointments for selected date */}
        <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" },
              )}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedAppts.length} appointment
              {selectedAppts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="divide-y divide-border overflow-y-auto max-h-[480px]">
            {selectedAppts.length === 0 ? (
              <div
                data-ocid="doctor.appointments.empty_state"
                className="py-12 flex flex-col items-center gap-2 text-center px-5"
              >
                <Clock className="w-8 h-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No appointments on this date.
                </p>
              </div>
            ) : (
              selectedAppts.map((appt, i) => (
                <div
                  key={appt.id}
                  data-ocid={`doctor.appointments.item.${i + 1}`}
                  className="px-5 py-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {appt.patientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appt.time} · Token #{appt.token}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] border flex-shrink-0 ${STATUS_STYLES[appt.status] ?? ""}`}
                    >
                      {appt.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${TYPE_COLORS[appt.type] ?? "bg-muted-foreground"}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {appt.type}
                    </span>
                  </div>
                  {appt.status !== "Completed" &&
                    appt.status !== "Cancelled" && (
                      <div className="flex gap-1.5 pt-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          data-ocid={`doctor.appointments.complete.${i + 1}`}
                          className="h-7 px-2.5 text-xs gap-1.5 text-emerald-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => markStatus(appt.id, "Completed")}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          data-ocid={`doctor.appointments.cancel.${i + 1}`}
                          className="h-7 px-2.5 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => markStatus(appt.id, "Cancelled")}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </Button>
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
