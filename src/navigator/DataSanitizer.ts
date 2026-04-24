import type { MapNode, MapPath } from "../types/map.ts"

export function sanitizeMapData(rawNodes: MapNode[], rawPaths: MapPath[]) {
    const nodeMap = new Map(rawNodes.map(node => [node.uid, node]));

    rawNodes.forEach(node => {
        node.accessiblePaths = []; 
    });

    rawPaths.forEach(path => {
        const sourceNode = nodeMap.get(path.fromNodeUid);
        if (sourceNode) {
            sourceNode.accessiblePaths ??= [];
            sourceNode.accessiblePaths.push(path.uid);
        }
    });

    return { nodes: rawNodes, paths: rawPaths };
}
