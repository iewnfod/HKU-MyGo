import {Card, Button} from "@heroui/react";
import {SettingsIcon} from "lucide-react";
import {Navigator, RoutingMode} from "@/navigator/NavCore.ts";
import SearchInput from "@/components/SearchInput.tsx";
import RouteStepList from "@/components/RouteStepList.tsx";
import {useState} from "react";
import type {MapNode, MapPath} from "@/types/map.ts";

export default function FloatingSearchBar({navigator} : {navigator: Navigator}) {
	const [start, setStart] = useState<MapNode | null>(null);
	const [end, setEnd] = useState<MapNode | null>(null);
	const [segments, setSegments] = useState<MapPath[]>([]);
	const [totalTime, setTotalTime] = useState<number>(0);
	const [totalDistance, setTotalDistance] = useState<number>(0);

	const handleGeneratePath = () => {
		if (start === null || end === null) return;
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
		<Card className="flex flex-col justify-start items-center min-w-24 h-full gap-4" variant="transparent">
			<div className="flex flex-row justify-between items-center w-full">
				<img
					src="/logo.svg"
					alt="HKU | My Go"
				/>
				<Button variant="outline" className="min-w-11 w-full md:w-auto">
					<SettingsIcon className="text-gray-600 dark:text-gray-400"/>
					<p className="text-gray-600 dark:text-gray-400">Settings</p>
				</Button>
			</div>
			<div className="flex flex-col md:flex-row justify-between items-start gap-4">
				<div className="flex flex-col gap-4 items-start justify-start">
					<SearchInput navigator={navigator} label="Start" onSelect={setStart} />
					<SearchInput navigator={navigator} label="End" onSelect={setEnd} />
				</div>
			</div>
			<Button className="w-full mt-2" isDisabled={start === null || end === null || start === end} onClick={handleGeneratePath}>
				Generate Path!
			</Button>
			{segments.length > 0 && (
				<RouteStepList totalTime={totalTime} totalDistance={totalDistance} segments={segments} />
			)}
		</Card>
	);
}
