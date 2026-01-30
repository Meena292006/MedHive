import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import HeartPrediction from "./pages/HeartPrediction";
import DiabetesPrediction from "./pages/DiabetesPrediction";
import LiverPrediction from "./pages/LiverPrediction";
import History from "./pages/History";
import Reports from "./pages/Reports";
import ECGPrediction from "./pages/ECGPrediction";
import PatientPrescriptions from "./pages/PatientPrescription";
import { DoctorRoute, PatientRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PATIENT ROUTES */}
        <Route element={<PatientRoute />}>
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/heart" element={<HeartPrediction />} />
          <Route path="/patient/diabetes" element={<DiabetesPrediction />} />
          <Route path="/patient/liver" element={<LiverPrediction />} />
          <Route path="/patient/ecg" element={<ECGPrediction />} />
          <Route path="/patient/history" element={<History />} />
          <Route path="/patient/reports" element={<Reports />} />

          {/* ✅ FIXED: prescription inside PatientRoute */}
          <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
        </Route>

        {/* DOCTOR ROUTES */}
        <Route element={<DoctorRoute />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/cases" element={<DoctorDashboard />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
