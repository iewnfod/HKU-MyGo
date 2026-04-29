import type { MapNode, MapPath } from "@/types/map.ts";
import { useEffect, useRef, useState } from "react";
import { FaMapPin } from "react-icons/fa6";
import { TbElevator, TbEscalator, TbRoad, TbStairs } from "react-icons/tb";
import { I18n } from "@/services/I18nService";

export default function RouteStepList({
	totalTime,
	totalDistance,
	nodes,
	segments,
	activeStepIndex,
} : {
	totalTime: number;
	totalDistance: number;
	nodes: MapNode[];
	segments: MapPath[];
	activeStepIndex: number;
}) {
	const scrollViewRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
	const [activeFrame, setActiveFrame] = useState({top: 0, height: 0, opacity: 0});

	useEffect(() => {
		const timer = requestAnimationFrame(() => {
			const container = containerRef.current;
			const activeItem = itemRefs.current[activeStepIndex];
			if (!container || !activeItem) {
				setActiveFrame(old => ({...old, opacity: 0}));
				return;
			}
			setActiveFrame({
				top: activeItem.offsetTop,
				height: activeItem.offsetHeight,
				opacity: 1,
			});
		});
		return () => cancelAnimationFrame(timer);
	}, [activeStepIndex, nodes, segments]);

	useEffect(() => {
		const timer = requestAnimationFrame(() => {
			const scrollView = scrollViewRef.current;
			const activeItem = itemRefs.current[activeStepIndex];
			if (!scrollView || !activeItem) return;
			const targetTop = activeItem.offsetTop - scrollView.clientHeight / 2 + activeItem.offsetHeight / 2;
			scrollView.scrollTo({
				top: Math.max(targetTop, 0),
				behavior: "smooth",
			});
		});
		return () => cancelAnimationFrame(timer);
	}, [activeStepIndex]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainSeconds = seconds % 60;
		if (minutes === 0) return `${remainSeconds}s`;
		if (remainSeconds === 0) return `${minutes}min`;
		return `${minutes}min ${remainSeconds}s`;
	}

	const getPathIcon = (segment: MapPath) => {
		if (segment.type === "stair") return <TbStairs className="w-4 h-4 text-blue-600"/>;
		if (segment.type === "elevator") return <TbElevator className="w-4 h-4 text-blue-600"/>;
		if (segment.type === "escalator") return <TbEscalator className="w-4 h-4 text-blue-600"/>;
		return <TbRoad className="w-4 h-4 text-blue-600"/>;
	}

	const timelineItems: Array<
		{type: "node"; node: MapNode; label: string} |
		{type: "segment"; segment: MapPath}
	> = [];

	nodes.forEach((node, index) => {
		timelineItems.push({
			type: "node",
			node: node,
			label: index === 0 ? I18n.get("app.routesteplist.start") : index === nodes.length - 1 ? I18n.get("app.routesteplist.end") : "",
		});
		const segment = segments[index];
		if (segment) {
			timelineItems.push({
				type: "segment",
				segment: segment,
			});
		}
	});

	return (
		<div className="w-full h-full min-h-0 mt-4 rounded-2xl bg-white/95 shadow-sm border border-gray-200 overflow-hidden max-h-full flex flex-col">
			<div className="grid grid-cols-3 p-4 bg-gray-50/80 border-b border-gray-100">
				<div className="flex flex-col pr-4">
					<p className="text-xs font-medium text-gray-400">{I18n.get("app.routesteplist.estimated_time")}</p>
					<p className="text-xl font-semibold text-gray-950">{formatTime(totalTime)}</p>
				</div>
				<div className="flex flex-col border-l border-gray-200 px-4">
					<p className="text-xs font-medium text-gray-400">{I18n.get("app.routesteplist.distance")}</p>
					<p className="text-base font-semibold text-gray-900">{totalDistance}m</p>
				</div>
				<div className="flex flex-col border-l border-gray-200 pl-4">
					<p className="text-xs font-medium text-gray-400">{I18n.get("app.routesteplist.steps")}</p>
					<p className="text-base font-semibold text-gray-900">{segments.length}</p>
				</div>
			</div>

			<div className="min-h-0 overflow-y-auto max-h-full grow scroll-smooth" ref={scrollViewRef}>
				<div className="relative flex flex-col px-4 py-4 gap-2" ref={containerRef}>
					<div
						className="absolute left-4 right-4 z-0 rounded-2xl bg-blue-500/10 ring-1 ring-blue-300/70 backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
						style={{
							top: `${activeFrame.top}px`,
							height: `${activeFrame.height}px`,
							opacity: activeFrame.opacity,
						}}
					/>
					{
						timelineItems.map((item, index) => {
							const hasNextItem = index < timelineItems.length - 1;
							return (
								<div
									className="relative z-10 flex flex-row gap-3 rounded-2xl px-2 pt-1 pb-0"
									key={item.type === "node" ? item.node.uid : item.segment.uid}
									ref={element => {
										itemRefs.current[index] = element;
									}}
								>
									<div className="w-8 shrink-0 flex flex-col items-center">
										<div className={`w-8 h-8 rounded-full border flex justify-center items-center ${item.type === "node" ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-100'}`}>
											{item.type === "node" ? (
												<FaMapPin className="w-4 h-4 text-gray-600"/>
											) : (
												getPathIcon(item.segment)
											)}
										</div>
										{hasNextItem && (
											<div className="w-px h-8 bg-gray-200 my-1"/>
										)}
									</div>
									{item.type === "node" ? (
										<div className="min-h-14 flex flex-row items-start gap-2 grow min-w-0 pt-1 pb-3">
											<p className="text-base font-semibold text-gray-950 leading-snug">{I18n.get(`map.nodes.${item.node.uid}.name`, item.node.name)}</p>
											{item.label && (
												<p className="h-5 shrink-0 rounded-full bg-gray-100 px-2 text-xs font-medium leading-5 text-gray-500">
													{item.label}
												</p>
											)}
										</div>
									) : (
										<div className="flex flex-col grow min-w-0 pb-3">
											<div className="flex flex-row justify-between items-start gap-4">
												<div className="flex flex-col gap-1 min-w-0">
													<p className="text-base font-semibold text-gray-950 leading-snug">
														{item.segment.name ? I18n.get(`map.paths.${item.segment.uid}.name`, item.segment.name) : `${I18n.get("app.routesteplist.step")} ${index + 1}`}
													</p>
													{item.segment.description && (
														<p className="text-xs text-gray-500 leading-relaxed invisible select-none">
															{I18n.get(`map.paths.${item.segment.uid}.description`, item.segment.description)}
														</p>
													)}
												</div>
												<div className="flex flex-col items-end shrink-0">
													<p className="text-sm font-semibold text-gray-950">{formatTime(item.segment.expectPassTime)}</p>
													<p className="text-xs text-gray-400">{item.segment.distance}m</p>
												</div>
											</div>
										</div>
									)}
								</div>
							);
						})
					}
				</div>
			</div>
		</div>
	);
}
