const getConfig = require("./helper");
const chokidar = require('chokidar');
const path = require('path')
const fs = require('fs-extra')

const saveLocation = getConfig()?.save_location

if (!saveLocation) {
  throw new Error('save location not found: ' + saveLocation)
}

const watcher = chokidar.watch(path.resolve(saveLocation, 'new'))

watcher.on('ready', () => {
  fs.ensureDirSync(path.resolve(__dirname, '../tmp'))

  console.log('[READY] - Folder Watched Ready: ' + path.resolve(saveLocation, 'new'))
})

watcher.on('change', (pathName) => {
  const fileName = path.basename(pathName)

  if (!fs.existsSync(path.resolve(__dirname, '../tmp', fileName))) {
    fs.cpSync(pathName, path.resolve(__dirname, '../tmp', fileName), { recursive: true })
    console.info('[COPY] file: ' + fileName)
  }
})
