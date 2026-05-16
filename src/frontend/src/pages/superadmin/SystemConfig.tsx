import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  CheckCircle2,
  Globe,
  Settings,
  Shield,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface HospitalModules {
  id: string;
  name: string;
  pharmacy: boolean;
  laboratory: boolean;
  billing: boolean;
  patientPortal: boolean;
}

const INITIAL_HOSPITALS: HospitalModules[] = [
  {
    id: "h1",
    name: "St. Mary's General Hospital",
    pharmacy: true,
    laboratory: true,
    billing: true,
    patientPortal: true,
  },
  {
    id: "h2",
    name: "Riverside Medical Center",
    pharmacy: true,
    laboratory: true,
    billing: true,
    patientPortal: false,
  },
  {
    id: "h3",
    name: "Northside Pediatric Clinic",
    pharmacy: false,
    laboratory: true,
    billing: true,
    patientPortal: false,
  },
  {
    id: "h4",
    name: "Metro Heart Institute",
    pharmacy: true,
    laboratory: true,
    billing: true,
    patientPortal: true,
  },
  {
    id: "h5",
    name: "Lakewood Community Hospital",
    pharmacy: false,
    laboratory: false,
    billing: false,
    patientPortal: false,
  },
  {
    id: "h6",
    name: "Sunvalley Orthopedic Center",
    pharmacy: false,
    laboratory: true,
    billing: true,
    patientPortal: false,
  },
];

type ModuleKey = keyof Omit<HospitalModules, "id" | "name">;

const MODULE_LABELS: { key: ModuleKey; label: string }[] = [
  { key: "pharmacy", label: "Pharmacy" },
  { key: "laboratory", label: "Laboratory" },
  { key: "billing", label: "Billing" },
  { key: "patientPortal", label: "Patient Portal" },
];

export default function SystemConfig() {
  const [hospitals, setHospitals] =
    useState<HospitalModules[]>(INITIAL_HOSPITALS);
  const [systemName, setSystemName] = useState("MedCore HMS");
  const [supportEmail, setSupportEmail] = useState("support@medcorehms.com");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const toggleModule = (hospitalId: string, module: ModuleKey) => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === hospitalId ? { ...h, [module]: !h[module] } : h,
      ),
    );
  };

  const handleSaveRow = (hospital: HospitalModules) => {
    toast.success(`Configuration saved for ${hospital.name}`, {
      description: "Module flags have been updated.",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    });
  };

  const handleSaveGlobal = () => {
    toast.success("Global settings saved", {
      description: `System name and support email updated.${maintenanceMode ? " Maintenance mode is ON." : ""}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-5 h-5 text-violet-500" />
            <h1 className="text-2xl font-bold text-foreground font-display">
              System Configuration
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage global settings and per-hospital feature flags
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-400"
        >
          <Shield className="w-3.5 h-3.5 mr-1.5" />
          Developer Only
        </Badge>
      </div>

      {/* Global Settings */}
      <Card
        data-ocid="super-admin.config.global_card"
        className="border-border"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Global Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="systemName"
                className="text-sm font-medium text-foreground"
              >
                System Name
              </Label>
              <Input
                id="systemName"
                data-ocid="super-admin.config.system_name_input"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="supportEmail"
                className="text-sm font-medium text-foreground"
              >
                Support Email
              </Label>
              <Input
                id="supportEmail"
                type="email"
                data-ocid="super-admin.config.support_email_input"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="bg-muted/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Wrench className="w-4 h-4 text-accent" />
                Maintenance Mode
              </p>
              <p className="text-xs text-muted-foreground">
                When enabled, all hospital dashboards will show a maintenance
                notice to staff
              </p>
            </div>
            <Switch
              data-ocid="super-admin.config.maintenance_toggle"
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
              aria-label="Toggle maintenance mode"
            />
          </div>

          {maintenanceMode && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm">
              <Shield className="w-4 h-4 flex-shrink-0" />
              Maintenance mode is active. Hospital staff will see a maintenance
              notice.
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              data-ocid="super-admin.config.save_global_button"
              onClick={handleSaveGlobal}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Save Global Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags per Hospital */}
      <Card
        data-ocid="super-admin.config.feature_flags_card"
        className="border-border"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Hospital Feature Flags
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Hospital
                  </th>
                  {MODULE_LABELS.map((m) => (
                    <th
                      key={m.key}
                      className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      {m.label}
                    </th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {hospitals.map((h, i) => (
                  <tr
                    key={h.id}
                    data-ocid={`super-admin.config.hospital.item.${i + 1}`}
                    className="hover:bg-muted/30 transition-smooth"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground whitespace-nowrap">
                          {h.name}
                        </span>
                      </div>
                    </td>
                    {MODULE_LABELS.map((m) => (
                      <td key={m.key} className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            data-ocid={`super-admin.config.${h.id}.${m.key}.toggle`}
                            checked={h[m.key]}
                            onCheckedChange={() => toggleModule(h.id, m.key)}
                            aria-label={`Toggle ${m.label} for ${h.name}`}
                          />
                        </div>
                      </td>
                    ))}
                    <td className="px-4 py-4 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        data-ocid={`super-admin.config.save.${i + 1}.button`}
                        onClick={() => handleSaveRow(h)}
                        className="text-xs"
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
