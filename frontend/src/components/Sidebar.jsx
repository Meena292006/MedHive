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

  // 🔴 PROFESSIONAL RED PALETTE (PATIENT)
  const PATIENT_RED = {
    bg: "linear-gradient(180deg, #2A0A0A, #3B0F0F)",
    card: "rgba(255,255,255,0.04)",
    activeBg: "rgba(220,38,38,0.25)",
    hoverBg: "rgba(220,38,38,0.15)",
    text: "#FEE2E2",
    textMuted: "#FCA5A5",
    accent: "#EF4444",
    border: "rgba(239,68,68,0.35)",
  };

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
          background: isDoctor ? "#1a1f2e" : PATIENT_RED.bg,
          color: isDoctor ? "white" : PATIENT_RED.text,
          borderRight: isDoctor ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${PATIENT_RED.border}`,
        },
      }}
    >
      {/* LOGO & USER */}
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
          <Avatar
            sx={{
              bgcolor: isDoctor ? theme.palette.primary.main : PATIENT_RED.accent,
              width: 44,
              height: 44,
              boxShadow: isDoctor ? "none" : "0 0 15px rgba(239,68,68,0.6)",
            }}
          >
            <LocalHospitalIcon />
          </Avatar>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ color: isDoctor ? "white" : PATIENT_RED.text }}
          >
            MedHive
          </Typography>
        </Box>

        {user && (
          <Typography
            variant="caption"
            sx={{ color: isDoctor ? "rgba(255,255,255,0.6)" : PATIENT_RED.textMuted }}
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
            color: isDoctor ? "#60A5FA" : PATIENT_RED.accent,
          }}
        >
          {isDoctor ? "Doctor" : "Patient"}
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
                    ? isDoctor
                      ? "rgba(59,130,246,0.2)"
                      : PATIENT_RED.activeBg
                    : "transparent",
                  color: active
                    ? isDoctor
                      ? "#60A5FA"
                      : "#FEE2E2"
                    : isDoctor
                      ? "rgba(255,255,255,0.6)"
                      : PATIENT_RED.textMuted,
                  "&:hover": {
                    bgcolor: isDoctor
                      ? "rgba(255,255,255,0.05)"
                      : PATIENT_RED.hoverBg,
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
            color: isDoctor ? "error.main" : "#FCA5A5",
            "&:hover": {
              bgcolor: isDoctor
                ? "rgba(239,68,68,0.1)"
                : "rgba(239,68,68,0.15)",
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
