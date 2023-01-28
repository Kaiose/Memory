class Deserializer
{
  constructor()
  {
    this.handler_map = new Map();
  }

  GetPacketHandler(cmd)
  {
    console.log(cmd);
    return this.handler_map.get(cmd);
  }

  AddPacketHandler(cmd, handler)
  {
    this.handler_map.set(cmd, handler);
  }
}

module.exports = Deserializer;