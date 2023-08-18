// 配置说明参考node_modules/@plantdata/reactive-menu-item/interface.ts
// 导航使用参考node_modules/@plantdata/reactive-menu-item/README.md
const menus = [
  {
    id: 'adfadf',
    name: '一级菜单1',
    enable: true,
    checked: true,
    type: 'menu',
    order: 1,
    config: {
      isDefault: true,
      icon: 'path://M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z',
      boundary: true
    },
    children: [
      {
        name: '二级菜单',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          icon: 'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'
        },
        children: [
          {
            name: '叶子菜单',
            enable: true,
            checked: true,
            type: 'menu',
            order: 1,
            config: {
              isDefault: true,
              icon: 'path://M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z',
              route: {
                name: 'template',
                query: [
                  {
                    key: 'type',
                    isReal: true,
                    value: '1-1-2'
                  },
                  {
                    key: 'date',
                      // eslint-disable-next-line no-template-curly-in-string
                    value: '${__date__}'
                  }
                ]
              }
            }
          },
          {
            name: '菜单分组测试1',
            enable: true,
            checked: true,
            type: 'menu',
            order: 1,
            config: {
              menuItemGroup: true,
              isDefault: true,
              icon: 'ic-system',
              route: {
                name: 'template',
                query: [{
                  key: 'type',
                  isReal: true,
                  value: '菜单分组测试1'
                }]
              }
            },
            children: [
              {
                name: '叶子菜单1',
                enable: true,
                checked: true,
                type: 'menu',
                order: 1,
                config: {
                  isDefault: true,
                  icon: 'ic-system',
                  route: {
                    name: 'template',
                    query: [
                      {
                        key: 'type',
                        isReal: true,
                        value: '1-1-1-1'
                      }
                    ]
                  }
                }
              },
              {
                name: '叶子菜单2',
                enable: true,
                checked: true,
                type: 'menu',
                order: 1,
                config: {
                  isDefault: true,
                  icon: 'ic-system',
                  route: {
                    name: 'template',
                    query: [{
                      key: 'type',
                      isReal: true,
                      value: '1-1-1-2'
                    }]
                  }
                }
              }
            ]
          }
        ]
      },
      {
        name: '普通菜单',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: false,
          icon: 'ic-system',
          route: {
            name: 'template',
            query: [{
              key: 'type',
              isReal: true,
              value: '普通菜单'
            }]
          }
        }
      },
      {
        name: 'query可选参数测试',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: false,
          icon: 'ic-system',
          route: {
            name: 'template',
            query: [{
              key: 'type',
              isReal: true,
              value: 'query可选参数测试'
            }, {
              key: 'url',
              isReal: true,
              // eslint-disable-next-line no-template-curly-in-string
              value: '/a/b/c/${kgName}/${apk?}/${page?}?kw=${kw}'
            }]
          }
        }
      },
      {
        name: '跳转百度测试',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: false,
          icon: 'ic-system',
          target: '_blank',
          route: {
            path: 'https://www.baidu.com/s?wd=a',
            query: [
              {
                key: 'kgName'
              }
            ]
          }
        }
      },
      {
        name: 'path测试',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: false,
          icon: 'ic-system',
          route: {
            // eslint-disable-next-line no-template-curly-in-string
            path: '/template/${apk?}?type=path测试&apk=${apk?}',
            query: [
              {
                key: 'url',
                // eslint-disable-next-line no-template-curly-in-string
                value: 'https://www.baidu.com/s?wd=${kgName?}&a=a',
                isReal: true
              }
            ]
          }
        }
      },
      {
        name: 'hash测试',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: false,
          icon: 'ic-system',
          route: {
            name: 'template',
            query: [{
              key: 'type',
              isReal: true,
              value: 'hash测试'
            }],
            // eslint-disable-next-line no-template-curly-in-string
            hash: '#hash测试${kgName?}'
          }
        }
      },
      {
        name: 'disabledDefaultClick的导航',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          disabledDefaultClick: true,
          isDefault: true,
          icon: 'ic-zsjm-gndy',
          boundary: true,
          route: {
            name: 'template',
            query: [{
              key: 'type',
              isReal: true,
              value: 'disabledDefaultClick的导航'
            }]
          }
        }
      },
      {
        name: '测试详情',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          icon: 'ic-zsjm-gndy',
          boundary: true,
          route: {
            name: 'template',
            query: [{
              key: 'type',
              isReal: true,
              value: '测试详情'
            }]
          }
        },
        children: [
          {
            name: '测试详情的详情',
            enable: true,
            checked: true,
            type: 'submenu',
            order: 1,
            config: {
              isDefault: true,
              icon: 'ic-zsjm-gndy',
              boundary: true,
              route: {
                name: 'template',
                query: [{
                  key: 'type',
                  isReal: true,
                  value: '测试详情的详情'
                }]
              }
            },
            children: [
              {
                name: '测试详情的详情的详情',
                enable: true,
                checked: true,
                type: 'submenu',
                order: 1,
                config: {
                  isDefault: true,
                  icon: 'ic-zsjm-gndy',
                  boundary: true,
                  route: {
                    name: 'template',
                    query: [{
                      key: 'type',
                      isReal: true,
                      value: '测试详情的详情的详情'
                    }]
                  }
                }
              }
            ]
          },
          {
            name: '测试详情的详情2',
            enable: true,
            checked: true,
            type: 'submenu',
            order: 1,
            config: {
              isDefault: true,
              icon: 'ic-zsjm-gndy',
              boundary: true,
              route: {
                name: 'template',
                query: [{
                  key: 'type',
                  isReal: true,
                  value: '测试详情的详情2'
                }]
              }
            }
          }
        ]
      }
    ]
  },
  {
    name: '文档',
    enable: true,
    checked: true,
    type: 'menu',
    order: 1,
    config: {
      isDefault: true,
      icon: 'ic-zsjm-gndy',
      boundary: true
    },
    children: [
      {
        id: '9999',
        name: 'README',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          icon: 'ic-zsjm-gndy',
          boundary: true,
          route: {
            name: 'template',
            query: [{
              key: 'type',
              isReal: true,
              value: 'README'
            }]
          }
        }
      },
      {
        name: 'interface',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          icon: 'ic-zsjm-gndy',
          boundary: true,
          route: {
            name: 'template',
            query: [{
              key: 'type',
              isReal: true,
              value: 'interface'
            }]
          }
        }
      }
    ]
  },
  {
    name: 'disabledDefaultClick的一级导航',
    enable: true,
    checked: true,
    type: 'menu',
    order: 1,
    config: {
      disabledDefaultClick: true,
      isDefault: true,
      icon: 'ic-zsjm-gndy',
      boundary: true,
      route: {
        name: 'template',
        query: [{
          key: 'type',
          isReal: true,
          value: 'disabledDefaultClick的一级导航'
        }]
      }
    }
  },
  {
    name: '一级跳转测试',
    enable: true,
    checked: true,
    type: 'menu',
    order: 1,
    config: {
      isDefault: false,
      icon: 'ic-system',
      target: '_blank',
      route: {
        path: 'https://www.baidu.com/s?wd=a',
        query: [
          {
            key: 'apk'
          }
        ]
      }
    }
  },
  {
    name: '菜单管理',
    enable: true,
    checked: true,
    type: 'menu',
    order: 1,
    config: {
      isDefault: true,
      icon: 'ic-zsjm-gndy',
      boundary: true
    },
    children: [
      {
        name: '菜单编辑',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          icon: 'ic-zsjm-gndy',
          boundary: true,
          route: {
            name: 'template',
            query: [{
              key: 'type',
              isReal: true,
              value: '菜单编辑'
            }]
          }
        }
      },
      {
        name: '菜单树',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          icon: 'ic-zsjm-gndy',
          boundary: true,
          route: {
            name: 'template',
            query: [{
              key: 'type',
              isReal: true,
              value: '菜单树'
            }]
          }
        }
      }
    ]
  },
  {
    name: '有children的一级菜单',
    enable: true,
    checked: true,
    type: 'menu',
    order: 1,
    config: {
      isDefault: false,
      icon: 'ic-system',
      target: '_blank'
    },
    children: [
      {
        name: '叶子菜单2',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          icon: 'ic-system',
          route: {
            name: 'template',
            query: [
              {
                key: 'type',
                isReal: true,
                value: '叶子菜单2'
              }
            ]
          }
        }
      },
      {
        name: '叶子菜单3',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          icon: 'ic-system',
          route: {
            name: 'template',
            query: [
              {
                key: 'type',
                isReal: true,
                value: '叶子菜单3'
              }
            ]
          }
        }
      }
    ]
  },
  {
    name: '没route的一级菜单',
    enable: true,
    checked: true,
    type: 'menu',
    order: 1,
    config: {
      isDefault: false,
      icon: 'ic-system'
    }
  }
]
export default menus

