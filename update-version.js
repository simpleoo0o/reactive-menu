const fs = require('fs-extra')

const packageData = require('./package')

const version = packageData.version.split('.')
const last = Number(version.pop()) + 1
version.push(last)
packageData.version = version.join('.')

fs.writeFileSync('./package.json', JSON.stringify(packageData, null, 2))
console.log('package更新成功！')
