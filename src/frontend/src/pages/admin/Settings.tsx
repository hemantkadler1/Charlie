import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Building2,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Save,
  Shield,
} from "lucide-react";
import { useState } from "react";

type HospitalSettings = {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  emergencyContact: string;
  openTime: string;
  closeTime: string;
  timezone: string;
  licenseNumber: string;
};

type NotificationSettings = {
  appointmentReminders: boolean;
  labReportAlerts: boolean;
  emergencyAlerts: boolean;
  billingNotifications: boolean;
  staffAlerts: boolean;
  systemUpdates: boolean;
};

const INITIAL_HOSPITAL: HospitalSettings = {
  name: "St. Mary's General Hospital",
  tagline: "Compassionate Care Since 1987",
  address: "1200 Medical Center Drive, Chicago, IL 60601",
  phone: "+1 (312) 555-0100",
  email: "info@stmarysgeneral.org",
  emergencyContact: "+1 (312) 555-0911",
  openTime: "07:00",
  closeTime: "21:00",
  timezone: "America/Chicago",
  licenseNumber: "IL-MED-2024-7842",
};

const INITIAL_NOTIFICATIONS: NotificationSettings = {
  appointmentReminders: true,
  labReportAlerts: true,
  emergencyAlerts: true,
  billingNotifications: false,
  staffAlerts: true,
  systemUpdates: false,
};

export default function Settings() {
  const [hospital, setHospital] = useState<HospitalSettings>(INITIAL_HOSPITAL);
  const [notifications, setNotifications] = useState<NotificationSettings>(
    INITIAL_NOTIFICATIONS,
  );
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const NOTIFICATION_ITEMS: {
    key: keyof NotificationSettings;
    label: string;
    description: string;
  }[] = [
    {
      key: "appointmentReminders",
      label: "Appointment Reminders",
      description: "Notify patients 24h before their scheduled appointment",
    },
    {
      key: "labReportAlerts",
      label: "Lab Report Alerts",
      description: "Alert doctors when lab results are ready for review",
    },
    {
      key: "emergencyAlerts",
      label: "Emergency Alerts",
      description: "Broadcast critical alerts to all on-duty staff immediately",
    },
    {
      key: "billingNotifications",
      label: "Billing Notifications",
      description:
        "Notify patients about pending invoices and payment reminders",
    },
    {
      key: "staffAlerts",
      label: "Staff Alerts",
      description: "Internal alerts for roster changes and shift reminders",
    },
    {
      key: "systemUpdates",
      label: "System Updates",
      description:
        "Receive notifications about platform updates and maintenance windows",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl" data-ocid="admin.settings.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage hospital profile, working hours, and notification preferences
        </p>
      </div>

      {/* Hospital Profile */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Hospital Profile</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-name">Hospital Name</Label>
              <Input
                id="s-name"
                data-ocid="admin.settings.name.input"
                value={hospital.name}
                onChange={(e) =>
                  setHospital({ ...hospital, name: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-tagline">Tagline</Label>
              <Input
                id="s-tagline"
                data-ocid="admin.settings.tagline.input"
                value={hospital.tagline}
                onChange={(e) =>
                  setHospital({ ...hospital, tagline: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>
            <div className="col-span-full space-y-1.5">
              <Label htmlFor="s-address">Address</Label>
              <Textarea
                id="s-address"
                data-ocid="admin.settings.address.textarea"
                value={hospital.address}
                onChange={(e) =>
                  setHospital({ ...hospital, address: e.target.value })
                }
                rows={2}
                className="bg-background border-border resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-phone">
                <Phone className="w-3 h-3 inline mr-1" />
                Main Phone
              </Label>
              <Input
                id="s-phone"
                data-ocid="admin.settings.phone.input"
                value={hospital.phone}
                onChange={(e) =>
                  setHospital({ ...hospital, phone: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-email">
                <Mail className="w-3 h-3 inline mr-1" />
                Email
              </Label>
              <Input
                id="s-email"
                type="email"
                data-ocid="admin.settings.email.input"
                value={hospital.email}
                onChange={(e) =>
                  setHospital({ ...hospital, email: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-emergency">
                <Phone className="w-3 h-3 inline mr-1 text-destructive" />
                Emergency Line
              </Label>
              <Input
                id="s-emergency"
                data-ocid="admin.settings.emergency.input"
                value={hospital.emergencyContact}
                onChange={(e) =>
                  setHospital({ ...hospital, emergencyContact: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-license">
                <Shield className="w-3 h-3 inline mr-1" />
                License Number
              </Label>
              <Input
                id="s-license"
                data-ocid="admin.settings.license.input"
                value={hospital.licenseNumber}
                onChange={(e) =>
                  setHospital({ ...hospital, licenseNumber: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <Clock className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-foreground">Working Hours</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-open">Opening Time</Label>
              <Input
                id="s-open"
                type="time"
                data-ocid="admin.settings.open_time.input"
                value={hospital.openTime}
                onChange={(e) =>
                  setHospital({ ...hospital, openTime: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-close">Closing Time</Label>
              <Input
                id="s-close"
                type="time"
                data-ocid="admin.settings.close_time.input"
                value={hospital.closeTime}
                onChange={(e) =>
                  setHospital({ ...hospital, closeTime: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-tz">Timezone</Label>
              <Input
                id="s-tz"
                data-ocid="admin.settings.timezone.input"
                value={hospital.timezone}
                onChange={(e) =>
                  setHospital({ ...hospital, timezone: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Emergency services operate 24/7 regardless of working hours.
          </p>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">
            Notification Preferences
          </h2>
        </div>
        <div className="p-6 space-y-1">
          {NOTIFICATION_ITEMS.map((item, i) => (
            <div key={item.key}>
              {i > 0 && <Separator className="my-3 bg-border" />}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
                <Switch
                  data-ocid={`admin.settings.${item.key}.switch`}
                  checked={notifications[item.key]}
                  onCheckedChange={(v) =>
                    setNotifications({ ...notifications, [item.key]: v })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-between">
        {saved && (
          <div
            data-ocid="admin.settings.success_state"
            className="flex items-center gap-2 text-emerald-400 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Settings saved successfully!
          </div>
        )}
        {!saved && <div />}
        <Button
          type="button"
          data-ocid="admin.settings.save_button"
          onClick={handleSave}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
