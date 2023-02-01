'use struct';
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Queue = require('../0.base/queue');
const Deserializer = require('./packet_func');
const RecordTable = require('../1.models/record_table');
const Logger = require('../utils/logger');

class Client
{
  constructor(key, websocket)
  {
    this.logger = new Logger();

    this.key = key;
    this.token = "";
    this.status = 1;
    this.websocket = websocket;

    this.deserializer = new Deserializer();

    this.protocols  = new Queue();

    this.RegistProtocolHandler();

    setInterval(() => {
      this.Update();
    }, 50);
  }

  onCreate()
  {
    this.websocket.on('close', () => {
      this.status = 0;
      console.log("disconnect");
    });

    // add event listen
    this.websocket.on('message', (stream) => {
      let protocol = JSON.parse(stream);
      this.logger.Str('[recv]').Obj(protocol).Write();
      this.protocols.Enqueue(protocol);
    });
  }

  IsConnected() { 
    return this.status == 1 ? true : false; 
  }

  Update()
  {
    // status update
    this.ProcessProtocol();
  }

  async ProcessProtocol()
  {
    while(!this.protocols.IsEmpty())
    {
      let protocol = this.protocols.Dequeue();
      let handler = this.deserializer.GetPacketHandler(protocol.cmd);
      if (handler == null)
      {
        console.log(`[protocol] failed, cannot find handler cmd(${protocol.cmd})`);
        continue;
      }
      handler(this, protocol);   
    }
  }

  async SendPacket(cmd, body)
  {
    if (body != null)
    {
      body["cmd"] = cmd;
    }
    else
    {
      body = {
        "cmd" : cmd
      };
    }

    this.logger.Str('[send]').Obj(body).Write();
    this.websocket.send(JSON.stringify(body));
  }

  RegistProtocolHandler()
  {
    this.deserializer.AddPacketHandler("login_rq", this.OnLogin_RQ);
    this.deserializer.AddPacketHandler("create_record_table_rq", this.OnCreateRecordTable_RQ);
    this.deserializer.AddPacketHandler("edit_title_rq", this.OnEditTitle_RQ);
  }

  async OnLogin_RQ(client, packet)
  {
    client.logger.Str("call func Login_RQ").Write();

    client.token = packet.token;

    client.SendPacket("login_rs");
  }

  async OnCreateRecordTable_RQ(client, packet)
  {
    client.logger.Str("call func OnCreateRecordTable_RQ").Write();

    // create record table
    const found_table = await RecordTable.findOne({title: packet.title, user: client.token});
    if (found_table != null)
    {
		// 테스트용..
		client.SendPacket("create_record_table_rs", {title : packet.title, router : '/home'});
      //client.SendPacket("create_record_table_rs", {result: "failed"});
    }
    else
    {
      const table = new RecordTable({
        title : packet.title,
        desciption : "desciption",
        user : client.token
      });
      
      table.save((err)=>{
        if (err) {
          console.log("[create_table] failed," + err);
          throw err;
        }
  
        client.SendPacket("create_record_table_rs", {title : table.title, router : '/home'});
      });
    }
  }

  async OnEditTitle_RQ(client, packet)
  {
    client.logger.Str("call func OnEditTitle_RQ").Obj(packet).Write();
    RecordTable.updateOne(
        {
            title: packet.from
        },
        {
            $set: {
                title: packet.to
            }
        }, (err)=>{
            if (err) {
                console.log("[edit_title] failed," + err);
                throw err;
            }
            
            client.SendPacket("edit_title_rs");
        });
  }
}

module.exports = Client;