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

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function updateLocales() {
    const nodesData = readJson(nodesPath);
    const pathsData = readJson(pathsPath);

    const nodes = nodesData.nodes || [];
    const paths = pathsData.paths || [];

    const localeFiles = ['en_us.json', 'zh_cn.json', 'zh_hk.json'];

    for (const file of localeFiles) {
        const localePath = path.join(localesDir, file);
        const localeObj = readJson(localePath);

        // Update nodes
        for (const node of nodes) {
            const nameKey = `map.nodes.${node.uid}.name`;
            const descKey = `map.nodes.${node.uid}.description`;

            if (!localeObj.hasOwnProperty(nameKey)) {
                localeObj[nameKey] = node.name || '';
            }
            if (!localeObj.hasOwnProperty(descKey)) {
                localeObj[descKey] = node.description || '';
            }
            if (file === 'en_us.json') {
                localeObj[nameKey] = node.name || '';
                localeObj[descKey] = node.description || '';
            }
        }

        // Update paths
        for (const p of paths) {
            const nameKey = `map.paths.${p.uid}.name`;
            const descKey = `map.paths.${p.uid}.description`;

            if (!localeObj.hasOwnProperty(nameKey)) {
                localeObj[nameKey] = p.name || '';
            }
            if (!localeObj.hasOwnProperty(descKey)) {
                localeObj[descKey] = p.description || '';
            }
            if (file === 'en_us.json') {
                localeObj[nameKey] = p.name || '';
                localeObj[descKey] = p.description || '';
            }
        }

        writeJson(localePath, localeObj);
        console.log(`Updated ${file}`);
    }
}

updateLocales();
