import Sidebar from "./Sidebar";
import { Box } from "@mui/material";

export default function DashboardLayout({ children }) {
  const role = localStorage.getItem("role");
  const isDoctor = role === "doctor";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: isDoctor ? "#0f172a" : "#f8fafc" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
