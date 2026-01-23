import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    CircularProgress,
    Tooltip,
    Box,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ variant = "icon", color = "inherit" }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            navigate("/login");
            setOpenDialog(false);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (variant === "icon") {
        return (
            <>
                <Tooltip title="Logout">
                    <IconButton
                        onClick={() => setOpenDialog(true)}
                        sx={{ color }}
                        aria-label="logout"
                    >
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>

                <Dialog open={openDialog} onClose={() => !loading && setOpenDialog(false)}>
                    <DialogTitle>Confirm Logout</DialogTitle>
                    <DialogContent>
                        Are you sure you want to logout from MedHive?
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            disabled={loading}
                            color="inherit"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLogout}
                            disabled={loading}
                            variant="contained"
                            color="error"
                            startIcon={loading ? <CircularProgress size={16} /> : <LogoutIcon />}
                        >
                            {loading ? "Logging out..." : "Logout"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    // Button variant
    return (
        <>
            <Button
                onClick={() => setOpenDialog(true)}
                variant={variant === "contained" ? "contained" : "outlined"}
                color="error"
                startIcon={<LogoutIcon />}
            >
                Logout
            </Button>

            <Dialog open={openDialog} onClose={() => !loading && setOpenDialog(false)}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    Are you sure you want to logout from MedHive?
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        disabled={loading}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogout}
                        disabled={loading}
                        variant="contained"
                        color="error"
                        startIcon={loading ? <CircularProgress size={16} /> : <LogoutIcon />}
                    >
                        {loading ? "Logging out..." : "Logout"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
