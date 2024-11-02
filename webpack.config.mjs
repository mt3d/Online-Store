import path from "path";
import { fileURLToPath } from "url";

// __dirname is not available in ES Modules, and so we have to recreate it.
// So, this code is in a way a boilerplate.
// ESM provides a standardized global called import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: "development",
    entry: "./src/admin/client.js",
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "dist/admin"),
        filename: "bundle.js"
    },
    devServer:{
        watchFiles: ["templates/admin"],
        port: 5100,
        client: {
            webSocketURL: "http://localhost:5000/ws"
        }
    }
}