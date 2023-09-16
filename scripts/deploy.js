const fsExtra = require('fs-extra')
const path = require('path')

const getConfig = require('./helper')

console.info('[START] - Deployment Script')
const saveLocation = getConfig()?.save_location

if (!saveLocation) {
  throw new Error('Cannot read config for save path')
}

if (!fsExtra.existsSync(saveLocation)) {
  throw new Error('Save Path not found.')
}

fsExtra.emptyDirSync(saveLocation)

fsExtra.cpSync(path.resolve(__dirname, '../02 - Ready to Use/'), saveLocation, { recursive: true })

console.info('[END] - Deployment Script')
