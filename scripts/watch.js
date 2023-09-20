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

console.log(`${color.blueBright(`[DEPLOY:READY]`)} - WIP Folder Watched Ready: ${color.yellow(srcPath)}`)
syncDir.sync(srcPath, saveLocation, {
  watch: true,
  skipInitialSync: true,

  exclude: (pathName) => {
    const fileName = path.basename(pathName)
    const rootFile = pathName.replace(srcPath + "\\", '')

    return /X\d+ - /.test(rootFile) || /\.(psd|ai|tmp)$/.test(fileName) || /^[A-Fa-f0-9]+\..+/.test(fileName) || /\.tmp/.test(rootFile)
  },
  afterEachSync: ({ eventType, srcPath }) => { console.log(`${color.blueBright(`[DEPLOY:${voca.upperCase(eventType)}]`)} - ${color.yellow(path.basename(srcPath))}`) }
})

console.log(`${color.redBright(`[TMP:READY]`)} - Texture Folder Watched Ready: ${color.yellow(newTexturePath)}`)
syncDir.sync(newTexturePath, path.resolve(__dirname, '../tmp'), {
  watch: true, skipInitialSync: true,
  afterEachSync: ({ eventType, srcPath }) => { console.log(`${color.redBright(`[TMP:${voca.upperCase(eventType)}]`)} - ${color.yellow(path.basename(srcPath))}`) }
})