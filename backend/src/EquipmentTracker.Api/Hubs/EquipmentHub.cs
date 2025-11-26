// SignalR: Real-time communication
// It allows the server to push content to connected clients instantly.
// SignalR automatically negotiates the best transport available,
// falling back gracefully if WebSockets aren't supported.
using Microsoft.AspNetCore.SignalR;

namespace EquipmentTracker.Api.Hubs;

public class EquipmentHub : Hub
//                        └── Inherits from SignalR Hub base class
{
    public async Task JoinEquipmentUpdates()
    {
        // Each browser tab/connection gets a unique ID. Disconnecting and reconnecting generates a new ID.
        // Add to group
        await Groups.AddToGroupAsync(Context.ConnectionId, "EquipmentUpdates");
    }

    public async Task LeaveEquipmentUpdates()
    {
        // Remove from group
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "EquipmentUpdates");
    }
}