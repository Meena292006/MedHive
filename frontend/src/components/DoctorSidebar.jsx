import {
  Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Button, Box, Avatar,
  Typography, Divider, Chip, Badge
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HistoryIcon from "@mui/icons-material/History";
import WarningIcon from "@mui/icons-material/Warning";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const DRAWER_WIDTH = 280;

export default function DoctorSidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { icon: DashboardIcon, label: "Dashboard", path: "/doctor", color: theme.palette.primary.main },
    { icon: PeopleIcon, label: "Patient List", path: "/doctor/patients", color: theme.palette.secondary.main },
    { icon: WarningIcon, label: "Symptom Alerts", path: "/doctor/alerts", color: theme.palette.error.main, badge: 3 },
    { icon: AnalyticsIcon, label: "Reports", path: "/doctor/reports", color: theme.palette.warning.main },
    { icon: EventNoteIcon, label: "Appointments", path: "/doctor/appointments", color: theme.palette.success.main },
    { icon: MessageIcon, label: "Messages", path: "/doctor/messages", color: theme.palette.info.main, badge: 2 },
    { icon: PersonIcon, label: "Profile", path: "/doctor/profile", color: theme.palette.primary.light }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          background: "linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
          color: "#F8FAFC",
          boxShadow: "4px 0 32px rgba(0, 0, 0, 0.4)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      {/* Doctor Profile Section */}
      <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              bgcolor: "rgba(14, 165, 233, 0.2)",
              border: "2px solid #0EA5E9",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#0EA5E9"
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "D"}
          </Avatar>
        </motion.div>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: "#F8FAFC" }}>
          Dr. {user?.name || "John Doe"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 2, color: "#CBD5E1" }}>
          Cardiologist & Internal Medicine
        </Typography>
        <Chip
          label="● Active"
          size="small"
          sx={{
            bgcolor: "rgba(16, 185, 129, 0.2)",
            color: "#10B981",
            fontWeight: 500,
            border: "1px solid rgba(16, 185, 129, 0.3)"
          }}
        />
      </Box>

      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 2,
                  position: 'relative',
                  '&:hover': {
                    bgcolor: `rgba(${item.color.slice(1, 3)}, ${item.color.slice(3, 5)}, ${item.color.slice(5, 7)}, 0.1)`,
                    transform: 'translateX(8px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& .MuiListItemIcon-root': {
                      transform: 'scale(1.1)',
                      filter: `drop-shadow(0 0 8px ${item.color}40)`
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: '60%',
                      background: `linear-gradient(180deg, ${item.color}, ${item.color}80)`,
                      borderRadius: '0 2px 2px 0',
                      boxShadow: `0 0 12px ${item.color}60`
                    }
                  }
                }}
              >
                <ListItemIcon sx={{
                  color: item.color,
                  minWidth: 40,
                  transition: 'all 0.3s ease'
                }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error" sx={{
                      '& .MuiBadge-badge': {
                        background: theme.palette.error.main,
                        color: 'white',
                        fontSize: '0.7rem',
                        minWidth: 16,
                        height: 16
                      }
                    }}>
                      <item.icon sx={{ fontSize: 24 }} />
                    </Badge>
                  ) : (
                    <item.icon sx={{ fontSize: 24 }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    color: "#CBD5E1"
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 2 }} />
        <Button
          fullWidth
          startIcon={<LogoutIcon sx={{ color: "#FCA5A5" }} />}
          onClick={logout}
          sx={{
            color: "#FCA5A5",
            border: "1px solid rgba(252, 165, 165, 0.3)",
            borderRadius: 3,
            py: 1.5,
            fontWeight: 500,
            backdropFilter: "blur(10px)",
            background: theme.palette.error.light,
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              borderColor: "#FCA5A5",
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.2)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}
