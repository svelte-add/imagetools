import { updateViteConfig } from "../../adder-tools.js";
import { addImport, findImport, setDefault } from "../../ast-tools.js";

/** @type {import("../..").AdderRun<import("./__info.js").Options>} */
export const run = async ({ install, updateJavaScript }) => {
	await updateViteConfig({
		mutateViteConfig(viteConfig, containingFile, cjs) {
			let viteImagetoolsImportedAs = findImport({ cjs, package: "vite-imagetools", typeScriptEstree: containingFile }).named["imagetools"];
			if (!viteImagetoolsImportedAs) {
				viteImagetoolsImportedAs = "imagetools";
				addImport({ cjs, named: { imagetools: viteImagetoolsImportedAs }, package: "vite-imagetools", typeScriptEstree: containingFile });
			}

			const pluginsList = setDefault({
				object: viteConfig,
				default: {
					type: "ArrayExpression",
					elements: [],
				},
				property: "plugins",
			});
			if (pluginsList.type !== "ArrayExpression") throw new Error("`plugins` in Vite config needs to be an array");

			/** @type {import("estree").CallExpression | undefined} */
			let viteImagetoolsFunctionCall;
			for (const element of pluginsList.elements) {
				if (!element) continue;
				if (element.type !== "CallExpression") continue;
				if (element.callee.type !== "Identifier") continue;
				if (element.callee.name !== viteImagetoolsImportedAs) continue;
				viteImagetoolsFunctionCall = element;
			}

			// Add an imagetools() call to the Vite plugins list if missing
			if (!viteImagetoolsFunctionCall) {
				viteImagetoolsFunctionCall = {
					type: "CallExpression",
					callee: {
						type: "Identifier",
						name: viteImagetoolsImportedAs,
					},
					arguments: [],
					optional: false,
				};

				pluginsList.elements.push(viteImagetoolsFunctionCall);
			}
		},
		updateJavaScript,
	});

	await install({ package: "vite-imagetools" });
};
