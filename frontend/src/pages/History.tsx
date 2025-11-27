import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Fade,
  Paper,
  Stack,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import HistoryTable from "../components/HistoryTable";
import {
  StateHistory,
  Equipment,
  getAllEquipment,
  getStateHistory,
} from "../api/equipmentApi";

export default function History() {
  // ============================================
  // DATA STATE
  // ============================================
  const [history, setHistory] = useState<StateHistory[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FILTER STATE (Controlled Inputs)
  // ============================================
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // ============================================
  // EFFECT 1: Load equipment list (for dropdown)
  // ============================================
  useEffect(() => {
    getAllEquipment()
      .then(setEquipment)
      .catch(() => setError("Failed to load equipment"));
  }, []);

  // ============================================
  // EFFECT 2: Load history when filters change
  // ============================================
  useEffect(() => {
    setLoading(true);
    getStateHistory(
      selectedEquipment || undefined,
      fromDate || undefined,
      toDate || undefined
    )
      .then(setHistory)
      .catch(() => setError("Failed to load history"))
      .finally(() => setLoading(false));
  }, [selectedEquipment, fromDate, toDate]);

  return (
    <Fade in timeout={400}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: "text.primary", mb: 0.5 }}>
            State History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and analyze equipment state changes over time
          </Typography>
        </Box>

        {/* Filter Bar */}
        <Paper
          sx={{
            p: 2.5,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ color: "text.secondary" }}
          >
            <FilterList sx={{ fontSize: 20 }} />
            <Typography variant="body2" fontWeight={500}>
              Filters
            </Typography>
          </Stack>

          {/* Equipment Dropdown */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Equipment</InputLabel>
            <Select
              value={selectedEquipment}
              label="Equipment"
              onChange={(e) => setSelectedEquipment(e.target.value)}
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
            >
              <MenuItem value="">All Equipment</MenuItem>
              {equipment.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "40vh",
            }}
          >
            <CircularProgress size={32} sx={{ color: "secondary.main" }} />
          </Box>
        ) : history.length === 0 ? (
          /* Empty State */
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(20px)",
            }}
          >
            <Typography color="text.secondary">
              No history records found for the selected filters
            </Typography>
          </Paper>
        ) : (
          /* Data Table */
          <HistoryTable history={history} />
        )}
      </Box>
    </Fade>
  );
}
