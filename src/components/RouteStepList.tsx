import type {MapPath} from "@/types/map.ts";
import {ArrowUpRightIcon, FootprintsIcon, MoveVerticalIcon, RouteIcon} from "lucide-react";

export default function RouteStepList({
	totalTime,
	totalDistance,
	segments,
} : {
	totalTime: number;
	totalDistance: number;
	segments: MapPath[];
}) {
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainSeconds = seconds % 60;
		if (minutes === 0) return `${remainSeconds}s`;
		if (remainSeconds === 0) return `${minutes}min`;
		return `${minutes}min ${remainSeconds}s`;
	}

	const getPathIcon = (segment: MapPath) => {
		if (segment.type === "stair") return <FootprintsIcon className="w-4 h-4 text-blue-600"/>;
		if (segment.type === "elevator") return <MoveVerticalIcon className="w-4 h-4 text-blue-600"/>;
		if (segment.type === "escalator") return <ArrowUpRightIcon className="w-4 h-4 text-blue-600"/>;
		return <RouteIcon className="w-4 h-4 text-blue-600"/>;
	}

	return (
		<div className="w-full mt-4 rounded-2xl bg-white/95 shadow-sm border border-gray-200 overflow-hidden max-h-full h-auto">
			<div className="flex flex-row items-center gap-4 p-4 bg-gray-50/80 border-b border-gray-100">
				<div className="flex flex-col">
					<p className="text-xs font-medium text-gray-400">Estimated time</p>
					<p className="text-xl font-semibold text-gray-950">{formatTime(totalTime)}</p>
				</div>
				<div className="h-8 w-px bg-gray-200"/>
				<div className="flex flex-col">
					<p className="text-xs font-medium text-gray-400">Distance</p>
					<p className="text-base font-semibold text-gray-900">{totalDistance}m</p>
				</div>
				<div className="h-8 w-px bg-gray-200"/>
				<div className="flex flex-col">
					<p className="text-xs font-medium text-gray-400">Steps</p>
					<p className="text-base font-semibold text-gray-900">{segments.length}</p>
				</div>
			</div>

			<div className="overflow-y-auto max-h-full grow">
				<div className="flex flex-col px-4 py-4">
					{
						segments.map((segment, index) => (
							<div className="flex flex-row gap-3" key={segment.uid}>
								<div className="flex flex-col items-center">
									<div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex justify-center items-center">
										{getPathIcon(segment)}
									</div>
									{index < segments.length - 1 && (
										<div className="w-px grow min-h-14 bg-gray-200 my-1"/>
									)}
								</div>
								<div className="flex flex-col grow pb-5">
									<div className="flex flex-row justify-between items-start gap-4">
										<div className="flex flex-col gap-1 min-w-0">
											<p className="text-base font-semibold text-gray-950 leading-snug">
												{segment.name || `Step ${index + 1}`}
											</p>
											<p className="text-xs text-gray-500 leading-relaxed">
												{segment.description || `${segment.fromNodeUid} to ${segment.toNodeUid}`}
											</p>
										</div>
										<div className="flex flex-col items-end shrink-0">
											<p className="text-sm font-semibold text-gray-950">{formatTime(segment.expectPassTime)}</p>
											<p className="text-xs text-gray-400">{segment.distance}m</p>
										</div>
									</div>
								</div>
							</div>
						))
					}
				</div>
			</div>
		</div>
	);
}
