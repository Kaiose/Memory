'use strict';
const Client = require('./client');

class ClientMgr
{
  static gen_key = 0;

  constructor()
  {
    this.clients = new Map();
  }

  init(config_local)
  {
    setInterval(() => {
      this.clients.forEach((client, key) => {
          if (false == client.IsConnected())
            this.deleteUser(key);
      });
    }, 1000);
   
    if (config_local.get('sync_server_time'))
    {
      setInterval(() => {
        this.clients.forEach((client, key) => {
            const data = JSON.stringify({'type': 'time', 'time': new Date().toTimeString()});
            client.send(data);
        });
      }, 1000);
    }

    if (config_local.get('monitoring_user'))
    {
      setInterval(() => {
        let count = 0;
        this.clients.forEach((client, key) => {
          count++;
        });
        console.log(`[monitor] current client count(${count})`);
      }, 10000);
    }
  }

  createUser(ws)
  {
    const client = new Client(ws);
    client.onCreate();

    this.clients.set(this.gen_key++, client);
  }

  deleteUser(key)
  {
    this.clients.delete(key);
  }



};

module.exports = ClientMgr;