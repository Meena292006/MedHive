import {
  Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Button, Box
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const DRAWER_WIDTH = 260;

export default function PatientSidebar() {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          backgroundColor: "#7F1D1D", // Dark burgundy red
          color: "#F87171", // Soft rose red
          borderRight: "1px solid rgba(185, 28, 28, 0.3)",
        },
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/patient")}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.3)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#F87171' }}><DashboardIcon /></ListItemIcon>
            <ListItemText primary="My Dashboard" sx={{ '& .MuiTypography-root': { color: '#F87171' } }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/patient/diagnosis")}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.3)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#F87171' }}><PsychologyIcon /></ListItemIcon>
            <ListItemText primary="AI Diagnosis" sx={{ '& .MuiTypography-root': { color: '#F87171' } }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{ color: "#ef4444" }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}
