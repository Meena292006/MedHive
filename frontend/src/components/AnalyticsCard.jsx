import { Card, CardContent, Typography, Box, Avatar, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function StatCard({ label, value, icon, color, delay = 0, trend, trendValue }) {
  const theme = useTheme();
  
  // Convert hex color to rgba for opacity
  const hexToRgba = (hex, alpha) => {
    if (!hex || typeof hex !== 'string') return `rgba(67, 24, 255, ${alpha})`;
    try {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch (e) {
      return `rgba(67, 24, 255, ${alpha})`;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <Card
        sx={{
          height: "100%",
          borderRadius: 4,
          background: `linear-gradient(135deg, ${hexToRgba(color, 0.15)}, ${hexToRgba(color, 0.05)})`,
          border: `1px solid ${hexToRgba(color, 0.3)}`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${color}, ${hexToRgba(color, 0.8)})`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                {label}
              </Typography>
              <Typography variant="h3" fontWeight={900} sx={{ mt: 1, color: color }}>
                {value}
              </Typography>
              {trend && (
                <Typography variant="caption" sx={{ mt: 0.5, color: trend === "up" ? "success.main" : "error.main", display: "flex", alignItems: "center", gap: 0.5 }}>
                  {trend === "up" ? "↑" : "↓"} {trendValue}
                </Typography>
              )}
            </Box>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Avatar
                sx={{
                  bgcolor: color || theme.palette.primary.main,
                  width: 64,
                  height: 64,
                  boxShadow: `0 10px 30px ${hexToRgba(color || theme.palette.primary.main, 0.4)}`,
                }}
              >
                {icon}
              </Avatar>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TrendChart({ data, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={`url(#gradient-${color})`}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PieChartCard({ data, colors, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
