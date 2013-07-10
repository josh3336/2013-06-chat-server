var url = require('url');
var controller = require('./message-controller.js');

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var path = url.parse(request.url).pathname.split("/");
  var room = path[path.length-1] || path[path.length-2];

  if(path[1]!=='classes') {
    controller.fourohfour(request, response);
  } else {
    switch(request.method){
      case 'GET':
        controller.getMessages(request, response, room);
        break;
      case 'POST':
        controller.postMessage(request, response, room);
        break;
      case 'OPTIONS':
        controller.noprobs(request, response);
        break;
      default:
        controller.badrequest(request, response);
        break;
    }
  }
};

exports.handleRequest = handleRequest;