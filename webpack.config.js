const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//console.log(path.resolve(__dirname, "assets","js"));// inporting path  and __dirname is givn by js
//__dirname shows basic path to here(/Users/jongbo/nomadcoder/wetube) and doing resolve to add path after thatt

module.exports = {
  entry: "./src/client/js/main.js",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css", //havin gthis in plugin to make css foler
    }),
  ],

  mode: "development",
  watch: true, //this is one is making webpack like nodaemon babel keep the thing on
  output: {
    filename: "js/main.js", //putthing js/ in front to make js folder
    path: path.resolve(__dirname, "assets"),
    clean: true, //cleans the output folder every time and re build, clear out assets folder
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], //when you are putting loader, it starts with last loader,
        //styles loader is to put on html, css loader is to turn sass to normal css and sass is what we are using to make
      },
    ],
  },
};
