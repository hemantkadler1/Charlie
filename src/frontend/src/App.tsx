import { AppLayout } from "@/components/layout/AppLayout";
import { SuperAdminLayout } from "@/layouts/SuperAdminLayout";
import LoginPage from "@/pages/LoginPage";
import { StubPage } from "@/pages/StubPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Departments from "@/pages/admin/Departments";
import HospitalSettings from "@/pages/admin/HospitalSettings";
import ManageDoctors from "@/pages/admin/ManageDoctors";
import ManageReceptionists from "@/pages/admin/ManageReceptionists";
import RoomsBeds from "@/pages/admin/RoomsBeds";
import AdminSettings from "@/pages/admin/Settings";
import DoctorAppointments from "@/pages/doctor/DoctorAppointments";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import MyPatients from "@/pages/doctor/MyPatients";
import Prescriptions from "@/pages/doctor/Prescriptions";
import Reports from "@/pages/doctor/Reports";
import PatientDashboard from "@/pages/patient/PatientDashboard";
import Billing from "@/pages/receptionist/Billing";
import BookAppointment from "@/pages/receptionist/BookAppointment";
import QueueManagement from "@/pages/receptionist/QueueManagement";
import ReceptionistDashboard from "@/pages/receptionist/ReceptionistDashboard";
import RegisterPatient from "@/pages/receptionist/RegisterPatient";
import AnalyticsPage from "@/pages/superadmin/Analytics";
import AuditLogsPage from "@/pages/superadmin/AuditLogs";
import HospitalAdminsPage from "@/pages/superadmin/HospitalAdmins";
import HospitalsPage from "@/pages/superadmin/Hospitals";
import SuperAdminDashboard from "@/pages/superadmin/SuperAdminDashboard";
import SystemConfigPage from "@/pages/superadmin/SystemConfig";
import UserOversightPage from "@/pages/superadmin/UserOversight";
import { useAuthStore } from "@/store/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

const queryClient = new QueryClient();

const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: AppLayout,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) throw redirect({ to: "/login" });
  },
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/admin",
  component: AdminDashboard,
});
const adminDoctorsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/admin/doctors",
  component: ManageDoctors,
});
const adminReceptionistsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/admin/receptionists",
  component: ManageReceptionists,
});
const adminDepartmentsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/admin/departments",
  component: Departments,
});
const adminRoomsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/admin/rooms",
  component: RoomsBeds,
});
const adminAnalyticsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/admin/analytics",
  component: () => (
    <StubPage
      title="Analytics"
      description="Revenue charts, patient demographics, and appointment trends."
    />
  ),
});
const adminSettingsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/admin/settings",
  component: AdminSettings,
});
const adminHospitalSettingsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/admin/hospital-settings",
  component: HospitalSettings,
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (user?.role !== "admin") throw redirect({ to: "/login" });
  },
});

// Doctor routes
const doctorRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/doctor",
  component: DoctorDashboard,
});
const doctorPatientsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/doctor/patients",
  component: MyPatients,
});
const doctorAppointmentsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/doctor/appointments",
  component: DoctorAppointments,
});
const doctorPrescriptionsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/doctor/prescriptions",
  component: Prescriptions,
});
const doctorReportsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/doctor/reports",
  component: Reports,
});

// Receptionist routes
const receptionistRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/receptionist",
  component: ReceptionistDashboard,
});
const receptionistRegisterRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/receptionist/register",
  component: RegisterPatient,
});
const receptionistBookRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/receptionist/book",
  component: BookAppointment,
});
const receptionistQueueRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/receptionist/queue",
  component: QueueManagement,
});
const receptionistBillingRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/receptionist/billing",
  component: Billing,
});

// Patient routes
const patientRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/patient",
  component: PatientDashboard,
});
const patientAppointmentsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/patient/appointments",
  component: () => (
    <StubPage
      title="My Appointments"
      description="View upcoming and past appointments."
    />
  ),
});
const patientPrescriptionsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/patient/prescriptions",
  component: () => (
    <StubPage
      title="My Prescriptions"
      description="Download and review your prescription history."
    />
  ),
});
const patientBillingRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/patient/billing",
  component: () => (
    <StubPage
      title="My Bills"
      description="Review invoices and payment history."
    />
  ),
});

// Super Admin route
const superAdminLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "super-admin-protected",
  component: SuperAdminLayout,
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated) throw redirect({ to: "/login" });
    if (user?.role !== "superAdmin") throw redirect({ to: "/login" });
  },
});

const superAdminDashboardRoute = createRoute({
  getParentRoute: () => superAdminLayout,
  path: "/super-admin",
  component: SuperAdminDashboard,
});

const superAdminHospitalsRoute = createRoute({
  getParentRoute: () => superAdminLayout,
  path: "/super-admin/hospitals",
  component: HospitalsPage,
});

const superAdminAdminsRoute = createRoute({
  getParentRoute: () => superAdminLayout,
  path: "/super-admin/admins",
  component: HospitalAdminsPage,
});

const superAdminAnalyticsRoute = createRoute({
  getParentRoute: () => superAdminLayout,
  path: "/super-admin/analytics",
  component: AnalyticsPage,
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role !== "superAdmin")
      throw redirect({ to: "/login" });
  },
});

const superAdminAuditLogsRoute = createRoute({
  getParentRoute: () => superAdminLayout,
  path: "/super-admin/audit-logs",
  component: AuditLogsPage,
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role !== "superAdmin")
      throw redirect({ to: "/login" });
  },
});

const superAdminUsersRoute = createRoute({
  getParentRoute: () => superAdminLayout,
  path: "/super-admin/users",
  component: UserOversightPage,
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role !== "superAdmin")
      throw redirect({ to: "/login" });
  },
});

const superAdminConfigRoute = createRoute({
  getParentRoute: () => superAdminLayout,
  path: "/super-admin/config",
  component: SystemConfigPage,
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role !== "superAdmin")
      throw redirect({ to: "/login" });
  },
});

// Index redirect
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated) throw redirect({ to: "/login" });
    const roleMap: Record<string, string> = {
      admin: "/admin",
      doctor: "/doctor",
      receptionist: "/receptionist",
      patient: "/patient",
      superAdmin: "/super-admin",
    };
    throw redirect({ to: roleMap[user?.role ?? "admin"] ?? "/login" });
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  superAdminLayout.addChildren([
    superAdminDashboardRoute,
    superAdminHospitalsRoute,
    superAdminAdminsRoute,
    superAdminAnalyticsRoute,
    superAdminAuditLogsRoute,
    superAdminUsersRoute,
    superAdminConfigRoute,
  ]),
  protectedLayout.addChildren([
    adminRoute,
    adminDoctorsRoute,
    adminReceptionistsRoute,
    adminDepartmentsRoute,
    adminRoomsRoute,
    adminAnalyticsRoute,
    adminSettingsRoute,
    adminHospitalSettingsRoute,
    doctorRoute,
    doctorPatientsRoute,
    doctorAppointmentsRoute,
    doctorPrescriptionsRoute,
    doctorReportsRoute,
    receptionistRoute,
    receptionistRegisterRoute,
    receptionistBookRoute,
    receptionistQueueRoute,
    receptionistBillingRoute,
    patientRoute,
    patientAppointmentsRoute,
    patientPrescriptionsRoute,
    patientBillingRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  // Apply persisted theme on mount to prevent flash
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("medcore-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
