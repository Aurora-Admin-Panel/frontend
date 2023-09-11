// websocketManager.ts

type MessageEventListener = (event: MessageEvent) => void;

let websocket: WebSocket | null = null;
let websocketUrl: string | null = null;
let listeners: Array<MessageEventListener> = [];
let reconnectTimeoutId: number | null = null;
const maxReconnectAttempts = 5;
let reconnectAttempts = 0;
const initialReconnectDelay = 1000; // 1 second
let token: string | null = null;

const connect = (): void => {
  if (reconnectTimeoutId) {
    clearTimeout(reconnectTimeoutId);
    reconnectTimeoutId = null;
  }

  if (websocketUrl) {
    websocket = new WebSocket(websocketUrl);

    websocket.addEventListener('open', handleOpen);
    websocket.addEventListener('close', handleClose);
    websocket.addEventListener('error', handleError);
  }
};

const handleOpen = (): void => {
  reconnectAttempts = 0;

  // Send the token through the WebSocket connection
  if (token) {
    websocket?.send(token);
    listeners.forEach((listener) => {
      websocket?.addEventListener('message', listener);
    });
  }
};

const handleClose = (): void => {
  if (reconnectAttempts < maxReconnectAttempts) {
    const reconnectDelay = initialReconnectDelay * (2 ** reconnectAttempts);
    reconnectAttempts += 1;
    reconnectTimeoutId = setTimeout(() => {
      connect();
    }, reconnectDelay);
  }
};

const handleError = (): void => {
  // You can handle WebSocket errors here if needed
};

const getWebSocketUrl = (): string => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  const path = 'api/ws'; // Update with your WebSocket path
  return `${protocol}//${host}/${path}`;
};

// Initialize the WebSocket connection
export const initializeWebSocket = (authToken: string): void => {
  token = authToken;
  websocketUrl = getWebSocketUrl();

  if (!websocket || websocket.readyState === WebSocket.CLOSED) {
    connect();
  }
};

// Close the WebSocket connection
export const closeWebSocket = (): void => {
  if (websocket) {
    websocket.removeEventListener('open', handleOpen);
    websocket.removeEventListener('close', handleClose);
    websocket.removeEventListener('error', handleError);

    websocket.close();
  }
};

// Send a message over the WebSocket connection
export const sendMessage = (message: string): void => {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(message);
  }
};

// Add a listener for incoming messages
export const addMessageListener = (callback: MessageEventListener): void => {
  if (websocket) {
    listeners.push(callback);
    websocket.addEventListener('message', callback);
  }
};

// Remove a listener for incoming messages
export const removeMessageListener = (callback: MessageEventListener): void => {
  if (websocket) {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
    websocket.removeEventListener('message', callback);
  }
};
