import { render } from "solid-js/web";
import App from "./widgets/app";

const root = document.createElement("div");
root.id = "extension-root";
document.body.append(root);

render(App, root);
