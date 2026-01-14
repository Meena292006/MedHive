import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Box, Button, useTheme
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import FavoriteIcon from "@mui/icons-material/FavoriteRounded";
import WaterDropIcon from "@mui/icons-material/WaterDropRounded";
import ScienceIcon from "@mui/icons-material/ScienceRounded";
import DescriptionIcon from "@mui/icons-material/DescriptionRounded";
import HistoryIcon from "@mui/icons-material/HistoryRounded";
import AnalyticsIcon from "@mui/icons-material/AnalyticsRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 280;

const patientMenu = [
  { text: "Home", icon: <DashboardIcon />, path: "/patient" },
  { text: "Heart Analysis", icon: <FavoriteIcon />, path: "/patient/heart" },
  { text: "Diabetes Check", icon: <WaterDropIcon />, path: "/patient/diabetes" },
  { text: "Liver Analysis", icon: <ScienceIcon />, path: "/patient/liver" },
  { text: "ECG Scan", icon: <FavoriteIcon />, path: "/patient/ecg" },
  { text: "Medical Reports", icon: <DescriptionIcon />, path: "/patient/reports" },
  { text: "History", icon: <HistoryIcon />, path: "/patient/history" },
];

const doctorMenu = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/doctor" },
  { text: "Analytics", icon: <AnalyticsIcon />, path: "/doctor/analytics" },
  { text: "Patient Cases", icon: <HistoryIcon />, path: "/doctor/cases" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const role = localStorage.getItem("role") || "patient";
  const menuItems = role === "doctor" ? doctorMenu : patientMenu;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          borderRight: "none",
        },
      }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight={800}>MedHive</Typography>
        <Typography variant="caption">{role.toUpperCase()}</Typography>
      </Box>

      <List sx={{ px: 2 }}>
        {menuItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? theme.palette.primary.main : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: active ? "#fff" : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    color: active ? "#fff" : "text.secondary",
                    fontWeight: active ? 700 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}
