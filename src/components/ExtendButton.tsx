import {Navigator} from "@/services/NavigatorService";
import {MapData} from "@/services/MapDataService.ts";
import {sanitizeMapData} from "@/services/DataSanitizerService.ts";
import {Button, Label, Modal, Separator} from "@heroui/react";
import {I18n} from "@/services/I18nService.ts";
import {FileUpIcon, InfoIcon} from "lucide-react";
import {useCallback, useEffect, useState} from "react";

function FileSelectButton({
	type,
	onUpdate,
} : {
	type: "node" | "path";
	onUpdate: (j: never) => void;
}) {
	const [name, setName] = useState<string | null>(null);
	const [content, setContent] = useState<string | null>(null);
	const [jsonContent, setJsonContent] = useState<never>();

	const selectFile = () => {
		const inp = document.createElement('input');
		inp.type = 'file';
		inp.accept = '.json';
		inp.onchange = () => {
			if (inp.files && inp.files[0]) {
				const f = inp.files[0];
				const reader = new FileReader();
				reader.onload = (e) => {
					if (e.target?.result && typeof e.target.result === "string") {
						setContent(e.target.result);
					}
				};
				reader.readAsText(f);
				setName(f.name);
			}
		}
		inp.click();
	}

	useEffect(() => {
		if (content) {
			const j = JSON.parse(content);
			if (j.nodes && type == "node") {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setJsonContent(j);
				// @ts-expect-error content type is maintained manually
				onUpdate(j);
			}
			if (j.paths && type == "path") {
				setJsonContent(j);
				// @ts-expect-error content type is maintained manually
				onUpdate(j);
			}
		}
	}, [content, type, onUpdate]);

	if (name && content && jsonContent) {
		return (
			<div className="flex flex-row gap-2">
				{name}
				<p>|</p>
				{type == "node" && (
					<p>
						{
							//@ts-expect-error nodes exist
							jsonContent.nodes.length
						}
						&nbsp;
						{I18n.get('app.extendbutton.nodes')}
					</p>
				)}
				{type == "path" && (
					<p>
						{
							//@ts-expect-error paths exist
							jsonContent.paths.length
						}
						&nbsp;
						{I18n.get('app.extendbutton.paths')}
					</p>
				)}
			</div>
		);
	}

	return (
		<Button onClick={selectFile} variant="secondary">
			{I18n.get('app.extendbutton.selectfile')}
		</Button>
	);
}

export default function ExtendButton() {
	const [newNodes, setNewNodes] = useState<never>();
	const [newPaths, setNewPaths] = useState<never>();

	const handleLoad = useCallback((onClose: () => void) => {
		if (newNodes && newPaths) {
			// @ts-expect-error nodes exist
			const nodes = [...MapData.getNodes(), ...newNodes.nodes];
			// @ts-expect-error paths exist
			const paths = [...MapData.getPaths(), ...newPaths.paths];

			MapData.reload(sanitizeMapData(nodes, paths));
			Navigator.reload();

			onClose();
		}
	}, [newNodes, newPaths]);

	const handleOpenLink = (link: string) => {
		const a = document.createElement('a');
		a.href = link;
		a.target = '_blank';
		a.click();
	}

	return (
		<Modal>
			<Button variant="outline">
				<FileUpIcon/>
				{I18n.get('app.extendbutton.extend')}
			</Button>
			<Modal.Backdrop>
				<Modal.Container size="lg">
					<Modal.Dialog>
						{(renderProps) => (
							<>
								<Modal.Header>
									<div className="flex flex-row items-center justify-start gap-3">
										<FileUpIcon className="h-8 w-8"/>
										<div className="flex flex-col items-start justify-start">
											<p className="text-lg">{I18n.get('app.extendbutton.extend')}</p>
											<p className="text-sm text-gray-500">{I18n.get('app.extendbutton.desc')}</p>
										</div>
									</div>
								</Modal.Header>
								<Separator className="mt-4 mb-4"/>
								<Modal.Body>
									<div className="w-full flex flex-col gap-3">
										<div className="w-full flex flex-row items-center justify-between">
											<Label className="flex flex-row justify-center items-center gap-1">
												{I18n.get('app.extendbutton.nodefile')}
												<Button size="sm" isIconOnly variant="ghost" onClick={() => handleOpenLink("https://github.com/iewnfod/HKU-MyGo/blob/master/data/nodes.json")}>
													<InfoIcon/>
												</Button>
											</Label>
											<FileSelectButton type="node" onUpdate={setNewNodes}/>
										</div>
										<div className="w-full flex flex-row items-center justify-between">
											<Label className="flex flex-row justify-center items-center gap-1">
												{I18n.get('app.extendbutton.pathfile')}
												<Button size="sm" isIconOnly variant="ghost" onClick={() => handleOpenLink("https://github.com/iewnfod/HKU-MyGo/blob/master/data/paths.json")}>
													<InfoIcon/>
												</Button>
											</Label>
											<FileSelectButton type="path" onUpdate={setNewPaths}/>
										</div>
									</div>
								</Modal.Body>
								<Modal.Footer className="gap-4">
									<Button onClick={() => renderProps.close()} variant="tertiary">
										{I18n.get('app.extendbutton.cancel')}
									</Button>
									<Button onClick={() => handleLoad(renderProps.close)} isDisabled={!newNodes && !newPaths}>
										{I18n.get('app.extendbutton.load')}
									</Button>
								</Modal.Footer>
							</>
						)}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
