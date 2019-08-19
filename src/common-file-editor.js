/**
 * CommonFileEditor
 */
window.CommonFileEditor = function($elm, fncCallGit, options){
	var _this = this;
	options = options || {};
	options.committer = options.committer || {};
	this.pages = {};

	var _twig = require('twig');

	var $elms = {};

	var templates = {
		"mainframe": require('./resources/templates/mainframe.html')
	};

	var committer = {
		name: "",
		email: ""
	};
	var currentBranchName;

	/**
	 * CommonFileEditor を初期化します。
	 */
	this.init = function( callback ){
		callback = callback || function(){};

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				// initialize page
				_this.pages.status();
				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				callback();
				rlv();
			}); })
		;
	}

	/**
	 * ページを開く
	 */
	function loadPage(pageName){
		$elm.querySelectorAll('.common-file-editor__toolbar a').forEach(function(elm){
			elm.classList.remove('active');
		});
		$elm.querySelector('.common-file-editor__btn--'+pageName).classList.add('active');
		_this.pages[pageName]();
	}

	/**
	 * page: status
	 */
	this.pages.status = function(){
		$elms.body.innerHTML = '';
		var git_status;

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				rlv();
			}); })
		;
	}

}
