import type {MapNode, MapPath} from "@/types/map.ts";
import {useEffect, useState} from "react";
import {FaMapPin} from "react-icons/fa6";
import {TbElevator, TbEscalator, TbRoad, TbStairs} from "react-icons/tb";
import { I18n } from "@/services/I18nService";

export default function ActiveStepsDisplay({
	nodes,
	segments,
	activeStepIndex,
	onChangeStep,
} : {
	nodes: MapNode[];
	segments: MapPath[];
	activeStepIndex: number;
	onChangeStep: (index: number) => void;
}) {
	const [displayStepIndex, setDisplayStepIndex] = useState<number>(activeStepIndex);
	const [isChanging, setIsChanging] = useState<boolean>(false);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [direction, setDirection] = useState<number>(1);
	const totalSteps = nodes.length + segments.length;
	const isLastStep = activeStepIndex === totalSteps - 1;
	const isNodeStep = displayStepIndex % 2 === 0;
	const currentNode = nodes[Math.floor(displayStepIndex / 2)];
	const currentSegment = segments[Math.floor(displayStepIndex / 2)];

	// animation
	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), 0);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (activeStepIndex === displayStepIndex) return;
		const nextDirection = activeStepIndex > displayStepIndex ? 1 : -1;
		const startTimer = setTimeout(() => {
			setDirection(nextDirection);
			setIsChanging(true);
		}, 0);
		const endTimer = setTimeout(() => {
			setDisplayStepIndex(activeStepIndex);
			setIsChanging(false);
		}, 180);
		return () => {
			clearTimeout(startTimer);
			clearTimeout(endTimer);
		};
	}, [activeStepIndex, displayStepIndex]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainSeconds = seconds % 60;
		if (minutes === 0) return `${remainSeconds}s`;
		if (remainSeconds === 0) return `${minutes}min`;
		return `${minutes}min ${remainSeconds}s`;
	}

	const getPathIcon = (segment: MapPath) => {
		if (segment.type === "stair") return <TbStairs className="w-5 h-5 text-blue-600"/>;
		if (segment.type === "elevator") return <TbElevator className="w-5 h-5 text-blue-600"/>;
		if (segment.type === "escalator") return <TbEscalator className="w-5 h-5 text-blue-600"/>;
		return <TbRoad className="w-5 h-5 text-blue-600"/>;
	}

	const handlePrevious = () => {
		if (activeStepIndex === 0) return;
		onChangeStep(activeStepIndex - 1);
	}

	const handleNext = () => {
		if (isLastStep) return;
		onChangeStep(activeStepIndex + 1);
	}

	if (totalSteps === 0) return null;

	const contentAnimation = isChanging ?
		(direction === 1 ? 'opacity-0 -translate-x-4 scale-[0.98]' : 'opacity-0 translate-x-4 scale-[0.98]') :
		'opacity-100 translate-x-0 scale-100';

	return (
		<div className={`w-full overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'max-h-[32rem] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-2'}`}>
			<div className="flex min-h-80 flex-col justify-between p-5">
				<div className={`flex min-h-56 flex-col gap-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${contentAnimation}`}>
					<div className="flex flex-row items-start gap-4">
						<div className={`w-11 h-11 rounded-full flex justify-center items-center border ${isNodeStep ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-100'}`}>
							{isNodeStep ? (
								<FaMapPin className="w-5 h-5 text-gray-600"/>
							) : (
								currentSegment && getPathIcon(currentSegment)
							)}
						</div>
						<div className="flex flex-col gap-2 grow min-w-0">
							<div className="flex flex-row items-center gap-2">
								<p className="text-xs font-medium text-gray-400">{I18n.get("app.activestepsdisplay.step")} {activeStepIndex + 1} {I18n.get("app.activestepsdisplay.of")} {totalSteps}</p>
								{isNodeStep && displayStepIndex === 0 && (
									<p className="h-5 rounded-full bg-gray-100 px-2 text-xs font-medium leading-5 text-gray-500">{I18n.get("app.activestepsdisplay.start")}</p>
								)}
								{isNodeStep && displayStepIndex === totalSteps - 1 && (
									<p className="h-5 rounded-full bg-gray-100 px-2 text-xs font-medium leading-5 text-gray-500">{I18n.get("app.activestepsdisplay.end")}</p>
								)}
							</div>
							<p className="text-lg font-semibold leading-snug text-gray-950">
								{isNodeStep ? I18n.get(`map.nodes.${currentNode?.uid}.name`, currentNode?.name) : I18n.get(`map.paths.${currentSegment?.uid}.name`, currentSegment?.name) || `${I18n.get("app.activestepsdisplay.step")} ${Math.floor(displayStepIndex / 2) + 1}`}
							</p>
							{!isNodeStep && currentSegment && (
								<div className="flex flex-row items-center gap-3 text-sm text-gray-500">
									<p>{formatTime(currentSegment.expectPassTime)}</p>
									<div className="w-1 h-1 rounded-full bg-gray-300"/>
									<p>{currentSegment.distance}m</p>
								</div>
							)}
						</div>
					</div>

					{!isNodeStep && currentSegment && currentSegment.description && (
						<p className="text-sm leading-relaxed text-gray-500">
							{I18n.get(`map.paths.${currentSegment.uid}.description`, currentSegment.description)}
						</p>
					)}
				</div>
				<div className="flex flex-row justify-between items-center gap-3 border-t border-gray-100 pt-4">
					<button
						type="button"
						className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeStepIndex === 0 ? 'text-gray-300 cursor-default' : 'text-gray-600 hover:bg-gray-50 active:scale-95'}`}
						onClick={handlePrevious}
					>
						{I18n.get("app.activestepsdisplay.previous")}
					</button>
					<button
						type="button"
						className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-blue-200 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-blue-700 active:scale-95"
						onClick={handleNext}
					>
						{isLastStep ? I18n.get("app.activestepsdisplay.finish") : I18n.get("app.activestepsdisplay.next")}
					</button>
				</div>
			</div>
		</div>
	);
}
