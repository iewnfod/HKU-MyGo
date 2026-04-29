import {Button} from "@heroui/react";
import {I18n} from "@/services/I18nService.ts";
import {AccessibilityIcon, ChevronDownIcon, DoorOpenIcon, UsersIcon, ZapIcon} from "lucide-react";
import {RoutingMode} from "@/services/NavigatorService.ts";
import {useCallback, useState} from "react";

export default function ModeButton({
	onModeChange
} : {
	onModeChange: (mode: RoutingMode) => void;
}) {
	const [selectedMode, _setSelectedMode] = useState<RoutingMode>(RoutingMode.FastestNormal);
	const [shouldShowModeOptions, setShouldShowModeOptions] = useState<boolean>(false);

	const setSelectedMode = useCallback((mode: RoutingMode) => {
		_setSelectedMode(mode);
		onModeChange(mode);
	}, [onModeChange, _setSelectedMode]);

	const modeOptions = [
		{
			label: I18n.get("app.floatingsearchbar.mode.fastest"),
			mode: RoutingMode.FastestNormal,
			icon: <ZapIcon className="w-4 h-4 text-blue-600"/>,
		},
		{
			label: I18n.get("app.floatingsearchbar.mode.popular"),
			mode: RoutingMode.MostPopular,
			icon: <UsersIcon className="w-4 h-4 text-blue-600"/>,
		},
		{
			label: I18n.get("app.floatingsearchbar.mode.accessible"),
			mode: RoutingMode.Accessible,
			icon: <AccessibilityIcon className="w-4 h-4 text-blue-600"/>,
		},
		{
			label: I18n.get("app.floatingsearchbar.mode.indoor"),
			mode: RoutingMode.IndoorOnly,
			icon: <DoorOpenIcon className="w-4 h-4 text-blue-600"/>,
		},
	];

	const selectedModeLabel = modeOptions.find(option => option.mode === selectedMode)?.label || I18n.get("app.floatingsearchbar.mode.fastest");

	return (
		<div className="relative">
			<Button
				variant="outline"
				className="min-w-11 lg:w-auto"
				onClick={() => setShouldShowModeOptions(old => !old)}
			>
				<p className="text-gray-600 dark:text-gray-400">{I18n.get("app.floatingsearchbar.mode")}</p>
				<p className="text-gray-400 text-xs">{selectedModeLabel}</p>
				<ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${shouldShowModeOptions ? 'rotate-180' : 'rotate-0'}`}/>
			</Button>
			<div className={`
				absolute left-[-25%] top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/70
				transition-all duration-300 ease-out
				${shouldShowModeOptions ? 'max-h-80 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}
			`}>
				<div className="flex flex-col gap-1 p-2">
					{
						modeOptions.map(option => (
							<button
								type="button"
								key={option.label}
								className={`flex flex-row cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-gray-50 ${selectedMode === option.mode ? 'bg-blue-50' : 'bg-white'}`}
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
	);
}
