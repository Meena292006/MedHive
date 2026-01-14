import { Box } from "@mui/material";
import PatientSidebar from "./PatientSidebar";

export default function PatientLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <PatientSidebar />
      <Box
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: "#f8fafc",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
