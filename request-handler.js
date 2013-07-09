var defaultCorsHeaders = require('./defaultCors.js');
var url = require('url');
var qs = require('querystring');

var storage = {};

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var tmp = (request.url).split('/');
  var _roomname = tmp[tmp.length-2];

  switch(request.method){
    case 'GET':

      var queryData = url.parse(request.url, true).query;

      if(queryData && (typeof queryData.time === 'undefined')) {
        lastMsgTime = new Date();
      } else {
        lastMsgTime = new Date(JSON.parse(queryData.time));
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

      response.writeHead(200, defaultCorsHeaders);
      response.end(JSON.stringify('GETted'));
      break;
    case 'POST':

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

      response.writeHead(201, defaultCorsHeaders);
      response.end('Posted.');
      break;

    default:
      response.writeHead(406, defaultCorsHeaders);
      response.end('Invalid request.');
      break;
  }
};


exports.rh = handleRequest;