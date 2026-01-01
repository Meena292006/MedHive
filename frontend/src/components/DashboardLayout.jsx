import Sidebar from "./Sidebar";
import { Box } from "@mui/material";

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          padding: 4,
          backgroundColor: "#f8fafc",
          overflowX: "hidden"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
