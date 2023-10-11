import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig((opt) => {
	return {
		root: "src",
		build: {
			outDir: "../dist",
			rollupOptions: {
				input: {
					content_scripts: resolve(__dirname, "src/content_scripts.ts"),
					background: resolve(__dirname, "src/background.ts"),
					popup: resolve(__dirname, "src/timetrack.html"),
				},
				output: {
					entryFileNames: "[name].js",
				},
			},
		},
		define: {
			"import.meta.env.TOGGL_API_TOKEN": JSON.stringify(
				process.env.TOGGL_API_TOKEN,
			),
			"import.meta.env.TOGGL_WORKSPACE_ID": JSON.stringify(
				process.env.TOGGL_WORKSPACE_ID,
			),
			"import.meta.env.GITHUB_PAT": JSON.stringify(process.env.GITHUB_PAT),
			"import.meta.env.GITHUB_ACTIONS_URL": JSON.stringify(
				process.env.GITHUB_ACTIONS_URL,
			),
			"import.meta.env.GITHUB_ACTIONS_EVENT_TYPE": JSON.stringify(
				process.env.GITHUB_ACTIONS_EVENT_TYPE,
			),
		},
	};
});
