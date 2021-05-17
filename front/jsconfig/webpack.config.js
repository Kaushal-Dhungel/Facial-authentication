const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "../src/index.js",
  output: {
    path: path.resolve(__dirname, "../static/reactjs"),
    // filename: "[name].js",
    filename : "reactapp.js"
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },

      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },

      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },

    ],


  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],

  resolve: {
    modules: [path.resolve(__dirname,"./node_modules")],
    extensions: ['.js', '.jsx']
}
};