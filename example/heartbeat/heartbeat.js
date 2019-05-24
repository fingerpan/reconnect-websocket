
(function() {
  var WS_URL = "ws://localhost:3000";
  var socket;

  // new
  socket = new ReconnectWebsocket(WS_URL);

  /**
   * 对数据进行解析
   * 注意：
   * beforeEmitHook 必须返回一个包含type和data的对象
   * 此时server.js发送的数据是{type: 'ping', data: '时间戳'}
   */
  socket.beforeEmitHook = function(event) {
    return JSON.parse(event.data);
  };


  // 在链接成功后开启心跳机制
  socket.on('open', function() {
    // 链接成功后开始开始心跳机制
    createHeartBeatFaction(socket)
  });


  // 如果需要，可以在重连失败之后做一些提示操作
  // 
  socket.on('reconnet-fail', function() {
    console.log('重连失败')
    // 可以手动进行重连
    socket.reconnect()
  })


  /**
   * 自动回复机制
   */
  socket.on("ping", function(event) {
    // 自动回复 pong
    socket.send({
      type: "pong",
      data: event.data
    });
  });





  /**
   * 创建自动问询机制
   * @param {*} socket
   */
  function createHeartBeatFaction(socket) {

    // 开始定时器
    let timer = setInterval(function() {
      let timeLine = new Date().valueOf();
      // 发送数据
      socket
        .send(
          {
            type: "ping",
            data: timeLine
          },
          {
            rep: "pong", // 等待pong事件
            timeout: 3000 // 等待5000秒钟
          }
        )
        .then(pongEvent => {
          if (pongEvent.data === timeLine) {

            console.log("发送成功， 链接正常");
          }
        })
        .catch(error => {
          console.log(error);
          console.log("等待失败");

          // 清楚定时器
          stopHeartBeat();

          // 进行尝试重连
          socket.reconnect();
        });
    }, 5000);


    function stopHeartBeat() {
      clearInterval(timer);
    }

    return stopHeartBeat
  }
})();
