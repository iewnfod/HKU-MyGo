import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../');
const nodesPath = path.join(rootDir, 'data/nodes.json');
const pathsPath = path.join(rootDir, 'data/paths.json');
const localesDir = path.join(rootDir, 'data/locales');

function readJson(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (!data.trim()) return {};
        return JSON.parse(data);
    }
    return {};
}

function validateLocales() {
    const nodesData = readJson(nodesPath);
    const pathsData = readJson(pathsPath);

    const nodes = nodesData.nodes || [];
    const paths = pathsData.paths || [];

    const localeFiles = ['en_us.json', 'zh_cn.json', 'zh_hk.json'];

    let hasError = false;

    for (const file of localeFiles) {
        const localePath = path.join(localesDir, file);
        const localeObj = readJson(localePath);

        // Validate nodes
        for (const node of nodes) {
            const nameKey = `map.nodes.${node.uid}.name`;
            const descKey = `map.nodes.${node.uid}.description`;

            if (!localeObj.hasOwnProperty(nameKey)) {
                console.error(`[Error] Missing key "${nameKey}" in ${file}`);
                hasError = true;
            }
            if (!localeObj.hasOwnProperty(descKey)) {
                console.error(`[Error] Missing key "${descKey}" in ${file}`);
                hasError = true;
            }
        }

        // Validate paths
        for (const p of paths) {
            const nameKey = `map.paths.${p.uid}.name`;
            const descKey = `map.paths.${p.uid}.description`;

            if (!localeObj.hasOwnProperty(nameKey)) {
                console.error(`[Error] Missing key "${nameKey}" in ${file}`);
                hasError = true;
            }
            if (!localeObj.hasOwnProperty(descKey)) {
                console.error(`[Error] Missing key "${descKey}" in ${file}`);
                hasError = true;
            }
        }
    }

    if (hasError) {
        console.error('Locale validation failed. Run "locales:update" to add missing keys.');
        process.exit(1);
    } else {
        console.log('Locale validation passed. All nodes and paths keys are present.');
    }
}

validateLocales();
