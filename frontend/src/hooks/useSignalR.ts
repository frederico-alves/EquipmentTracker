import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { Equipment } from "../api/equipmentApi";

export function useSignalR(onEquipmentChanged: (equipment: Equipment) => void) {
  const [isConnected, setIsConnected] = useState(navigator.onLine);

  // Keep callback ref updated so effect can use latest without re-running
  const callbackRef = useRef(onEquipmentChanged);
  useEffect(() => {
    callbackRef.current = onEquipmentChanged;
  });

  // Detect browser online/offline status
  useEffect(() => {
    const goOnline = () => setIsConnected(true);
    const goOffline = () => setIsConnected(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/hubs/equipment")
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // Listen for equipment updates from server
    connection.on("EquipmentStateChanged", (equipment: Equipment) => {
      callbackRef.current(equipment);
    });

    // Track connection state for Live/Offline indicator
    connection.onreconnecting(() => setIsConnected(false));
    connection.onreconnected(() => {
      setIsConnected(true);
      connection.invoke("JoinEquipmentUpdates").catch(console.error);
    });
    connection.onclose(() => setIsConnected(false));

    // Start connection and join updates group
    connection
      .start()
      .then(() => {
        setIsConnected(true);
        return connection.invoke("JoinEquipmentUpdates");
      })
      .catch(() => setIsConnected(false));

    // Stop the SignalR connection when Dashboard is no longer displayed
    // On History page, the connection is not used
    // Lift SignalR connection management to App.tsx if needed globally
    // Or use `connection.off("EquipmentStateChanged", handleUpdate);` instead
    return () => {
      connection.stop();
    };
  }, []);

  return { isConnected };
}
