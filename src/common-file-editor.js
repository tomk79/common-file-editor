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
		"tabbody": require('./resources/templates/tabbody.html'),
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
	this.preview = function(filename){
		this.createNewTab(filename);

		options.read( filename, function(result){
			// console.log(result);
			var ext = filename.replace(/^[\s\S]*\.([\s\S]+)$/, '$1').toLowerCase();
			var $preview = _twig.twig({
				data: templates.preview
			}).render({
				filename: filename,
				ext: ext,
				label: filename,
				base64: result.base64,
				bin: _this.base64_decode(result.base64)
			});

			var $currentBody = $elms.body.querySelector('.common-file-editor__tab-body[data-filename="'+filename+'"]');
			$currentBody.innerHTML = $preview;
			$currentBody.querySelector('.common-file-editor__btn-edit-as-a-text').addEventListener('click', function(e){
				var filename = this.getAttribute('data-filename');
				_this.edit(filename);
			});
			$currentBody.querySelector('button.common-file-editor__btn-close').addEventListener('click', function(e){
				var filename = this.getAttribute('data-filename');
				_this.closeTab(filename);
			});
			$currentBody.addEventListener('dragover', function(e){
				e.stopPropagation();
				e.preventDefault();
			});
			$currentBody.addEventListener('drop', function(e){
				e.stopPropagation();
				e.preventDefault();
				var filename = this.getAttribute('data-filename');
				var fileInfo = e.dataTransfer.files[0];
				// alert(filename);
				console.log(fileInfo);
				(function(fileInfo, callback){
					var reader = new FileReader();
					reader.onload = function(evt) {
						callback( evt.target.result );
					}
					reader.readAsDataURL(fileInfo);
				})(fileInfo, function(dataUri){
					dataUri.match(/^data\:([^\/]+?\/[^\/]+?)\;base64\,([\s\S]*)$/g);
					var mime = RegExp.$1;
					var base64 = RegExp.$2;
					options.write(filename, base64, function(){
						_this.preview(filename);
					});
				});
			});

		} );

		// _this.pages[pageName]();
	}

	/**
	 * ファイルの編集画面を開く
	 */
	this.edit = function(filename){
		this.createNewTab(filename);

		options.read( filename, function(result){
			var $texteditor = _twig.twig({
				data: templates.editor.texteditor
			}).render({
				filename: filename,
				label: filename,
				bin: _this.base64_decode(result.base64)
			});

			var $currentBody = $elms.body.querySelector('.common-file-editor__tab-body[data-filename="'+filename+'"]');
			$currentBody.innerHTML = $texteditor;
			$currentBody.querySelector('form').addEventListener('submit', function(e){
				var filename = this.getAttribute('data-filename');
				var newSrc = this.querySelector('textarea[name="common-file-editor__editor"]').value;
				options.write(filename, _this.base64_encode(newSrc), function(result){
					if(!result){
						alert('Failed');
						return;
					}
					_this.preview(filename);
				});
				return false;
			});
			$currentBody.querySelector('button.common-file-editor__btn-cancel').addEventListener('click', function(e){
				var filename = this.getAttribute('data-filename');
				_this.preview(filename);
			});
		} );

		// _this.pages[pageName]();
	}

	function tabOnClick(e){
		_this.switchTab(this.getAttribute('data-filename'));
	}

	/**
	 * 新しいタブを生成する
	 */
	this.createNewTab = function(filename){
		if(!$elm.querySelector('.common-file-editor__tab-bar a[data-filename="'+filename+'"]')){
			var $tab = _twig.twig({
				data: templates.tab
			}).render({
				filename: filename,
				label: filename
			});
			$elms.tabBar.innerHTML += $tab;
		}
		if(!$elms.body.querySelector('.common-file-editor__tab-body[data-filename="'+filename+'"]')){
			var $tabBody = _twig.twig({
				data: templates.tabbody
			}).render({
				filename: filename,
				label: filename
			});
			$elms.body.innerHTML += $tabBody;
		}

		$elm.querySelectorAll('.common-file-editor__tab-bar a').forEach(function(a){
			a.removeEventListener('click', tabOnClick);
			a.addEventListener('click', tabOnClick);
		});

		return this.switchTab(filename);
	}

	/**
	 * タブを閉じる
	 */
	this.closeTab = function(filename){
		var tab = $elm.querySelector('.common-file-editor__tab-bar a[data-filename="'+filename+'"]');
		var body = $elms.body.querySelector('.common-file-editor__tab-body[data-filename="'+filename+'"]');
		if(tab){
			tab.parentNode.removeChild(tab);
		}
		if(body){
			body.parentNode.removeChild(body);
		}

		// 残ったタブ
		var tabs = $elm.querySelectorAll('.common-file-editor__tab-bar a');
		if( tabs.length ){
			var focus = tabs[0].getAttribute('data-filename');
			this.switchTab(focus);
		}
		return;
	}

	/**
	 * タブを切り替える生成する
	 */
	this.switchTab = function(filename){

		// 一旦全部をノンアクティブ化
		$elm.querySelectorAll('.common-file-editor__tab-bar a').forEach(function(elm){
			elm.classList.remove('active');
		});
		$elms.body.querySelectorAll('.common-file-editor__tab-body').forEach(function(elm){
			elm.style.display = 'none';
		});

		// 対象のタブをアクティブ化
		$elm.querySelector('.common-file-editor__tab-bar a[data-filename="'+filename+'"]').classList.add('active');
		$elms.body.querySelector('.common-file-editor__tab-body[data-filename="'+filename+'"]').style.display = 'block';

		return;
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
