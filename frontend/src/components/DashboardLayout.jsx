import Sidebar from "./Sidebar";
import { Box, useTheme } from "@mui/material";

export default function DashboardLayout({ children }) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", bgcolor: theme.palette.background.default }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          padding: { xs: 2, md: 4 }, // Responsive padding
          overflowX: "hidden"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
