const fs = require('fs-extra')
const path = require('path')
const ini = require('ini')

const getConfig = (iniFile = path.resolve(__dirname, './config.ini')) => {
  return ini.parse(fs.readFileSync(iniFile, 'utf-8'))
}

module.exports = getConfig