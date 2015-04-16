// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var fs = require('fs');
var http = require('http');
var archiveHelper = require('helpers/archive-helpers');

var downloadFile = function(fileName) {
  var content = '';
  var req = http.request('http://' + fileName, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      content += chunk;
    });
    res.on('end', function () {
      fs.writeFile('archives/sites/' + fileName, content, function(err){
        if (err) {
          console.log(err);
        }
      });
    });
  });

  req.on('error', function(e) {

  });

  req.end();
};

var handleUrls = function (arrOfUrls) {
  fs.writeFile('archives/sites.txt', '', function(err){
    if (err) {
      console.log(err);
    }
  });
  arrOfUrls.forEach(downloadFile);
};

archiveHelper.readListOfUrls(handleUrls);




