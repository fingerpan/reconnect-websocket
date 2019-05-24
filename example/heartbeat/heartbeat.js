

// console.log(window.ReconnectWebsocket)
(function() {
  var WS_URL = 'ws://localhost:3000'
  var socket

  // new 
  socket = new ReconnectWebsocket(WS_URL)

  socket.beforeEmitHook = function (event) {
    console.log(event.data)
    return JSON.parse(event.data)
  }

  // 对消息
  // socket.on('message', function(event) {
  //   console.log(event)
  // })


  socket.on('ping', function(event) {
    console.log(event)

  })









})()