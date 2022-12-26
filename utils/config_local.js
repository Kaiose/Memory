'use strict'

const fs = require('fs');

class ConfigLocal
{
  constructor() {}

  load(path)
  {
    let is_exist = fs.existsSync(path);
    if (!is_exist)
    {
      console.log(`[config_local] not exist path(${config_local_path})`);
      return false;
    }

    const body = fs.readFileSync(path);
    this.props = JSON.parse(body);

    console.log(`[config_local] setting(${config_local.toString()})`);
    return true;
  }

  toString()
  {
    var keys = "";

    for (const key in this.props) {
      if (Object.hasOwnProperty.call(this.props, key)) {
        const element = this.props[key];
        keys += `${key} : ${element}, `;
      }
    }

    return keys;
  }
};

module.exports = ConfigLocal;