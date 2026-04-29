import { I18n } from "@/services/I18nService.ts";
import { useCallback, useState } from "react";
import { Button } from "@heroui/react";

export default function PeakHourCheckBox({
	onChange,
} : {
	onChange: (value: boolean) => void;
}) {
	const [isPeakHours, _setIsPeakHours] = useState<boolean>(false);

	const setIsPeakHours = useCallback((v: boolean) => {
		_setIsPeakHours(v);
		onChange(v);
	}, [_setIsPeakHours, onChange]);

	return (
		<Button
			type="button"
			variant="outline"
			className="flex flex-row items-center gap-2 rounded-full transition-all duration-200"
			onClick={() => setIsPeakHours(!isPeakHours)}
		>
			<div className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 ${isPeakHours ? 'bg-blue-500' : 'bg-gray-200'}`}>
				<div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${isPeakHours ? 'translate-x-4' : 'translate-x-0'}`}/>
			</div>
			<p className="text-sm text-gray-600 whitespace-nowrap">{I18n.get("app.floatingsearchbar.peak_hour")}</p>
		</Button>
	);
}
