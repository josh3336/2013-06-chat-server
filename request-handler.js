var defaultCorsHeaders = require('./defaultCors.js');
var url = require('url');
var qs = require('querystring');

var storage = {};
var chatData = [];

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  if( request.method === 'PUT' || request.method === 'DELETE' ) {
    statusCode = 406;
    response.writeHead(statusCode, headers);
    response.end('Invalid request.');
  } else {
    var queryData = url.parse(request.url, true).query;


    if(request.method === 'GET') {
      console.log('Getted');
      //response.write("hey there.");

    } else if(request.method === 'POST') {
      console.log('Posted.');
      var body = '';

      request.on('data', function (data) {
        body += data;
        if (body.length > 1e6) {
          request.connection.destroy();
        }
      });

      request.on('end', function () {
          chatData.push(qs.parse(body));
          //console.log(data);
      });
    }

    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end('Okay.');
  }
};


exports.rh = handleRequest;