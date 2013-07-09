var defaultCorsHeaders = require('./defaultCors.js');
var url = require('url');
var qs = require('querystring');

var storage = {};

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var tmp = (request.url).split('/');
  var _roomname = tmp[tmp.length-2];

  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  if( request.method === 'PUT' || request.method === 'DELETE' ) {
    statusCode = 406;
    response.writeHead(statusCode, headers);
    response.end('Invalid request.');
  } else {
    if(request.method === 'POST') {
      console.log('Posted.');

      var body = '';

      request.on('data', function (data) {
        body += data;
        if (body.length > 1e6) {
          request.connection.destroy();
        }
      });

      request.on('end', function () {
          body = JSON.parse(body);
          body['createdAt'] = new Date();

          if(storage.hasOwnProperty(_roomname)) {
            storage[_roomname].push(body);
          } else {
            storage[_roomname] = [];
            storage[_roomname].push(body);
          }

          console.log('st: ' + storage[_roomname]);
          console.log('len: ' + storage[_roomname].length);
      });

      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end();
    }

    var queryData = url.parse(request.url, true).query;
    if(request.method === 'GET') {
      console.log('Getted');
      console.log('Storage: ' + storage);
    }

    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(storage[_roomname]));
  }
};


exports.rh = handleRequest;