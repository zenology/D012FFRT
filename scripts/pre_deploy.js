const fsExtra = require('fs-extra')
const path = require('path')

console.info('[START] - Pre Deploy Script')
fsExtra.cpSync(path.resolve(__dirname, '../01 - WIP'), path.resolve(__dirname, '../02 - Ready to Use'), {
  recursive: true,
  filter: (source) => {
    return !/X\d+ - /.test(source) && !/\.(psd|ai)$/.test(source) && !/[A-Fa-f0-9]+\.(.+)$/.test(source)
  },
})
console.info('[END] - Pre Deploy Script')
