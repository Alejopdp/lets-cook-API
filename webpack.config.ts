const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: ["webpack/hot/poll?100", "./src/index.ts"],
    watch: true,
    context: __dirname,
    node: {
        __filename: true,
        __dirname: true,
    },
    target: "node",
    externals: [
        nodeExternals({
            allowlist: ["webpack/hot/poll?100"],
        }),
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".env", ".env.*"],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "index.js",
    },
};
