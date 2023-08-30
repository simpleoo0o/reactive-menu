# 动态导航更新日志

## [0.0.23] (2023.08.30)
#### feat
useReactiveMenu导出
#### chore
build.lib.formats改成es
#### refactor
更新依赖
reactive-menu.js 重命名为 useReactiveMenu.js

## [0.0.22] (2023.08.29)
#### chore
添加GitHub action并适配

## [0.0.21] (2023.08.29)
#### feat
feat: MenuContent 按图标类型添加class

#### refactor
menuItemAttrs、subMenuAttrs、menuItemGroupAttrs合并成attributes

#### chore
package添加homepage、repository信息

## [0.0.20] (2023.08.15)
#### feat
- autoIndex方法添加参数

## [0.0.19] (2023.08.15)
#### feat
- 移除include、exclude配置
- autoIndex支持方法

## [0.0.18] (2023.08.14)
#### feat
- menuContent菜单名称包一层span
- menuContent修改icon中image的规则
- menuContent修改path支持配置viewBox

## [0.0.17] (2023.07.18)
#### feat
- 添加include、exclude配置
- matchRoute方法添加willGoDefaultIfNeed参数，内置goDefaultIfNeed方法（根据include、exclude、willGoDefaultIfNeed判断是否跳转）
- 移除了菜单config中的showChildren


## [0.0.16] (2023.07.07)
#### fix
- 点击无config.route菜单报错

## [0.0.15] (2023.06.30)
#### refactor
- 重构resetId，会保留已设置的id,支持字符串id，并暴露resetId方法

#### fix
- type不是menu的导航点击报错

## [0.0.14] (2023.05.08)
#### fix
- disabled无效

## [0.0.13] (2023.05.08)
#### fix
- topActiveIndex 在一级导航有多层时计算错误
- resetActiveIndex 无匹配时置为null

#### refactor
- pathValueGet 直接用正则匹配

## [0.0.12] (2023.05.04)

#### feat
- 支持hash
- matchRoute 方法添加route、setToReactiveMenuData参数

#### refactor
- 利用正则比对value

#### fix
- menus监听

## [0.0.11] (2023.04.27)
#### fix
- 跳转后菜单选中修正

## [0.0.10] (2023.04.19)
#### feat
- icon支持data:image/开头的图片和path://开头的path的d

## [0.0.9] (2023.04.07)
#### fix
- el-menu-item点击不触发默认事件

## [0.0.8] (2023.04.06)
#### feat
- 当mock、config、menus为ref或reactive时，支持监听
- 支持匹配route中配置的path
- config中添加resetId

## [0.0.7] (2023.04.03)
#### feat
- 动态参数从:支持${a?}

## [0.0.6] (2023.04.03)
#### feat
- 动态参数从:a改成${a}

## [0.0.5] (2023.03.08)
#### refactor
- 简化代码

## [0.0.4] (2023.03.07)
#### improvement
- 规范方法名
#### docs
- 修改文案错误

## [0.0.3] (2023.03.06)
#### feat
- 支持 disableMock 配置
#### refactor
- 一些小重构

## [0.0.0] (2023.01.05)
#### feat
- 初始化
