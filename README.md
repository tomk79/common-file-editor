# tomk79/common-file-editor
汎用的なファイル編集インターフェイスを提供するJavaScriptライブラリ

## Usage

```html
<link rel="stylesheet" href="dist/common-file-editor.css" />
<script src="dist/common-file-editor.js"></script>
<div id="common-file-editor"></div>

<script>
var commonFileEditor = new CommonFileEditor(
    document.getElementById('cont-common-file-editor'),
    {
        lang: "ja",
        read: function(filename, callback){
            // サーバーでファイルを読み込むAPIを用意してください。
            // callback には、base64エンコードされた文字列を含むオブジェクトを返してください。
            callback({
                "base64": base64string
            });
            return;
        },
        write: function(filename, base64, callback){
            // サーバーでファイルを保存するAPIを用意してください。
            // callback には、結果(true or false)を返してください。
            callback(true);
            return;
        },
        onemptytab: function(){
            alert('すべてのタブが閉じられました。');
        }
    }
);

// Initialize
commonFileEditor.init(function(){
    console.log('ready.');

    // Open Files
    commonFileEditor.preview('/file_a.txt');
    commonFileEditor.preview('/file_b.html');
    commonFileEditor.preview('/file_c.svg');
    commonFileEditor.preview('/file_d.jpg');
    commonFileEditor.preview('/file_e.gif');
    commonFileEditor.preview('/file_f.png');
});
</script>
```


## 更新履歴 - Change log

### tomk79/common-file-editor v0.1.2 (2023年11月13日)

- ダークモード用のスタイルをバンドルした。
- ファイルを閉じたときに、タブが正しく閉じられない不具合を修正した。

### tomk79/common-file-editor v0.1.1 (2023年4月22日)

- オプション `onemptytab` 追加。
- プレビュー可能な拡張子を追加。
- `options.lang` を追加した。
- スタイリングの改善。

### tomk79/common-file-editor v0.1.0 (2019年8月21日)

- 初回リリース


## License

MIT License


## Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <https://www.pxt.jp/>
- Twitter: @tomk79 <https://twitter.com/tomk79/>
