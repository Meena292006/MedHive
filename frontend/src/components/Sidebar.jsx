import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Box, Avatar, useTheme, Divider
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import HistoryIcon from "@mui/icons-material/HistoryRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import LocalHospitalIcon from "@mui/icons-material/LocalHospitalRounded";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeartRounded";
import ScienceIcon from "@mui/icons-material/ScienceRounded";
import MedicationIcon from "@mui/icons-material/MedicationRounded";
import PulseIcon from "@mui/icons-material/ShowChartRounded";
import DescriptionIcon from "@mui/icons-material/DescriptionRounded";
import PeopleIcon from "@mui/icons-material/PeopleRounded";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DRAWER_WIDTH = 280;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { role, user, logout } = useAuth();

  const isDoctor = role === "doctor";

  const patientMenu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/patient" },
    { text: "Heart Disease", icon: <MonitorHeartIcon />, path: "/patient/heart" },
    { text: "Diabetes", icon: <MedicationIcon />, path: "/patient/diabetes" },
    { text: "Liver Disease", icon: <ScienceIcon />, path: "/patient/liver" },
    { text: "ECG Analysis", icon: <PulseIcon />, path: "/patient/ecg" },
    { text: "Medical Reports", icon: <DescriptionIcon />, path: "/patient/reports" },
    { text: "History", icon: <HistoryIcon />, path: "/patient/history" },
  ];

  const doctorMenu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/doctor" },
    { text: "Patient Cases", icon: <PeopleIcon />, path: "/doctor/cases" },
  ];

  const menuItems = isDoctor ? doctorMenu : patientMenu;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(0,0,0,0.08)",
          background: isDoctor ? "#1a1f2e" : "white",
          color: isDoctor ? "white" : "text.primary",
        },
      }}
    >
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
            <LocalHospitalIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={800} sx={{ color: isDoctor ? "white" : "primary.main" }}>
            MedHive
          </Typography>
        </Box>
        {user && (
          <Typography variant="caption" sx={{ color: isDoctor ? "rgba(255,255,255,0.6)" : "text.secondary", display: 'block', mt: 1 }}>
            {user.displayName || user.email}
          </Typography>
        )}
        <Typography variant="caption" sx={{
          color: isDoctor ? "rgba(96, 165, 250, 1)" : "primary.main",
          display: 'block',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          mt: 0.5
        }}>
          {isDoctor ? "Doctor" : "Patient"}
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, opacity: isDoctor ? 0.1 : 1 }} />

      <List sx={{ p: 2 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? (isDoctor ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.08)") : "transparent",
                  color: active ? (isDoctor ? "#60a5fa" : "primary.main") : (isDoctor ? "rgba(255,255,255,0.6)" : "text.secondary"),
                  "&:hover": {
                    bgcolor: isDoctor ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 500, variant: "body2" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "error.main",
            "&:hover": { bgcolor: isDoctor ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.08)" }
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, variant: "body2" }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
