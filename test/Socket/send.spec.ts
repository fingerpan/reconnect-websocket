


import Socket from '../../src/Socket'

import { Server, WebSocket } from 'mock-socket'
// 
describe('send normal', function() {
  let $socket: Socket
  let mockServer: Server
  const wsUrl = 'ws://localhost:8080'
  const sendData = 'sendTestData'

  beforeEach(function() {
    mockServer = new Server(wsUrl)
  })
  // 释放
  afterEach(function() {
    mockServer && mockServer.stop()
  })


  it('send normal', function(done) {

      mockServer.on('connection', (ws:any) => {
        ws.on('message', (data:any) => {
          expect(data).toBe(sendData)
          mockServer.stop(done)
        })
      })

      $socket = new Socket(wsUrl)
      expect($socket.readyState).toBe(Socket.CONNECTING)
      
      // open
      $socket.on('open', (event) => {
        expect(event.type).toBe('open')
        expect($socket.readyState).toBe(Socket.OPEN)

        $socket.send(sendData)
      })

  })



  // it('event normal', function(done) {




    
  // })
});