import FloatingSearchBar from "@/components/FloatingSearchBar.tsx";
import {useState} from "react";
import {Navigator} from "@/navigator/NavCore.ts";
import nodeJson from "@/../data/nodes.json";
import pathJson from "@/../data/paths.json";

function App() {
	const [navigator, setNavigator] = useState<Navigator>(
		// @ts-expect-error json type is manually maintained
		new Navigator(nodeJson, pathJson)
	);

	return (
		<div className="w-screen h-screen overflow-hidden p-4">
			<FloatingSearchBar navigator={navigator}/>
		</div>
	);
}

export default App;
