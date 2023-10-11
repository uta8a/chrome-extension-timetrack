chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
	if (!message) {
		sendResponse({
			status: false,
			reason: "message is missing",
		});
	} else if (message.contentScriptQuery === "startTimeEntry") {
		const getData = async () => {
			try {
				const response = await fetch(
					`https://api.track.toggl.com/api/v9/workspaces/${
						import.meta.env.TOGGL_WORKSPACE_ID
					}/projects`,
					{
						method: "GET",
						mode: "cors",
						credentials: "include",
						headers: {
							// 'Content-Type': 'application/json',
							Authorization: `Basic ${btoa(
								`${import.meta.env.TOGGL_API_TOKEN}:api_token`,
							)}`,
						},
					},
				);
				if (!response.ok) {
					sendResponse({
						status: false,
						reason: "[GET project] failed to fetch response not ok",
					});
					return;
				}
				const projectsData = await response.json();
				let projectId = null;
				for (const projectData of projectsData) {
					if (projectData.name === message.project) {
						projectId = projectData.id;
					}
				}
				if (projectId === null) {
					const query = {
						active: true,
						auto_estimates: false,
						is_private: true,
						name: message.project,
					};
					const res = await fetch(
						`https://api.track.toggl.com/api/v9/workspaces/${
							import.meta.env.TOGGL_WORKSPACE_ID
						}/projects`,
						{
							method: "POST",
							mode: "cors",
							credentials: "include",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Basic ${btoa(
									`${import.meta.env.TOGGL_API_TOKEN}:api_token`,
								)}`,
							},
							body: JSON.stringify(query),
						},
					);
					if (!res.ok) {
						sendResponse({
							status: false,
							reason: "[POST project] failed to fetch response not ok",
						});
						return;
					}
					const resJson = await res.json();
					projectId = resJson.id;
				}
				if (projectId === null) {
					sendResponse({
						status: false,
						reason: "specify project in toggl",
					});
					return;
				}
				console.log("projectId", projectId);
				const query = {
					description: message.entry,
					created_with: "UPJ chrome extension",
					duration: -1,
					project_id: projectId,
					start: new Date().toISOString(),
					workspace_id: Number(import.meta.env.TOGGL_WORKSPACE_ID),
					tags: [],
				};
				const startTimeEntryResponse = await fetch(
					`https://api.track.toggl.com/api/v9/workspaces/${
						import.meta.env.TOGGL_WORKSPACE_ID
					}/time_entries`,
					{
						method: "POST",
						mode: "cors",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Basic ${btoa(
								`${import.meta.env.TOGGL_API_TOKEN}:api_token`,
							)}`,
						},
						body: JSON.stringify(query),
					},
				);
				console.log("timeEntries query", JSON.stringify(query));
				if (!startTimeEntryResponse.ok) {
					sendResponse({
						status: false,
						reason: `[POST time_entries] failed to fetch response not ok ${startTimeEntryResponse.statusText}`,
					});
					return;
				}
				const status = await startTimeEntryResponse.json();
				sendResponse(status);
			} catch (e) {
				sendResponse({
					status: false,
					reason: `failed to fetch ${e}`,
				});
			}
		};
		getData();
	} else if (message.contentScriptQuery === "makeNewDocs") {
		const getData = async () => {
			try {
				// post github actions
				const query = {
					event_type: import.meta.env.GITHUB_ACTIONS_EVENT_TYPE,
					client_payload: {
						task: message.entry,
						project: message.project,
					},
				};
				const response = await fetch(import.meta.env.GITHUB_ACTIONS_URL, {
					method: "POST",
					mode: "cors",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/vnd.github.v3+json",
						Authorization: `token ${import.meta.env.GITHUB_PAT}`,
					},
					body: JSON.stringify(query),
				});
				if (!response.ok) {
					sendResponse({
						status: false,
						reason: "[POST github actions] failed",
					});
					return;
				}
				sendResponse({
					status: true,
					reason: "ok",
				});
			} catch (e) {
				sendResponse({
					status: false,
					reason: `[try] failed to fetch ${e}`,
				});
			}
		};
		getData();
	}
	return true;
});
