import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AppointmentBookPage from "../pages/appointments/AppointmentBookPage";
import AppointmentListPage from "../pages/appointments/AppointmentListPage";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import DoctorDetailPage from "../pages/doctors/DoctorDetailPage";
import DoctorFormPage from "../pages/doctors/DoctorFormPage";
import DoctorListPage from "../pages/doctors/DoctorListPage";
import NotFoundPage from "../pages/NotFoundPage";
import PatientDetailPage from "../pages/patients/PatientDetailPage";
import PatientFormPage from "../pages/patients/PatientFormPage";
import PatientListPage from "../pages/patients/PatientListPage";
import HealthStatusPage from "../pages/system/HealthStatusPage";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="doctors" element={<DoctorListPage />} />
        <Route path="doctors/new" element={<DoctorFormPage />} />
        <Route path="doctors/:id/edit" element={<DoctorFormPage />} />
        <Route path="doctors/:id" element={<DoctorDetailPage />} />
        <Route path="patients" element={<PatientListPage />} />
        <Route path="patients/new" element={<PatientFormPage />} />
        <Route path="patients/:id/edit" element={<PatientFormPage />} />
        <Route path="patients/:id" element={<PatientDetailPage />} />
        <Route path="appointments" element={<AppointmentListPage />} />
        <Route path="appointments/book" element={<AppointmentBookPage />} />
        <Route path="health" element={<HealthStatusPage />} />
      </Route>
      <Route
        path="*"
        element={
          isAuthenticated ? <NotFoundPage /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default AppRoutes;
