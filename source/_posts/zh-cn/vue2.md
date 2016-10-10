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
```
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
```
- [initMixin](#initMixin)
定义原型上_init方法，进行必要的初始化，并执行instance文件夹中个文件定义的初始化函数，将Vue实例（组件）this注入。

#### init.js
##### initMixin<a name="initMixin" />
```
initLifecycle(vm)
initEvents(vm)
callHook(vm, 'beforeCreate')
initState(vm)
callHook(vm, 'created')
initRender(vm)
```
- initLifecycle
初始化组件的生命周期变量，包括$parent，$root，$children，$refs，内部变量_watcher，\_inactive，\_isMounted，\_isDestroyed，\_isBeingDestroyed
- initEvents
通过updateListeners监听vm.$options.\_parentListeners，其中原型上的$on，$off（eventsMixin中定义）作为updateListeners的add和remove参数
- callHook -beforeCreate
通过callHook（lifecycle.js定义）执行beforeCreate钩子，即执行$options['beforeCreate']数组中的每个handler，并发射'hook:beforeCreate'事件。
- [initState](#initState)

#### state.js
##### initState<a name="initState" />
state.js定义，从[observer文件夹](#observer)中引入set,del,observe,defineReactive,observerState,重置_watchers属性为空数组，并执行Props,Data,Computed,Methods,Watch的初始化函数
[initProps](#initProps)
[initData](#initData)
[initComputed](#initComputed)
[initMethods](#initMethods)
[initWatch](#initWatch)
```
export function initState (vm: Component) {
  vm._watchers = []
  initProps(vm)
  initData(vm)
  initComputed(vm)
  initMethods(vm)
  initWatch(vm)
}
```
##### initProps<a name="initProps" />
处理$options上传入的prop相关，使其加载到vm实例上。
1. 在$options上取props、propsData。```observerState.shouldConvert = isRoot```如果不是根组件，该prop的值上就不建立观测者
2. ```const keys = vm.$options._propKeys = Object.keys(props)```
3. 遍历keys，生产环境：``` defineReactive(vm, key, validateProp(key, props, propsData, vm))```，该属性添加观测者，其本身及后代都会转化为getter，setter
4. 若非生产环境，且```vm.$parent && !observerState.isSettingProps```(isSettingProps默认为false), 则通过传入defineReactive 的customSetter提示警告：不要改变prop的值，因为该组件有父组件, 父组件重新渲染会重写prop，所以应该是用该prop上的data和计算属性。
5. ```observerState.shouldConvert = true```
##### initData<a name="initData" />
1. 取$options.data为data，若为function，则绑定vm为this，执行后置为data，并绑定在vm.\_data。
2. data不是PlainObject，提示'data functions should return an object.'
3. ```const keys = Object.keys(data);const props = vm.$options.props```,遍历keys，若props上已存在该key，则提示使用prop default value而不是data
4. 若props上无该key，则使用proxy，定义vm[key]的get，set，在vm.\_data上存取该属性。
5. ```observe(data)```为data设立观测者，data的属性及其后代则都会被转化getter，setter
6. ```data.__ob__ && data.__ob__.vmCount++```使观测者vmCount+1

##### initComputed<a name="initComputed" />
在模块内预定义：
```
const computedSharedDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
```
1. 取$options.computed为computed
2. computed存在，则遍历computed属性
3. 若属性值的类型为function，调用makeComputedGetter传入该属性值，加工后作为get，set为noop（空函数）
4. 若属性值的类型不是function：该值不存在get属性，则get和set都设为noop
5. 若属性值的类型不是function：该值存在get：属性值上未声明cache为false，调用makeComputedGetter传入属性值的get返回getter，否则直接将vm注入get方法中，并返回新的函数作为get。若存在set属性，同样注入vm后作为新set，否则置为noop。
6. 将修改后的computedSharedDefinition作为新的属性值绑定在vm上。

##### makeComputedGetter<a name="makeComputedGetter" />
传入参数：```getter: Function, owner: Component```
该函数加工getter，返回一个新的函数作为getter
1. 在该属性上建立watcher钩子```const watcher = new Watcher(owner, getter, noop, {lazy: true})```
2. 新getter函数内：watcher.dirty为true，则执行```watcher.evaluate()```,该watcher因为定义时传入lazy:true,所以dirty默认为true,在执行evaluate后会置为false。
3. 新getter函数内：若Dep.target存在，即是某个watcher在初始化或运行时需要读取该computed值，则调用watcher.depend()，使第1步建立的闭包watcher收集的所有deps对象（evaluate时通过遍历后代触发getter收集的）都监听该watcher（Dep.target也会收集到该闭包watcher的deps）。从而deps中的对象notify时（原getter指向的vm中data或props某个属性变化时），会同时执行该watcher及闭包watcher。
4. 返回watcher.value，watcher.value在evaluate时，被赋予原始getter的执行结果。

##### initMethods<a name="initMethods" />
1. ```const methods = vm.$options.methods```
2. methods存在，则遍历它的属性值，不为null，则直接注入vm为this，把返回的新的函数，使用原key绑定在vm上
```
function initMethods (vm: Component) {
  const methods = vm.$options.methods
  if (methods) {
    for (const key in methods) {
      if (methods[key] != null) {
        vm[key] = bind(methods[key], vm)
      } else if (process.env.NODE_ENV !== 'production') {
        warn(`Method "${key}" is undefined in options.`, vm)
      }
    }
  }
}
```
##### initWatch<a name="initWatch" />
1. ```const watch = vm.$options.watch```
2. 遍历watch的每个属性，若为数组，则展开，分别传入[createWatcher](#createWatcher)函数
```
function createWatcher (vm: Component, key: string, handler: any) {
  let options
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  vm.$watch(key, handler, options)
}
```
##### Vue.prototype.$watch
使用传入的expOrFn和cb建立一个闭包watcher对象，若options.immediate为true，则立即执行回调
```
Vue.prototype.$watch = function (
  expOrFn: string | Function,
  cb: Function,
  options?: Object
): Function {
  const vm: Component = this
  options = options || {}
  options.user = true
  const watcher = new Watcher(vm, expOrFn, cb, options)
  if (options.immediate) {
    cb.call(vm, watcher.value)
  }
  return function unwatchFn () {
    watcher.teardown()
  }
}
```
### observer<a name="observer" />
#### array.js
预先准备arrayMethods对象，根据Array原型重定义push、unshift、splice方法，当这些方法造成元素增减时，通过第1步定义的__ob__属性取得observer对象并调用observeArray方法，该原型方法将对数组中每个元素执行[observe](#observe)函数，若元素上没有观测者对象，则会递归建立（防止新增元素没有对应的observer对象），然后执行ob.dep.notify()，触发dep的subs中每个watcher对象的update方法。
#### index.js
##### Observer类
在传入value上面建立观测者对象
###### 实例属性
保存其附加到的value，内部保存一个dep对象，这样调用dep.notify()，则可触发dep对象subs数组中所有watcher对象的update方法，从而完成回调。
```
this.value = value
this.dep = new Dep()
this.vmCount = 0
```
###### 初始化
1. 将observer对象作为value的__ob__属性。
2. 若value为数组：取得在array.js中导出的arrayMethods对象，在模块内而后通过[hasProto](#hasProto)方法检查value的__proto__属性是否存在，若存在，则将arrayMethods对象直接赋为value的__proto__，否则，将arrayMethods的属性复制到value上，从而实现数组增减的监听。然后调用observeArray方法，对数组中每个元素执行[observe](#observe)函数，若元素上没有观测者对象，则会递归建立。
3. 若value不是数组，则执行walk方法，对value上的每个属性都执行defineReactive函数，
4. 这样将由defineReactive为入口形成递归，无论初始的value为数组还是对象，只要其属性或子元素是object，都会执行defineReactive，从而添加监听的getter，setter

##### observe<a name="observe" />
尝试为一个值建立一个observer实例或是或者直接返回一个已经存在的observer。注意该函数将会在传入值上通过new Observer递归建立观测者，在其属性及属性后代上使用getter，setter监听。
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
内部新建dep对象
内部通过[observe](#observe)得到val的observer对象childOb
通过Object.getOwnPropertyDescriptor得到参数对象obj上该属性的描述，如果configurable为false则直接return
重定义对象obj上的属性的get,set方法
###### get
1. 若存在原始的get方法，则执行get方法得到value，否则直接把原始的val赋为value。
2. 如果存在Dep.target， 则执行[dep.depend()](#depend)。如果同时childOb存在，则执行childOb.dep.depend()，主要作用是将Dep.target加入dep对象的subs数组中。若同时value为数组，则触发其每个元素observer对象的depend方法。在每个watcher对象初始化时会将自己置为Dep.target，然后通过get调用这步，从而使得闭包dep的subs中包含该watcher对象。
3. 返回value。

###### set
1. 若存在原始的get方法，则执行get方法得到value，否则直接把原始的val赋为value，比较value和newVal，相同则直接返回。
2. 若非生产环境， customSetter存在则执行customSetter
3. 原始setter存在则执行原始setter
4. 对新值newVal建立观测者对象```childOb = observe(newVal)```
5. 执行闭包中dep的notify方法，触发其中的watcher update，从而执行回调。这样就实现了，该属性值变化时，执行预先加入dep中的watcher

#### scheduler.js
```
const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0
```
该模块定义静态watcher对象数组queue ，waiting作为flag，控制是否将flushSchedulerQueue加入异步调度，flushing则判断是否queue正在执行，has记录已加入队列但尚未执行的watcher，circular记录每个watcher 运行的次数
##### flushSchedulerQueue
置flushing为true，开始处理队列
1. 对queue中的watcher对象按照id从小到大排序，这样组件会从父到子更新，用户watcher先于render watcher，父组件watcher运行时将子组件销毁，则子组件watcher可被跳过。
2. 将queue中的watcher对象执行watcher.run()，注意每次循环会重取queue.length，从而执行新加入的对象
3. 若非生产环境，则使用circular[id]记录每个watcher 运行的次数，若执行次数过多，大于（config.\_maxUpdateCount），且在执行时不断加入队列（has判断）,则提示检查是否为死循环。
4. 执行resetSchedulerState
##### resetSchedulerState
清空queue，has,circular,置waiting及flushing为false
##### queueWatcher
通过flushing判断，如果flushSchedulerQueue正在处理queue，则将watcher对象插入queue的已排序位置，否则直接压入最后，因为flushSchedulerQueue自然会进行排序。
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
expOrFn为指向被监视对象的路径或是函数，但都是表示找到被监视对象的方法。被监视对象必须为已转化getter，setter的对象（props或data），这样执行get方法时，才能将当前watcher加入到其闭包dep的监听数组中，从而实现调用setter时执行cb。
##### 初始化
以下剖析watcher对象上的各属性的初始化：
- this.getter<a name="watchergetter" />
若expOrFn为函数，则将其直接赋为实例的getter，否则通过[parsePath](#parsePath)得到一个获取对象路径的函数赋与this.getter，如果表达式中包含.$或不是字符串，则getter的赋值将失败，此时将getter赋为空函数，并且若process.env.NODE_ENV不是production，则提示警告：
`Failed watching path: "${expOrFn}"
Watcher only accepts simple dot-delimited paths. or full control, use a function instead.`
该方法执行时会触发[defineReactive](#defineReactive)定义的参数obj属性路径path下的get方法，这样该属性绑定的闭包dep、属性val的__ob__.dep、若是数组则包含数组元素的dep,都将执行depend方法，监听本watcher，本watcher也将收集这些dep对象存于deps。
这样，当按照expOrFnobj得到的属性val变动时，将触发闭包dep的notify方法，从而执行本watcher对象的update。

- this.value
```
this.value = this.lazy
      ? undefined
      : this.get()
```
lazy为false或未定义，则会执行this.get()，这个方法将触发[this.getter](#watchergetter)，达到监听属性变化的目的。
##### 原型方法
###### update
在dep实例的notify方法中会触发subs数组中watcher对象的update方法
```
if (this.lazy) {
  this.dirty = true
} else if (this.sync) {
  this.run()
} else {
  queueWatcher(this)
}
```
[queueWatcher](#queueWatcher)会将watcher对象加入异步队列，延迟调用run方法。
###### run
this.active为true方可执行该方法。
1. 通过this.get()取得value
2. ```value !== this.value ||isObject(value) || this.deep```为true则继续执行
3. 执行回调```this.cb.call(this.vm, value, oldValue)```

###### get
1. 通过pushTarget将watcher对象设为Dep.target
2. 调用[this.getter](#watchergetter)，this绑定当前实例，并传入当前实例作为参数
3. 如果deep为true，执行traverse(value)
4. 通过popTarget，将压入targetStack中的旧watcher对象取出，并恢复为Dep.target
5. 执行this.cleanupDeps()
6. 返回2中得到的value

###### addDep<a name="addDep" />
当本watcher对象变为Dep.target时，将由dep对象的depend方法触发。
共有4个实例属性与此相关：
```
deps: Array<Dep>; // 旧依赖数组
newDeps: Array<Dep>; // 新依赖数组
depIds: Set; // 旧依赖Ids
newDepIds: Set; // 新依赖Ids
```
该方法传入1个Dep实例dep，如果newDepIds无此id，则实例压入newDeps，id压入newDepIds，若旧ids中无此id，则执行dep.addSub(this)，将watcher对象加入dep的subs数组中

###### cleanupDeps
1. 遍历deps中每个dep 的id，若this.newDepIds不复存在id，则执行dep.removeSub(this),这样dep再notify时将不会执行本watcher的callback。
2. 将newDeps及newDepIds分别赋与deps及depIds，然后置空newDeps及newDepIds。
3. 这样由update/run/get触发的traverse方法收集到的dep对象全部转入deps，并清除了旧deps内的dep对象对本watcher的引用（移出subs数组）

###### depend
```
depend () {
  let i = this.deps.length
  while (i--) {
    this.deps[i].depend()
  }
}
```

##### Helper
###### traverse
传入val，读取val.__ob__.dep.id，并保存于模块定义 的seenObjects中（Set，非重复），递归读取val的每个属性或数组元素，执行同样操作。由于存在__ob__,在读取val属性的时候会执行defineReactive定义的get方法，进而执行：defineReactive函数闭包中的dep对象、val.__ob__.dep，若val为数组，则还有数组元素__ob__的dep，以上dep对象的depend方法，确保Dep.target(watcher对象)在subs数组中，dep对象出现在watcher对象的newDeps数组中。
这样，当任何这些属性变化时，将触发对应闭包的dep对象的notify方法，执行当前watcher的update。
#### dep.js
定义Dep类，初始化时this.id为模块保存的uid+1
，this.subs为watcher对象的数组，初始化时置为空数组。
##### Dep.target<a name="Deptarget" />
Dep.target的类型为Watcher，默认为null，只有dep.js中pushTarget可以设置该值，pushTarget函数仅被watcher对象的get方法调用。而get方法设置Dep.target的目的是为了deep为true时，可以在属性及属性的后代上递归建立observer并通过get，set监听后代变化，后代变化时即可调用该watcher。
- Dep.target为某个watcher对象时仅限以下场景：
1.  某个非lazy的watcher初始化时
2.  watcher对象执行run方法（准备执行回调钩子时）
3.  lazy watcher执行evaluate时。
- 用到Dep.target的场景：
1. dep.depend -> Dep.target.addDep,而调用dep.depend()即为以上Dep.target存在值的场景
2. 以上场景中读取了computed属性，则Dep.target会被加入到computed属性getter闭包中watcher对象所收集的Dep对象的监听数组（subs）中。也就是说，某个watcher执行时需要读取某个computed属性，那么这个watcher会在computed属性改变时一同执行。

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
将this.subs中每个watcher对象执行update方法

#### depend<a name="depend" />
如果Dep.target(watcher对象)存在，调用target的[addDep](#addDep)方法，并将Dep实例this传入,该方法将会确保dep对象出现在watcher对象的newDeps数组中，dep id在newDepIds中，且watcher对象在subs数组中。

#### 静态属性方法
Dep类的静态属性target为watcher对象，开始置为null。
此外该模块还设置const targetStack = []

##### pushTarget
传入watcher对象_target
```
if (Dep.target) targetStack.push(Dep.target)
Dep.target = _target
```
##### pushTarget
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

##### isObject<a name="isObject" />
```
export function isObject (obj: mixed): boolean {
  return obj !== null && typeof obj === 'object'
}
```
##### isPlainObject<a name="isPlainObject" />
```
const toString = Object.prototype.toString
const OBJECT_STRING = '[object Object]'
export function isPlainObject (obj: any): boolean {
  return toString.call(obj) === OBJECT_STRING
}
```
##### remove<a name="remove" />
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
##### hasOwn
```
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}
```
##### hyphenate
将驼峰转化为连字符,最多接受两个驼峰
```
const hyphenateRE = /([^-])([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
})
```
##### cached
闭包缓存
```
export function cached (fn: Function): Function {
  const cache = Object.create(null)
  return function cachedFn (str: string): any {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}
```
#### lang.js
##### parsePath<a name="parsePath" />
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
##### def<a name="def" />
```
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```
#### env.js
##### nextTick<a name="nextTick" />
1. 定义nextTickHandler，执行内部callbacks中的所有任务。
2. 定义timerFunc，若Promise存在使用Promise.resolve().then(nextTickHandler).
3. 否则使用MutationObserver
4. 否则使用setTimeout
使用pending作为flag，若true，则直接把任务加入callbacks即可，因为正在执行，否则触发timerFunc

##### hasProto<a name="hasProto" />
```
// can we use __proto__?
export const hasProto = '__proto__' in {}
```
#### props.js
##### validateProp<a name="validateProp" />
参数：
```
key: string,
propOptions: Object,
propsData: Object,
vm?: Component
```
propOptions: $options.props 一般形式：
```
{
    key1 : {
          type: Number,
          default: 100
        }
  }
```
注意type为构造函数而非字符串
1. ```const prop = propOptions[key];const absent = !hasOwn(propsData, key);let value = propsData[key]```
2. 检查getType(prop.type)，若为Boolean：若propsData无此key，且prop无该key的默认值(default属性)，则```value = false```;若value为''或value为key的连字符形式，则```value = true```
3. value仍为undefined，```value = getPropDefaultValue(vm, prop, key)```因为默认值是函数，value为函数计算的结果，所以是一个新值，所以暂时置observerState.shouldConvert为true，然后```observe(value)```,为这个新值添加观测者。[observe](#observe)
4. 如果非生产环境，执行assertProp
5. 返回value。

##### getPropDefaultValue
参数：```vm: ?Component, prop: PropOptions, name: string```
1. prop没有default属性，直接返回undefined
2. def = prop.default为object，且在非生产环境下，警告不要使用Object/Array，而要使用一个工厂函数返回默认值。
3. 若prop.default为function，判断prop.type，为Function直接返回默认值，不是则返回```def.call(vm)```

##### getType
```
function getType (fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match && match[1]
}
```
##### assertProp

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
