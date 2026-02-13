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
import ShieldIcon from "@mui/icons-material/ShieldRounded";
import PsychologyIcon from "@mui/icons-material/PsychologyRounded";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const DRAWER_WIDTH = 280;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { role, user, logout } = useAuth();

  const isDoctor = role === "doctor";

  // 🔵 MODERN MEDICAL PALETTE (PATIENT)
  // 🔵 SHARED THEME REFERENCING TOKENS
  const SHARED_THEME = {
    bg: theme.gradients.main,
    card: theme.palette.background.paper,
    activeBg: theme.palette.primary.light,
    hoverBg: theme.palette.action.hover,
    text: theme.palette.text.primary,
    textMuted: theme.palette.text.secondary,
    accent: theme.palette.secondary.main,
    border: theme.palette.divider,
  };


  const patientMenu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/patient" },
    { text: "Digital Twin", icon: <PsychologyIcon />, path: "/patient/digital-twin" },
    { text: "Heart Disease", icon: <MonitorHeartIcon />, path: "/patient/heart" },
    { text: "MedAlert AI", icon: <ShieldIcon />, path: "/patient/medalert" },
    { text: "Diabetes", icon: <MedicationIcon />, path: "/patient/diabetes" },
    { text: "Liver Disease", icon: <ScienceIcon />, path: "/patient/liver" },
    { text: "ECG Analysis", icon: <PulseIcon />, path: "/patient/ecg" },
    { text: "Medical Reports", icon: <DescriptionIcon />, path: "/patient/reports" },
    { text: "History", icon: <HistoryIcon />, path: "/patient/history" },

    // ✅ NEW
    { text: "Prescriptions", icon: <MedicationIcon />, path: "/patient/prescriptions" },
  ];


  const doctorMenu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/doctor" },
    { text: "Patient Cases", icon: <PeopleIcon />, path: "/doctor/cases" },
  ];

  const menuItems = isDoctor ? doctorMenu : patientMenu;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* LOGO & USER */}
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 44,
              height: 44,
              boxShadow: `0 4px 12px ${theme.palette.primary.light}`,
            }}
          >
            <LocalHospitalIcon />
          </Avatar>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ color: theme.palette.text.primary }}
          >
            MedHive
          </Typography>
        </Box>

        {user && (
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}
          >
            {user.displayName || user.email}
          </Typography>
        )}

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: theme.palette.secondary.main,
          }}
        >
          Secure Access • MedHive
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.25 }} />

      {/* MENU */}
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 3,
                  bgcolor: active
                    ? theme.palette.primary.light
                    : "transparent",
                  color: active
                    ? "#FFFFFF"
                    : theme.palette.text.secondary,
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 42 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    variant: "body2",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* LOGOUT */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            color: theme.palette.error.main,
            "&:hover": {
              bgcolor: theme.palette.error.light,
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 42 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontWeight: 600, variant: "body2" }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
