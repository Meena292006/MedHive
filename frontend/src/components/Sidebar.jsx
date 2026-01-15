import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Box, Button, useTheme, Avatar
} from "@mui/material";
import { motion } from "framer-motion";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import FavoriteIcon from "@mui/icons-material/FavoriteRounded";
import WaterDropIcon from "@mui/icons-material/WaterDropRounded";
import ScienceIcon from "@mui/icons-material/ScienceRounded";
import DescriptionIcon from "@mui/icons-material/DescriptionRounded";
import HistoryIcon from "@mui/icons-material/HistoryRounded";
import AnalyticsIcon from "@mui/icons-material/AnalyticsRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import LocalHospitalIcon from "@mui/icons-material/LocalHospitalRounded";
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
        position: "relative",
        zIndex: 10,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          borderRight: "none",
          background: `linear-gradient(180deg, #0f172a 0%, #1e293b 100%)`,
          color: "white",
          boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 10,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ p: 4, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 48,
                height: 48,
                boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
              }}
            >
              <LocalHospitalIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={900} sx={{ color: "white" }}>
                MedHive
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                {role}
              </Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>

      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item, index) => {
          const active = location.pathname === item.path;
          return (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 3,
                    bgcolor: active
                      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      : "transparent",
                    background: active
                      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      : "transparent",
                    color: active ? "white" : "rgba(255,255,255,0.7)",
                    py: 1.5,
                    "&:hover": {
                      bgcolor: active ? theme.palette.primary.dark : "rgba(255,255,255,0.1)",
                      transform: "translateX(5px)",
                    },
                    transition: "all 0.2s",
                    position: "relative",
                    "&::before": active
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 4,
                          height: "60%",
                          background: theme.palette.secondary.main,
                          borderRadius: "0 4px 4px 0",
                        }
                      : {},
                  }}
                >
                  <ListItemIcon sx={{ color: active ? "white" : "rgba(255,255,255,0.7)", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      color: active ? "white" : "rgba(255,255,255,0.7)",
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            sx={{
              color: "rgba(255,255,255,0.8)",
              py: 1.5,
              borderRadius: 3,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
                color: "white",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </motion.div>
    </Drawer>
  );
}
