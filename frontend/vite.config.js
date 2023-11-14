import path from 'path';
import {defineConfig} from "vite";
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    root: path.join(__dirname, 'src'),
    assetsInclude: [
        /\.wenv$/,
        /\.gltf$/
    ],
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.wenv': 'dataurl',
                '.gltf': 'dataurl'
            }
        }
    }
});
