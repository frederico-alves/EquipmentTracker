import { Card, CardContent, Typography, Box, Chip, Stack } from "@mui/material";
import {
  LocationOn,
  AccessTime,
  Assignment,
  Schedule,
} from "@mui/icons-material";
import { Equipment, ProductionState } from "../api/equipmentApi";
import StateButton from "./StateButton";

// ============================================
// PROPS INTERFACE
// ============================================
interface EquipmentCardProps {
  equipment: Equipment;
  onStateChange: (equipmentId: string, newState: ProductionState) => void;
  updating?: boolean;
}

// ============================================
// STATE CONFIGURATION
// ============================================
const stateConfig: Record<
  ProductionState,
  { color: string; bg: string; label: string }
> = {
  [ProductionState.Red]: {
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)",
    label: "Stopped",
  },
  [ProductionState.Yellow]: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    label: "Idle",
  },
  [ProductionState.Green]: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    label: "Running",
  },
};

// ============================================
// COMPONENT
// ============================================
export default function EquipmentCard({
  equipment,
  onStateChange,
  updating,
}: EquipmentCardProps) {
  const config = stateConfig[equipment.currentState];

  // Helper function to format relative time
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString();
  };

  // Helper function to format scheduled time range
  const formatSchedule = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Colored Status Bar */}
      <Box
        sx={{
          position: "absolute",
          top: -1,
          left: 24,
          right: 24,
          height: 3,
          borderRadius: "0 0 4px 4px",
          backgroundColor: config.color,
        }}
      />

      <CardContent sx={{ flex: 1, pt: 3 }}>
        {/* Header: Name + Status Chip */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2.5,
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
            {equipment.name}
          </Typography>
          <Chip
            label={config.label}
            size="small"
            sx={{
              backgroundColor: config.bg,
              color: config.color,
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 24,
              minWidth: 70,
              justifyContent: "center",
            }}
          />
        </Box>

        {/* Location & Last Updated */}
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {equipment.location}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(equipment.updatedAt)}
            </Typography>
          </Box>
        </Stack>

        {/* Current Order (Conditional Rendering) */}
        {equipment.currentOrder && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: config.bg,
              border: `1px solid ${config.color}33`,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}
            >
              <Assignment sx={{ fontSize: 14, color: config.color }} />
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: config.color }}
              >
                CURRENT ORDER
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {equipment.currentOrder.orderNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {equipment.currentOrder.description}
            </Typography>
          </Box>
        )}

        {/* Scheduled Orders (Conditional Rendering) */}
        {equipment.scheduledOrders && equipment.scheduledOrders.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}
            >
              <Schedule sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "text.secondary" }}
              >
                SCHEDULED ({equipment.scheduledOrders.length})
              </Typography>
            </Box>
            <Stack spacing={0.5}>
              {equipment.scheduledOrders.slice(0, 2).map((order) => (
                <Box key={order.id} sx={{ pl: 2.5 }}>
                  <Typography variant="caption" fontWeight={500}>
                    {order.orderNumber}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    {formatSchedule(order.scheduledStart, order.scheduledEnd)}
                  </Typography>
                </Box>
              ))}
              {equipment.scheduledOrders.length > 2 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ pl: 2.5 }}
                >
                  +{equipment.scheduledOrders.length - 2} more
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* State Change Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
            borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <StateButton
            currentState={equipment.currentState}
            onStateChange={(newState) => onStateChange(equipment.id, newState)}
            disabled={updating}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
