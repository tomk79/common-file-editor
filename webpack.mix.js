const path = require('path');
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
				},
				{
					test: /\.tsx?$/,
					include: [
						path.resolve(__dirname, 'src'),
						path.resolve(__dirname, 'node_modules/@tomk79/htmm'),
					],
					use: {
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
							compilerOptions: {
								module: 'esnext',
								moduleResolution: 'node',
								jsx: 'react-jsx',
								allowSyntheticDefaultImports: true,
								esModuleInterop: true,
								noEmit: true,
							},
						},
					},
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
			alias: {
				// 単一の React に統一（htmm の node_modules/react を参照させない）
				'react': path.resolve(__dirname, 'node_modules/react'),
				'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
				'react-dom/client': path.resolve(__dirname, 'node_modules/react-dom/client'),
			},
			fallback: {
				"fs": false,
				"path": false,
				"crypto": false,
				"stream": false,
			}
		},
		optimization: {
			splitChunks: false,
			runtimeChunk: false,
		}
	})


	// --------------------------------------
	// common-file-editor
	.js('src/common-file-editor.js', 'dist/common-file-editor.js')
	.sass('src/common-file-editor.css.scss', 'dist/common-file-editor.css')
	.sass('src/themes/darkmode.css.scss', 'dist/themes/darkmode.css')
;
