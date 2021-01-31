/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  // 初始化Vue.config 对象
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 这些工具方法不诗作全局Api的一部分，除非你已经意识到某些风险，否则不要去依赖他们
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }
  // 静态方法 set/delete/nextTick
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 2.6 explicit observable API
  // 让一个对象可相应
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  // 初始化Vue.options 对象，并给其扩展
  // components/directives/filters
    Vue.options = Object.create(null)
    ASSET_TYPES.forEach(type => {
      Vue.options[type + 's'] = Object.create(null)
    })
  
    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    // 储存了Vue的构造函数
    Vue.options._base = Vue
    
    // 设置keep-alive组件
    // extend 把一个对象的所有属性 拷贝到另一个对象中来
    extend(Vue.options.components, builtInComponents)
    
    // 注册 Vue.use() 用来注册插件
    initUse(Vue)
    // 注册 Vue.mixin() 实现混入
    initMixin(Vue)
    // 注册Vue.extend() 基于传入的options返回一个组件的构造函数
    initExtend(Vue)
    // 注册Vue.directive(), Vue.component(), Vue.filter() 这三个方法的参数是一样的 都是 id,definition
    initAssetRegisters(Vue)

    // 给Vue挂载了一些静态方法
  }
  
