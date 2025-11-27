import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Equipment } from "../api/equipmentApi";

export function useSignalR(onEquipmentChanged: (equipment: Equipment) => void) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);

  // ============================================
  // EFFECT 1: Create the connection (once)
  // ============================================
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("/hubs/equipment")
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConnection(newConnection);

    // Cleanup: stop connection when component unmounts
    return () => {
      newConnection.stop();
    };
  }, []);

  // ============================================
  // EFFECT 2: Start connection & subscribe to events
  // ============================================
  useEffect(() => {
    if (!connection) return;

    // Register event handler
    connection.on("EquipmentStateChanged", (equipment: Equipment) => {
      onEquipmentChanged(equipment);
    });

    // Start the connection
    connection
      .start()
      .then(() => {
        setIsConnected(true);
        return connection.invoke("JoinEquipmentUpdates");
      })
      .catch((err) => {
        console.error("SignalR connection error:", err);
        setIsConnected(false);
      });

    // Handle reconnection events
    connection.onreconnecting(() => {
      setIsConnected(false);
    });

    connection.onreconnected(() => {
      setIsConnected(true);
      connection.invoke("JoinEquipmentUpdates");
    });

    connection.onclose(() => {
      setIsConnected(false);
    });

    // Cleanup: remove event handler
    return () => {
      connection.off("EquipmentStateChanged");
    };
  }, [connection, onEquipmentChanged]);

  return { isConnected };
}
