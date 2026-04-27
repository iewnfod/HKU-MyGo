import FloatingSearchBar from "@/components/FloatingSearchBar.tsx";
import {Navigator, RoutingMode} from "@/navigator/NavCore.ts";
import {sanitizeMapData} from "@/navigator/DataSanitizer.ts";
import nodeJson from "@/../data/nodes.json";
import pathJson from "@/../data/paths.json";
import {useMemo, useState} from "react";
import type {MapNode, MapPath} from "@/types/map.ts";
import RouteStepList from "@/components/RouteStepList.tsx";

function App() {
	const navigator = new Navigator(sanitizeMapData(nodeJson.nodes, pathJson.paths));
	const [segments, setSegments] = useState<MapPath[]>([]);
	const [totalTime, setTotalTime] = useState<number>(0);
	const [totalDistance, setTotalDistance] = useState<number>(0);
	const hasResult = useMemo(() => segments.length > 0, [segments]);

	const handleGeneratePath = (start: MapNode, end: MapNode) => {
		const routeResult = navigator.findPath(start.uid, end.uid, RoutingMode.FastestNormal);
		console.log(routeResult);
		if (routeResult) {
			const pathSegments = navigator.findPathSegments(routeResult.path, RoutingMode.FastestNormal);
			console.log(pathSegments);
			if (pathSegments) {
				setSegments(pathSegments);
				setTotalTime(routeResult.totalTime);
				setTotalDistance(routeResult.totalDistance);
			}
		}
	}

	return (
		<div className="w-screen h-screen overflow-hidden flex flex-col justify-start lg:flex-row lg:justify-between items-center p-4 min-w-96 overflow-y-auto">
			<FloatingSearchBar navigator={navigator} onGeneratePath={handleGeneratePath} hasResult={hasResult}/>
			<div className={`w-full grow lg:max-w-[55vw] p-4 pt-0 h-auto max-h-full lg:max-h-screen ${hasResult ? 'h-full' : ''}`}>
				{hasResult && (
					<RouteStepList totalTime={totalTime} totalDistance={totalDistance} segments={segments} />
				)}
			</div>
		</div>
	);
}

export default App;
