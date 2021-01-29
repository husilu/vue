/* @flow */

import * as nodeOps from 'web/runtime/node-ops' // 操作dom的api
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index' // 处理指令和ref的
import platformModules from 'web/runtime/modules/index' // 操作属性，事件，样式等生命周期的钩子函数

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules }) // 
