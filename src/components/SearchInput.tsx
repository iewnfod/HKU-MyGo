import {Button, Card, InputGroup, Label, Separator, TextField} from "@heroui/react";
import {SearchIcon, XIcon} from "lucide-react";
import {type ChangeEvent, useMemo, useState} from "react";
import type {MapNode} from "@/types/map.ts";
import { searchLocation } from "@/services/NodeSearchingService";

export default function SearchInput({
	placeholder = "Search Location...",
	label,
	onSelect,
} : {
	placeholder?: string;
	label: string;
	onSelect?: (node: MapNode | null) => void;
}) {
	const [options, setOptions] = useState<MapNode[]>([]);
	const shouldShowOptions = useMemo(() => options.length > 0, [options]);
	const [selectedOption, setSelectedOption] = useState<MapNode | null>(null);
	const [text, setText] = useState<string>("");

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value);
		if (event.target.value !== "") {
			setOptions(searchLocation(event.target.value));
		} else {
			setOptions([]);
		}
	}

	const handleSelectOption = (item: MapNode) => {
		setSelectedOption(item);
		onSelect?.(item);
	}

	const clearSelectOption = () => {
		setSelectedOption(null);
		onSelect?.(null);
	}

	if (selectedOption) {
		return (
			<div className="w-full flex flex-col justify-center items-start">
				<Label>{label}</Label>
				<Card className="w-full select-none rounded-lg">
					<Card.Content>
						<div className="flex flex-row justify-between items-center w-full">
							<div className="flex flex-col items-start grow w-[70%]">
								<p>{selectedOption.name}</p>
								<p className="text-xs text-gray-500 max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap">
									{selectedOption.description}
								</p>
							</div>
							<Button isIconOnly variant="tertiary" size="sm" onClick={clearSelectOption}>
								<XIcon />
							</Button>
						</div>
					</Card.Content>
				</Card>
			</div>
		);
	} else {
		return (
			<div className="w-full flex flex-col justify-center items-center">
				<TextField className="w-full">
					{label && (
						<Label>{label}</Label>
					)}
					<InputGroup className="w-full">
						<InputGroup.Input
							onChange={handleSearchChange}
							className="w-full grow"
							placeholder={placeholder}
							value={text}
						/>
						<InputGroup.Suffix>
							<SearchIcon className="w-4"/>
						</InputGroup.Suffix>
					</InputGroup>
				</TextField>

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
									onClick={() => handleSelectOption(option)}
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
		);
	}
}
