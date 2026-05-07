import react from '@vitejs/plugin-react';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      ...(env.ANALYZE ? [analyzer()] : []),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          quietDeps: true,
          silenceDeprecations: [
            'legacy-js-api',
            'import',
            'global-builtin',
            'color-functions',
            'if-function',
          ],
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('origin', env.VITE_API_URL);
            });
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
