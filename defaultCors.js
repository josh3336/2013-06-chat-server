/* These headers will allow Cross-Origin Resource Sharing.
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
module.exports = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST",
  "access-control-allow-headers": "content-type, accept, origin, x-requested-with",
  "access-control-max-age": 10 // Seconds.
};