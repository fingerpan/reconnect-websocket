# reconnect-websocket

Auto reconnect WebSocket client for browsers.

`reconnect-websocket` wraps the native `WebSocket` API and adds automatic
reconnect, message queueing while connecting, Promise-based sending, reply
waiting, and a small event emitter.

## Features

- Automatic connection on initialization.
- Automatic reconnect after unexpected close.
- Manual `connect`, `reconnect`, and `close` controls.
- Message queue while the socket is still connecting.
- Promise-based `send`.
- Optional reply waiting with timeout.
- `beforeSendHook` for outgoing message normalization.
- `beforeEmitHook` for incoming message parsing and event routing.
- Native WebSocket state constants and common read-only properties.
- TypeScript source and declaration file.

## Browser Support

This package is designed for browsers that support:

- `WebSocket`
- `Promise`
- `Object.defineProperty`

For older browsers, provide the required polyfills before creating a socket.

## Installation

This repository contains the source package. Build it before using the files in
`dist/`.

```bash
npm install
npm run build
```

After build, the generated files are:

- `dist/reconnect-websocket.js` - UMD build for browsers.
- `dist/reconnect-websocket.common.js` - CommonJS build.
- `dist/reconnect-websocket.esm.js` - ES module build.

> Note: verify the npm package name before publishing or installing from npm.
> The package name in this repository is `reconnect-websocket`.

## Quick Start

```js
import ReconnectWebsocket from 'reconnect-websocket'

const socket = new ReconnectWebsocket('ws://localhost:3000')

socket.on('open', () => {
  socket.send('hello')
})

socket.on('message', event => {
  console.log(event.data)
})

socket.on('close', event => {
  console.log('socket closed', event)
})

socket.on('error', error => {
  console.error(error)
})
```

## JSON Message Example

By default, incoming messages emit the native `message` event. If your server
sends JSON payloads with a `type` field, use `beforeEmitHook` to route messages
to custom events.

```js
const socket = new ReconnectWebsocket('ws://localhost:3000', {
  beforeEmitHook(event) {
    return JSON.parse(event.data)
  }
})

socket.on('chat', event => {
  console.log(event.data)
})
```

For example, the server message below will trigger the `chat` listener:

```json
{
  "type": "chat",
  "data": "hello"
}
```

Return `false` from `beforeEmitHook` to ignore a message.

## Send And Wait For Reply

`send(data, options)` returns a Promise. If `options.rep` is provided, the
Promise resolves when an event with that name is emitted. If the event is not
received before `options.timeout`, the Promise rejects.

```js
const socket = new ReconnectWebsocket('ws://localhost:3000', {
  beforeEmitHook(event) {
    return JSON.parse(event.data)
  }
})

socket
  .send(
    { type: 'ping', data: Date.now() },
    {
      rep: 'pong',
      timeout: 3000
    }
  )
  .then(pongEvent => {
    console.log('reply received', pongEvent.data)
  })
  .catch(error => {
    console.error('wait reply failed', error)
    socket.reconnect()
  })
```

## API

### `new ReconnectWebsocket(url, config)`

Creates a reconnecting WebSocket instance.

```js
const socket = new ReconnectWebsocket('ws://localhost:3000', {
  reconnect: true,
  autoconnect: true,
  reconnectTime: 10
})
```

### `socket.send(data, options)`

Sends data to the server and returns a Promise.

```js
socket.send('hello')

socket.send({ type: 'chat', data: 'hello' }, {
  rep: 'chat-ack',
  timeout: 5000,
  retry: true
})
```

Objects are serialized with `JSON.stringify` before sending.

### `socket.connect(url)`

Connects to a WebSocket URL. If `url` is omitted, the last connected URL is
used.

```js
socket.connect('ws://localhost:3000')
```

### `socket.reconnect()`

Closes the current socket and connects again with the last URL.

```js
socket.reconnect()
```

### `socket.close(code, reason)`

Closes the socket and disables automatic reconnect for this close operation.

```js
socket.close(1000, 'normal close')
```

### `socket.on(event, callback, context)`

Registers an event listener. Returns an `off` function.

```js
const off = socket.on('message', event => {
  console.log(event.data)
})

off()
```

### `socket.once(event, callback, context)`

Registers a listener that runs once.

```js
socket.once('connect', () => {
  console.log('first connection opened')
})
```

### `socket.off(event, callback)`

Removes an event listener.

```js
function handleMessage(event) {
  console.log(event.data)
}

socket.on('message', handleMessage)
socket.off('message', handleMessage)
```

## Config

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `protocol` | `string \| string[]` | `''` | WebSocket subprotocol passed to the native constructor. |
| `reconnect` | `boolean` | `true` | Whether to reconnect automatically after unexpected close. |
| `autoconnect` | `boolean` | `true` | Whether to connect immediately in the constructor. |
| `reconnectTime` | `number` | `10` | Maximum automatic reconnect counter before emitting `reconnet-fail`. |
| `binaryType` | `'blob' \| 'arraybuffer'` | `'blob'` | Binary data type for the native WebSocket. |
| `beforeSendHook` | `function` | `undefined` | Hook called before each send. |
| `beforeEmitHook` | `function` | `undefined` | Hook called before each incoming message is emitted. |

### `beforeSendHook`

Use this hook to normalize outgoing messages.

```js
const socket = new ReconnectWebsocket('ws://localhost:3000', {
  beforeSendHook(options, send) {
    options.data = JSON.stringify({
      type: options.type || 'message',
      data: options.data
    })

    send(options)
  }
})
```

### `beforeEmitHook`

Use this hook to parse incoming messages. It must return an object with a
`type` property, or `false` to ignore the message.

```js
const socket = new ReconnectWebsocket('ws://localhost:3000', {
  beforeEmitHook(event) {
    try {
      return JSON.parse(event.data)
    } catch (error) {
      return false
    }
  }
})
```

## Send Options

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `rep` | `string` | `undefined` | Event name to wait for after sending. |
| `timeout` | `number` | `10000` | Reply wait timeout in milliseconds. |
| `retry` | `boolean` | `true` | Queue the message if the socket is still connecting. |

## Events

| Event | Description |
| --- | --- |
| `open` | Native WebSocket `open` event. |
| `connect` | First successful connection. |
| `reconnect` | Successful connection after reconnect. |
| `message` | Native WebSocket message event when no custom `beforeEmitHook` changes the event type. |
| `close` | Native WebSocket `close` event. |
| `error` | Native WebSocket error or internal send error. |
| `reconnet-fail` | Emitted when automatic reconnect exceeds the retry counter. The event name keeps the current source spelling. |
| Custom event | Any event object returned by `beforeEmitHook` with a `type` field. |

## Properties

| Property | Description |
| --- | --- |
| `readyState` | Current native WebSocket state. |
| `binaryType` | Gets or sets the native `binaryType`. |
| `bufferedAmount` | Native buffered amount. |
| `extensions` | Native selected extensions. |
| `protocol` | Native selected protocol. |

Static state constants are also available:

```js
ReconnectWebsocket.CONNECTING
ReconnectWebsocket.OPEN
ReconnectWebsocket.CLOSING
ReconnectWebsocket.CLOSED
```

## Heartbeat Example

```js
const socket = new ReconnectWebsocket('ws://localhost:3000', {
  beforeEmitHook(event) {
    return JSON.parse(event.data)
  }
})

socket.on('open', () => {
  setInterval(() => {
    const time = Date.now()

    socket
      .send(
        { type: 'ping', data: time },
        { rep: 'pong', timeout: 3000 }
      )
      .then(event => {
        console.log('heartbeat ok', event.data)
      })
      .catch(() => {
        socket.reconnect()
      })
  }, 5000)
})
```

See `example/heartbeat` for a runnable browser example.

## Development

```bash
npm install
npm run build
npm test
```

## TypeScript

The project is written in TypeScript and exposes declaration files through the
`types` field.

```ts
import ReconnectWebsocket from 'reconnect-websocket'

const socket = new ReconnectWebsocket('ws://localhost:3000')
```

## License

MIT
