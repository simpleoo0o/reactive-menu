import * as _ from 'lodash'
import { computed, reactive, provide, watch, toRaw, isRef, unref, isProxy } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const reactiveMenuData = reactive({
  menus: [], // 排序过滤后的所有数据
  secondMenus: [], // 二级导航要展示的数据
  mock: {}, // 动态参数取值的地方
  currentMenu: null, // 当前选中的导航
  currentMenuWithParents: [], // 当前选中导航的链路
  activeIndex: null,
  topActiveIndex: null,
  config: {
    autoIndex: true, // 无匹配导航时是否重定向到首页
    selfJump: false, // 点击当前导航时，是否跳转
    disableMock: false,
    resetId: false, // 自动为菜单生成id和parentId
  },
  methods: { // 暴露的方法
    jump,
    updateMenus,
    goDefault,
    matchRoute,
    resetId
  }
})

let $router = null
let $route = null
export default function useReactiveMenu (menus, options) {
  reactiveMenuData.mock = getOriginalValue(options.mock || {})
  if (isRef(options.mock) || isProxy(options.mock)) {
    watch(options.mock, () => {
      reactiveMenuData.mock = getOriginalValue(options.mock || {})
    })
  }

  reactiveMenuData.config = _.merge({}, reactiveMenuData.config, getOriginalValue(options.config || {}))
  if (isRef(options.config) || isProxy(options.config)) {
    watch(options.config, () => {
      reactiveMenuData.config = _.merge({}, reactiveMenuData.config, getOriginalValue(options.config || {}))
    })
  }

  $router = useRouter()
  $route = useRoute()

  updateMenus(menus)
  if (isRef(menus) || isProxy(menus)) {
    watch(menus, () => {
      updateMenus(menus)
    })
  }

  reactiveMenuData.secondMenus = computed({
    get () {
      const lastParent = _.findLast(reactiveMenuData.currentMenuWithParents, (o) => {
        return o.config && o.config.boundary && reactiveMenuData.currentMenu && o.id !== reactiveMenuData.currentMenu.id && o.type === 'menu'
      })
      if (lastParent) {
        return _.filter(lastParent.children || [], ['type', 'menu'])
      }
      return []
    }
  })

  reactiveMenuData.activeIndex = computed(() => {
    return reactiveMenuData.currentMenu?.id
  })
  reactiveMenuData.topActiveIndex = computed(() => {
    return _.find(reactiveMenuData.currentMenuWithParents || [], (item) => {
      return item.config.boundary && item.type === 'menu'
    })?.id || _.findLast(reactiveMenuData.currentMenuWithParents || [], (item) => {
      return item.type === 'menu'
    })?.id
  })

  watch($route, () => {
    matchRoute()
  })

  provide('reactiveMenuData', reactiveMenuData)

  return reactiveMenuData
}

function updateMenus (menus) {
  reactiveMenuData.currentMenu = null
  reactiveMenuData.currentMenuWithParents = []
  menus = _.cloneDeep(getOriginalValue(menus))
  if (reactiveMenuData.config.resetId) {
    resetId(menus)
  }
  reactiveMenuData.menus = menuOrderAndFilter(menus)
  matchRoute()
}
function menuOrderAndFilter (menus) {
  for (const menu of menus) {
    menu.id = menu.id.toString ? menu.id.toString() : menu.id
    menu.type = menu.type ?? 'menu'
    menu.config = menu.config ?? {}
    if (menu && menu.children && menu.children.length) {
      menu.children = menuOrderAndFilter(menu.children)
    }
  }
  return _.filter(_.orderBy(menus, ['order'], ['asc']), (o) => {
    return o.enable !== false && o.checked !== false
  })
}

/**
 * 匹配菜单
 * @param route 路由对象，默认$route
 * @param setToReactiveMenuData 是否将匹配结果设置到reactiveMenuData中,默认true
 * @param willGoDefaultIfNeed 无匹配导航时是否重定向到首页,默认true
 * @returns {currentMenu: ReactiveMenuItemVO, currentMenuWithParents: ReactiveMenuItemVO[]}
 */
function matchRoute (route = $route, setToReactiveMenuData = true, willGoDefaultIfNeed = true) {
  const recursion = (menus, currentMenuWithParents) => {
    for (const menuItem of menus) {
      const currentMenuWithParents2 = [...currentMenuWithParents]
      currentMenuWithParents2.push(menuItem)
      if (matchConfig(menuItem, route)) {
        const currentMenu = _.findLast(currentMenuWithParents2, ['type', 'menu']) || menuItem
        return {
          currentMenuWithParents: currentMenuWithParents2,
          currentMenu
        }
      } else if (menuItem && menuItem.children && menuItem.children.length) {
        const res = recursion(menuItem.children, currentMenuWithParents2)
        if (res?.currentMenuWithParents?.length) {
          return res
        }
      }
    }
    return {
      currentMenuWithParents: [],
      currentMenu: null
    }
  }
  const res = recursion(reactiveMenuData.menus, [])
  if (setToReactiveMenuData) {
    reactiveMenuData.currentMenuWithParents = res.currentMenuWithParents
    reactiveMenuData.currentMenu = res.currentMenu
  }

  if (willGoDefaultIfNeed) {
    goDefaultIfNeed()
  }

  return res
}

function matchConfig (item, $routeToMatch) {
  if (!item.config) {
    return false
  }
  if (!item.config.route) {
    return false
  }
  let routeConfig = item.config.route
  if (routeConfig.path && !routeConfig.name) {
    const route = $router.resolve(pathValueGet(routeConfig.path, true).replace(/\?}/g, '%3F}'))
    if (route.name) {
      routeConfig = {
        ...getOriginalValue(routeConfig)
      }
      routeConfig.name = route.name
      routeConfig.params = []
      routeConfig.query = [...routeConfig.query || []]
      for (const o of ['params', 'query']) {
        for (const key in route[o]) {
          routeConfig[o].push({
            key,
            value: route[o][key],
            isReal: route[o][key] ? !route[o][key].endsWith('?}') : false
          })
        }
      }
    }
  }
  if ($routeToMatch?.name === routeConfig.name && routeConfig.name) {
    for (const o of ['params', 'query']) {
      const configValue = routeValueGet(routeConfig[o], true) || {}
      for (const key in configValue || {}) {
        if (!matchValue(configValue[key], $routeToMatch[o][key])) {
          return false
        }
        // let isSameValue = true
        // let [configTruePath, configQuery] = configValue[key].split(/\?(?!})/)
        // const configArr = configTruePath.split('/')
        // const configQueryArr = configQuery?.split('&') || []
        // let [routeTruePath, routeQuery] = ($routeToMatch[o][key] ?? '').split(/\?(?!})/)
        // const routeArr = routeTruePath.split('/')
        // const routeQueryArr = routeQuery?.split('&') || []
        // for (let i = 0; i < configArr.length; i++) {
        //     if (!configArr[i].endsWith('?}') && routeArr[i] !== configArr[i]) {
        //         isSameValue = false
        //     }
        // }
        // for (let i = 0; i < configQueryArr.length; i++) {
        //     if (!configQueryArr[i].endsWith('?}') && configQueryArr[i] !== routeQueryArr[i]) {
        //         isSameValue = false
        //     }
        // }
        // if (Object.prototype.hasOwnProperty.call(configValue, key) && !isSameValue) {
        //     return false
        // }
      }
    }
    if (routeConfig.hash && !matchValue(pathValueGet(routeConfig.hash, true), $routeToMatch.hash)) {
      return false
    }
  } else {
    return false
  }
  return true
}

function matchValue (a, b) {
  const reg = new RegExp('^' + _.escapeRegExp(a).replace(/(\/?\\\$\\{.*?\\\?\\})+/g, '.*?') + '$')
  return reg.test(b)
}

/**
 * 路由参数取值
 * @param configs 路由配置
 * @param forCompare 是否用于比较，为true时，isReal为false的值会被忽略
 */
function routeValueGet (configs, forCompare) {
  const value = {}
  if (configs) {
    for (const config of configs) {
      if (!forCompare || (forCompare && config.isReal)) {
        if (Object.prototype.hasOwnProperty.call(config, 'value')) {
          let configValue = config.value
          if (typeof configValue === 'string') {
            configValue = pathValueGet(configValue, forCompare)
          }
          value[config.key] = configValue
        } else {
          value[config.key] = getMockValue(config.key)
        }
      }
    }
  }
  return value
}

/**
 * 路径参数取值
 * @param path 路径
 * @param forCompare 是否用于比较，为true时，${a?}返回原值
 * @returns {*}
 */
function pathValueGet (path, forCompare) {
  if (getConfigValue('disableMock')) {
    return path
  }
  return path.replace(/\$\{(.*?)(\?)?}/g, (match, key, isReal) => {
    if (isReal && forCompare) {
      return match
    }
    return getMockValue(key)
  })
  // const transform = (item) => {
  //     const mockKeys = item.match(/\$\{(.*?)\??}/g)
  //     if (mockKeys && mockKeys.length) {
  //         _.forEach(mockKeys, (mockKey) => {
  //             if (mockKey.endsWith('?}') && forCompare) {
  //                 return
  //             }
  //             let mockValue = getMockValue(mockKey.replace(/^\$\{/, '').replace(/\??}$/, ''))
  //             item = item.replace(mockKey, mockValue ?? '')
  //         })
  //     }
  //     return item
  // }
  //
  // let [truePath, query] = path.split(/\?(?!})/)
  //
  // const arr = truePath.split('/')
  // for (let i = arr.length - 1; i >= 0; i--) {
  //     const flag = !!arr[i]
  //     arr[i] = transform(arr[i])
  //     if (flag && !arr[i]) {
  //         arr.splice(i, 1)
  //     }
  // }
  //
  // if (query) {
  //     query = transform(query)
  // }
  //
  // return arr.join('/') + (query ? ('?' + query) : '')
}

function goDefault (menus = reactiveMenuData.menus) {
  const defaultMenu = getDefault(menus)
  jump(defaultMenu)
}

function getDefault (menuList) {
  let defaultItem = _.find(menuList, (o) => {
    return o.config && o.config.isDefault && !o.config.disabled
  })
  if (!defaultItem) {
    defaultItem = _.find(menuList, (o) => {
      return o.type === 'menu' && !o.config.disabled
    })
  }
  if (defaultItem && defaultItem.children &&
    defaultItem.children.length &&
    (!defaultItem.config.route || (defaultItem.config.route && !defaultItem.config.route.name))) {
    return getDefault(defaultItem.children)
  } else {
    return defaultItem
  }
}

function jump (menu) {
  if (!menu) {
    return
  }
  if (menu && menu.config && menu.config.route) {
    const routeInfo = _.cloneDeep(menu.config.route)
    if (routeInfo) {
      routeInfo.params = routeValueGet(routeInfo.params)
    }
    if (routeInfo.query) {
      routeInfo.query = routeValueGet(routeInfo.query)
    }
    if (routeInfo.hash) {
      routeInfo.hash = pathValueGet(routeInfo.hash)
    }
    if (routeInfo.path) {
      routeInfo.path = pathValueGet(routeInfo.path)
      if (routeInfo.query) {
        routeInfo.path += (routeInfo.path.includes('?') ? '&' : '?') + _.map(_.keys(routeInfo.query), (key) => {
          return `${key}=${encodeURIComponent(routeInfo.query[key])}`
        }).join('&')
      }
      if (routeInfo.hash) {
        routeInfo.path += routeInfo.hash
      }
    }
    if (!menu.config.target || menu.config.target === '_self') {
      $router.push(routeInfo.path || routeInfo)
    } else {
      window.open(routeInfo.path || $router.resolve(routeInfo).href, menu.config.target)
    }
    return menu
  } else if (menu.children && menu.children.length && menu.config.boundary) {
    return jump(getDefault(menu.children))
  }
}

function getMockValue (key) {
  if (getConfigValue('disableMock')) {
    return key
  }
  if (key === '__date__') {
    return new Date().getTime()
  }
  const mock = getOriginalValue(reactiveMenuData.mock)
  return _.get(mock, key)
}

function getConfigValue (key) {
  const config = getOriginalValue(reactiveMenuData.config)
  return _.get(config, key)
}

function getOriginalValue (value) {
  return isProxy(value) ? toRaw(value) : unref(value)
}

function goDefaultIfNeed () {
  const autoIndex = getConfigValue('autoIndex')
  if (!reactiveMenuData.currentMenuWithParents.length && !!autoIndex) {
    if (autoIndex instanceof Function) {
      autoIndex(reactiveMenuData)
    } else {
      goDefault()
    }
  }
}

function resetId (list) {
  const ids = []
  const noIdMenus = []
  const recursion = (list, parentId) => {
    for (const item of list) {
      if (item.id || item.id === 0) {
        ids.push(item.id)
      } else {
        noIdMenus.push(item)
      }
      if (parentId || parentId === 0) {
        item.parentId = parentId
      }
      if (item.children?.length) {
        recursion(item.children, item.id)
      }
    }
  }
  recursion(list)
  let maxId = Math.max(...ids.map((id) => {
    return isNaN(Number(id)) ? 0 : Number(id)
  }), 0)
  for (const item of noIdMenus) {
    item.id = ++maxId
    if (item.children?.length) {
      for (const child of item.children) {
        child.parentId = item.id
      }
    }
  }
}
