const body = document.querySelector("body");
const $p = document.createElement("p");
$p.innerHTML =
	"使い方: githubのProjectでボタンが生えるよ & ドキュメントを生成できるよ";
if (body) {
	body.appendChild($p);
}
