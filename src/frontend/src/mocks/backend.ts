import type { backendInterface, Hospital, HospitalAdmin } from "../backend";
import { HospitalStatus, HospitalAdminStatus } from "../backend";

const sampleHospitals: Hospital[] = [
  {
    id: "hosp-001",
    name: "City General Hospital",
    address: "123 Main Street, Downtown",
    contact: "+1-555-100-2000",
    status: HospitalStatus.Active,
    createdAt: BigInt(1700000000),
    logoUri: "",
  },
  {
    id: "hosp-002",
    name: "Sunrise Medical Center",
    address: "456 Oak Avenue, Midtown",
    contact: "+1-555-200-3000",
    status: HospitalStatus.Active,
    createdAt: BigInt(1710000000),
    logoUri: "",
  },
];

const sampleAdmins: HospitalAdmin[] = [
  {
    id: "admin-001",
    hospitalId: "hosp-001",
    username: "admin_citygeneral",
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@citygeneral.com",
    status: HospitalAdminStatus.Active,
  },
  {
    id: "admin-002",
    hospitalId: "hosp-002",
    username: "admin_sunrise",
    name: "James Carter",
    email: "j.carter@sunrisemedical.com",
    status: HospitalAdminStatus.Active,
  },
];

export const mockBackend: backendInterface = {
  get_hospitals: async () => sampleHospitals,

  get_hospital_by_id: async (id: string) =>
    sampleHospitals.find((h) => h.id === id) ?? null,

  create_hospital: async (name, address, contact) => ({
    id: `hosp-${Date.now()}`,
    name,
    address,
    contact,
    status: HospitalStatus.Active,
    createdAt: BigInt(Date.now()),
    logoUri: "",
  }),

  update_hospital: async (id, name, address, contact, status) => {
    const hospital = sampleHospitals.find((h) => h.id === id);
    if (!hospital) return null;
    return { ...hospital, name, address, contact, status };
  },

  get_hospital_admins: async (_hospitalId: string) => sampleAdmins,

  create_hospital_admin: async (hospitalId, username, name, email) => ({
    id: `admin-${Date.now()}`,
    hospitalId,
    username,
    name,
    email,
    status: HospitalAdminStatus.Active,
  }),

  update_hospital_admin_status: async (id, status) => {
    const admin = sampleAdmins.find((a) => a.id === id);
    if (!admin) return null;
    return { ...admin, status };
  },

  verify_super_admin: async (username: string, password: string) =>
    username === "superadmin" && password === "superadmin123",
};
