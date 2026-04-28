import type { MapNode, MapPath } from "@/types/map.ts";

export class MapData {    
    private static nodes: MapNode[] = [];
    private static paths: MapPath[] = [];

    public static reload(p : {nodes: MapNode[], paths: MapPath[]}) {
        MapData.nodes = p.nodes;
        MapData.paths = p.paths;
    }

    public static getNodes(): MapNode[] {
        return MapData.nodes;
    }

    public static getPaths(): MapPath[] {
        return MapData.paths;
    }
}