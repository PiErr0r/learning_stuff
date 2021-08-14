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
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.json' ],
    alias: {
      Canvas: path.resolve(__dirname, "src/canvas/"),
      Contact: path.resolve(__dirname, "src/contact/"),
      FGs: path.resolve(__dirname, "src/FGs"),
      Geometry: path.resolve(__dirname, "src/geometry/"),
      Lib: path.resolve(__dirname, "src/lib"),
      Link: path.resolve(__dirname, "src/link"),
      Particle: path.resolve(__dirname, "src/particle/"),
    }
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