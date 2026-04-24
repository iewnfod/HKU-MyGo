import {Card, Button} from "@heroui/react";
import {SettingsIcon} from "lucide-react";
import {Navigator} from "@/navigator/NavCore.ts";
import SearchInput from "@/components/SearchInput.tsx";
import {useState} from "react";
import type {MapNode} from "@/types/map.ts";

export default function FloatingSearchBar({navigator} : {navigator: Navigator}) {
	const [start, setStart] = useState<MapNode | null>(null);
	const [end, setEnd] = useState<MapNode | null>(null);

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
			<Button className="w-full mt-2" isDisabled={start === null || end === null || start === end}>
				Generate Path!
			</Button>
		</Card>
	);
}
