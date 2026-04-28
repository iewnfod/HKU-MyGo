import type { MapNode } from "../types/map.ts"
import { I18n } from "./I18nService.ts";
import { MapData } from "./MapDataService.ts";

function getFirstLetters(str: string): string {
    return str
        .split(/\s+/)
        .map(word => word.charAt(0))
        .join("")
        .toLowerCase();
}

function canMatch(node: MapNode, query: string): boolean {
    const name = node.name.toLowerCase();
    return (
        I18n.get(`map.nodes.${node.uid}.name`, name).includes(query) ||
        getFirstLetters(name).includes(query) ||
        node.aliases.some(alias => alias.toLowerCase().includes(query))
    );
}

export function searchLocation(text: string): MapNode[] {
    text = text.toLowerCase();
    return MapData.getNodes().filter(node => canMatch(node, text));
}