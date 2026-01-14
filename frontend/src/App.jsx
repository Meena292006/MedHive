import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import HeartPrediction from "./pages/HeartPrediction";
import DiabetesPrediction from "./pages/DiabetesPrediction";
import LiverPrediction from "./pages/LiverPrediction";
import History from "./pages/History";
import Reports from "./pages/Reports";
import ECGPrediction from "./pages/ECGPrediction";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient/heart" element={<HeartPrediction />} />
        <Route path="/patient/diabetes" element={<DiabetesPrediction />} />
        <Route path="/patient/history" element={<History />} />
        <Route path="/patient/reports" element={<Reports />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/analytics" element={<DoctorDashboard />} />
        <Route path="/doctor/cases" element={<DoctorDashboard />} />
        <Route path="/patient/liver" element={<LiverPrediction/>}/>
        <Route path="/patient/ecg" element={<ECGPrediction />} />
      </Routes>
    </BrowserRouter>
  );
}
