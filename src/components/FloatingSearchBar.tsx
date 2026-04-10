import { Card, Button, InputGroup } from "@heroui/react";
import {SearchIcon, SettingsIcon} from "lucide-react";

export default function FloatingSearchBar() {
	return (
		<Card className="flex flex-col justify-center items-center min-w-24 w-full md:w-[50vw] lg:w-[40vw]" variant="transparent">
			<div className="flex flex-col md:flex-row justify-start items-center w-full gap-4">
				<InputGroup className="w-full">
					<InputGroup.Input
						className="w-full grow"
						placeholder="Search Location..."
					/>
					<InputGroup.Suffix>
						<SearchIcon className="w-4"/>
					</InputGroup.Suffix>
				</InputGroup>
				<Button variant="outline" className="min-w-11 w-full md:w-auto">
					<SettingsIcon className="text-gray-600 dark:text-gray-400"/>
					<p className="md:hidden text-gray-600 dark:text-gray-400">Settings</p>
				</Button>
			</div>
		</Card>
	);
}
