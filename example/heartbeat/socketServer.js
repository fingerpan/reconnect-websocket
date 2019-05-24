const ws = require('nodejs-websocket')


function transformObject(str) {
  try {
    str = JSON.parse(str)
  } catch (e) {

  }
  return str
}

module.exports = ws
  .createServer(function(conn) {
    // 获取数据
    console.log("New connection")

    let pongdata = null
    conn.on('text', function(text) {
      text = transformObject(text)
      // only object
      if (typeof text === 'object') {
        let { type, data } = text
        //  order

        switch(type) {
          case 'ping':
            conn.sendText(JSON.stringify({
              type: 'pong',
              data: data
            }))
            break
          case 'pong':
            pongdata = data
            break
        }
      }
    })

    let timer = setInterval(function () {
      let dataValue = (new Date).valueOf()
      conn.sendText(JSON.stringify({
        type: 'ping',
        data: dataValue
      }))

      setTimeout(function () {
        if(pongdata !== dataValue) {
          clearInterval(timer)
          console.error('链接超时')
        }
      }, 3000)
    }, 10000)


    conn.on('close', function(code, reason) {
      console.log('关闭连接')
    })
    conn.on('error', function(code, reason) {
      console.log('异常关闭')
    })
    
  })
  .listen(3000)


