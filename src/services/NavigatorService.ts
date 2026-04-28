import type { MapNode, MapPath } from "../types/map.ts"
import { MapData } from "./MapDataService.ts";

export const RoutingMode = {
    FastestNormal: "FastestNormal",  // fastest time during normal hours
    FastestBusy: "FastestBusy",      // fastest time during busy hours
    MostPopular: "MostPopular",      // least cognitive effort
    Accessible: "Accessible",
    IndoorOnly: "IndoorOnly"
} as const;

export type RoutingMode = typeof RoutingMode[keyof typeof RoutingMode];

interface RouteResult {
    nodes: MapNode[];
    edges: MapPath[];
    totalTime: number;
    totalDistance: number;
}

// https://oi-wiki.org/graph/shortest-path/#bellmanford-%E7%AE%97%E6%B3%95
export class Navigator {
    private static nodes: Map<string, MapNode>;
    private static adjacencyList: Map<string, MapPath[]>;

    public static reload() {
        this.nodes = new Map(MapData.getNodes().map(n => [n.uid, n]));
        this.adjacencyList = new Map();
        
        MapData.getPaths().forEach(path => {
            if (!this.adjacencyList.has(path.fromNodeUid)) {
                this.adjacencyList.set(path.fromNodeUid, []);
            }
            this.adjacencyList.get(path.fromNodeUid)!.push(path);
        });
    }

    private static calculateWeight(path: MapPath, mode: RoutingMode): number {
        switch (mode) {
            case RoutingMode.FastestNormal:
                return path.expectPassTime;
            
            case RoutingMode.FastestBusy:
                return path.expectPassTime + (path.penalty || 0);

            case RoutingMode.MostPopular:
                return 1 / ((path.popularity || 0) + 1);

            case RoutingMode.Accessible:
                if (path.isAccessible === false) return Infinity;
                return path.expectPassTime;

            case RoutingMode.IndoorOnly:
                if (path.isOpenAir === true) return Infinity;
                return path.expectPassTime;

            default:
                return path.expectPassTime;
        }
    }

    public static findAvailablePath(startUid: string, endUid: string, mode: RoutingMode): RouteResult | null {
        const distances = new Map<string, number>();
        const parentPath = new Map<string, { nodeUid: string, path: MapPath }>();
        const inQueue = new Set<string>();
        const queue: string[] = [];

        this.nodes.forEach((_, uid) => distances.set(uid, Infinity));
        distances.set(startUid, 0);

        queue.push(startUid);
        inQueue.add(startUid);

        while (queue.length > 0) {
            const u = queue.shift()!;
            inQueue.delete(u);

            const neighbors = this.adjacencyList.get(u) || [];
            for (const path of neighbors) {
                const v = path.toNodeUid;
                const weight = this.calculateWeight(path, mode);

                if (weight === Infinity) continue;

                if (distances.get(u)! + weight < distances.get(v)!) {
                    distances.set(v, distances.get(u)! + weight);
                    parentPath.set(v, { nodeUid: u, path: path });

                    if (!inQueue.has(v)) {
                        queue.push(v);
                        inQueue.add(v);
                    }
                }
            }
        }

        if (distances.get(endUid) === Infinity) return null;

        const pathNodes: MapNode[] = [];
        const pathEdges: MapPath[] = [];
        let totalDist = 0;
        let totalTime = 0;
        let curr = endUid;

        while (curr !== startUid) {
            const node = this.nodes.get(curr)!;
            const edge = parentPath.get(curr)!;
            pathNodes.unshift(node);
            pathEdges.unshift(edge.path);
            totalDist += edge.path.distance;
            totalTime += (mode === RoutingMode.FastestBusy ? 
                          edge.path.expectPassTime + (edge.path.penalty || 0) : 
                          edge.path.expectPassTime);
            curr = edge.nodeUid;
        }
        pathNodes.unshift(this.nodes.get(startUid)!);

        return {
            nodes: pathNodes,
            edges: pathEdges,
            totalTime: totalTime,
            totalDistance: totalDist
        };
    }
}
