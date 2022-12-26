'use struct';
const { ws } = require('ws');

class Client
{
  constructor(websocket)
  {
    this.status = 1;
    this.websocket = websocket;
  }

  onCreate()
  {
    this.websocket.on('close', () => {
      this.status = 0;
      console.log("disconnect");
    });

    // add event listen
  }

  IsConnected() { return this.status == 1? true : false; }

  Update()
  {
    // status update
  }
}

module.exports = Client;

