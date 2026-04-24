import {Card, Button, InputGroup, Separator} from "@heroui/react";
import {SearchIcon, SettingsIcon} from "lucide-react";
import {type ChangeEvent, useMemo, useState} from "react";
import type {MapNode} from "@/types/map.ts";
import {Navigator} from "@/navigator/NavCore.ts";

export default function FloatingSearchBar({navigator} : {navigator: Navigator}) {
	const [options, setOptions] = useState<MapNode[]>([]);
	const shouldShowOptions = useMemo(() => options.length > 0, [options]);

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.value !== "") {
			setOptions(navigator.searchLocation(event.target.value));
		} else {
			setOptions([]);
		}
	}

	return (
		<Card className="flex flex-col justify-center items-center min-w-24 w-full" variant="transparent">
			<div className="flex flex-col md:flex-row justify-between items-start w-full gap-4">
				<div className="w-full flex flex-col justify-center items-center md:w-[50vw] lg:w-[40vw]">
					<InputGroup className="w-full">
						<InputGroup.Input
							onChange={handleSearchChange}
							className="w-full grow"
							placeholder="Search Location..."
						/>
						<InputGroup.Suffix>
							<SearchIcon className="w-4"/>
						</InputGroup.Suffix>
					</InputGroup>

					<div className={`
						w-full h-auto transition-all ease-in-out duration-300 overflow-hidden
						${shouldShowOptions ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
					`}>
						<Separator className="mt-4 mb-2"/>

						<div className="flex flex-col gap-2 w-full p-2 overflow-y-auto h-96">
							{
								options.map((option, index) => (
									<Card
										className={`w-full ${option.description ? "min-h-18" : "min-h-13"} select-none rounded-lg cursor-pointer hover:bg-gray-200 transition-all ease duration-200`}
										variant="default"
										key={index}
									>
										<Card.Content>
											<div className="flex flex-col w-full gap-1">
												<p className="text-sm">{option.name}</p>
												<p className="text-xs text-gray-500 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
													{option.description}
												</p>
											</div>
										</Card.Content>
									</Card>
								))
							}
							<div className="min-h-2"/>
						</div>
					</div>
				</div>
				<Button variant="outline" className="min-w-11 w-full md:w-auto">
					<SettingsIcon className="text-gray-600 dark:text-gray-400"/>
					<p className="md:hidden text-gray-600 dark:text-gray-400">Settings</p>
				</Button>
			</div>
		</Card>
	);
}
