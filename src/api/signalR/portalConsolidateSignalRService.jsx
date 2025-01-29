import * as signalR from "@microsoft/signalr";

// Create a connection to the SignalR hub
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/app/schedulerConsolidatedViewHub", {
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

const startConnection = async (orgId) => {
    try {
        await hubConnection.start();
        console.log("SignalR Connected to Scheduler Hub");

        // Call the server function to start tracking
        await hubConnection.invoke("startTracking", orgId);
    } catch (err) {
        console.error("SignalR Connection Error:", err);
        setTimeout(() => startConnection(orgId), 5000); // Retry connection
    }
};

// Expose the connection and start function
export { hubConnection, startConnection };