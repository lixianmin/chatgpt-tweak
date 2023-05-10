import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = packageJson.version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

const manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: packageJson.displayName ?? packageJson.name,
  version: `${major}.${minor}.${patch}.${label}`,
  description: packageJson.description,
  options_page: "src/pages/options/index.html",
  background: { service_worker: "src/pages/background/index.ts" },
  action: {
    // default_popup: "src/pages/popup/index.html",
    // default_icon: "icons/34x34.png"
  },
  // chrome_url_overrides: {
  //   newtab: "src/pages/newtab/index.html",
  // },
  icons: {
    "128": "src/assets/icons/128x128.png"
  },
  content_scripts: [
    {
      matches: packageJson.siteUrls,
      js: ["src/pages/content/index.tsx"]
    }
  ],
  // devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: ["assets/js/*.js", "assets/css/*.css", "assets/images/*"],
      matches: ["*://*/*"]
    }
  ],
  permissions: [
    "storage",  // 不加这个，Browser.storage.sync取不到
    "tabs"      // 在option页面中遍历tabs需要这个权限, 但在content页面中无法遍历其它tabs, 需要通过Browser.runtime.sendMessage中转一下
    // "webRequest",
    // "webRequestBlocking",
    // "*://*/*"
  ]
}));

export default manifest;
