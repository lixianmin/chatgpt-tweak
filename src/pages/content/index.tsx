import { render } from "solid-js/web";
import App from "./widgets/App";

const root = document.createElement("div");
root.id = "extension-root";
document.body.append(root);

// 这不是跟react中的render()同名嘛？
render(App, root);
