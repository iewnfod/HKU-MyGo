import { Button, Card, InputGroup, Label, Separator, TextField } from "@heroui/react";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { MapNode } from "@/types/map.ts";
import { searchLocation } from "@/services/NodeSearchingService";
import { I18n } from "@/services/I18nService";

export default function SearchInput({
	placeholder,
	label,
	onSelect,
	resetKey,
	shouldFocusOnReset,
} : {
	placeholder?: string;
	label: string;
	onSelect?: (node: MapNode | null) => void;
	resetKey?: number;
	shouldFocusOnReset?: boolean;
}) {
	const resolvedPlaceholder = placeholder ?? I18n.get("app.searchinput.placeholder");
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [options, setOptions] = useState<MapNode[]>([]);
	const shouldShowOptions = useMemo(() => options.length > 0, [options]);
	const [selectedOption, setSelectedOption] = useState<MapNode | null>(null);
	const [text, setText] = useState<string>("");
	const [shouldFocusInput, setShouldFocusInput] = useState<boolean>(false);

	useEffect(() => {
		if (!shouldFocusInput || selectedOption) return;
		const timer = requestAnimationFrame(() => {
			inputRef.current?.focus();
			setShouldFocusInput(false);
		});
		return () => cancelAnimationFrame(timer);
	}, [shouldFocusInput, selectedOption]);

	useEffect(() => {
		if (!resetKey) return;
		const timer = requestAnimationFrame(() => {
			setSelectedOption(null);
			setText("");
			setOptions([]);
			if (shouldFocusOnReset) {
				setShouldFocusInput(true);
			}
		});
		return () => cancelAnimationFrame(timer);
	}, [resetKey, shouldFocusOnReset]);

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
		setText("");
		setOptions([]);
		setShouldFocusInput(true);
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
								<p>{selectedOption.name ? I18n.get(`map.nodes.${selectedOption.uid}.name`, selectedOption.name) : ""}</p>
								{selectedOption.description && (
									<p className="text-xs text-gray-500 max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap">
										{I18n.get(`map.nodes.${selectedOption.uid}.description`, selectedOption.description)}
									</p>
								)}
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
							ref={inputRef}
							onChange={handleSearchChange}
							className="w-full grow"
							placeholder={resolvedPlaceholder}
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

					<div className="flex flex-col gap-2 w-full p-2 overflow-y-auto max-h-96">
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
											<p className="text-sm">{option.name ? I18n.get(`map.nodes.${option.uid}.name`, option.name) : ""}</p>
											{option.description && (
												<p className="text-xs text-gray-500 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
													{I18n.get(`map.nodes.${option.uid}.description`, option.description)}
												</p>
											)}
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
