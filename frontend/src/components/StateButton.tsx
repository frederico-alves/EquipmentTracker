import { Box, IconButton, Tooltip } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";
import { ProductionState } from "../api/equipmentApi";

// ============================================
// PROPS INTERFACE
// ============================================
interface StateButtonProps {
  currentState: ProductionState;
  onStateChange: (newState: ProductionState) => void;
  disabled?: boolean;
}

// ============================================
// STATE CONFIGURATION
// ============================================
const stateConfig: Record<
  ProductionState,
  { color: string; label: string; hoverBg: string }
> = {
  [ProductionState.Red]: {
    color: "#ef4444",
    label: "Stop",
    hoverBg: "rgba(239, 68, 68, 0.1)",
  },
  [ProductionState.Yellow]: {
    color: "#f59e0b",
    label: "Idle",
    hoverBg: "rgba(245, 158, 11, 0.1)",
  },
  [ProductionState.Green]: {
    color: "#10b981",
    label: "Run",
    hoverBg: "rgba(16, 185, 129, 0.1)",
  },
};

// ============================================
// COMPONENT
// ============================================
export default function StateButton({
  currentState,
  onStateChange,
  disabled,
}: StateButtonProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        p: 0.5,
        borderRadius: 3,
        backgroundColor: "rgba(0, 0, 0, 0.03)",
      }}
    >
      {[ProductionState.Red, ProductionState.Yellow, ProductionState.Green].map(
        (state) => {
          const config = stateConfig[state];
          const isActive = currentState === state;

          return (
            <Tooltip key={state} title={config.label} arrow>
              <IconButton
                onClick={() => onStateChange(state)}
                disabled={disabled}
                sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: isActive ? config.hoverBg : "transparent",
                  border: isActive
                    ? `2px solid ${config.color}`
                    : "2px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: config.hoverBg,
                    transform: "scale(1.05)",
                  },
                  "&:disabled": {
                    opacity: 0.5,
                  },
                }}
              >
                <FiberManualRecord
                  sx={{
                    fontSize: isActive ? 24 : 20,
                    color: config.color,
                    transition: "all 0.2s ease",
                    filter: isActive
                      ? `drop-shadow(0 0 6px ${config.color})`
                      : "none",
                  }}
                />
              </IconButton>
            </Tooltip>
          );
        }
      )}
    </Box>
  );
}
