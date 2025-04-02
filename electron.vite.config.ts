import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

function dateFormater(date: Date) {
  return (
    date.getFullYear() +
    '.' +
    (date.getMonth() + 1) +
    '.' +
    date.getDate() +
    '.' +
    date.getHours() +
    '.' +
    date.getMinutes() +
    '.' +
    date.getSeconds()
  );
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify('v1.0.1'),
      __BUILD_DATE__: JSON.stringify(dateFormater(new Date())),
    },
  },
});
