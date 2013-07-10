var defaultCorsHeaders = require('./defaultCors.js');
var url = require('url');
var qs = require('querystring');

var storage = {};

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var path = url.parse(request.url).path.split("/");

  var _roomname = path[path.length-1] || path[path.length-2];

  if(path[1]!=='classes') {
    response.writeHead(404);
    response.end('');
  } else {
    switch(request.method){
      case 'GET':

        // var queryData = url.parse(request.url, true).query;

        // if(queryData && (typeof queryData.time === 'undefined')) {
        //   lastMsgTime = new Date();
        // } else {
        //   lastMsgTime = new Date(JSON.parse(queryData.time));
        // }

        // lastMsgTime = lastMsgTime.getTime();

        // console.log(lastMsgTime);


        // for(var i=messages.length-1; i>-1; i--) {
        //   if(messages[i].createdAt.getTime()<=lastMsgTime) {
        //     resultArray = messages.slice(i+1);
        //     break;
        //   }
        // }
        // console.log(resultArray);

        var messages = storage[_roomname] || [];

        response.writeHead(200, defaultCorsHeaders);
        response.end(JSON.stringify(messages));
        break;
      case 'POST':
        var body = '';

        request.on('data', function (chunk) {
          body += chunk;
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
        });

        response.writeHead(201, defaultCorsHeaders);
        response.end('');
        break;

      default:
        response.writeHead(406, defaultCorsHeaders);
        response.end('Invalid request.');
        break;
    }
  }
};


exports.handleRequest = handleRequest;