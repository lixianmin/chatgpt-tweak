import { render } from "solid-js/web";
import App from "./widgets/App";

const root = document.createElement("div");
root.id = "extension-root";
document.body.append(root);

render(App, root);
