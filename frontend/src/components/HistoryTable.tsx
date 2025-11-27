import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import {
  TrendingFlat,
  Person,
  Schedule,
  Assignment,
} from "@mui/icons-material";
import { StateHistory, ProductionState } from "../api/equipmentApi";

interface HistoryTableProps {
  history: StateHistory[];
}

const stateConfig: Record<ProductionState, { color: string; bg: string }> = {
  [ProductionState.Red]: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
  [ProductionState.Yellow]: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  [ProductionState.Green]: { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
};

export default function HistoryTable({ history }: HistoryTableProps) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 4,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Equipment</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>
              State Transition
            </TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Order</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Changed By</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Time</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((row) => {
            const prevConfig = stateConfig[row.previousState];
            const newConfig = stateConfig[row.newState];

            return (
              <TableRow
                key={row.id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.04)" },
                  transition: "background-color 0.2s ease",
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {row.equipmentName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={row.previousStateDisplay}
                      size="small"
                      sx={{
                        backgroundColor: prevConfig.bg,
                        color: prevConfig.color,
                        fontWeight: 500,
                      }}
                    />
                    <TrendingFlat
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                    <Chip
                      label={row.newStateDisplay}
                      size="small"
                      sx={{
                        backgroundColor: newConfig.bg,
                        color: newConfig.color,
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  {row.orderNumber ? (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                    >
                      <Assignment sx={{ fontSize: 16, color: "#6366f1" }} />
                      <Typography variant="body2" sx={{ color: "#6366f1" }}>
                        {row.orderNumber}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                  >
                    <Person sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {row.changedBy}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                  >
                    <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(row.changedAt)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.notes || "—"}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
