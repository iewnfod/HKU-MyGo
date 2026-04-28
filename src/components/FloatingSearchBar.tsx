import {Card, Button} from "@heroui/react";
import {AccessibilityIcon, ChevronDownIcon, DoorOpenIcon, UsersIcon, ZapIcon} from "lucide-react";
import {Navigator, RoutingMode} from "@/navigator/NavCore.ts";
import SearchInput from "@/components/SearchInput.tsx";
import ActiveStepsDisplay from "@/components/ActiveStepsDisplay.tsx";
import {useCallback, useState} from "react";
import type {MapNode, MapPath} from "@/types/map.ts";

export default function FloatingSearchBar({navigator, onGeneratePath, hasResult, nodes, segments, activeStepIndex, onChangeStep} : {
	navigator: Navigator;
	onGeneratePath: (start: MapNode, end: MapNode, mode: RoutingMode) => void;
	hasResult: boolean;
	nodes: MapNode[];
	segments: MapPath[];
	activeStepIndex: number;
	onChangeStep: (index: number) => void;
}) {
	const [start, setStart] = useState<MapNode | null>(null);
	const [end, setEnd] = useState<MapNode | null>(null);
	const [selectedMode, setSelectedMode] = useState<RoutingMode>(RoutingMode.FastestNormal);
	const [isPeakHours, setIsPeakHours] = useState<boolean>(false);
	const [shouldShowModeOptions, setShouldShowModeOptions] = useState<boolean>(false);

	const modeOptions = [
		{
			label: "Fastest",
			mode: RoutingMode.FastestNormal,
			icon: <ZapIcon className="w-4 h-4 text-blue-600"/>,
		},
		{
			label: "Popular",
			mode: RoutingMode.MostPopular,
			icon: <UsersIcon className="w-4 h-4 text-blue-600"/>,
		},
		{
			label: "Accessible",
			mode: RoutingMode.Accessible,
			icon: <AccessibilityIcon className="w-4 h-4 text-blue-600"/>,
		},
		{
			label: "Indoor",
			mode: RoutingMode.IndoorOnly,
			icon: <DoorOpenIcon className="w-4 h-4 text-blue-600"/>,
		},
	];

	const selectedModeLabel = modeOptions.find(option => option.mode === selectedMode)?.label || "Fastest";

	const handleGeneratePath = useCallback(() => {
		if (start === null || end === null) return;
		const mode = selectedMode === RoutingMode.FastestNormal && isPeakHours ? RoutingMode.FastestBusy : selectedMode;
		onGeneratePath(start, end, mode);
	}, [start, end, selectedMode, isPeakHours, onGeneratePath]);

	return (
		<Card className={`flex flex-col justify-start items-center w-full min-w-24 ${hasResult ? '' : 'h-full'} lg:h-full lg:grow gap-4 min-h-90`} variant="transparent">
			<div className="flex flex-row justify-between items-center w-full">
				<img
					src="/logo.svg"
					alt="HKU | My Go"
				/>
				<div className="flex flex-row items-center gap-2">
					{ selectedMode == "FastestBusy" || selectedMode == "FastestNormal" && (
					<button
						type="button"
						className="flex flex-row items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm transition-all duration-200 hover:bg-gray-50"
						onClick={() => setIsPeakHours(old => !old)}
					>
						<div className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 ${isPeakHours ? 'bg-blue-500' : 'bg-gray-200'}`}>
							<div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${isPeakHours ? 'translate-x-4' : 'translate-x-0'}`}/>
						</div>
						<p className="text-sm text-gray-600 whitespace-nowrap">Peak Hours</p>
					</button>
					)}
					<div className="relative">
						<Button
							variant="outline"
							className="min-w-11 lg:w-auto"
							onClick={() => setShouldShowModeOptions(old => !old)}
						>
							<p className="text-gray-600 dark:text-gray-400">Mode</p>
							<p className="text-gray-400 text-xs">{selectedModeLabel}</p>
							<ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${shouldShowModeOptions ? 'rotate-180' : 'rotate-0'}`}/>
						</Button>
						<div className={`
							absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/70
							transition-all duration-300 ease-out
							${shouldShowModeOptions ? 'max-h-80 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}
						`}>
							<div className="flex flex-col gap-1 p-2">
								{
									modeOptions.map(option => (
										<button
											type="button"
											key={option.label}
											className={`flex flex-row items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-gray-50 ${selectedMode === option.mode ? 'bg-blue-50' : 'bg-white'}`}
											onClick={() => {
												setSelectedMode(option.mode);
												setShouldShowModeOptions(false);
											}}
										>
											<div className={`w-8 h-8 rounded-full flex justify-center items-center border transition-all duration-200 ${selectedMode === option.mode ? 'border-blue-200 bg-white' : 'border-gray-200 bg-gray-50'}`}>
												{option.icon}
											</div>
											<p className={`text-sm font-medium ${selectedMode === option.mode ? 'text-blue-700' : 'text-gray-700'}`}>
												{option.label}
											</p>
										</button>
									))
								}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-4 items-start justify-start w-full">
				<SearchInput navigator={navigator} label="Start" onSelect={setStart} />
				<SearchInput navigator={navigator} label="End" onSelect={setEnd} />
			</div>
			<Button className="w-full mt-2" isDisabled={start === null || end === null || start === end} onClick={handleGeneratePath}>
				Generate Path!
			</Button>
			{nodes.length > 0 && segments.length > 0 && (
				<ActiveStepsDisplay nodes={nodes} segments={segments} activeStepIndex={activeStepIndex} onChangeStep={onChangeStep} />
			)}
		</Card>
	);
}
