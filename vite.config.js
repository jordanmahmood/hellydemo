import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            usePolling: true,
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, './index.html'),
            },
                },
            },


});