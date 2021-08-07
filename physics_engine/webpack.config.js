const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = env => ({
  entry: `./${env.folder}/index.ts`,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: [ {
            loader: "html-loader"
          }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
     },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: `./${env.folder}/index.html`,
      filename: "./index.html",
      baseUrl:  "/"
    }),
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000
  }
});