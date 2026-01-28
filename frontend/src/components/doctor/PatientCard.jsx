import { Card, CardContent, Typography, Box, Chip, Divider, Avatar, Stack, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/PersonRounded";
import { motion } from "framer-motion";

import { useTheme } from "@mui/material";

export default function PatientCard({ patientCase, onViewReport }) {
    const theme = useTheme();
    const getPriorityColor = (p) => (p === "HIGH" ? "error" : "success");

    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Card
                sx={{
                    borderRadius: 4,
                    borderLeft: `6px solid ${patientCase.priority === "HIGH" ? theme.palette.error.main : theme.palette.success.main}`,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "all .25s",
                    "&:hover": {
                        boxShadow: `0 18px 45px ${theme.palette.shadow}`,
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between" mb={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.light,
                                    color: "primary.main",
                                    boxShadow: `0 8px 20px ${theme.palette.shadow}`,
                                }}
                            >
                                <PersonIcon />
                            </Avatar>

                            <Box>
                                <Typography fontWeight={700} noWrap sx={{ maxWidth: 150 }}>
                                    {patientCase.patient_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Case #{patientCase.id}
                                </Typography>
                            </Box>
                        </Stack>

                        <Chip
                            label={patientCase.priority}
                            color={getPriorityColor(patientCase.priority)}
                            size="small"
                            sx={{ fontWeight: 800, height: 24, borderRadius: 1 }}
                        />
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                        Symptoms
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                        {JSON.parse(patientCase.symptoms || "[]").slice(0, 3).map((s, i) => (
                            <Chip
                                key={i}
                                label={s}
                                size="small"
                                sx={{ bgcolor: theme.palette.primary.light, fontWeight: 500, fontSize: "0.65rem", borderRadius: 1 }}
                            />
                        ))}
                        {JSON.parse(patientCase.symptoms || "[]").length > 3 && (
                            <Typography variant="caption" sx={{ alignSelf: "center", ml: 0.5 }}>...</Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            mt: 2,
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: theme.palette.background.default,
                            border: `1px dashed ${theme.palette.divider}`
                        }}
                    >
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                            AI Prediction
                        </Typography>

                        {JSON.parse(patientCase.predictions || "[]").slice(0, 1).map((p, i) => (
                            <Stack key={i} direction="row" justifyContent="space-between" mt={0.5}>
                                <Typography variant="body2" fontWeight={600} noWrap>
                                    {p.disease || p.label}
                                </Typography>
                                <Typography variant="body2" fontWeight={800} color="primary.main">
                                    {p.probability}%
                                </Typography>
                            </Stack>
                        ))}
                    </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={() => onViewReport(patientCase)}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        View Full Report
                    </Button>
                </Box>
            </Card>
        </motion.div>
    );
}
