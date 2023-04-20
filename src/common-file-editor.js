/**
 * CommonFileEditor
 */
window.CommonFileEditor = function($elm, options){
	var main = this;
	options = options || {};
	options.lang = options.lang || "ja";
	options.read = options.read || function(){};
	options.write = options.write || function(){};
	options.onemptytab = options.onemptytab || function(){};

	this.pages = {};

	var _twig = require('twig');
	var LangBank = require('langbank');
	var languageCsv = require('./languages/language.csv');

	var $elms = {};

	var templates = {
		"mainframe": require('./resources/templates/mainframe.html'),
		"tab": require('./resources/templates/tab.html'),
		"tabbody": require('./resources/templates/tabbody.html'),
		"preview": require('./resources/templates/preview.html'),
		"editor": {
			"texteditor": require('./resources/templates/editor/texteditor.html')
		}
	};

	/**
	 * CommonFileEditor を初期化します。
	 */
	this.init = function( callback ){
		callback = callback || function(){};

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				main.lb = new LangBank(languageCsv, ()=>{
					main.lb.setLang( options.lang );
					rlv();
				});
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				$elm.classList.add("common-file-editor");
				$elm.innerHTML = templates.mainframe;

				// tab bar
				$elms.tabBar = $elm.querySelector('.common-file-editor__tab-bar > ul');

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
			var $preview = main.bindTwig(templates.preview, {
				filename: filename,
				ext: ext,
				label: filename,
				base64: result.base64,
				bin: main.base64_decode(result.base64)
			});

			var $currentBody = $elms.body.querySelector('.common-file-editor__tab-body[data-filename="'+filename+'"]');
			$currentBody.innerHTML = $preview;
			$currentBody.querySelector('.common-file-editor__btn-edit-as-a-text').addEventListener('click', function(e){
				var filename = this.getAttribute('data-filename');
				main.edit(filename);
			});
			$currentBody.querySelector('button.common-file-editor__btn-close').addEventListener('click', function(e){
				var filename = this.getAttribute('data-filename');
				main.closeTab(filename);
			});
			$currentBody.addEventListener('dragover', function(e){
				e.stopPropagation();
				e.preventDefault();
			});
			$currentBody.addEventListener('drop', function(e){
				e.stopPropagation();
				e.preventDefault();
				if(!e.dataTransfer.files.length){
					return;
				}
				var filename = this.getAttribute('data-filename');
				var fileInfo = e.dataTransfer.files[0];
				// alert(filename);
				console.log(fileInfo);
				(function(fileInfo, callback){
					var reader = new FileReader();
					reader.onload = function(evt) {
						// console.log(evt.target);
						callback( evt.target.result );
					}
					reader.readAsDataURL(fileInfo);
				})(fileInfo, function(dataUri){
					dataUri.match(/^data\:([^\/]+?\/[^\/]+?)\;base64\,([\s\S]*)$/g);
					var mime = RegExp.$1;
					var base64 = RegExp.$2;
					options.write(filename, base64, function(){
						main.preview(filename);
					});
				});
			});

		} );
	}

	/**
	 * ファイルの編集画面を開く
	 */
	this.edit = function(filename){
		this.createNewTab(filename);

		options.read( filename, function(result){
			var $texteditor = main.bindTwig(templates.editor.texteditor, {
				filename: filename,
				label: filename,
				bin: main.base64_decode(result.base64)
			});

			var $currentBody = $elms.body.querySelector('.common-file-editor__tab-body[data-filename="'+filename+'"]');
			$currentBody.innerHTML = $texteditor;
			$currentBody.querySelector('form').addEventListener('submit', function(e){
				var filename = this.getAttribute('data-filename');
				var newSrc = this.querySelector('textarea[name="common-file-editor__editor"]').value;
				options.write(filename, main.base64_encode(newSrc), function(result){
					if(!result){
						alert('Failed');
						return;
					}
					main.preview(filename);
				});
				return false;
			});
			$currentBody.querySelector('button.common-file-editor__btn-cancel').addEventListener('click', function(e){
				var filename = this.getAttribute('data-filename');
				main.preview(filename);
			});
		} );
	}

	function tabOnClick(e){
		main.switchTab(this.getAttribute('data-filename'));
	}

	/**
	 * 新しいタブを生成する
	 */
	this.createNewTab = function(filename){
		if(!$elm.querySelector('.common-file-editor__tab-bar a[data-filename="'+filename+'"]')){
			var $tab = main.bindTwig(templates.tab, {
				filename: filename,
				label: filename
			});
			$elms.tabBar.innerHTML += $tab;
		}
		if(!$elms.body.querySelector('.common-file-editor__tab-body[data-filename="'+filename+'"]')){
			var $tabBody = main.bindTwig(templates.tabbody, {
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
		}else{
			options.onemptytab();
		}
		return;
	}

	/**
	 * タブを切り替える
	 */
	this.switchTab = function(filename){

		// 一旦全部をノンアクティブ化
		$elm.querySelectorAll('.common-file-editor__tab-bar a').forEach(function(elm){
			elm.classList.remove('current');
		});
		$elms.body.querySelectorAll('.common-file-editor__tab-body').forEach(function(elm){
			elm.style.display = 'none';
		});

		// 対象のタブをアクティブ化
		$elm.querySelector('.common-file-editor__tab-bar a[data-filename="'+filename+'"]').classList.add('current');
		$elms.body.querySelector('.common-file-editor__tab-body[data-filename="'+filename+'"]').style.display = 'flex';

		return;
	}

	/**
	 * base64に変換する
	 */
	this.base64_encode = function( bin ){
		var base64 = new Buffer(bin).toString('base64');
		return base64;
	}

	/**
	 * base64を逆変換する
	 */
	this.base64_decode = function( base64 ){
		var bin = new Buffer(base64, 'base64').toString();
		return bin;
	}

	/**
	 * HTML特殊文字をエスケープする
	 */
	this.htmlspecialchars = function( html ){
		html = html.split('<').join('&lt;');
		html = html.split('>').join('&gt;');
		html = html.split('"').join('&quot;');
		return html;
	}

	/**
	 * Twig テンプレートを処理する
	 */
	this.bindTwig = function( templateSrc, bindData ){
		var data = {
			"lb": main.lb,
			...bindData,
		};
		var template = _twig.twig({
			data: templateSrc,
		});
		return template.render(data);
	}
}
