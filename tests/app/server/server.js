/**
 * server.js
 */
const fs = require('fs');
const path = require('path');
const utils79 = require('utils79');
const express = require('express'),
	app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');

app.use( bodyParser({"limit": "1024mb"}) );
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use( '/common/common-file-editor/', express.static( path.resolve(__dirname, '../../../dist/') ) );
app.use( '/common/px2style/', express.static( path.resolve(__dirname, '../../../node_modules/px2style/dist/') ) );
app.use( '/common/bootstrap/', express.static( path.resolve(__dirname, '../../../node_modules/bootstrap/dist/') ) );
app.use( '/apis/read', function(req, res, next){
	// console.log(req);
	// console.log(req.method);
	// console.log(req.body);
	// console.log(req.originalUrl);
	// console.log(req.query);

	var bin = fs.readFileSync(__dirname+'/../../data/' + req.body.filename);
	// bin = utils79.base64_encode(bin);
	bin = Buffer.from(bin).toString('base64');

	res.send(JSON.stringify({
		'base64': bin
	}));
	return;
} );
app.use( '/apis/write', function(req, res, next){
	// console.log(req);
	// console.log(req.method);
	// console.log(req.body);
	// console.log(req.originalUrl);
	// console.log(req.query);

	// var bin = new Buffer(req.body.base64, 'base64');
	var bin = Buffer.from(req.body.base64, 'base64').toString();
	// var bin = utils79.base64_decode(req.body.base64);
	fs.writeFileSync(__dirname+'/../../data/' + req.body.filename, bin);
	res.send(JSON.stringify(true));
	return;
} );

app.use( express.static( __dirname+'/../client/' ) );

// 3000番ポートでLISTEN状態にする
server.listen( 3000, function(){
	console.log('server-standby');
} );
