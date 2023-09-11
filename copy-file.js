const fs = require('fs-extra')
const glob = require('glob')
const path = require('node:path')
const _ = require('lodash')
const { globSync: Function } = require("glob");
const basePath = path.resolve(__dirname)
const savePath = path.resolve(basePath, 'dist')

fs.ensureDir(savePath)

const a = function (paths) {
  paths = Object.assign({
    'package.json': true,
    'README.md': true,
    'CHANGELOG.md': true,
    'src/useReactiveMenu.ts': true,
    'src/ReactiveMenuItem.vue': true,
    'src/MenuContent.vue': true,
    'src/ReactiveMenuTree.vue': true,
    'types/src': true,
  }, paths)
  for (const key in paths) {
    if (key === 'package.json') {
      const packageFilePath = path.resolve(basePath, key)
      const packageData = _.cloneDeep(require(packageFilePath))
      delete packageData.devDependencies
      delete packageData.dependencies
      packageData.homepage = "https://github.com/simpleoo0o/reactive-menu-item/blob/dev/README.md"
      packageData.repository = {
        "type": "git",
        "url": "https://github.com/simpleoo0o/reactive-menu-item.git",
      }
      packageData.main = './reactive-menu.mjs'
      packageData.types = '././reactive-menu.d.ts'
      delete packageData.private
      packageData.scripts = {}
      fs.writeJsonSync(path.resolve(savePath, key), packageData, { spaces: 2 })
    } else {
      const files = glob.globSync(path.resolve(basePath, key))
      files.forEach(file => {
        if (paths[key] === true || (paths[key] instanceof Function && paths[key](file))) {
          let newPath = file.split(/[/\\]/).pop()
          if (!newPath.includes('.')) {
            newPath = ''
          }
          console.log(file, newPath, path.resolve(savePath, newPath))
          newPath = path.resolve(savePath, newPath)
          fs.copySync(file, newPath)
        }
      })
    }
  }
}
a()

console.log('copy-file 执行完毕')
