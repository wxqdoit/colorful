import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
 plugins: [react(), tailwindcss()],
 resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
 server: {host:'127.0.0.1',port:5186,strictPort:true},
 test: {environment:'jsdom',include:['test/**/*.test.{ts,tsx}'],restoreMocks:true},
 build: {rollupOptions:{output:{manualChunks(id){if(id.includes('/dist/catalog.'))return 'catalog';if(id.includes('/node_modules/react-dom/'))return 'react-dom';}}}}
});
