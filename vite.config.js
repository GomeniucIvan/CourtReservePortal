import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as dotenv from 'dotenv';

dotenv.config();
let appUrl = process.env.VITE_APP_URL;
let backendUrl = process.env.VITE_BACKEND_URL;
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction){
    appUrl = 'http://localhost:2129/';
    backendUrl = 'https://localhost:7130/';
}

export default defineConfig({
    plugins: [react()],
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: false, // true, //prod true
            },
            output: {
                comments: true, //false, //prod false
            },
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: isProduction
            ? {}
            : {
                '/app': {
                    target: appUrl,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/app/, ''),
                },
                '/api': {
                    target: backendUrl,
                    changeOrigin: true,
                    secure: false,
                },
            },
    },
})