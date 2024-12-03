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
    build: {
        sourcemap: !isProduction,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: isProduction, // true, //prod true !! Set to true in production to remove console logs
            },
            output: {
                comments: !isProduction, //false, //prod false !!// Include comments in development for debugging
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