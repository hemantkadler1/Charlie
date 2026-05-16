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
import { MOCK_PATIENTS } from "@/lib/mock-data";
import type { Patient } from "@/lib/types";
import { CheckCircle2, User, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FormData = {
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
  address: string;
  aadhar: string;
  condition: string;
};

const EMPTY_FORM: FormData = {
  fullName: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  phone: "",
  emergencyName: "",
  emergencyPhone: "",
  address: "",
  aadhar: "",
  condition: "",
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RegisterPatient() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [registeredPatients, setRegisteredPatients] = useState<Patient[]>([]);

  function setField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.gender) e.gender = "Gender is required";
    if (!form.bloodGroup) e.bloodGroup = "Blood group is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.emergencyName.trim())
      e.emergencyName = "Emergency contact name is required";
    if (!form.emergencyPhone.trim())
      e.emergencyPhone = "Emergency contact phone is required";
    if (!form.address.trim()) e.address = "Address is required";
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
      const newId = `P${Date.now().toString().slice(-5)}`;
      const age = new Date().getFullYear() - new Date(form.dob).getFullYear();
      const newPatient: Patient = {
        id: newId,
        name: form.fullName,
        age,
        gender: form.gender as Patient["gender"],
        phone: form.phone,
        email: "",
        bloodGroup: form.bloodGroup,
        condition: form.condition || "General",
        status: "Scheduled",
        admittedDate: new Date().toISOString().split("T")[0],
        doctorId: "",
        address: form.address,
        emergencyContact: `${form.emergencyName} — ${form.emergencyPhone}`,
      };
      setRegisteredPatients((prev) => [newPatient, ...prev]);
      setForm(EMPTY_FORM);
      setSubmitting(false);
      toast.success(`Patient registered successfully! ID: ${newId}`, {
        description: `${form.fullName} has been added to the system.`,
      });
    }, 800);
  }

  const allPatients = [...registeredPatients, ...MOCK_PATIENTS];

  return (
    <div className="space-y-6" data-ocid="register_patient.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Register New Patient
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in patient details to create a new record
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        data-ocid="register_patient.form"
        className="glass-elevated rounded-xl p-6 shadow-glass-sm space-y-6"
      >
        {/* Personal Info */}
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                data-ocid="register_patient.full_name.input"
                placeholder="e.g. Jane Doe"
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p
                  data-ocid="register_patient.full_name.field_error"
                  className="text-xs text-destructive"
                >
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dob">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dob"
                type="date"
                data-ocid="register_patient.dob.input"
                value={form.dob}
                onChange={(e) => setField("dob", e.target.value)}
                className={errors.dob ? "border-destructive" : ""}
              />
              {errors.dob && (
                <p
                  data-ocid="register_patient.dob.field_error"
                  className="text-xs text-destructive"
                >
                  {errors.dob}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.gender}
                onValueChange={(v) => setField("gender", v)}
              >
                <SelectTrigger
                  data-ocid="register_patient.gender.select"
                  className={errors.gender ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p
                  data-ocid="register_patient.gender.field_error"
                  className="text-xs text-destructive"
                >
                  {errors.gender}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Blood Group <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.bloodGroup}
                onValueChange={(v) => setField("bloodGroup", v)}
              >
                <SelectTrigger
                  data-ocid="register_patient.blood_group.select"
                  className={errors.bloodGroup ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodGroup && (
                <p
                  data-ocid="register_patient.blood_group.field_error"
                  className="text-xs text-destructive"
                >
                  {errors.bloodGroup}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                data-ocid="register_patient.phone.input"
                placeholder="+1 555-0000"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p
                  data-ocid="register_patient.phone.field_error"
                  className="text-xs text-destructive"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="condition">Primary Condition / Reason</Label>
              <Input
                id="condition"
                data-ocid="register_patient.condition.input"
                placeholder="e.g. Hypertension, Fever..."
                value={form.condition}
                onChange={(e) => setField("condition", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Emergency Contact */}
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="emergencyName">
                Contact Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="emergencyName"
                data-ocid="register_patient.emergency_name.input"
                placeholder="e.g. John Doe"
                value={form.emergencyName}
                onChange={(e) => setField("emergencyName", e.target.value)}
                className={errors.emergencyName ? "border-destructive" : ""}
              />
              {errors.emergencyName && (
                <p
                  data-ocid="register_patient.emergency_name.field_error"
                  className="text-xs text-destructive"
                >
                  {errors.emergencyName}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emergencyPhone">
                Contact Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="emergencyPhone"
                data-ocid="register_patient.emergency_phone.input"
                placeholder="+1 555-0000"
                value={form.emergencyPhone}
                onChange={(e) => setField("emergencyPhone", e.target.value)}
                className={errors.emergencyPhone ? "border-destructive" : ""}
              />
              {errors.emergencyPhone && (
                <p
                  data-ocid="register_patient.emergency_phone.field_error"
                  className="text-xs text-destructive"
                >
                  {errors.emergencyPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Address & ID */}
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Address & Identification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="address">
                Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                data-ocid="register_patient.address.textarea"
                placeholder="Full address including city and ZIP code"
                rows={2}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p
                  data-ocid="register_patient.address.field_error"
                  className="text-xs text-destructive"
                >
                  {errors.address}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="aadhar">Aadhaar / ID Number (Optional)</Label>
              <Input
                id="aadhar"
                data-ocid="register_patient.aadhar.input"
                placeholder="XXXX-XXXX-XXXX"
                value={form.aadhar}
                onChange={(e) => setField("aadhar", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            data-ocid="register_patient.reset.button"
            onClick={() => {
              setForm(EMPTY_FORM);
              setErrors({});
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            data-ocid="register_patient.submit.submit_button"
            disabled={submitting}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 min-w-[160px]"
          >
            {submitting ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Registering...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Register Patient
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Patients Table */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">
              Registered Patients
            </h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {allPatients.length} total
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Age / Gender
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Blood Group
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allPatients.map((p, i) => (
                <tr
                  key={p.id}
                  data-ocid={`register_patient.table.item.${i + 1}`}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {p.id}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {p.name}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {p.age} yrs / {p.gender}
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      variant="outline"
                      className="text-xs bg-primary/10 text-primary border-primary/30"
                    >
                      {p.bloodGroup}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{p.phone}</td>
                  <td className="px-5 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs border ${
                        p.status === "Admitted"
                          ? "bg-primary/20 text-primary border-primary/30"
                          : p.status === "Discharged"
                            ? "bg-muted text-muted-foreground border-border"
                            : p.status === "Scheduled"
                              ? "bg-accent/20 text-accent border-accent/30"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
