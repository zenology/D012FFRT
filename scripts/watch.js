const getConfig = require("./helper");
const path = require('path')
const syncDir = require('sync-directory')
const voca = require('voca')
const color = require('ansi-colors');

const saveLocation = getConfig()?.save_location

if (!saveLocation) {
  throw new Error('save location not found: ' + saveLocation)
}

const srcPath = path.resolve(__dirname, '../src')
const newTexturePath = path.resolve(saveLocation, 'new')

console.log(`${color.blueBright(`[DEPLOY_READY]`)} - WIP Folder Watched Ready: ${srcPath}`)
syncDir.sync(srcPath, saveLocation, {
  watch: true,
  skipInitialSync: true,
  filter: (pathName) => {
    const fileName = path.basename(pathName)
    const rootFile = pathName.replace(srcPath + "\\", '')

    return !/X\d+ - /.test(rootFile) && !/\.(psd|ai|tmp)$/.test(fileName) && !/^[A-Fa-f0-9]+\..+/.test(fileName) && !/\.tmp/.test(rootFile)
  },
  afterEachSync: ({ eventType, srcPath }) => { console.log(`${color.blueBright(`[DEPLOY_${voca.upperCase(eventType)}]`)} ${path.basename(srcPath)}`) }
})

// const destWatcher = chokidar.watch(newTexturePath, { persistent, awaitWriteFinish: true })

// destWatcher.on('ready', () => {
//   fs.ensureDirSync(path.resolve(__dirname, '../tmp'))

//   console.log('[READY] - Destination Folder Watched Ready: ' + newTexturePath)
// })

// destWatcher.on('change', (pathName) => {
//   const fileName = path.basename(pathName)

//   fs.cpSync(pathName, path.resolve(__dirname, '../tmp', fileName), { recursive: true })
//   console.info('[SYNC] Texture file to src: ' + fileName)
// })

console.log(`${color.redBright(`[TMP_READY]`)} - Texture Folder Watched Ready: ${newTexturePath}`)
syncDir.sync(newTexturePath, path.resolve(__dirname, '../tmp'), {
  watch: true, skipInitialSync: true,
  // chokidarWatchOptions: {awaitWriteFinish: true},
  afterEachSync: ({ eventType, srcPath }) => { console.log(`${color.redBright(`[TMP_${voca.upperCase(eventType)}]`)} ${path.basename(srcPath)}`) }
})