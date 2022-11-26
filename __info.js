export const name = "Imagetools";

export const emoji = "🖼";

export const usageMarkdown = ["You can preprocess images"];

/** @type {import("../..").Gatekeep} */
export const gatekeep = async () => {
	return { able: true };
};

/** @typedef {{}} Options */

/** @type {import("../..").AdderOptions<Options>} */
export const options = {};

/** @type {import("../..").Heuristic[]} */
export const heuristics = [
	{
		description: "`vite-imagetools` is installed",
		async detector({ folderInfo }) {
			return "vite-imagetools" in folderInfo.allDependencies;
		},
	},
	{
		description: "The vite-imagetools plugin is set up",
		async detector({ readFile }) {
			/** @param {string} text */
			const vitePluginIsProbablySetup = (text) => {
				if (!text.includes("vite-imagetools")) return false;
				if (!text.includes("imagetools(")) return false;

				return true;
			};

			const vite = await readFile({ path: "/vite.config.js" });

			if (vitePluginIsProbablySetup(vite.text)) return true;

			return false;
		},
	},
];
