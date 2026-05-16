export type UserRole =
  | "admin"
  | "doctor"
  | "receptionist"
  | "patient"
  | "superAdmin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  hospitalId?: string;
  avatar?: string;
  specialty?: string;
  department?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  bloodGroup: string;
  condition: string;
  status: "Admitted" | "Discharged" | "In-Progress" | "Scheduled";
  admittedDate: string;
  doctorId: string;
  address: string;
  emergencyContact: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  phone: string;
  email: string;
  status: "Active" | "Busy" | "On Leave";
  patients: number;
  experience: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: "Scheduled" | "Confirmed" | "Checked-In" | "Completed" | "Cancelled";
  token: number;
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  doctors: number;
  patients: number;
  rooms: number;
  status: "Active" | "Full";
}

export interface Room {
  id: string;
  number: string;
  type: "ICU" | "General" | "Private" | "Semi-Private";
  floor: number;
  patientId?: string;
  patientName?: string;
  status: "Available" | "Occupied" | "Maintenance";
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: Medicine[];
  notes: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface BillingRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  consultationFee: number;
  labCharges: number;
  medicineCharges: number;
  roomCharges: number;
  total: number;
  status: "Paid" | "Pending" | "Partial";
  paymentMethod?: "Cash" | "Card" | "UPI" | "Insurance";
}
export interface Hospital {
  id: string;
  name: string;
  logoUri?: string;
  address: string;
  contact: string;
  status: "active" | "inactive";
  createdAt?: string;
}
