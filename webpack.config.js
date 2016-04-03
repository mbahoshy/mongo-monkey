
var path = require('path')
var webpack = require('webpack')
var HtmlWebPackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var output = process.argv.indexOf('-p') !== -1 ? "build" : "server";

module.exports = {
  devtool: 'source-map',
  entry: {
    app: './client/app.js',
  },
  output: {
    path: path.join(__dirname, output, 'public'),
    publicPath: "/",
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.woff(2)?/,   loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf/, loader: "file-loader" },
      { test: /\.eot/, loader: "file-loader" },
      { test: /\.svg/, loader: "file-loader" },
      // { test: require.resolve('jquery'), loader: "expose?jQuery" },
      { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")  },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")  },
      { test: /\.png$/, loader: "file-loader" },
      { test: /\.gif$/, loader: "file-loader" },
      {include: /\.json$/, loaders: ["json-loader"]}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.less', '.json'],
    modulesDirectories: ['client', 'client/routes', 'client/less', 'client/components', 'node_modules']
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'ENVIRONMENT',
    ]),
    new HtmlWebPackPlugin({
      inject: false,
      template: './client/templates/index.ejs',
      filename: '../templates/index.ejs'
    }),
    new ExtractTextPlugin("[name].css")
  ]
}
