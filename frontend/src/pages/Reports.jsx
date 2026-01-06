import DashboardLayout from "../components/DashboardLayout";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/DescriptionRounded";
import DownloadIcon from "@mui/icons-material/DownloadRounded";

export default function Reports() {
    return (
        <DashboardLayout>
            <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <DescriptionIcon sx={{ fontSize: 40, color: "primary.main" }} />
                <Typography variant="h4" fontWeight={800}> Medical Reports</Typography>
            </Box>

            <Card>
                <CardContent sx={{ textAlign: "center", py: 10 }}>
                    <DescriptionIcon sx={{ fontSize: 80, color: "text.secondary", opacity: 0.2, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No reports generated yet.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Run a prediction to generate a comprehensive health report.
                    </Typography>
                    <Button variant="outlined" startIcon={<DownloadIcon />} disabled>
                        Export Data as PDF
                    </Button>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
