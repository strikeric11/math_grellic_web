import { io } from 'socket.io-client';

const url = import.meta.env.VITE_WS_BASE_URL;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

// export const socket = io(url);
export const socket = io(url, {
  query: getToken(),
  transports: ['websocket', 'polling'],
});

function getToken() {
  // Get token from localstorage
  const token = JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}') || {};
  const { access_token: accessToken } = token;
  return accessToken ? { token: accessToken } : {};
}
