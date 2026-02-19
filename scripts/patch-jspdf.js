/**
 * jspdf の動的 import を webpackMode: "eager" に置換したファイルを生成する。
 * これにより webpack が html2canvas/dompurify/canvg をメインバンドルに含め、チャンク分割を防ぐ。
 */
const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../node_modules/jspdf/dist/jspdf.es.min.js');
const dest = path.resolve(__dirname, '../src/vendor/jspdf.es.patched.js');

if (!fs.existsSync(src)) {
  console.warn('patch-jspdf: jspdf not found, skipping');
  process.exit(0);
}

const dir = path.dirname(dest);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

let s = fs.readFileSync(src, 'utf8');
s = s.replace(/import\("html2canvas"\)/g, 'import(/* webpackMode: "eager" */ "html2canvas")');
s = s.replace(/import\("dompurify"\)/g, 'import(/* webpackMode: "eager" */ "dompurify")');
s = s.replace(/import\("canvg"\)/g, 'import(/* webpackMode: "eager" */ "canvg")');
fs.writeFileSync(dest, s);
console.log('patch-jspdf: wrote src/vendor/jspdf.es.patched.js');
