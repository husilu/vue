/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++
    this.subs = []
  }
  // 添加新的订阅者 watcher 对象
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }
  // 移除订阅者
  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  // 将观察对象和watcher 建立依赖
  depend() {
    if (Dep.target) {
      // 如果target存在 把dep对象添加到watcher的依赖中 this 就是dep
      Dep.target.addDep(this)
    }
  }

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice() // subs存储的是watcher，slice是对数组克隆
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    // 调用每个订阅者的update方法实现更新
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// Dep.target 用来存放目前正在使用的watcher
// 全局唯一，并且一次也只能有一个watcher被使用
// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

// 入栈并将当前 watcher 赋值给Dep.target 
// 父子组件嵌套的时候 先把父组件对应watcher入栈
// 再去处理子组件的watcher，子组件处理完毕之后，再把父组件对应的watcher出栈，继续操作
// vue2.0之后每一个组件对应一个watcher ？ 为什么？不是说每一个属性对应一个watcher吗  懵逼
export function pushTarget(target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  // 出栈操作
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
