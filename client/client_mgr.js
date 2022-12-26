'use strict';
const Client = require('client');

class ClientMgr
{
  static gen_key = 0;

  constructor()
  {
    this.clients = new Map();
  }

  init()
  {
    setInterval(() => {
      this.clients.forEach((key, client) => {
          const data = JSON.stringify({'type': 'time', 'time': new Date().toTimeString()});
          client.send(data);
      });
   }, 1000);

   setInterval(() => {
    this.clients.forEach((key, client) => {
        if (false == client.IsConnected())
          this.deleteUser(key);
    });
 }, 1000);

  }

  createUser(ws)
  {
    const client = new Client(ws);
    client.onCreate();

    this.clients.set(gen_key++, client);
  }

  deleteUser(key)
  {
    this.clients.delete(key);
  }



};

module.exports = ClientMgr;