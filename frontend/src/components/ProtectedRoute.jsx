import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ allowedRole }) => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && role !== allowedRole) {
        // Redirect role mismatch
        return <Navigate to={role === 'doctor' ? '/doctor' : '/patient'} replace />;
    }

    return <Outlet />;
};

export const DoctorRoute = () => <ProtectedRoute allowedRole="doctor" />;
export const PatientRoute = () => <ProtectedRoute allowedRole="patient" />;

export default ProtectedRoute;
