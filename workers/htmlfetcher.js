// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var archiveHelper = require('../helpers/archive-helpers');
var http = require("http");
var content = "";

var req = http.request('http://127.0.0.1:8080/loading.html', function(res) {
  res.setEncoding("utf8");
  res.on("data", function (chunk) {
      content += chunk;
  });
  res.on("end", function () {
      console.log(content);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();

