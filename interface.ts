import { RouteLocationNamedRaw } from "vue-router";

export interface ReactiveMenuVO {
  menus: ReactiveMenuItemVO[]; // 排序过滤后的所有数据,一般用在一级导航上
  secondMenus: ReactiveMenuItemVO[]; // 二级导航要展示的数据
  mock: {[key: string]: any}; // 动态参数取值的地方
  currentMenu: ReactiveMenuItemVO; // 当前选中的导航数据
  currentMenuWithParents: ReactiveMenuItemVO[]; // 当前选中导航的链路
  activeIndex: string;
  topActiveIndex: string;
  config: { // 配置项
    autoIndex: boolean | ((reactiveMenuData: ReactiveMenuVO) => void); // 无匹配导航时是否重定向到首页，布尔值或一个方法，默认true，会获取当前menus的默认菜单跳转，为方法时会调用方法，为false不跳转
    selfJump: boolean; // 点击当前导航时，是否跳转，默认false
    disableMock: boolean; // 禁用mock,自行处理参数，默认false
    resetId: boolean; // 重置Id和parentId，限制同级100个，默认false
  };
  methods: { // 暴露的方法
    jump: (data: ReactiveMenuItemVO) => void;
    updateMenus: (menus: ReactiveMenuItemVO[]) => void;
    goDefault: (menus: ReactiveMenuItemVO[]) => void;
    resetId: (menus: ReactiveMenuItemVO[]) => void;
    /**
     * 匹配路由，返回当前匹配的导航数据
     * @param $route 路由对象，不传则取当前路由,目前只比对name、params、query、hash(hash仅在history模式下生效)
     * @param setToReactiveMenuData 是否设置到reactiveMenuData中，默认true
     * @param willGoDefaultIfNeed 如果不匹配，是否跳转到默认导航，默认true
     */
    matchRoute: ($route?: RouteLocationNamedRaw, setToReactiveMenuData?: boolean, willGoDefaultIfNeed?: boolean) => {currentMenu: ReactiveMenuItemVO, currentMenuWithParents: ReactiveMenuItemVO[]};
  }
}

export interface ReactiveMenuItemVO {
  id: number;
  pid: number;
  name: string;
  // 只有type为 'menu' 时才会被渲染成导航项，
  // shadowMenu'用于详情等页面，不会生成导航项，会高亮他的parent
  // 自定义的 string 用于记录其他信息，如权限，选项等
  type: 'menu' | 'shadowMenu' | string;
  checked: boolean;
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
      params?: ReactiveMenuRouteParamsVO[];
      query?: ReactiveMenuRouteParamsVO[];
      hash?: string; // '#'开头的hash，支持${key}
      path?: string; // 会无视name、params参数，直接作为地址跳转,支持 /a/${b}/${c}?d=${d},query参数也可在query中定义；支持${e?}，表示不参与比较
    };
    attributes: {[key: string]: any}; // 视情况，Menu-Item 属性、SubMenu 属性、Menu-Item-Group 属性,具体参考element-plu文档
  };
  children?: ReactiveMenuItemVO[];
}

export interface ReactiveMenuRouteParamsVO {
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
  isReal?: boolean;
}

