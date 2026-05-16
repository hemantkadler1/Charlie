import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_HOSPITALS } from "@/lib/mock-data";
import { useAuthStore } from "@/store/auth-store";
import {
  Building2,
  Hash,
  ImageIcon,
  Mail,
  Phone,
  Save,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function HospitalSettings() {
  const { user } = useAuthStore();

  // Find the hospital for the current admin
  const hospital = MOCK_HOSPITALS.find((h) => h.id === user?.hospitalId);

  const [name, setName] = useState(hospital?.name ?? "");
  const [address, setAddress] = useState(hospital?.address ?? "");
  const [phone, setPhone] = useState(hospital?.contact ?? "");
  const [email, setEmail] = useState(
    hospital
      ? `admin@${hospital.name.toLowerCase().replace(/\s+/g, "")}.org`
      : "",
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    hospital?.logoUri ?? null,
  );
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Hospital settings saved successfully!");
    }, 800);
  }

  return (
    <div
      className="space-y-6 max-w-2xl"
      data-ocid="admin.hospital_settings.page"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">
          Hospital Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your hospital's profile and contact details
        </p>
      </div>

      {/* Read-only Hospital ID */}
      <div className="glass rounded-xl px-5 py-4 flex items-center gap-3 border border-primary/20 shadow-glass-sm">
        <Hash className="w-4 h-4 text-primary flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Hospital ID
          </p>
          <p
            className="text-sm font-mono font-semibold text-foreground"
            data-ocid="admin.hospital_settings.hospital_id"
          >
            {hospital?.id ?? "—"}
          </p>
        </div>
        <div className="ml-auto">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
              hospital?.status === "active"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {hospital?.status ?? "unknown"}
          </span>
        </div>
      </div>

      {/* Profile form */}
      <div className="glass-elevated rounded-xl overflow-hidden shadow-glass-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Hospital Profile</h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Logo upload */}
          <div className="space-y-2">
            <Label>Hospital Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden flex-shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Hospital logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="admin.hospital_settings.logo.upload_button"
                  className="gap-2 border-border"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 2MB. Recommended 256×256px.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          {/* Hospital Name */}
          <div className="space-y-1.5">
            <Label htmlFor="hs-name">Hospital Name</Label>
            <Input
              id="hs-name"
              data-ocid="admin.hospital_settings.name.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. City General Hospital"
              className="bg-background border-border"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="hs-address">Address</Label>
            <Textarea
              id="hs-address"
              data-ocid="admin.hospital_settings.address.textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="Full hospital address"
              className="bg-background border-border resize-none"
            />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="hs-phone">
                <Phone className="w-3 h-3 inline mr-1" />
                Contact Phone
              </Label>
              <Input
                id="hs-phone"
                data-ocid="admin.hospital_settings.phone.input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0100"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hs-email">
                <Mail className="w-3 h-3 inline mr-1" />
                Contact Email
              </Label>
              <Input
                id="hs-email"
                type="email"
                data-ocid="admin.hospital_settings.email.input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@hospital.org"
                className="bg-background border-border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          type="button"
          data-ocid="admin.hospital_settings.save_button"
          onClick={handleSave}
          disabled={saving}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 min-w-[140px]"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
