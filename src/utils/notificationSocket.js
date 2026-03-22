import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

let stompClient = null;

export function connectNotificationSocket(userId, onMessage) {
  if (!userId) return null;

  stompClient = new Client({
    webSocketFactory: () =>  new SockJS(`${import.meta.env.VITE_API_URL}/ws-notifications`),
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
        const body = JSON.parse(message.body);
        onMessage(body);
      });
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame);
    },
    onWebSocketError: (event) => {
      console.error("WebSocket error:", event);
    },
  });

  stompClient.activate();
  return stompClient;
}

export function disconnectNotificationSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}