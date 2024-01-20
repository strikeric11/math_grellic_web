import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '#/assets',
        replacement: fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
      {
        find: '#/config',
        replacement: fileURLToPath(new URL('./src/config', import.meta.url)),
      },
      {
        find: '#/utils',
        replacement: fileURLToPath(new URL('./src/utils', import.meta.url)),
      },
      {
        find: '#/app',
        replacement: fileURLToPath(
          new URL('./src/features/app', import.meta.url),
        ),
      },
      {
        find: '#/core',
        replacement: fileURLToPath(
          new URL('./src/features/core', import.meta.url),
        ),
      },
      {
        find: '#/base',
        replacement: fileURLToPath(
          new URL('./src/features/base', import.meta.url),
        ),
      },
      {
        find: '#/static',
        replacement: fileURLToPath(
          new URL('./src/features/static', import.meta.url),
        ),
      },
      {
        find: '#/dashboard',
        replacement: fileURLToPath(
          new URL('./src/features/dashboard', import.meta.url),
        ),
      },
      {
        find: '#/user',
        replacement: fileURLToPath(
          new URL('./src/features/user', import.meta.url),
        ),
      },
      {
        find: '#/lesson',
        replacement: fileURLToPath(
          new URL('./src/features/lesson', import.meta.url),
        ),
      },
      {
        find: '#/exam',
        replacement: fileURLToPath(
          new URL('./src/features/exam', import.meta.url),
        ),
      },
      {
        find: '#/activity',
        replacement: fileURLToPath(
          new URL('./src/features/activity', import.meta.url),
        ),
      },
      {
        find: '#/performance',
        replacement: fileURLToPath(
          new URL('./src/features/performance', import.meta.url),
        ),
      },
      {
        find: '#/help',
        replacement: fileURLToPath(
          new URL('./src/features/help', import.meta.url),
        ),
      },
      {
        find: '#/schedule',
        replacement: fileURLToPath(
          new URL('./src/features/schedule', import.meta.url),
        ),
      },
      {
        find: '#/announcement',
        replacement: fileURLToPath(
          new URL('./src/features/announcement', import.meta.url),
        ),
      },
    ],
  },
});
