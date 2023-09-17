const getConfig = require("./helper");
const chokidar = require('chokidar');
const path = require('path')
const fs = require('fs-extra')

const saveLocation = getConfig()?.save_location

if (!saveLocation) {
  throw new Error('save location not found: ' + saveLocation)
}

const srcPath = path.resolve(__dirname, '../src')
const newTexturePath = path.resolve(saveLocation, 'new')

const srcWatcher = chokidar.watch(srcPath)

srcWatcher.on('ready', () => {
  console.log('[READY] - Source Folder Watched Ready: ' + srcPath)
})

srcWatcher.on('change', (pathName) => {
  const fileName = path.basename(pathName)

  if (!/X\d+ - /.test(fileName) && !/\.(psd|ai|tmp)$/.test(fileName) && !/^[A-Fa-f0-9]+\..+/.test(fileName)) {
    const rootFolder = pathName.replace(srcPath + "\\", '').replace("\\" + fileName, '')

    fs.ensureDirSync(path.resolve(saveLocation, rootFolder))
    fs.cpSync(pathName, path.resolve(saveLocation, rootFolder, fileName))

    console.info('[DEPLOY] Texture file to PPSSPP: ' + rootFolder + "/" + fileName)
  }
})

const destWatcher = chokidar.watch(newTexturePath)

destWatcher.on('ready', () => {
  fs.ensureDirSync(path.resolve(__dirname, '../tmp'))

  console.log('[READY] - Destination Folder Watched Ready: ' + newTexturePath)
})

destWatcher.on('change', (pathName) => {
  const fileName = path.basename(pathName)

  if (!fs.existsSync(path.resolve(__dirname, '../tmp', fileName))) {
    fs.cpSync(pathName, path.resolve(__dirname, '../tmp', fileName), { recursive: true })
    console.info('[SYNC] Texture file to src: ' + fileName)
  }
})

