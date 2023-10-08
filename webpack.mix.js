const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
	.webpackConfig({
		module: {
			rules:[
				{
					test: /\.txt$/i,
					use: ['raw-loader'],
				},
				{
					test: /\.csv$/i,
					loader: 'csv-loader',
					options: {
						dynamicTyping: true,
						header: false,
						skipEmptyLines: false,
					},
				},
				{
					test:/\.twig$/,
					use:['twig-loader']
				},
				{
					test: /\.jsx$/,
					exclude: /(node_modules|bower_components)/,
					use: [{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-react',
								'@babel/preset-env'
							]
						}
					}]
				}
			]
		},
		resolve: {
			fallback: {
				"fs": false,
				"path": false,
				"crypto": false,
				"stream": false,
			}
		}
	})


	// --------------------------------------
	// common-file-editor
	.js('src/common-file-editor.js', 'dist/common-file-editor.js')
	.sass('src/common-file-editor.css.scss', 'dist/common-file-editor.css')
	.sass('src/themes/darkmode.css.scss', 'dist/themes/darkmode.css')
;
