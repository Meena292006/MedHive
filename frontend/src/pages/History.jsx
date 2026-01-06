import { useState, useEffect } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import {
    Card, CardContent, Typography, Box, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/HistoryRounded";

export default function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Fetch history from backend (Mocking for now if backend not ready, or implement backend endpoint)
        // api.get("/history").then(res => setHistory(res.data));

        // Fallback/Mock Data for UI Demo
        const mockData = [
            { date: "2025-01-06 14:30", type: "Heart Disease", result: "No Heart Disease", probability: "12%", status: "Normal" },
            { date: "2025-01-05 09:15", type: "Diabetes", result: "Diabetes Present", probability: "78%", status: "High" },
        ];
        setHistory(mockData);

        // Try to fetch real Data
        api.get("/history").then(res => {
            if (res.data && Array.isArray(res.data)) setHistory(res.data);
        }).catch(err => console.log("History endpoint not active yet"));
    }, []);

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <HistoryIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                <Typography variant="h4" fontWeight={800}> Prediction History</Typography>
            </Box>

            <Card>
                <CardContent>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date & Time</TableCell>
                                    <TableCell>Prediction Type</TableCell>
                                    <TableCell>Result</TableCell>
                                    <TableCell>Confidence</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.type}</TableCell>
                                        <TableCell>{row.result}</TableCell>
                                        <TableCell>{row.probability}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                color={row.status === "High" || row.status === "Risk" ? "error" : "success"}
                                                size="small"
                                                sx={{ fontWeight: "bold" }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {history.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No history found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
