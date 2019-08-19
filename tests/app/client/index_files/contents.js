(function(){
	var commonFileEditor = window.commonFileEditor = new CommonFileEditor(
		document.getElementById('cont-common-file-editor'),
		function(cmdAry, callback){
			// サーバーでgitコマンドを実行するAPIを用意してください。
			// callback には、 gitコマンドが出力した文字列を返してください。
			var stdout = '';
			$.ajax({
				url: '/apis/git',
				method: 'POST',
				data: {"cmdAry": cmdAry},
				success: function(data){
					stdout += data;
				},
				error: function(data){
					stdout += data; // エラー出力も stdout に混ぜて送る
				},
				complete: function(){
					// alert(stdout);
					var result = JSON.parse(stdout);
					callback(result.code, result.stdout);
				}
			});
			return;
		},
		{}
	);
	// console.log(commonFileEditor);
	commonFileEditor.init(function(){
		console.log('ready.');
	});
})();
