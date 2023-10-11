# TimeTrack chrome extension

- togglとGitHub Projectsを連携させるchrome extension

# Constants

- `src/public/manifest.json` の URL
- github repositoryのpath

```sh
# .envrc
export TOGGL_API_TOKEN="***"
export TOGGL_WORKSPACE_ID="***"
export GITHUB_PAT="***"
export GITHUB_OWNER="OWNERNAME"
export GITHUB_PROJECT_NUMBER="NUMBER"
export GITHUB_ACTIONS_URL="https://api.github.com/repos/OWNER/REPONAME/dispatches"
export GITHUB_ACTIONS_EVENT_TYPE="EVENT_TYPE"
```

- `TOGGL_API_TOKEN`: https://track.toggl.com/profile の `API Token` から
- `TOGGL_WORKSPACE_ID`: https://track.toggl.com/timer の左のバーのProjectsをクリック→遷移した先のURLの `https://track.toggl.com/projects/NUMBER/list` のNUMBERの部分
- `GITHUB_PAT`: https://github.com/settings/tokens?type=beta から、Repository permission  Read access to metadata と Read and Write access to actions and code を許可したものを作成
- `GITHUB_OWNER`: GitHub Projects のオーナー名
- `GITHUB_PROJECT_NUMBER`: GitHub Projects のプロジェクト番号
- `GITHUB_ACTIONS_URL`: GitHub Actions のworkflow dispatchのURL
- `GITHUB_ACTIONS_EVENT_TYPE`: GitHub Actions のworkflow dispatchのイベントタイプ

# Setup

```sh
npm run setup # generate manifest.json
npm run build # dist に生成される

# あとはdistをchrome extensionから読み込めばOK(パッケージ化されていない拡張機能を読み込む)
```
