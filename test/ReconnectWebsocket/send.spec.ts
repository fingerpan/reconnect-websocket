


import ReconnentWebsocket from '../../src/ReconnectWebsocket'

import { Server, WebSocket } from 'mock-socket'
// 
describe('send normal', function() {
  let $socket: ReconnentWebsocket
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

      $socket = new ReconnentWebsocket(wsUrl)
      expect($socket.readyState).toBe(ReconnentWebsocket.CONNECTING)
      
      // open
      $socket.on('open', (event) => {
        expect(event.type).toBe('open')
        expect($socket.readyState).toBe(ReconnentWebsocket.OPEN)

        $socket.send(sendData)
      })

  })
});