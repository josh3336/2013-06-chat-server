var defaultCorsHeaders = require('./defaultCors.js');
var url = require('url');

var findLastTime = function(qd) {
  if(!qd.time) {
    return undefined;
  } else {
    return new Date(JSON.parse(qd.time));
  }
};

var controller = {
  storage: {},

  getMessages: function(request, response, room) {
    var messages = controller.storage[room] || [];

    var lastMsgTime = findLastTime(url.parse(request.url, true).query);

      // given the last message time, set the array equal to those after that time
    if(lastMsgTime) {
      lastMsgTime = lastMsgTime.getTime();
      for(var i=messages.length-1; i>-1; i--) {
        if(messages[i].createdAt.getTime()<=lastMsgTime) {
          messages = messages.slice(i+1);
          break;
        }
      }
    }

    response.writeHead(200, defaultCorsHeaders);
    response.end(JSON.stringify(messages));
  },

  postMessage: function(request, response, room) {
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

        if(controller.storage.hasOwnProperty(room)) {
          controller.storage[room].push(body);
        } else {
          controller.storage[room] = [];
          controller.storage[room].push(body);
        }
    });

    response.writeHead(201, defaultCorsHeaders);
    response.end('');
  },

  noprobs: function(request, response) {
    response.writeHead(200, defaultCorsHeaders);
    response.end('');
  },

  badrequest: function(request, response) {
    response.writeHead(406, defaultCorsHeaders);
    response.end('Invalid request.');
  },

  fourohfour: function(request, response) {
    response.writeHead(404);
    response.end('');
  }
};

module.exports = controller;