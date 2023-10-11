#!/bin/sh bash

MANIFEST=`cat <<EOF
{
	"manifest_version": 3,
	"name": "TimeTrack extension",
	"description": "TimeTrack with Toggl and GitHub Projects",
	"version": "1.0",
	"permissions": [],
	"host_permissions": [
		"https://api.track.toggl.com/api/v9/*",
		"https://api.github.com/*"
	],
	"action": {
		"default_popup": "timetrack.html",
		"default_icon": "timetrack.png"
	},
	"background": {
		"service_worker": "background.js"
	},
	"content_scripts": [
		{
			"matches": ["https://github.com/users/${GITHUB_OWNER}/projects/${GITHUB_PROJECT_NUMBER}/*"],
			"run_at": "document_end",
			"all_frames": true,
			"js": ["content_scripts.js"],
			"css": ["content_styles.css"]
		}
	]
}
`

echo ${MANIFEST} > ./src/public/manifest.json
