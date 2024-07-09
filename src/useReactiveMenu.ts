import { get, keys, map, escapeRegExp, orderBy, cloneDeep, filter, find, findLast, merge } from 'lodash-es'
import {
  reactive,
  provide,
  watch,
  toRaw,
  isRef,
  unref,
  isProxy,
  MaybeRef,
  UnwrapNestedRefs,
  watchEffect
} from 'vue'
import {
  RouteLocation,
  RouteLocationNamedRaw,
  RouteLocationNormalizedLoaded,
  RouteLocationPathRaw,
  Router,
  useRoute,
  useRouter
} from 'vue-router'

export interface ReactiveMenuConfig {
  autoIndex?: boolean | ((reactiveMenu: ReactiveMenu) => void); // 无匹配导航时是否重定向到首页，布尔值或一个方法，默认true，会获取当前menus的默认菜单跳转，为方法时会调用方法，在方法中自行跳转；为false不跳转
  selfJump?: boolean; // 点击当前导航时，是否跳转，默认false
  disableMock?: boolean; // 禁用mock,自行处理参数，默认false
}

export interface ReactiveMenuRouteParams {
  // 字段的key
  key: string;
  /**
   * 字段值，填了即为字段的值，
   * 若不填，从mockConfig中用key取值
   * ${key} 会被替换成 mockConfig[key]
   * 支持${key?},表示不参与比较
   */
  value?: string;
  // 地址比较时是否必选
  required?: boolean;
}

export interface ReactiveMenuItemConfig {
  id: string;
  pid: string;
  name: string;
  // 只有type为 'menu' 时才会被渲染成导航项，
  // 'shadowMenu' 用于详情等页面，不会生成导航项，会高亮他type为  'menu' 的祖先
  // 自定义的 string 用于记录其他信息，如权限，选项等,实际使用中不利于维护，更推荐放配置文件
  type: 'menu' | 'shadowMenu' | string;
  checked?: boolean;
  enable?: boolean;
  order?: number;
  config: {
    element?: string; // 自定义元素，type为 'menu' 时生效
    boundary?: boolean; // 边界,对应某个菜单项内展开一个详情，自成一棵导航树的场景,如3.6版kgtext，语料管理 点击 管理，进入管理详情，自成一棵导航树
    isDefault?: boolean;
    icon?: string;// 默认为icon的class,支持path://开头的，svg path的d，或者path://开头的图片地址,仿echarts的 https://echarts.apache.org/zh/option.html#series-line.symbol
    viewBox?: string; // 配合icon以path://开头的使用,默认'0 0 24 24'
    target?: '_blank' | '_self'; // 点击menu时是新开还是本页跳转，默认_self
    disabled?: boolean;
    classList?: string[];
    disabledDefaultClick?: boolean; // 是否禁止默认click事件,用于自定义菜单元素自行处理click事件
    notBeDefault?: boolean; // 管理时是否可被设为默认菜单
    route?: {
      name?: string; // name和path必须有一个，path优先级高于name
      params?: ReactiveMenuRouteParams[];
      query?: ReactiveMenuRouteParams[];
      hash?: string; // '#'开头的hash，支持${key}
      path?: string; // 会无视name、params参数，直接作为地址跳转,支持 /a/${b}/${c}?d=${d},query参数也可在query中定义；支持${e?}，表示不参与比较
    };
    attributes: Record<string, unknown>; // 视情况，Menu-Item 属性、SubMenu 属性、Menu-Item-Group 属性,具体参考element-plu文档
    menuItemGroup: boolean; // 是否将菜单的类型置为menuItemGroup
  };
  children?: ReactiveMenuItemConfig[];
}

export interface MockParams {
  [key: string]: string | MockParams
}

export interface ReactiveMenu {
  menus: ReactiveMenuItemConfig[]; // 排序过滤后的所有数据,一般用在一级导航上
  secondMenus: ReactiveMenuItemConfig[]; // 二级导航要展示的数据
  mock: MockParams; // 动态参数取值的地方
  currentMenu?: ReactiveMenuItemConfig; // 当前选中的导航数据
  currentMenuWithParents?: ReactiveMenuItemConfig[]; // 当前选中导航的链路
  activeIndex?: string;
  topActiveIndex?: string;
  config: ReactiveMenuConfig;
  methods: { // 暴露的方法
    jump: typeof jump;
    updateMenus: (menus: ReactiveMenuItemConfig[]) => void;
    goDefault: (menus?: ReactiveMenuItemConfig[]) => void;
    resetMenuIds: (menus: ReactiveMenuItemConfig[]) => void;
    /**
     * 匹配路由，返回当前匹配的导航数据
     * @param $route 路由对象，不传则取当前路由,目前只比对name、params、query、hash(hash仅在history模式下生效)
     * @param setToReactiveMenu 匹配到的currentMenu是否设置到reactiveMenu中，默认true
     * @param willGoDefaultIfNeed 如果不匹配，是否跳转到默认导航，默认true
     */
    matchRoute: typeof matchRoute;
  }
}

export interface ReactiveMenuOption {
  mock?: MockParams;
  config?: ReactiveMenuConfig;
}

const reactiveMenu = reactive<ReactiveMenu>({
  menus: [], // 排序过滤后的所有数据
  secondMenus: [], // 二级导航要展示的数据
  mock: {}, // 动态参数取值的地方
  currentMenu: undefined, // 当前选中的导航
  currentMenuWithParents: [], // 当前选中导航的链路
  activeIndex: undefined,
  topActiveIndex: undefined,
  config: {
    autoIndex: true, // 无匹配导航时是否重定向到首页
    selfJump: false, // 点击当前导航时，是否跳转
    disableMock: false
  },
  methods: { // 暴露的方法
    jump,
    updateMenus,
    goDefault,
    matchRoute,
    resetMenuIds
  }
})

let $router: Router
let $route: RouteLocationNormalizedLoaded

export function useReactiveMenu (menus: ReactiveMenuItemConfig[], options: ReactiveMenuOption = {}) {
  reactiveMenu.mock = getOriginalValue(options.mock || {})
  if (options.mock && (isRef(options.mock) || isProxy(options.mock))) {
    watch(options?.mock || {}, () => {
      reactiveMenu.mock = getOriginalValue(options.mock || {})
    })
  }

  reactiveMenu.config = merge({}, reactiveMenu.config, getOriginalValue(options.config || {}))
  if (options.config && (isRef(options.config) || isProxy(options.config))) {
    watch(options?.config || {}, () => {
      reactiveMenu.config = merge({}, reactiveMenu.config, getOriginalValue(options.config || {}))
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

  watchEffect(() => {
    const lastParent = findLast<ReactiveMenuItemConfig>(reactiveMenu.currentMenuWithParents, (o) => {
      return !!(
        o.config &&
        o.config.boundary &&
        reactiveMenu.currentMenu &&
        // currentMenu是 boundary为true的menu时，不需要展示他的children
        o.id !== reactiveMenu.currentMenu.id &&
        o.type === 'menu'
      )
    })
    if (lastParent) {
      if (reactiveMenu.currentMenu &&
        reactiveMenu.currentMenu.type !== 'menu' &&
        find(lastParent.children, { id: reactiveMenu.currentMenu.id })) {
        reactiveMenu.secondMenus = []
      } else {
        reactiveMenu.secondMenus = filter(lastParent.children || [], ['type', 'menu'])
      }
    } else {
      reactiveMenu.secondMenus = []
    }
  })

  watchEffect(() => {
    reactiveMenu.activeIndex = reactiveMenu.currentMenu?.id
  })

  watchEffect(() => {
    reactiveMenu.topActiveIndex = find<ReactiveMenuItemConfig>(reactiveMenu.currentMenuWithParents || [], (item) => {
      return !!item.config.boundary && item.type === 'menu'
    })?.id || findLast(reactiveMenu.currentMenuWithParents || [], (item) => {
      return item.type === 'menu'
    })?.id
  })

  watch($route, () => {
    matchRoute()
  })

  provide('reactiveMenu', reactiveMenu)

  return reactiveMenu
}

function updateMenus (menus: ReactiveMenuItemConfig[]) {
  reactiveMenu.currentMenu = undefined
  reactiveMenu.currentMenuWithParents = []
  menus = cloneDeep(getOriginalValue(menus))
  resetMenuIds(menus)
  reactiveMenu.menus = menuOrderAndFilter(menus)
  matchRoute()
}

function menuOrderAndFilter (menus: ReactiveMenuItemConfig[]) {
  for (const menu of menus) {
    menu.id = menu.id.toString ? menu.id.toString() : menu.id
    menu.type = menu.type ?? 'menu'
    menu.config = menu.config ?? {}
    if (menu && menu.children && menu.children.length) {
      menu.children = menuOrderAndFilter(menu.children)
    }
  }
  return filter(orderBy(menus, ['order'], ['asc']), (o) => {
    return o.enable !== false && o.checked !== false
  })
}

/**
 * 匹配菜单
 * @param route 路由对象，默认$route
 * @param setToReactiveMenu 匹配到的currentMenu是否设置到reactiveMenu中，默认true
 * @param willGoDefaultIfNeed 无匹配导航时是否重定向到首页,默认true
 * @returns {currentMenu: ReactiveMenuItemConfig, currentMenuWithParents: ReactiveMenuItemConfig[]}
 */
function matchRoute (route = $route, setToReactiveMenu = true, willGoDefaultIfNeed = true) {
  const recursion = (menus: ReactiveMenuItemConfig[], currentMenuWithParents: ReactiveMenuItemConfig[]): {
    currentMenuWithParents: ReactiveMenuItemConfig[];
    currentMenu?: ReactiveMenuItemConfig;
  } => {
    for (const menuItem of menus) {
      const currentMenuWithParents2 = [...currentMenuWithParents]
      currentMenuWithParents2.push(menuItem)
      if (matchConfig(menuItem, route)) {
        const currentMenu = findLast(currentMenuWithParents2, ['type', 'menu']) || menuItem
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
      currentMenu: undefined
    }
  }
  const res = recursion(reactiveMenu.menus, [])
  if (setToReactiveMenu) {
    reactiveMenu.currentMenuWithParents = res.currentMenuWithParents
    reactiveMenu.currentMenu = res.currentMenu
  }

  if (willGoDefaultIfNeed) {
    goDefaultIfNeed()
  }

  return res
}

function matchConfig (item: ReactiveMenuItemConfig, $routeToMatch: RouteLocationNormalizedLoaded) {
  const paramsAndQuery: ['params', 'query'] = ['params', 'query']
  if (!item.config) {
    return false
  }
  if (!item.config.route) {
    return false
  }
  let routeConfig = item.config.route
  if (routeConfig.path && !routeConfig.name) {
    const route: RouteLocation = $router.resolve(pathValueGet(routeConfig.path, true).replace(/\?}/g, '%3F}'))
    if (route.name) {
      routeConfig = {
        ...getOriginalValue(routeConfig)
      }
      routeConfig.name = route.name as string
      routeConfig.params = []
      routeConfig.query = [...(routeConfig.query || [])]
      for (const o of paramsAndQuery) {
        for (const key in route[o]) {
          const value = route[o][key] as string
          routeConfig[o]?.push({
            key,
            value,
            required: route[o][key] ? !value.endsWith('?}') : false
          })
        }
      }
    }
  }
  if ($routeToMatch?.name === routeConfig.name && routeConfig.name) {
    for (const o of paramsAndQuery) {
      const configValue = routeValueGet(routeConfig[o] || [], true)
      for (const key in configValue || {}) {
        if (!matchValue(configValue[key], $routeToMatch[o][key] as string)) {
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

function matchValue (a: string, b: string) {
  const reg = new RegExp('^' + escapeRegExp(a).replace(/(\/?\\\$\\{.*?\\\?\\})+/g, '.*?') + '$')
  return reg.test(b)
}

/**
 * 路由参数取值
 * @param configs 路由配置
 * @param forCompare 是否用于比较，为true时，required为false的值会被忽略
 */
function routeValueGet (configs: ReactiveMenuRouteParams[], forCompare = false) {
  const value: { [key: string]: string } = {}
  if (configs) {
    for (const config of configs) {
      if (!forCompare || (forCompare && config.required)) {
        if (Object.prototype.hasOwnProperty.call(config, 'value')) {
          let configValue = config.value
          if (typeof configValue === 'string') {
            configValue = pathValueGet(configValue, forCompare)
          }
          value[config.key] = configValue as string
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
function pathValueGet (path: string, forCompare = false): string {
  if (getConfigValue('disableMock')) {
    return path
  }
  return path.replace(/\$\{(.*?)(\?)?}/g, (match, key, required) => {
    if (required && forCompare) {
      return match
    }
    return getMockValue(key)
  })
  // const transform = (item) => {
  //     const mockKeys = item.match(/\$\{(.*?)\??}/g)
  //     if (mockKeys && mockKeys.length) {
  //         forEach(mockKeys, (mockKey) => {
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

function goDefault (menus = reactiveMenu.menus) {
  const defaultMenu = getDefault(menus)
  jump(defaultMenu)
}

function getDefault (menuList: ReactiveMenuItemConfig[]) {
  let defaultItem = find<ReactiveMenuItemConfig>(menuList, (o) => {
    return !!(o.config?.isDefault && !o.config.disabled)
  })
  if (!defaultItem) {
    defaultItem = find<ReactiveMenuItemConfig>(menuList, (o) => {
      return o.type === 'menu' && !o.config.disabled
    })
  }
  if (defaultItem?.children?.length && (!defaultItem.config.route || !defaultItem?.config?.route?.name)) {
    return getDefault(defaultItem.children)
  } else {
    return defaultItem
  }
}

function jump (menu: ReactiveMenuItemConfig | undefined) {
  if (!menu) {
    return
  }
  if (menu && menu.config && menu.config.route) {
    const configRoute = menu.config.route
    const routeInfo: RouteLocationPathRaw | RouteLocationNamedRaw = {
      name: configRoute?.name,
      path: configRoute?.path
    }
    if (configRoute.params) {
      (routeInfo as RouteLocationNamedRaw).params = routeValueGet(configRoute.params)
    }
    if (configRoute.query) {
      routeInfo.query = routeValueGet(configRoute.query)
    }
    if (configRoute.hash) {
      routeInfo.hash = pathValueGet(configRoute.hash)
    }
    if (configRoute.path) {
      (routeInfo as RouteLocationPathRaw).path = pathValueGet(configRoute.path)
      if (routeInfo.query) {
        (routeInfo as RouteLocationPathRaw).path += ((routeInfo as RouteLocationPathRaw).path.includes('?') ? '&' : '?') + map(keys(routeInfo.query), (key) => {
          return `${key}=${encodeURIComponent(routeInfo.query?.[key] as string)}`
        }).join('&')
      }
      if (routeInfo.hash) {
        (routeInfo as RouteLocationPathRaw).path += routeInfo.hash
      }
    }
    if (!menu.config.target || menu.config.target === '_self') {
      $router.push((routeInfo as RouteLocationPathRaw).path || routeInfo)
    } else {
      window.open((routeInfo as RouteLocationPathRaw).path || $router.resolve(routeInfo).href, menu.config.target)
    }
    return menu
  } else if (menu.children && menu.children.length && menu.config.boundary) {
    return jump(getDefault(menu.children))
  }
}

function getMockValue (key: string) {
  if (getConfigValue('disableMock')) {
    return key
  }
  if (key === '__date__') {
    return new Date().getTime()
  }
  const mock = getOriginalValue(reactiveMenu.mock)
  return get(mock, key)
}

function getConfigValue (key: string) {
  const config = getOriginalValue(reactiveMenu.config)
  return get(config, key)
}

function getOriginalValue<T> (value: UnwrapNestedRefs<T> | MaybeRef<T>): T {
  return isProxy(value) ? toRaw<T>(value as T) : unref(value as MaybeRef<T>)
}

function goDefaultIfNeed () {
  const autoIndex = getConfigValue('autoIndex')
  if (!reactiveMenu.currentMenuWithParents?.length && !!autoIndex) {
    if (autoIndex instanceof Function) {
      autoIndex(reactiveMenu)
    } else {
      goDefault()
    }
  }
}

function resetMenuIds (list: ReactiveMenuItemConfig[]) {
  const ids: string[] = []
  const noIdMenus: ReactiveMenuItemConfig[] = []
  const recursion = (list: ReactiveMenuItemConfig[], parentId: string) => {
    for (const item of list) {
      if (item.id || parentId?.toString() === '0') {
        ids.push(item.id)
      } else {
        noIdMenus.push(item)
      }
      if (parentId || parentId?.toString() === '0') {
        item.pid = parentId
      }
      if (item.children?.length) {
        recursion(item.children, item.id)
      }
    }
  }
  recursion(list, '')
  let maxId = Math.max(...ids.map((id) => {
    return isNaN(Number(id)) ? 0 : Number(id)
  }), 0)
  for (const item of noIdMenus) {
    item.id = (++maxId).toString()
    if (item.children?.length) {
      for (const child of item.children) {
        child.pid = item.id
      }
    }
  }
}
