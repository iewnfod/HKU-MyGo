import {Card, Button} from "@heroui/react";
import {SettingsIcon} from "lucide-react";
import {Navigator} from "@/navigator/NavCore.ts";
import SearchInput from "@/components/SearchInput.tsx";
import {useCallback, useState} from "react";
import type {MapNode} from "@/types/map.ts";

export default function FloatingSearchBar({navigator, onGeneratePath, hasResult} : {
	navigator: Navigator;
	onGeneratePath: (start: MapNode, end: MapNode) => void;
	hasResult: boolean;
}) {
	const [start, setStart] = useState<MapNode | null>(null);
	const [end, setEnd] = useState<MapNode | null>(null);

	const handleGeneratePath = useCallback(() => {
		if (start === null || end === null) return;
		onGeneratePath(start, end);
	}, [start, end, onGeneratePath]);

	return (
		<Card className={`flex flex-col justify-start items-center w-full min-w-24 ${hasResult ? '' : 'h-full'} lg:h-full lg:grow gap-4 min-h-90`} variant="transparent">
			<div className="flex flex-row justify-between items-center w-full">
				<img
					src="/logo.svg"
					alt="HKU | My Go"
				/>
				<Button variant="outline" className="min-w-11 lg:w-auto">
					<SettingsIcon className="text-gray-600 dark:text-gray-400"/>
					<p className="text-gray-600 dark:text-gray-400">Settings</p>
				</Button>
			</div>
			<div className="flex flex-col gap-4 items-start justify-start w-full">
				<SearchInput navigator={navigator} label="Start" onSelect={setStart} />
				<SearchInput navigator={navigator} label="End" onSelect={setEnd} />
			</div>
			<Button className="w-full mt-2" isDisabled={start === null || end === null || start === end} onClick={handleGeneratePath}>
				Generate Path!
			</Button>
		</Card>
	);
}
