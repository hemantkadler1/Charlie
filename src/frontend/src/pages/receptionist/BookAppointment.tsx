import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { MOCK_DOCTORS, MOCK_PATIENTS } from "@/lib/mock-data";
import type { Appointment } from "@/lib/types";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MORNING_SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30"];
const AFTERNOON_SLOTS = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];
const EVENING_SLOTS = ["16:00", "16:30", "17:00", "17:30", "18:00"];

type FormData = {
  patientSearch: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  type: string;
  notes: string;
};

const EMPTY_FORM: FormData = {
  patientSearch: "",
  patientId: "",
  doctorId: "",
  date: "",
  timeSlot: "",
  type: "",
  notes: "",
};

export default function BookAppointment() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);

  const filteredPatients = MOCK_PATIENTS.filter(
    (p) =>
      form.patientSearch.length > 0 &&
      (p.name.toLowerCase().includes(form.patientSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(form.patientSearch.toLowerCase())),
  );

  const selectedPatient = MOCK_PATIENTS.find((p) => p.id === form.patientId);
  const selectedDoctor = MOCK_DOCTORS.find((d) => d.id === form.doctorId);
  const availableDoctors = MOCK_DOCTORS.filter((d) => d.status !== "On Leave");

  function setField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function selectPatient(id: string, name: string) {
    setForm((prev) => ({ ...prev, patientId: id, patientSearch: name }));
    setShowSuggestions(false);
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.patientId) e.patientId = "Please select a patient";
    if (!form.doctorId) e.doctorId = "Please select a doctor";
    if (!form.date) e.date = "Please select a date";
    if (!form.timeSlot) e.timeSlot = "Please select a time slot";
    if (!form.type) e.type = "Please select appointment type";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const token = Math.floor(Math.random() * 90) + 10;
      const appt: Appointment = {
        id: `a${Date.now()}`,
        patientId: form.patientId,
        patientName: selectedPatient?.name ?? "",
        doctorId: form.doctorId,
        doctorName: selectedDoctor?.name ?? "",
        date: form.date,
        time: form.timeSlot,
        type: form.type,
        status: "Confirmed",
        token,
        notes: form.notes,
      };
      setConfirmed(appt);
      setSubmitting(false);
      toast.success("Appointment booked successfully!", {
        description: `Token #${token} assigned to ${selectedPatient?.name}`,
      });
    }, 800);
  }

  function handleNewBooking() {
    setConfirmed(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  if (confirmed) {
    return (
      <div className="space-y-6" data-ocid="book_appointment.confirmation.page">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">
              Appointment Confirmed
            </h1>
            <p className="text-sm text-muted-foreground">
              Booking details are ready
            </p>
          </div>
        </div>

        <div className="glass-elevated rounded-xl p-8 shadow-glass-sm max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-black font-display text-primary">
              #{confirmed.token}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            Token #{confirmed.token}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Present this token at the reception desk
          </p>

          <div className="text-left space-y-3 bg-muted/30 rounded-lg p-4 mb-6">
            {[
              { label: "Patient", value: confirmed.patientName },
              { label: "Doctor", value: confirmed.doctorName },
              { label: "Date", value: confirmed.date },
              { label: "Time", value: confirmed.time },
              { label: "Type", value: confirmed.type },
              { label: "Status", value: confirmed.status },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              data-ocid="book_appointment.confirmation.new_booking.button"
              className="flex-1"
              onClick={handleNewBooking}
            >
              Book Another
            </Button>
            <Button
              type="button"
              data-ocid="book_appointment.confirmation.print.button"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => window.print()}
            >
              Print Token
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="book_appointment.page">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Book Appointment
          </h1>
          <p className="text-sm text-muted-foreground">
            Schedule a patient visit with doctor, date, and time slot
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        data-ocid="book_appointment.form"
        className="glass-elevated rounded-xl p-6 shadow-glass-sm space-y-6"
      >
        {/* Patient Search */}
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Patient
          </h2>
          <div className="relative">
            <Label htmlFor="patientSearch">
              Search Patient <span className="text-destructive">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="patientSearch"
                data-ocid="book_appointment.patient_search.input"
                placeholder="Type patient name or ID..."
                value={form.patientSearch}
                onChange={(e) => {
                  setField("patientSearch", e.target.value);
                  setField("patientId", "");
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className={`pl-9 ${errors.patientId ? "border-destructive" : ""}`}
                autoComplete="off"
              />
            </div>
            {errors.patientId && (
              <p
                data-ocid="book_appointment.patient_search.field_error"
                className="text-xs text-destructive mt-1"
              >
                {errors.patientId}
              </p>
            )}
            {showSuggestions && filteredPatients.length > 0 && (
              <div
                data-ocid="book_appointment.patient_suggestions.popover"
                className="absolute z-50 w-full mt-1 glass-elevated rounded-lg border border-border shadow-glass overflow-hidden"
              >
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    data-ocid={`book_appointment.patient_suggestion.${p.id}`}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted/30 transition-colors flex items-center justify-between"
                    onClick={() => selectPatient(p.id, p.name)}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {p.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {p.id} · {p.bloodGroup}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedPatient && (
            <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">
                  {selectedPatient.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {selectedPatient.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedPatient.age} yrs · {selectedPatient.gender} ·{" "}
                  {selectedPatient.bloodGroup}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs bg-primary/20 text-primary border-primary/30"
              >
                {selectedPatient.id}
              </Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* Doctor Selection */}
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary" />
            Doctor
          </h2>
          <div className="space-y-1.5">
            <Label>
              Select Doctor <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.doctorId}
              onValueChange={(v) => setField("doctorId", v)}
            >
              <SelectTrigger
                data-ocid="book_appointment.doctor.select"
                className={errors.doctorId ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Choose a doctor..." />
              </SelectTrigger>
              <SelectContent>
                {availableDoctors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    <div className="flex items-center gap-2">
                      <span>{d.name}</span>
                      <span className="text-xs text-muted-foreground">
                        · {d.specialty}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ml-1 ${
                          d.status === "Active"
                            ? "text-emerald-400 border-emerald-500/30"
                            : "text-accent border-accent/30"
                        }`}
                      >
                        {d.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.doctorId && (
              <p
                data-ocid="book_appointment.doctor.field_error"
                className="text-xs text-destructive"
              >
                {errors.doctorId}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Date & Slot */}
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Date & Time Slot
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="apptDate">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="apptDate"
                type="date"
                data-ocid="book_appointment.date.input"
                value={form.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setField("date", e.target.value)}
                className={errors.date ? "border-destructive" : ""}
              />
              {errors.date && (
                <p
                  data-ocid="book_appointment.date.field_error"
                  className="text-xs text-destructive"
                >
                  {errors.date}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Time Slot <span className="text-destructive">*</span>
              </Label>
              {errors.timeSlot && (
                <p
                  data-ocid="book_appointment.time_slot.field_error"
                  className="text-xs text-destructive"
                >
                  {errors.timeSlot}
                </p>
              )}
              {[
                { label: "Morning", slots: MORNING_SLOTS },
                { label: "Afternoon", slots: AFTERNOON_SLOTS },
                { label: "Evening", slots: EVENING_SLOTS },
              ].map(({ label, slots }) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        data-ocid={`book_appointment.slot.${slot.replace(":", "-")}`}
                        onClick={() => setField("timeSlot", slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-smooth ${
                          form.timeSlot === slot
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Appointment Type & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>
              Appointment Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.type}
              onValueChange={(v) => setField("type", v)}
            >
              <SelectTrigger
                data-ocid="book_appointment.type.select"
                className={errors.type ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Check-up">Check-up</SelectItem>
                <SelectItem value="Post-Op">Post-Op</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p
                data-ocid="book_appointment.type.field_error"
                className="text-xs text-destructive"
              >
                {errors.type}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              data-ocid="book_appointment.notes.textarea"
              placeholder="Any special instructions or reason for visit..."
              rows={2}
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            data-ocid="book_appointment.reset.button"
            onClick={() => {
              setForm(EMPTY_FORM);
              setErrors({});
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            data-ocid="book_appointment.submit.submit_button"
            disabled={submitting}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 min-w-[180px]"
          >
            {submitting ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Booking...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                Confirm Booking
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
