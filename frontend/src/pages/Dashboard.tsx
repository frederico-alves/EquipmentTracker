import { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Box,
  Chip,
  Fade,
} from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";
import EquipmentCard from "../components/EquipmentCard";
import {
  Equipment,
  ProductionState,
  getAllEquipment,
  updateEquipmentState,
} from "../api/equipmentApi";
import { useSignalR } from "../hooks/useSignalR";

export default function Dashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ============================================
  // REAL-TIME UPDATE HANDLER
  // ============================================
  // CRITICAL: Wrap in useCallback to prevent infinite re-renders!
  const handleEquipmentUpdate = useCallback((updatedEquipment: Equipment) => {
    setEquipment((prev) =>
      prev.map((e) => (e.id === updatedEquipment.id ? updatedEquipment : e))
    );
  }, []);

  // Connect to SignalR hub
  const { isConnected } = useSignalR(handleEquipmentUpdate);

  // ============================================
  // INITIAL DATA FETCH
  // ============================================
  useEffect(() => {
    getAllEquipment()
      .then(setEquipment)
      .catch(() => setError("Failed to load equipment"))
      .finally(() => setLoading(false));
  }, []);

  // ============================================
  // STATE CHANGE HANDLER
  // ============================================
  const handleStateChange = async (
    equipmentId: string,
    newState: ProductionState
  ) => {
    setUpdating(equipmentId);
    try {
      const updated = await updateEquipmentState(equipmentId, {
        newState,
        changedBy: "Worker",
        notes: undefined,
      });
      handleEquipmentUpdate(updated);
      setSuccess("State updated successfully");
    } catch {
      setError("Failed to update state");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={32} sx={{ color: "secondary.main" }} />
      </Box>
    );
  }

  return (
    <Fade in timeout={400}>
      <Box sx={{ px: { xs: 1, sm: 0 } }}>
        {/* Header with Live Indicator */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 0 },
            mb: { xs: 3, sm: 4 },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "text.primary",
                mb: 0.5,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
              }}
            >
              Equipment Dashboard
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Monitor and manage your equipment states in real-time
            </Typography>
          </Box>

          {/* Connection Status Indicator */}
          <Chip
            icon={
              <FiberManualRecord
                sx={{
                  fontSize: 12,
                  color: `${isConnected ? "#22c55e" : "#ef4444"} !important`,
                  animation: isConnected
                    ? "pulse 2s infinite"
                    : "blink 1s infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.3 },
                  },
                }}
              />
            }
            label={isConnected ? "Live" : "Offline"}
            sx={{
              backgroundColor: isConnected
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
              color: isConnected ? "#16a34a" : "#dc2626",
              border: isConnected
                ? "1px solid rgba(34, 197, 94, 0.3)"
                : "1px solid rgba(239, 68, 68, 0.3)",
              fontWeight: 600,
              px: 1,
            }}
          />
        </Box>

        {/* Equipment Grid */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {equipment.map((e, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={e.id}>
              <Fade in timeout={400 + index * 100}>
                <Box>
                  <EquipmentCard
                    equipment={e}
                    onStateChange={handleStateChange}
                    updating={updating === e.id}
                  />
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Snackbars */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ borderRadius: 3 }}
          >
            {error}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!success}
          autoHideDuration={3000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="info"
            onClose={() => setSuccess(null)}
            sx={{ borderRadius: 3 }}
          >
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
}
