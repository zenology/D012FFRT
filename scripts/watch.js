const getConfig = require("./helper");
const chokidar = require('chokidar');
const path = require('path')
const fs = require('fs-extra')
const timer = require('timers/promises')

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
  const rootFile = pathName.replace(srcPath + "\\", '')
  const isSingleLevelDir = rootFile === fileName

  if (!/X\d+ - /.test(rootFile) && !/\.(psd|ai|tmp)$/.test(fileName) && !/^[A-Fa-f0-9]+\..+/.test(fileName)) {

    // Wait 1 second for the file to finish created
    timer.setTimeout(1000).then(() => {
      if (!isSingleLevelDir) {
        fs.ensureDirSync(path.resolve(saveLocation, rootFile.replace('\\' + fileName)))
      }

      fs.cpSync(pathName, path.resolve(saveLocation, rootFile))

      const infoFileMsg = rootFile
      console.info('[DEPLOY] Texture file to PPSSPP: ' + infoFileMsg)
    })
  }
})

const destWatcher = chokidar.watch(newTexturePath)

destWatcher.on('ready', () => {
  fs.ensureDirSync(path.resolve(__dirname, '../tmp'))

  console.log('[READY] - Destination Folder Watched Ready: ' + newTexturePath)
})

destWatcher.on('change', (pathName) => {
  const fileName = path.basename(pathName)

  fs.cpSync(pathName, path.resolve(__dirname, '../tmp', fileName), { recursive: true })
  console.info('[SYNC] Texture file to src: ' + fileName)

})

