var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

var sendResponse = function(response, statusCode, data, contentType) {
  contentType = contentType || {'Content-Type': 'text/html'};
  data = data || '';

  response.writeHead(statusCode, contentType);
  response.write(data);
  response.end();
};

var processPath = function(response, path, statusCode, contentType) {
  fs.readFile(path, 'utf-8', function(err, data){
    if (!err) {
      sendResponse(response, statusCode, data, contentType);
    } else {
      sendResponse(response, 404);
    }
  });
};

var makeProcessPath = function (path, statusCode, contentType) {
  return function (response) {
    processPath(response,path,statusCode,contentType);
  };
};

var routes = {
  '/': makeProcessPath('web/public/index.html', 200),
  '/styles.css': makeProcessPath('web/public/styles.css', 200, {'Content-Type': 'text/css'}),
  '/loading.html' : makeProcessPath('web/public/loading.html', 200),
};

exports.handleRequest = function (request, response) {

  if (request.method === 'GET') {

    if (routes[request.url]) {
      routes[request.url](response);
    } else {
      var filePath = 'archives/sites'+request.url;
      processPath(response,filePath, 200);
    }
  }

  if (request.method === 'POST') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var url = body.substring(4);
      //look to see if file exists in archive
      fs.exists('archives/sites/'+url, function(exists){
        if (exists) {
          sendResponse(response,302,'', {'Location': '/'+ url});
        } else {
          fs.appendFile('archives/sites.txt', url + '\n', function (err) {
            if (err) {
              console.log('ERROR FOR POST',err,'+++');
            }
            sendResponse(response,302, '', {'Location': '/loading.html'});
          });
        }
      });


    });
  }
};
