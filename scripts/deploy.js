const fsExtra = require('fs-extra')
const path = require('path')
const ini = require('ini')

console.info('[START] - Deployment Script')
const saveLocation = ini.parse(fsExtra.readFileSync(path.resolve(__dirname, './config.ini'), 'utf-8'))?.save_location

if (!saveLocation) {
  throw new Error('Cannot parse file config.ini')
}

if (!fsExtra.existsSync(saveLocation)) {
  throw new Error('Save Path not found.')
}

fsExtra.emptyDirSync(saveLocation)

fsExtra.cpSync(path.resolve(__dirname, '../02 - Ready to Use/'), saveLocation, { recursive: true })

console.info('[END] - Deployment Script')
