export interface MapNode {
	uid: string;
	name: string;  // 名称
	level: string;  // 楼层
	description?: string;
	aliases: string[];
	accessiblePaths: string[];
}

export const MapPathTypes = {
	Road: "road",  // 普通的路
	Elevator: "elevator",  // 电梯
	Escalator: "escalator",  // 扶梯
	Stair: "stair",  // 楼梯
}

export type MapPathType = typeof MapPathTypes[keyof typeof MapPathTypes];

export interface MapPath {
	uid: string;
	fromNodeUid: string;
	toNodeUid: string;
	name?: string;
	expectPassTime: number;  // s
	distance: number;  // m
	type: MapPathType;
	popularity?: number;  // people/min
	penalty?: number;
	description?: string;
	isOpenAir?: boolean;
	isAccessible?: boolean;
}
