(function(){
	var commonFileEditor = window.commonFileEditor = new CommonFileEditor(
		document.getElementById('cont-common-file-editor'),
		{
			read: function(filename, callback){
				// サーバーでファイルを読み込むAPIを用意してください。
				// callback には、結果(true or false)を返してください。
				var stdout = '';
				$.ajax({
					url: '/apis/read',
					method: 'POST',
					data: {"filename": filename},
					success: function(data){
						stdout += data;
					},
					error: function(data){
						stdout += data; // エラー出力も stdout に混ぜて送る
					},
					complete: function(){
						// alert(stdout);
						var result = JSON.parse(stdout);
						callback(result);
					}
				});
				return;
			},
			write: function(filename, base64, callback){
				// サーバーでファイルを保存するAPIを用意してください。
				// callback には、結果(true or false)を返してください。
				var stdout = '';
				$.ajax({
					url: '/apis/write',
					method: 'POST',
					data: {"filename": filename, "base64": base64},
					success: function(data){
						stdout += data;
					},
					error: function(data){
						stdout += data; // エラー出力も stdout に混ぜて送る
					},
					complete: function(){
						// alert(stdout);
						var result = JSON.parse(stdout);
						callback(result);
					}
				});
				return;
			}
		}
	);
	// console.log(commonFileEditor);
	commonFileEditor.init(function(){
		console.log('ready.');
		commonFileEditor.createNewPreview('/test/a.html');
	});
})();
