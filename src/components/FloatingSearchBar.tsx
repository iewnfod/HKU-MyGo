import { Card, Button } from "@heroui/react";
import { MoveRightIcon, XIcon } from "lucide-react";
import { RoutingMode } from "@/services/NavigatorService";
import SearchInput from "@/components/SearchInput.tsx";
import ActiveStepsDisplay from "@/components/ActiveStepsDisplay.tsx";
import { Fragment, useCallback, useState } from "react";
import type { MapNode, MapPath } from "@/types/map.ts";
import { I18n } from "@/services/I18nService";
import ExtendButton from "@/components/ExtendButton.tsx";
import I18nButton from "@/components/I18nButton.tsx";
import PeakHourCheckBox from "./PeakHourCheckBox.tsx";
import ModeButton from "@/components/ModeButton.tsx";

export default function FloatingSearchBar({onGeneratePath, hasResult, nodes, segments, activeStepIndex, onChangeStep, clearResults} : {
	onGeneratePath: (start: MapNode, end: MapNode, mode: RoutingMode) => void;
	hasResult: boolean;
	nodes: MapNode[];
	segments: MapPath[];
	activeStepIndex: number;
	onChangeStep: (index: number) => void;
	clearResults: () => void;
}) {
	const [start, setStart] = useState<MapNode | null>(null);
	const [end, setEnd] = useState<MapNode | null>(null);
	const [selectedMode, setSelectedMode] = useState<RoutingMode>(RoutingMode.FastestNormal);
	const [isPeakHours, setIsPeakHours] = useState<boolean>(false);
	const isLargeScreen = window.innerWidth >= 1024;

	const handleGeneratePath = useCallback(() => {
		if (start === null || end === null) return;
		const mode = selectedMode === RoutingMode.FastestNormal && isPeakHours ? RoutingMode.FastestBusy : selectedMode;
		onGeneratePath(start, end, mode);
	}, [start, end, selectedMode, isPeakHours, onGeneratePath]);

	const handleClear = useCallback(() => {
		clearResults();
	}, [clearResults]);

	return (
		<Card className={`flex flex-col justify-start items-center w-full min-w-24 ${hasResult ? '' : 'h-full'} lg:h-full lg:grow gap-4 min-h-108`} variant="transparent">
			<div className="flex flex-row justify-between items-center w-full">
				<img
					src="/logo.svg"
					alt="HKU | My Go"
				/>
				<I18nButton/>
			</div>
			<div className="flex flex-row items-center justify-between w-full gap-4">
				<div className="flex flex-row items-center gap-4">
					<PeakHourCheckBox onChange={setIsPeakHours}/>
					<ModeButton onModeChange={setSelectedMode}/>
				</div>
				<ExtendButton/>
			</div>
			{hasResult && (
				<div className="lg:hidden w-full flex flex-row justify-between items-center pl-2">
					<div className="grow w-full flex flex-row justify-start items-center gap-4">
						{start?.name}
						<MoveRightIcon/>
						{end?.name}
					</div>
					<Button isIconOnly variant="tertiary" size="sm" onClick={handleClear}>
						<XIcon/>
					</Button>
				</div>
			)}
			{(!hasResult || isLargeScreen) && (
				<Fragment>
					<div className="flex flex-col gap-4 items-start justify-start w-full">
						<SearchInput label={I18n.get("app.floatingsearchbar.start")} onSelect={setStart} />
						<SearchInput label={I18n.get("app.floatingsearchbar.end")} onSelect={setEnd} />
					</div>
					<Button className="w-full mt-2 min-h-10 mb-2" isDisabled={start === null || end === null || start === end} onClick={handleGeneratePath}>
						{I18n.get("app.floatingsearchbar.generate_path")}
					</Button>
				</Fragment>
			)}
			{nodes.length > 0 && segments.length > 0 && (
				<ActiveStepsDisplay nodes={nodes} segments={segments} activeStepIndex={activeStepIndex} onChangeStep={onChangeStep} />
			)}
		</Card>
	);
}
