import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

let stompClient = null;

export function connectNotificationSocket(userId, onMessage) {
  if (!userId) return null;

  const SOCKET_URL = `${import.meta.env.VITE_API_URL}/ws-notifications`;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ WebSocket connected");

      stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
        try {
          const body = JSON.parse(message.body);
          onMessage(body);
        } catch (err) {
          console.error("❌ Error parsing message:", err);
        }
      });
    },

    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame);
    },

    onWebSocketError: (event) => {
      console.error("❌ WebSocket error:", event);
    },
  });

  stompClient.activate();
  return stompClient;
}

export function disconnectNotificationSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log("🔌 WebSocket disconnected");
  }
}