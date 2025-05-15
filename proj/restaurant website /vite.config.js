import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@static': path.resolve(__dirname, './public/static')
      }
    },
    server: {
      port: parseInt(env.FRONTEND_PORT || 5173),
      proxy: {
        '/api': {
          target: `http://localhost:${env.BACKEND_PORT || 5001}`,
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      assetsDir: 'static',
      rollupOptions: {
        output: {
          assetFileNames: 'static/[name].[hash][extname]'
        }
      }
    }
  };
});