import FloatingSearchBar from "@/components/FloatingSearchBar.tsx";
import { MapData } from "./services/MapDataService";
import { Navigator, RoutingMode } from "@/services/NavigatorService";
import { sanitizeMapData } from "@/services/DataSanitizerService";
import nodeJson from "@/../data/nodes.json";
import pathJson from "@/../data/paths.json";
import { useMemo, useState } from "react";
import type { MapNode, MapPath } from "@/types/map.ts";
import RouteStepList from "@/components/RouteStepList.tsx";
import RouteErrorPanel from "@/components/RouteErrorPanel.tsx";

function App() {
	MapData.reload(sanitizeMapData(nodeJson.nodes, pathJson.paths));
	Navigator.reload();

	const [nodes, setNodes] = useState<MapNode[]>([]);
	const [segments, setSegments] = useState<MapPath[]>([]);
	const [totalTime, setTotalTime] = useState<number>(0);
	const [totalDistance, setTotalDistance] = useState<number>(0);
	const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
	const [hasError, setHasError] = useState<boolean>(false);
	const hasResult = useMemo(() => segments.length > 0, [segments]);
	const hasPanel = useMemo(() => hasResult || hasError, [hasResult, hasError]);

	const handleClearResults = () => {
		setNodes([]);
		setSegments([]);
		setTotalTime(0);
		setTotalDistance(0);
		setActiveStepIndex(0);
		setHasError(false);
	}

	const handleGeneratePath = (start: MapNode, end: MapNode, mode: RoutingMode) => {
		handleClearResults();
		const routeResult = Navigator.findAvailablePath(start.uid, end.uid, mode);
		if (!routeResult) {
			setHasError(true);
			return;
		}
		const pathSegments = routeResult.edges;
		if (!pathSegments) {
			setHasError(true);
			return;
		}
		setNodes(routeResult.nodes);
		setSegments(pathSegments);
		setTotalTime(routeResult.totalTime);
		setTotalDistance(routeResult.totalDistance);
		setActiveStepIndex(0);
	}

	return (
		<div className="w-screen h-screen overflow-hidden flex flex-col justify-start lg:flex-row lg:justify-between items-center p-4 min-w-96 overflow-y-auto">
			<FloatingSearchBar
				onGeneratePath={handleGeneratePath}
				hasResult={hasPanel}
				nodes={nodes}
				segments={segments}
				activeStepIndex={activeStepIndex}
				onChangeStep={setActiveStepIndex}
				clearResults={handleClearResults}
			/>
			<div className={`w-full grow lg:max-w-[55vw] p-4 pt-0 h-auto max-h-full lg:max-h-screen overflow-hidden ${hasPanel ? 'h-full' : ''}`}>
				{hasResult && (
					<RouteStepList totalTime={totalTime} totalDistance={totalDistance} nodes={nodes} segments={segments} activeStepIndex={activeStepIndex} />
				)}
				{hasError && (
					<RouteErrorPanel />
				)}
			</div>
		</div>
	);
}

export default App;
