const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

let conf = {
	target: 'web',
	name: 'client',
	devtool: 'source-map',
	entry: [
		'webpack-hot-middleware/client',
		'./src/index.js'
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.min.js',
		publicPath: "/dist"
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		inline: false,
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/',
				query: {compact: false}
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
		          fallback: "style-loader",
		          use: ["css-loader", "sass-loader"]
		        })
			},
			{
				test: /\.pug$/,
				loader: 'pug-loader',
				options: {
					pretty: true
				}
			},
			{
				test: /\.(jpg|png|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[ext]',
							publicPath: './'
						}
					}
				] 
			},
			{
				test: /\.mp3$/,
        		loader: 'file-loader'
			}
		]
	},
	plugins: [
    	new HtmlWebpackPlugin({
    		template: path.resolve(__dirname, './src/views/index.pug')
    	}),
    	new ExtractTextPlugin("style.css"),
    	new webpack.HotModuleReplacementPlugin(),
    	new webpack.NoEmitOnErrorsPlugin()
  	]
};
module.exports = conf;
/*module.exports = (env, options) => {
	let production = options.mode === 'production';
	conf.devtool = production ? 'source-map' : 'eval-sourcemap';
	return conf;
}*/
