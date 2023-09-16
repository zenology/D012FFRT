const path = require('path')
const fs = require('fs-extra')
const getConfig = require('./helper')

console.info('[START] - Clean Raw Texture Script')
const saveLocation = getConfig()?.save_location

fs.emptyDirSync(path.resolve(__dirname, '../tmp'))

if (!saveLocation) {
  throw new Error('save location not found: ' + saveLocation)
}

fs.emptyDirSync(path.resolve(saveLocation, 'new'))
console.info('[END] - Clean Raw Texture Script')