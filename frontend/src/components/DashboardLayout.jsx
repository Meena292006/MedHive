import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    ml: 0, // Sidebar is fixed, but flex layout handles it
                    transition: "margin 0.3s",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
