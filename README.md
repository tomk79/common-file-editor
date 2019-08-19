# common-file-editor
汎用的なファイル編集インターフェイスを提供するJavaScriptライブラリ

## Usage

```html
<div id="common-file-editor"></div>

<script>
var commonFileEditor = new CommonFileEditor(
    document.getElementById('common-file-editor'),
    function(cmdAry, callback){
        // サーバーでgitコマンドを実行するAPIを用意してください。
        // callback には、 gitコマンドが出力した文字列を返してください。
        var stdout = '';
        $.ajax({
            url: '/path/to/endpoint',
            data: cmdAry,
            success: function(data){
                stdout += data;
            },
            error: function(data){
                stdout += data; // エラー出力も stdout に混ぜて送る
            },
            complete: function(){
                callback(0, stdout);
            }
        });
        return;
    },
    {}
);
commonFileEditor.init(function(){
    console.log('ready.');
});
</script>
```


## 更新履歴 - Change log

### gitui79 v0.1.0 (リリース日未定)

- 初回リリース


## License

MIT License


## Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <https://www.pxt.jp/>
- Twitter: @tomk79 <https://twitter.com/tomk79/>
