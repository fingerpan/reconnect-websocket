


import Socket from '../../src/Socket'

import { Server, WebSocket } from 'mock-socket'
// 
describe('connect normal', function() {
  let $socket: Socket
  let mockServer: Server
  let wsUrl = 'ws://localhost:8080'
  const sendData = 'sendTestData'

  beforeEach(function() {
    mockServer = new Server(wsUrl)
  })
  it('normal', function(done) {
      mockServer.on('connection', (ws:any) => {
        ws.send(sendData)
      })
      $socket = new Socket(wsUrl)

      expect($socket.readyState).toBe(Socket.CONNECTING)

      // open
      $socket.on('open', (event) => {
        expect(event.type).toBe('open')
        expect($socket.readyState).toBe(Socket.OPEN)
      })

      // message
      $socket.on('message', (event) => {
        expect(event.type).toBe('message')
        expect(event.data).toBe(sendData)
        mockServer.stop(done)
      })
  })



  it('event normal', function(done) {




    
  })
});