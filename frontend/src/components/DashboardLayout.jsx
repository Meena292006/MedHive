import Sidebar from "./Sidebar";
import AnimatedBackground from "./AnimatedBackground";
import { Box, useTheme } from "@mui/material";

export default function DashboardLayout({ children }) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", position: "relative", bgcolor: theme.palette.background.default }}>
      {/* Animated Background */}
      {/* <AnimatedBackground /> */}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          padding: { xs: 2, md: 4 },
          overflowX: "hidden",
          position: "relative",
          zIndex: 2,
          bgcolor: "transparent",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
