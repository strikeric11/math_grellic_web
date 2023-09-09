import ky from 'ky';

const prefixUrl = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

export const kyInstance = ky.extend({
  prefixUrl,
  hooks: {
    beforeRequest: [
      (options) => {
        // Get token from localstorage
        const token = JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}') || {};
        const { access_token: accessToken } = token;
        // If token is present then add authorization to header
        if (accessToken) {
          options.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [],
  },
});
