import FloatingSearchBar from "@/components/FloatingSearchBar.tsx";
import {Navigator} from "@/navigator/NavCore.ts";
import {sanitizeMapData} from "@/navigator/DataSanitizer.ts";
import nodeJson from "@/../data/nodes.json";
import pathJson from "@/../data/paths.json";

function App() {
	const navigator = new Navigator(sanitizeMapData(nodeJson.nodes, pathJson.paths));

	return (
		<div className="w-screen h-screen overflow-hidden flex flex-row justify-between items-center p-4">
			<FloatingSearchBar navigator={navigator}/>
		</div>
	);
}

export default App;
