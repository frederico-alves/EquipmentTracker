// ============================================
// ENUMERATIONS
// ============================================
export enum ProductionState {
  Red = 0, // Stopped
  Yellow = 1, // Idle
  Green = 2, // Running
}

// ============================================
// INTERFACES
// ============================================
export interface Order {
  id: string;
  orderNumber: string;
  description: string;
  isCurrent: boolean;
  scheduledStart: string;
  scheduledEnd: string;
}

export interface Equipment {
  id: string;
  name: string;
  location: string;
  currentState: ProductionState;
  currentStateDisplay: string;
  updatedAt: string;
  currentOrder: Order | null;
  scheduledOrders: Order[];
}

export interface UpdateStateRequest {
  newState: ProductionState;
  changedBy: string;
  notes?: string; // Optional field
}

export interface StateHistory {
  id: string;
  equipmentId: string;
  equipmentName: string;
  previousState: ProductionState;
  previousStateDisplay: string;
  newState: ProductionState;
  newStateDisplay: string;
  changedBy: string;
  changedAt: string;
  notes?: string;
  orderNumber?: string;
  orderDescription?: string;
}

// ============================================
// API FUNCTIONS
// ============================================
const API_BASE = "/api/equipment";

export async function getAllEquipment(): Promise<Equipment[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error("Failed to fetch equipment");
  return response.json();
}

export async function updateEquipmentState(
  id: string,
  request: UpdateStateRequest
): Promise<Equipment> {
  const response = await fetch(`${API_BASE}/${id}/state`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error("Failed to update state");
  return response.json();
}

export async function getStateHistory(
  equipmentId?: string,
  from?: string,
  to?: string
): Promise<StateHistory[]> {
  const params = new URLSearchParams();
  if (equipmentId) params.append("equipmentId", equipmentId);
  if (from) params.append("from", from);
  if (to) params.append("to", to);

  const url = `${API_BASE}/history${
    params.toString() ? "?" + params.toString() : ""
  }`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch history");
  return response.json();
}
