'use struct';
const mongoose = require('mongoose');
const { Schema } = mongoose;


const Queue = require('../0.base/queue');
const Deserializer = require('./packet_func');
const RecordTable = require('../1.models/record_table');
const { hash } = require('bcrypt');

class Client
{
  constructor(key, websocket)
  {
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

  GetObjectKey()
  {
    
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
      console.log(`[recv] ${protocol}`);

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

  ProcessProtocol()
  {
    while(!this.protocols.IsEmpty())
    {
      let protocol = this.protocols.Dequeue();
      let handler = this.deserializer.GetPacketHandler(protocol.cmd);
      handler(this, protocol);   
    }
  }

  RegistProtocolHandler()
  {
    this.deserializer.AddPacketHandler("login_rq", this.OnLogin_RQ);
    this.deserializer.AddPacketHandler("create_record_table_rq", this.OnCreateRecordTable_RQ);
  }

  OnLogin_RQ(client, packet)
  {
    console.log("call func Login_RQ");
    console.log(packet);

    client.token = packet.token;
  }

  OnCreateRecordTable_RQ(client, packet)
  {
    console.log("call func OnCreateRecordTable_RQ");
    console.log(packet);

    // create record table
    const table = new RecordTable({
      title : "test",
      desciption : "desciption",
      user : this.token
    });
    
    table.save((err)=>{
      if (err) {
        console.log("[create_table] faile," + err);
        throw err;
      }

      let rs = {
        name : "create_record_table_rq",
        table_name : table.title
      }

      this.websocket.send(JSON.stringify(rs));
    });
    // save record table
    // response record table list
  }
}

module.exports = Client;