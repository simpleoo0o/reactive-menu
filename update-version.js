import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const packagePath = path.resolve(__dirname, 'package.json')
const packageData = fs.readJSONSync(packagePath)

const version = packageData.version.split('.')
const last = Number(version.pop()) + 1
version.push(last)
packageData.version = version.join('.')

fs.writeFileSync('./package.json', JSON.stringify(packageData, null, 2))
console.log('package更新成功！')
