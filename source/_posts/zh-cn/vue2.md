---
title: Vue2 code
---
Vue2源码阅读

## 获取Vue2源码
``` bash
git clone git@github.com:vuejs/vue.git
cd vue
git checkout next
```

## 文件结构
<pre>
├── compiler
│   ├── codegen
│   │   ├── events.js
│   │   └── index.js
│   ├── directives
│   │   ├── bind.js
│   │   └── index.js
│   ├── error-detector.js
│   ├── helpers.js
│   ├── index.js
│   ├── optimizer.js
│   └── parser
│       ├── entity-decoder.js
│       ├── filter-parser.js
│       ├── html-parser.js
│       ├── index.js
│       └── text-parser.js
├── core
│   ├── components
│   │   ├── index.js
│   │   └── keep-alive.js
│   ├── config.js
│   ├── global-api
│   │   ├── assets.js
│   │   ├── extend.js
│   │   ├── index.js
│   │   ├── mixin.js
│   │   └── use.js
│   ├── index.js
│   ├── instance
│   │   ├── events.js
│   │   ├── index.js
│   │   ├── init.js
│   │   ├── lifecycle.js
│   │   ├── proxy.js
│   │   ├── render.js
│   │   └── state.js
│   ├── observer
│   │   ├── array.js
│   │   ├── dep.js
│   │   ├── index.js
│   │   ├── scheduler.js
│   │   └── watcher.js
│   ├── util
│   │   ├── debug.js
│   │   ├── env.js
│   │   ├── index.js
│   │   ├── lang.js
│   │   ├── options.js
│   │   └── props.js
│   └── vdom
│       ├── create-component.js
│       ├── create-element.js
│       ├── helpers.js
│       ├── modules
│       │   ├── directives.js
│       │   ├── index.js
│       │   └── ref.js
│       ├── patch.js
│       └── vnode.js
├── entries
│   ├── web-compiler.js
│   ├── web-runtime.js
│   ├── web-runtime-with-compiler.js
│   └── web-server-renderer.js
├── platforms
│   └── web
│       ├── compiler
│       │   ├── directives
│       │   │   ├── html.js
│       │   │   ├── index.js
│       │   │   ├── model.js
│       │   │   └── text.js
│       │   ├── index.js
│       │   └── modules
│       │       ├── class.js
│       │       ├── index.js
│       │       └── style.js
│       ├── runtime
│       │   ├── class-util.js
│       │   ├── components
│       │   │   ├── index.js
│       │   │   ├── transition-group.js
│       │   │   └── transition.js
│       │   ├── directives
│       │   │   ├── index.js
│       │   │   ├── model.js
│       │   │   └── show.js
│       │   ├── modules
│       │   │   ├── attrs.js
│       │   │   ├── class.js
│       │   │   ├── dom-props.js
│       │   │   ├── events.js
│       │   │   ├── index.js
│       │   │   ├── style.js
│       │   │   └── transition.js
│       │   ├── node-ops.js
│       │   ├── patch.js
│       │   └── transition-util.js
│       ├── server
│       │   ├── directives
│       │   │   ├── index.js
│       │   │   └── show.js
│       │   └── modules
│       │       ├── attrs.js
│       │       ├── class.js
│       │       ├── dom-props.js
│       │       ├── index.js
│       │       └── style.js
│       └── util
│           ├── attrs.js
│           ├── class.js
│           ├── compat.js
│           ├── element.js
│           └── index.js
├── server
│   ├── create-bundle-renderer.js
│   ├── create-renderer.js
│   ├── render.js
│   ├── render-stream.js
│   ├── run-in-vm.js
│   └── write.js
├── sfc
│   └── parser.js
└── shared
    └── util.js
</pre>

## vm实例

### $parent
若$parent为undefined,则其为根实例。

### $options
属性     | 处理文件 | 处理函数 | 说明
----     |------   |----     |----
props    | b       | c       |----
propsData| e       | f       |----
\_propKeys| h       | i       |----

## core
### index.js
从instance/index.js导入Vue类，根据配置文件（process.env.VUE_ENV）设置vue原型上$isServer的get方法，设置Vue静态变量version，导出Vue类。

### config.js
各项设置开关

### instance
#### index.js
定义Vue类，将instance文件夹中定义的各Mixin函数注入Vue类，并导出，该类将在实例初始化执行原型上的_init方法(init.js定义)。
##### initMixin
定义原型上_init方法，进行必要的初始化，并执行instance文件夹中个文件定义的初始化函数，将Vue实例（组件）this注入。
###### initLifecycle
初始化组件的生命周期变量，包括$parent，$root，$children，$refs，内部变量_watcher，\_inactive，\_isMounted，\_isDestroyed，\_isBeingDestroyed
###### initEvents
通过updateListeners监听vm.$options.\_parentListeners，其中原型上的$on，$off（eventsMixin中定义）作为updateListeners的add和remove参数
###### callHook -beforeCreate
通过callHook（lifecycle.js定义）执行beforeCreate钩子，即执行$options['beforeCreate']数组中的每个handler，并发射'hook:beforeCreate'事件。
###### initState
state.js定义，从[observer文件夹](#observer)中引入set,del,observe,defineReactive,observerState,重置_watchers属性为空数组，并执行以下函数
- initProps
- initData
- initComputed
- initMethods
- initWatch


###### callHook
###### initRender

### observer<a name="observer" />
#### index.js
##### observe<a name="observe" />
尝试为一个值建立一个observer实例或是或者直接返回一个已经存在的observer。
传入值value若不是[object](#isObject)则直接返回，若value存在```__ob__```属性并且```__ob__```为Observer实例，则返回```__ob__```。
否则判断value是否合法，合法则返回new Observer(value)。
判断value是否合法：
- observerState.shouldConvert为true
- ```config._isServer```为false
- value为数组或[plainObject](#isPlainObject)
- Object.isExtensible(value)为true
- value不是vue实例（通过```value._isVue```判断）
##### defineReactive
传入参数：
```
obj: Object,
key: string,
val: any,
customSetter?: Function
```
内部新建Dep对象dep
内部通过[observe](#observe)得到observer对象childOb
通过Object.getOwnPropertyDescriptor得到参数对象obj上该属性的描述，如果configurable为false则直接return
重定义对象obj上的属性的get,set方法
###### get
1. 执行原始的get方法
2. 如果存在Dep.target， 则执行[dep.depend()](#depend)。
3. 如果childOb存在，则执行childOb.dep.depend()

#### scheduler.js
```
const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0
```
该模块定义静态Watcher实例数组queue ，waiting作为flag，控制是否将flushSchedulerQueue加入异步调度，flushing则判断是否queue正在执行，has记录已加入队列但尚未执行的watcher，circular记录每个watcher 运行的次数
##### flushSchedulerQueue
置flushing为true，开始处理队列
1. 对queue中的watcher对象按照id从小到大排序，这样组件会从父到子更新，用户watcher先于render watcher，父组件watcher运行时将子组件销毁，则子组件watcher可被跳过。
2. 将queue中的watcher对象执行watcher.run()，注意每次循环会重取queue.length，从而执行新加入的对象
3. 若非生产环境，则使用circular[id]记录每个watcher 运行的次数，若执行次数过多，大于（config.\_maxUpdateCount），且在执行时不断加入队列（has判断）,则提示检查是否为死循环。
4. 执行resetSchedulerState
##### resetSchedulerState
清空queue，has,circular,置waiting及flushing为false
##### queueWatcher
通过flushing判断，如果flushSchedulerQueue正在处理queue，则将watcher实例插入queue的已排序位置，否则直接压入最后，因为flushSchedulerQueue自然会进行排序。
如果waiting为false，表示尚未将flushSchedulerQueue加入异步调度，则使用[nextTick](#nextTick)将其加入。

#### watcher.js
定义Watcher类，转化表达式，集合依赖，当表达式的值变化时，则执行回调
构造函数传入：
```
vm: Component,
expOrFn: string | Function,
cb: Function,
options?: Object = {}
```
以下剖析Watcher实例上的各属性的初始化：
##### this.getter
若expOrFn为函数，则将其直接赋为实例的getter，否则通过[parsePath](#parsePath)得到一个获取对象路径的函数赋与this.getter，如果表达式中包含.$或不是字符串，则getter的赋值将失败，此时将getter赋为空函数，并且若process.env.NODE_ENV不是production，则提示警告：
`Failed watching path: "${expOrFn}"
Watcher only accepts simple dot-delimited paths. or full control, use a function instead.`

##### this.value
```
this.value = this.lazy
      ? undefined
      : this.get()
```
##### 原型方法
###### addDep<a name="addDep" /a>
共有4个实例属性与此相关：
```
deps: Array<Dep>; // 旧依赖数组
newDeps: Array<Dep>; // 新依赖数组
depIds: Set; // 旧依赖Ids
newDepIds: Set; // 新依赖Ids
```
该方法传入1个Dep实例dep，如果newDepIds无此id，则实例压入newDeps，id压入newDepIds，若旧ids中无此id，则执行dep.addSub(this)，将Watcher实例加入dep的subs数组中
###### cleanupDeps
1. 遍历deps中每个dep 的id，若this.newDepIds不复存在id，则执行dep.removeSub(this)
2. 将newDeps及newDepIds分别赋与deps及depIds，然后置空newDeps及newDepIds
###### get
1. 通过pushTarget将watcher实例设为Dep.target
2. 调用this.getter，this绑定当前实例，并传入当前实例作为参数
3. 如果deep为true，执行traverse(value)
4. 通过popTarget，将压入targetStack中的旧Watcher实例取出，并恢复为Dep.target
5. 执行this.cleanupDeps()
6. 返回2中得到的value
###### run
this.active为true方可执行该方法。
1. 通过this.get()取得value
2. ```value !== this.value ||isObject(value) || this.deep```为true则继续执行
3. 执行回调```this.cb.call(this.vm, value, oldValue)```
###### update
在dep实例的notify方法中会调用subs数组中对象的update方法
```
if (this.lazy) {
  this.dirty = true
} else if (this.sync) {
  this.run()
} else {
  queueWatcher(this)
}
```

##### Helper
###### traverse
传入val，读取val.__ob__.dep.id，并保存于模块定义 的seenObjects中（Set，非重复），递归读取val的每个属性或数组元素，执行同样操作
#### dep.js
定义Dep类，初始化时this.id为模块保存的uid+1
，this.subs为Watcher实例的数组，初始化时置为空数组。
#### addSub
```
addSub (sub: Watcher) {
  this.subs.push(sub)
}
```
#### removeSub
```
removeSub (sub: Watcher) {
  remove(this.subs, sub)
}
```
[remove](#remove)

#### notify
将this.subs中每个Watcher实例执行update方法

#### depend<a name="depend" /a>
如果Dep.target存在，调用target的addDep方法，并将Dep实例this传入

Dep类的静态属性target为Watcher实例，开始置为null。
此外该模块还设置const targetStack = []

#### pushTarget
传入Watcher实例_target
```
if (Dep.target) targetStack.push(Dep.target)
Dep.target = _target
```
#### pushTarget
```
  Dep.target = targetStack.pop()
```

### util工具类
#### debug.js
##### formatComponentName
获取vm实例的名字，如果$root属性等于自身，则返回'root instance'，否则按以下顺序取名字：`$options.name`，`$options._componentTag，name`，'anonymous component'
##### formatLocation
如果名字为'anonymous component'，则提示` - use the "name" option for better debugging messages.`
##### warn
如果console存在并且没有设置silent模式，则打印传入的警告信息及vm实例的位置
#### shared/util.js
##### bind
仅用于返回一个新函数并绑定传入的this，通过判断参数数量，从而比原生的快

##### isObject<a name="isObject" /a>
```
export function isObject (obj: mixed): boolean {
  return obj !== null && typeof obj === 'object'
}
```
##### isPlainObject<a name="isPlainObject" /a>
```
const toString = Object.prototype.toString
const OBJECT_STRING = '[object Object]'
export function isPlainObject (obj: any): boolean {
  return toString.call(obj) === OBJECT_STRING
}
```
##### remove<a name="remove" /a>
```
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```

#### lang.js
##### parsePath<a name="parsePath" /a>
传入路径path，若其中包含*.$则直接返回，否则返回一个函数，传入obj，返回obj根据path路径得到的值
```
const bailRE = /[^\w\.\$]/
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    return
  } else {
    const segments = path.split('.')
    return function (obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return
        obj = obj[segments[i]]
      }
      return obj
    }
  }
}
```
#### env.js
##### nextTick<a name="nextTick" /a>
1. 定义nextTickHandler，执行内部callbacks中的所有任务。
2. 定义timerFunc，若Promise存在使用Promise.resolve().then(nextTickHandler).
3. 否则使用MutationObserver
4. 否则使用setTimeout
使用pending作为flag，若true，则直接把任务加入callbacks即可，因为正在执行，否则触发timerFunc

### vdom
#### updateListeners
共传入4个参数。
on：新的监听键值对
oldOn：旧的监听键值对
add：添加事件监听的方法
remove： 移除事件监听的方法
on及oldOn的一般形式：{
    'event_name': {
      fn: handler
      invoker: (...args) => { handler.apply(null,args)}
    }
  } 或 {
      'event_name': [...handlers]
    }
