import fs from 'fs';
import path from 'path';

// Adjust paths
const SVG_DIR = path.join(path.resolve(), 'public/svg');
const MANIFEST_FILE = path.join(path.resolve(), 'public/svg-manifest.json');

const getAllFiles = (dir, basePath = '') => {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry) => {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
            files = files.concat(getAllFiles(fullPath, relativePath));
        } else if (entry.name.endsWith('.svg')) {
            files.push(relativePath);
        }
    });

    return files;
};

const generateManifest = () => {
    const svgFiles = getAllFiles(SVG_DIR);
    const manifest = { svgs: svgFiles };

    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log(`Manifest written to ${MANIFEST_FILE}`);
};

generateManifest();