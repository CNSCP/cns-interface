//
//

//
const ws = require('ws');

//
const server = new ws.WebSocketServer({
  port: 8080
})
.on('listening', () => {
  console.log('listening on 8080');
})
.on('headers', (headers, req) => {
  console.log('headers');
})
.on('connection', (client, req) => {
  //
  const origin = req.socket.remoteAddress;
  console.log('connect ' + origin);

  //
  client.on('message', (packet) => {
    console.log('received ' + origin + ' ' + packet);
    const data = JSON.parse(packet.toString());

    const cmd = data.cmd;
    const identifier = data.identifier;

    const id = identifier.id;

    const reply = JSON.stringify({
      action: 'message',
      identifier: identifier,
      properties: {
        name: 'Resource ' + id,
        title: '',
        have: {
        },
        use: {
        },
        need: {
        }
      },
      connections: {
      }
    });

    console.log('send ' + origin + ' ' + reply);
    client.send(reply);
  })
  //
  .on('close', () => {
    console.log('disconnect ' + origin);
  })
  //
  .on('error', (error) => {
    console.log('error: ' + origin + ' ' + error.message);
  });

//req.reject();

})
//
.on('close', (client) => {
  console.log('close');
})
//
.on('error', (error) => {
  console.log('error: ' + error.message);
});
