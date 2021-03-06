var gulp = require('gulp');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var sass = require('gulp-sass');//CSSコンパイラ
var autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
var minifyCss = require('gulp-minify-css');//CSSファイルの圧縮ツール
var uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
var concat = require('gulp-concat');//ファイルの結合ツール
var plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
var rename = require("gulp-rename");//ファイル名の置き換えを行う
var packageJson = require(__dirname+'/package.json');
var _tasks = [
	'client-libs',
	'common-file-editor.js',
	'.css.scss'
];

// client-libs (frontend) を処理
gulp.task("client-libs", function() {
	// gulp.src(["node_modules/px2style/dist/**/*"])
	// 	.pipe(gulp.dest( './tests/app/client/libs/px2style/dist/' ))
	// ;
});

// src 中の *.css.scss を処理
gulp.task('.css.scss', function(){
	gulp.src("src/**/*.css.scss")
		.pipe(plumber())
		.pipe(sass({
			"sourceComments": false
		}))
		.pipe(autoprefixer())
		.pipe(rename({
			extname: ''
		}))
		.pipe(rename({
			extname: '.css'
		}))
		.pipe(gulp.dest( './dist/' ))

		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest( './dist/' ))
	;
});

// common-file-editor.js (frontend) を処理
gulp.task("common-file-editor.js", function() {
	return webpackStream({
		mode: 'development',
		entry: "./src/common-file-editor.js",
		output: {
			filename: "common-file-editor.js"
		},
		module:{
			rules:[
				{
					test:/\.html$/,
					use:['html-loader']
				}
			]
		}
	}, webpack)
		.pipe(plumber())
		.pipe(gulp.dest( './dist/' ))
		.pipe(concat('common-file-editor.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest( './dist/' ))
	;
});

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["src/**/*"], _tasks);
});

// ブラウザを立ち上げてプレビューする
gulp.task("preview", function() {
	require('child_process').spawn('open',['http://127.0.0.1:3000/']);
});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
