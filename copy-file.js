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
    'interface.ts': true,
    'src/reactive-menu.js': true,
    'src/ReactiveMenuItem.vue': true,
    'src/MenuContent.vue': true,
    'src/ReactiveMenuTree.vue': true
  }, paths)
  for (const key in paths) {
    if (key === 'package.json') {
      const packageFilePath = path.resolve(basePath, key)
      const packageData = _.cloneDeep(require(packageFilePath))
      packageData.devDependencies = {}
      // packageData.dependencies = {}
      packageData.homepage = "https://github.com/simpleoo0o/reactive-menu-item"
      packageData.repository = {
        "type": "git",
        "url": "https://github.com/simpleoo0o/reactive-menu-item.git",
      }
      packageData.main = './reactive-menu.umd.js'
      delete packageData.private
      packageData.scripts = {}
      fs.writeJsonSync(path.resolve(savePath, key), packageData, { spaces: 2 })
    } else {
      const files = glob.globSync(path.resolve(basePath, key))
      files.forEach(file => {
        if (paths[key] === true || (paths[key] instanceof Function && paths[key](file))) {
          fs.copySync(file, path.resolve(savePath, key.replace('src/', '')))
        }
      })
    }
  }
}
a()

console.log('copy-file 执行完毕')
