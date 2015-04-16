var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (request, response) {

  if (request.method === 'GET') {
    if(request.url === '/') {
    // res.end(archive.paths.list);
      fs.readFile('web/public/index.html', 'utf-8', function(err,data){
        if (!err){
          response.writeHead(200, {'Content-Type': 'text/html'});
          response.write(data);
          response.end();
        }else{
          console.log('ERROR FOR GET /',err,'+++');
        }
      });
    } else {
      var filePath = 'archives/sites'+request.url;
      var contentType = {'Content-Type': 'text/html'};
      if (request.url === '/styles.css') {
        filePath = 'web/public/styles.css';
        contentType = {'Content-Type': 'text/css'};
      }
      if (request.url === '/loading.html') {
        filePath = 'web/public/loading.html';
      }
      fs.readFile(filePath, 'utf-8', function(err,data){
        if (!err){
          response.writeHead(200, contentType);
          response.write(data);
          response.end();
        }else{
          response.writeHead(404);
          response.end();
        }
      });
    }
  }

  if (request.method === 'POST') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var url = body.substring(4);
      fs.appendFile('archives/sites.txt', url + '\n', function (err) {
        if (err) {
          console.log('ERROR FOR POST',err,'+++');
        }
        response.writeHead(302, {'Location': '/loading.html'});
        response.end();
      });

    });
  }
};
