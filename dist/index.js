"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_async_ssr_1 = require("react-async-ssr");
let data = null;
let promise;
function LazyData() {
    if (data)
        return react_1.default.createElement("div", null, data.foo);
    if (!promise) {
        promise = new Promise(resolve => {
            setTimeout(() => {
                data = { foo: 'bar' };
                resolve();
            }, 1000);
        });
    }
    throw promise;
}
function App() {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement("div", null, "Loading...") },
            react_1.default.createElement(LazyData, null))));
}
const execute = async () => {
    const html = await react_async_ssr_1.renderToStringAsync(react_1.default.createElement(App, null));
    console.log(html);
};
execute();
