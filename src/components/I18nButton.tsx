import {ChevronDownIcon} from "lucide-react";
import {useState} from "react";
import {useI18n} from "@/hooks/useI18n.ts";
import type {LangCode} from "@/services/I18nService.ts";

export default function I18nButton() {
	const [shouldShowLangOptions, setShouldShowLangOptions] = useState<boolean>(false);
	const [lang, setLang] = useI18n();

	const langOptions: { label: string; code: LangCode }[] = [
		{ label: "English", code: "en_us" },
		{ label: "简体中文", code: "zh_cn" },
		{ label: "繁體中文", code: "zh_hk" },
	];

	return (
		<div className="relative">
			<button
				type="button"
				className="h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg border border-transparent hover:bg-gray-100 transition-colors cursor-pointer"
				onClick={() => setShouldShowLangOptions(!shouldShowLangOptions)}
			>
				<span className="text-sm font-medium text-gray-700">
					{lang === 'en_us' ? 'EN' : lang === 'zh_cn' ? '简' : '繁'}
				</span>
				<ChevronDownIcon className="w-3.5 h-3.5 text-gray-500" />
			</button>

			{shouldShowLangOptions && (
				<>
					<div
						className="fixed inset-0 z-40"
						onClick={() => setShouldShowLangOptions(false)}
					/>
					<div className="absolute right-0 top-full mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-gray-100 p-1.5 z-50 flex flex-col gap-0.5">
						{langOptions.map((option) => (
							<button
								key={option.code}
								className={`flex cursor-pointer items-center w-full px-3 py-2 text-sm rounded-lg transition-colors ${
									lang === option.code
										? "bg-blue-50 text-blue-700 font-medium"
										: "text-gray-700 hover:bg-gray-50"
								}`}
								onClick={() => {
									setLang(option.code);
									setShouldShowLangOptions(false);
								}}
							>
								{option.label}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
}
