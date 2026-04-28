import {FaRoadCircleExclamation} from "react-icons/fa6";

export default function RouteErrorPanel() {
	return (
		<div className="w-full mt-4 rounded-2xl bg-white/95 shadow-sm border border-gray-200 overflow-hidden">
			<div className="flex flex-col justify-center items-center gap-4 px-8 py-12 text-center">
				<div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex justify-center items-center">
					<FaRoadCircleExclamation className="w-8 h-8 text-gray-600"/>
				</div>
				<div className="max-w-md flex flex-col gap-1 text-base font-medium text-gray-800 leading-relaxed">
					<p>Sorry, your specified route does not exist in our database</p>
					<p>( ╥﹏╥)</p>
				</div>
			</div>
		</div>
	);
}
