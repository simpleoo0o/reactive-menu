import fs from 'fs-extra'
import path from 'node:path'
import _ from'lodash'
import { globSync } from 'glob'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const basePath = path.resolve(__dirname)
const savePath = path.resolve(basePath, 'dist')

fs.ensureDir(savePath)

const a = function (paths) {
  paths = Object.assign({
    'package.json': true,
    'README.md': true,
    'CHANGELOG.md': true,
    'src/useReactiveMenu.ts': true,
    'src/reactive-menu.ts': true,
    'src/ReactiveMenuItem.vue': true,
    'src/MenuContent.vue': true,
    'src/ReactiveMenuTree.vue': true,
    'types/src': true,
  }, paths)
  for (const key in paths) {
    if (key === 'package.json') {
      const packageFilePath = path.resolve(basePath, key)
      const packageData = _.cloneDeep(fs.readJSONSync(packageFilePath))
      delete packageData.devDependencies
      delete packageData.dependencies
      packageData.homepage = "https://github.com/simpleoo0o/reactive-menu/blob/dev/README.md"
      packageData.repository = {
        "type": "git",
        "url": "https://github.com/simpleoo0o/reactive-menu.git",
      }
      packageData.main = './reactive-menu.cjs'
      packageData.module = './reactive-menu.js'
      packageData.types = './reactive-menu.d.ts'
      packageData.unpkg = './reactive-menu.iife.js'
      packageData.jsdelivr = './reactive-menu.iife.js'
      delete packageData.private
      packageData.scripts = {}
      fs.writeJsonSync(path.resolve(savePath, key), packageData, { spaces: 2 })
    } else {
      const files = globSync(path.resolve(basePath, key))
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
