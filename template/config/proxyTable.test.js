var fs = require('fs')
var path = require('path')
var config = require('../config')
var proxyPath = path.resolve(__dirname, '../localProxy')
var fileLength = fs.readdirSync(proxyPath);
var total = {};
for(i=0;i<fileLength.length;i++){
	var files = require('../localProxy/'+fileLength[i])
	total = Object.assign(total,files);
}
var index = require('../localProxy/index')
var other = require('../localProxy/other')
// var total = Object.assign(index,other);
module.exports = total;