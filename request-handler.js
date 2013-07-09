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

    if(request.method === 'GET') {
      var queryData = url.parse(request.url, true).query;
      var lastMsgTime = '2013-07-09T03:55:44.127Z';
      lastMsgTime = new Date(JSON.parse(queryData.time));

      if(typeof lastMsgTime === 'undefined') {
        console.log('bad time.');
        lastMsgTime = '2013-07-09T03:55:44.127Z';
      }

      lastMsgTime = lastMsgTime.getTime();

      console.log(lastMsgTime);

      var messages = storage[_roomname];
      var resultArray = messages.slice(0);

      console.log('msgs:',messages);
      console.log('ra:',resultArray);

      // for(var i=messages.length-1; i>-1; i--) {
      //   if(messages[i].createdAt.getTime()<=lastMsgTime) {
      //     resultArray = messages.slice(i+1);
      //     break;
      //   }
      // }
      // console.log(resultArray);
    }
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify('fuck'));
  }
};


exports.rh = handleRequest;