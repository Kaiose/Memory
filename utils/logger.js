class Logger
{
  constructor()
  {
    this.builder = "";
  }

  Str(str) {
    this.builder += str + " ";
    return this;
  }

  Obj(obj) {
    let str = "";
    for(let key in obj)
    {
      str += `${key} : ${obj[key]}, `;      
    }

    this.builder += str;
    return this;
  };

  Write() {
    console.log(this.builder);
    this.builder = "";
  }
}

module.exports = Logger;