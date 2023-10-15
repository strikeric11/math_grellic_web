const url = import.meta.env.VITE_WS_BASE_URL;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

export function createSocket(namespace?: string) {
  // Get token from localstorage
  const token = JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}') || {};
  const { access_token: accessToken } = token;
  const query = accessToken ? { token: accessToken } : {};

  return [
    namespace ? `${url}/${namespace}` : url,
    {
      query,
      transports: ['websocket', 'polling'],
    },
  ];
}
