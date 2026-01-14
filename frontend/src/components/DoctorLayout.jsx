import { Box } from "@mui/material";
import DoctorSidebar from "./DoctorSidebar";

export default function DoctorLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <DoctorSidebar />
      <Box sx={{ flexGrow: 1, p: 4, backgroundColor: "#f8fafc" }}>
        {children}
      </Box>
    </Box>
  );
}
