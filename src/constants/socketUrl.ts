import "dotenv/config";

const getSocketUrl = () => {
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/";

  // Replace http(s) with ws(s)
  if (baseUrl.startsWith("https://")) {
    baseUrl = baseUrl.replace("https://", "wss://");
  } else if (baseUrl.startsWith("http://")) {
    baseUrl = baseUrl.replace("http://", "ws://");
  } else if (!baseUrl.startsWith("ws://") && !baseUrl.startsWith("wss://")) {
    baseUrl = `ws://${baseUrl}`;
  }

  // Remove trailing slash to standardize
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  // Append the websocket path
  // If baseUrl ends with /v1, just append /ws/notifications/
  // Otherwise append /v1/ws/notifications/
  if (baseUrl.endsWith("/v1")) {
    return `${baseUrl}/ws/`;
  }

  return `${baseUrl}/v1/ws/`;
};

export const socketUrl = getSocketUrl();
