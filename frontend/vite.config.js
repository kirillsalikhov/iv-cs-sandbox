import path from 'path';
import {defineConfig} from "vite";

export default defineConfig({
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
