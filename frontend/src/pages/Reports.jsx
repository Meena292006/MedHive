import DashboardLayout from "../components/DashboardLayout";
import { Box, Typography, Button, Card, CardContent, Stack } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/DescriptionRounded";
import DownloadIcon from "@mui/icons-material/DownloadRounded";

export default function Reports() {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <DescriptionIcon sx={{ fontSize: 40, color: "primary.main" }} />
        <Typography variant="h4" fontWeight={800}>
          Medical Reports
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ py: 8 }}>
          <Stack spacing={2} alignItems="center">
            <DescriptionIcon
              sx={{ fontSize: 90, color: "text.secondary", opacity: 0.25 }}
            />
            <Typography variant="h6" color="text.secondary">
              No reports generated yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reports will appear here once predictions are completed
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              disabled
            >
              Download Latest Report
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
