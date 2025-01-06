import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();
let appUrl = process.env.VITE_APP_URL;
let backendUrl = process.env.VITE_BACKEND_URL;
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction){
    appUrl = 'http://localhost:2129/';
    backendUrl = 'https://localhost:7130/';
}

let enableDebug = !isProduction;

//enableDebug = true;

export default defineConfig({
    plugins: [
        react(),

        // Custom plugin to modify asset paths in index.html
        {
            name: 'modify-html-assets-path',
            enforce: 'post',
            apply: 'build',
            transformIndexHtml: {
                enforce: 'post',
                transform(html) {
                    // Replace asset paths in the HTML
                    return html.replace(
                        /(src|href)="\/assets\//g,
                        '$1="../ClientApp/dist/assets/'
                    );
                },
            },
        },
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@portal': path.resolve(__dirname, './src/pages/portal'),
        },
    },
    build: {
        sourcemap: enableDebug,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: !enableDebug, // true, //prod true !! Set to true in production to remove console logs
            },
            output: {
                comments: enableDebug, //false, //prod false !!// Include comments in development for debugging
            },
        },
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id
                            .toString()
                            .split('node_modules/')[1]
                            .split('/')[0]
                            .toString();
                    }
                },
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