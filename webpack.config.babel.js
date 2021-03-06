import webpack from 'webpack';
import path from 'path';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const PROD = process.env.NODE_ENV == 'production';

export default {
	entry: [
		'./app/Resources/public/js/app.jsx',
		'./app/Resources/public/css/main.scss'
	],
	output: {
		filename: `js/app.js`,
    	path: path.resolve(__dirname, './web/assets')
	},
	devtool: PROD ? 'hidden-source-map' : 'source-map',
	devServer: {
		contentBase: path.resolve(__dirname, 'web'),
		port: 8090,
		host: '0.0.0.0',
		stats: {
			colors: true
		}
	},
	module: {
		loaders: [
			{
				test: /(\.css|\.scss)$/,
				include: [
					path.resolve(__dirname, 'app/Resources/public/css')
				],
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true
							}
						},
						'sass-loader',
						'postcss-loader'
					]
				})
			},
			{
				loader: "babel-loader",
				include: [
					path.resolve(__dirname, 'app/Resources/public/js')
				],
				test: /\.jsx$/,
				query: {
					presets: ['env', 'react']
				}
			}
		]
	},
	plugins: (function(){
		let plugins = [
			new ExtractTextPlugin('css/[name].css'),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				'window.jQuery': 'jquery',
				Popper: ['popper.js', 'default'],
				// Bootstrap utils
				Util: "exports-loader?Util!bootstrap/js/dist/util",
				//For Bootstrap Navbar
				Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse"
			})
		];

		if(PROD){
			plugins.push(new UglifyJSPlugin());
		}

		return plugins;
	})()
};
