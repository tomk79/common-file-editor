/**
 * CommonFileEditor
 */
window.CommonFileEditor = function($elm, options){
	var _this = this;
	options = options || {};
	options.read = options.read || function(){};
	options.write = options.write || function(){};
	this.pages = {};

	var _twig = require('twig');

	var $elms = {};

	var templates = {
		"mainframe": require('./resources/templates/mainframe.html'),
		"tab": require('./resources/templates/tab.html'),
		"preview": require('./resources/templates/preview.html'),
		"editor": {
			"texteditor": require('./resources/templates/editor/texteditor.html'),
			"uploader": require('./resources/templates/editor/uploader.html')
		}
	};

	/**
	 * CommonFileEditor を初期化します。
	 */
	this.init = function( callback ){
		callback = callback || function(){};

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				$elm.classList.add("common-file-editor");
				$elm.innerHTML = templates.mainframe;

				// tab bar
				$elms.tabBar = $elm.querySelector('.common-file-editor__tab-bar .nav-tabs');

				// body
				$elms.body = $elm.querySelector('.common-file-editor__body');

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				callback();
				rlv();
			}); })
		;
	}

	/**
	 * ファイルのプレビューを開く
	 */
	this.createNewPreview = function(filename){
		var $tab = _twig.twig({
			data: templates.tab
		}).render({
			filename: filename,
			label: filename
		});
		$elms.tabBar.innerHTML += $tab;

		$elm.querySelectorAll('.common-file-editor__tab-bar a').forEach(function(elm){
			elm.classList.remove('active');
		});
		$elm.querySelector('.common-file-editor__tab-bar a[data-filename="'+filename+'"]').classList.add('active');

		var $preview = _twig.twig({
			data: templates.preview
		}).render({
			filename: filename,
			label: filename
		});
		$elms.body.innerHTML += $preview;

		$elms.body.querySelectorAll('.common-file-editor__tab-body').forEach(function(elm){
			elm.style.displya = 'none';
		});
		var $currentBody = $elms.body.querySelector('.common-file-editor__tab-body[data-filename="'+filename+'"]');
		$currentBody.style.displya = 'block';

		options.read( filename, function(result){
			console.log(result);
			$currentBody.querySelector('pre code').innerHTML = _this.htmlspecialchars(_this.base64_decode(result.base64));
		} );

		// _this.pages[pageName]();
	}

	this.base64_encode = function( bin ){
		var base64 = new Buffer(bin).toString('base64');
		return base64;
	}
	this.base64_decode = function( base64 ){
		var bin = new Buffer(base64, 'base64').toString();
		return bin;
	}
	this.htmlspecialchars = function( html ){
		html = html.split('<').join('&lt;');
		html = html.split('>').join('&gt;');
		html = html.split('"').join('&quot;');
		return html;
	}

}
