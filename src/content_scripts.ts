const main = () => {
  const jsInitCheckTimer = setInterval(jsLoaded, 500);
  const isBoard = (url: string): boolean => {
    return /views\/\d+$/.test(url);
  };
  const isPanel = (url: string): boolean => {
    return /itemId=\d+$/.test(url);
  };

  function jsLoaded() {
    if (
      (isBoard(window.location.href) &&
        document.querySelectorAll("[data-testid='board-view-column-card']") !==
          null) ||
      (isPanel(window.location.href) &&
        document.querySelectorAll(
          "[data-testid='side-panel-title-content']"
        ) !== null)
    ) {
      console.log("loaded");
    }
    clearInterval(jsInitCheckTimer);

    const makeNewDocs = (event: MouseEvent) => {
      const getData = async () => {
        let timeEntryTitle = null;
        let timeEntryProject = null;
        const paths = event.composedPath();
        for (const raw_path of paths) {
          const path = raw_path as HTMLElement;
          // GitHubのHTML構造が変わったら path を出力してデバッグ
          if (path.getAttribute("data-testid") === "board-view-column-card") {
            const task = path.querySelector<HTMLElement>(
              "[data-testid='card-side-panel-trigger']"
            )?.innerText;
            const project = path.querySelector<HTMLElement>(
              "[data-testid='custom-label-Project']"
            )?.innerText;
            timeEntryTitle = task || "default";
            timeEntryProject = project || "default";
            break;
          }
        }
        // send request through background.js(Service Worker)
        chrome.runtime.sendMessage(
          {
            contentScriptQuery: "makeNewDocs",
            entry: timeEntryTitle,
            project: timeEntryProject,
          },
          (response) => {
            console.log(response);
            if (response.data !== undefined) {
              console.log("status ok");
            }
          }
        );
      };
      getData();
    };

    const togglPost = (event: MouseEvent) => {
      const getData = async () => {
        let timeEntryTitle = null;
        let timeEntryProject = null;
        const paths = event.composedPath();
        for (const raw_path of paths) {
          const path = raw_path as HTMLElement;
          // GitHubのHTML構造が変わったら path を出力してデバッグ
          if (path.getAttribute("data-testid") === "board-view-column-card") {
            const task = path.querySelector<HTMLElement>(
              "[data-testid='card-side-panel-trigger']"
            )?.innerText;
            const project = path.querySelector<HTMLElement>(
              "[data-testid='custom-label-Project']"
            )?.innerText;
            timeEntryTitle = task || "default";
            timeEntryProject = project || "default";
            break;
          }
        }
        // send request through background.js(Service Worker)
        chrome.runtime.sendMessage(
          {
            contentScriptQuery: "startTimeEntry",
            entry: timeEntryTitle,
            project: timeEntryProject,
          },
          (response) => {
            console.log(response);
            if (response.data !== undefined) {
              console.log("status ok");
            }
          }
        );
      };
      getData();
    };
    // style: add button
    const issues = document.querySelectorAll(
      "[data-testid='board-view-column-card'] [data-testid='board-card-header'] > div:nth-child(1)"
    );

    for (const issue of issues) {
      // make docs
      const btn2 = document.createElement("button");
      const txt2 = document.createTextNode("🖊️");
      btn2.className = "actions-github-chrome-extension";
      btn2.appendChild(txt2);
      issue.appendChild(btn2);
      btn2.addEventListener("click", makeNewDocs, false);
      // start toggl
      const btn = document.createElement("button");
      const txt = document.createTextNode("▶️");
      btn.className = "toggl-github-chrome-extension";
      btn.appendChild(txt);
      issue.appendChild(btn);
      btn.addEventListener("click", togglPost, false);
    }
  }
};

window.addEventListener("load", main, false);
