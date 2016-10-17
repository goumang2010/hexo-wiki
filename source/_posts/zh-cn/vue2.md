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

### global-api
#### extend.js
##### initExtend<a name="initExtend">
```
Vue.cid = 0
let cid = 1
```
每个实例构造函数，包括Vue类本身，都有一个独一无二的cid。这使得我们可以通过原型继承来包装子级构造函数并缓存它们。

- Vue.extend
返回一个继承Vue类的构造函数。
参数：```extendOptions: Object```
1. 将this（this为基类本身，因为该方法是基类的属性，this不一定为Vue，因为Vue的子类因为`Sub.extend = Super.extend`也同样有该静态方法）置为Super，若Super.cid === 0，则说明现在构造的这个类是第一个继承Vue的，故置isFirstExtend为true。
2. 若该类是第一个继承Vue的，并且extendOptions.\_Ctor存在，则直接返回extendOptions.\_Ctor。
3. `let name = extendOptions.name || Super.options.name`
4. 非生产环境，使用正则判断，name应以字母开头，其后是单词或'-'，否则提示'Invalid component name'
5. 创建继承类Sub，其构造函数内部与Vue一致，执行`this._init(options)`
6. 设置原型`Sub.prototype = Object.create(Super.prototype);Sub.prototype.constructor = Sub`
7. `Sub.cid = cid++`cid是initExtend闭包中的变量，从1开始，这样，类的静态属性cid就表示其创建顺序，Vue本身的cid为0
8. 调用[mergeOptions](#mergeOptions)融合extendOptions和Super.options，置为Sub.options
9. `Sub.extend = Super.extend`, 子类同样设置该静态方法。
10. 在子类注册asset类型。<pre> config.\_assetTypes.forEach(function (type) {
      Sub[type] = Super[type]
    })</pre> 其实目前type只有component，directive，filter
11. 若name存在，挂载自身从而可以循环查找。`Sub.options.components[name] = Sub`
12. `Sub.superOptions = Super.options` 挂载superOptions，这样在实例化时可以检查父级option是否已经更新了
13. `Sub.extendOptions = extendOptions`
14. isFirstExtend为true（根据第1步，能进行到这部，说明extendOptions上无_Ctor属性），`extendOptions._Ctor = Sub`
15. 返回Sub

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
##### initMixin<a name="initMixin">
```
initLifecycle(vm)
initEvents(vm)
callHook(vm, 'beforeCreate')
initState(vm)
callHook(vm, 'created')
initRender(vm)
```
- [initLifecycle](#initLifecycle)
- [initEvents](#initEvents)
- [callHook](#callHook) -beforeCreate
通过callHook（lifecycle.js定义）执行beforeCreate钩子，即执行$options['beforeCreate']数组中的每个handler，并发射'hook:beforeCreate'事件。
- [initState](#initState)
- [callHook](#callHook) -created
通过callHook执行created钩子。
- [initRender](#initRender)

#### events.js
##### initEvents
1. vm.\_events置为无原型空对象
2. 定义<a name= "\_updateListeners" >vm.\_updateListeners</a>，通过updateListeners监听vm.$options.\_parentListeners，其中原型上的$on，$off（eventsMixin中定义）作为updateListeners的add和remove参数
```
// init parent attached events
const listeners = vm.$options._parentListeners
const on = bind(vm.$on, vm)
const off = bind(vm.$off, vm)
vm._updateListeners = (listeners, oldListeners) => {
  updateListeners(listeners, oldListeners || {}, on, off)
}
if (listeners) {
  vm._updateListeners(listeners)
}
```

#### lifecycle.js
##### initLifecycle<a name="initLifecycle">
1. 从$options.parent开始，递归其上$options.abstract为true的$parent属性,找到第一个非abstract的parent
2. ```parent.$children.push(vm)```
3. 初始化组件的生命周期变量，包括$parent，$root，$children，$refs，内部变量_watcher，\_inactive，\_isMounted，\_isDestroyed，\_isBeingDestroyed

##### lifecycleMixin<a name="lifecycleMixin">
定义Vue原型上的_mount，\_update，\_updateFromParent，$forceUpdate，$destroy方法

- Vue.prototype.\_mount
  参数：
  ```
  el?: Element | void,
  hydrating?: boolean
  ```
  返回：Component
  1. ```const vm: Component = this
      vm.$el = el```
  2. 若$options.render不存在，将$options.render置为[emptyVNode](#emptyVNode)（空节点），若非生产环境，且$options.template存在，则提示应使用render函数或预先编译template，$options.template不存在则提示装载组件错误
  3. 使用[callHook](#callHook)执行beforeMount钩子。
  4. ```vm._watcher = new Watcher(vm, () => {
      vm._update(vm._render(), hydrating)
    }, noop)``` ，vm.\_update(vm.\_render(), hydrating)会在该方法经过的观测者的dep捕获。因为在这个过程中会执行vm.\_render()，该方法会调用组件定义的render函数，render函数中包含对data或props的读取（如{{data.XX}}将会转化成render的createElement参数的某个属性值），这样因为其读取的所用到的data和props已转化getter，setter，故该watcher会被这些相关数据的dep捕获。但这些数据发生变化时，setter就会促发本watcher的get方法（vm.\_update(vm.\_render(), hydrating)，从而重新渲染）和回调noop(无用)。注意在此过程中，[createElement](#createElement)会按照render函数的指示生成并返回vnode对象，经过vm.\_update渲染到$el上。
  5. ```hydrating = false```
  6. vm为根节点，使用[callHook](#callHook)执行mounted钩子。
  7. 返回vm

- Vue.prototype.\_update
  1. 使用[callHook](#callHook)执行beforeUpdate钩子。
  2. `const prevEl = vm.$el`注意$el为在[initRender](#initRender)传入Vue.prototype.\_mount中的vm.$options.el
  3. `const prevActiveInstance = activeInstance;activeInstance = vm;` activeInstance为lifecycle.js所定义的模块变量。
  4. `const prevVnode = vm._vnode;vm._vnode = vnode;`
  5. prevVnode不存在，重新构建`vm.$el = vm.__patch__(vm.$el, vnode, hydrating)`,否则在上个vnode基础上打补丁`vm.$el = vm.__patch__(prevVnode, vnode)`,`__patch__`方法在`src\entries\web-runtime.js`加载，非服务端会调用[patch](#patch)方法，该步骤使用虚拟DOM算法来更新真实DOM或重新生成真实DOM。
  6. 恢复activeInstance`activeInstance = prevActiveInstance`
  7. 更新`__vue__`引用：prevEl存在，`prevEl.__vue__ = null`;`vm.$el`存在，·`vm.$el.__vue__ = vm`,将vm实例引用赋予__vue__属性。
  8. 父亲若为HOC，则也更新父亲的$el。HOC:Higher order components .一个向已存在的组件添加功能的函数。<pre>if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent.\_vnode) {
      vm.$parent.$el = vm.$el
    }</pre>
  9. \_isMounted若已为true(根节点在此之前即为true，子节点会在渲染的过程中变为true)，使用[callHook](#callHook)执行updated钩子。

- Vue.prototype.\_updateFromParent<a name="\_updateFromParent">
  根据新的vnode传入的参数更新组件实例,在vnode的_update过程中，通过默认的[prepatch](#hooks.prepatch)钩子调用。
  参数：
  ```
  propsData: ?Object, // vnode.componentOptions.propsData
  listeners: ?Object, // vnode.componentOptions.listeners
  parentVnode: VNode, // vnode
  renderChildren: ?VNodeChildren //vnode.componentOptions.children
  ```
  1. `const vm: Component = this;const hasChildren = !!(vm.$options._renderChildren || renderChildren)`
  2. 更新option的_parentVnode和_renderChildren：`vm.$options._parentVnode = parentVnode;vm.$options._renderChildren = renderChildren`
  3. 更新props：propsData并且vm.$options.props存在，`observerState.shouldConvert = false`，从而在vm[key]赋值时，如果这个key上本来没有贯彻者，则不会再建立观测者。非生产环境下，`observerState.isSettingProps = true`// TODO 遍历vm.$options.\_propKeys ，调用[validateProp](#validateProp)生成新值并挂载到vm上。`observerState.shouldConvert = true` 非生产环境下，`observerState.isSettingProps = false`
  4. 新listeners存在，将新listeners赋予vm.$options.\_parentListeners，调用原型方法[_updateListeners](#_updateListeners)更新listeners
  5. hasChildren存在，调用[resolveSlots](#resolveSlots)，处理renderChildren，并挂载到vm.$slots。然后执行$forceUpdate，该操作会执行该组件的_update,从而和上层组件的_update形成递归，不断执行子组件实例的_update，注意子组件实例_update，render出的vnode是子组件的根vnode（tag名称是子组件模板最上层标签，如div），和上层组件vnode中的组件vnode（tag名称为vue-component...）已不是同一个组件,所以这并不是一个死循环，而是向后代组件的递归遍历。

- Vue.prototype.$forceUpdate
  强制更新
  ```
    Vue.prototype.$forceUpdate = function () {
    const vm: Component = this
    if (vm._watcher) {
      vm._watcher.update()
    }
  }
  ```

- Vue.prototype.$destroy

##### callHook<a name="callHook">
执行$options上挂载的钩子数组中的所有handler。
```
export function callHook (vm: Component, hook: string) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(vm)
    }
  }
  vm.$emit('hook:' + hook)
}
```

#### render.js
##### initRender<a name="initRender">
1.
  <pre>vm.$vnode = null // the placeholder node in parent tree
  vm.\_vnode = null // the root of the child tree
  vm.\_staticTrees = null
  vm.\_renderContext = vm.$options.\_parentVnode && vm.$options.\_parentVnode.context
  </pre>
2. 使用[resolveSlots](#resolveSlots)将$options.\_renderChildren按照slot分类并挂载到vm.$slots。
3. 将公共createElement方法注入vm实例，并挂载到vm.$createElement
4. $options.el存在，```vm.$mount(vm.$options.el)``` $mount为封装的Vue.prototype.\_mount原型方法，定义在[lifecycleMixin](#lifecycleMixin)中。

##### resolveSlots<a name="resolveSlots">
参数：
```
renderChildren: ?VNodeChildren,
context: ?Component
```
返回值：```{ [key: string]: Array<VNode> }```
将renderChildren标准化处理后，按照slot分类，并返回分类对象。
1. ```const slots = {}```，作为结果，在处理完成后返回slots。
2. ```const children = normalizeChildren(renderChildren) || []``` 调用[normalizeChildren](#normalizeChildren)将renderChildren转为vnode对象的数组，并存于children。
3. 遍历children中每一个vnode对象child
 - 若child的context属性和传入的context相同（context即是父组件预留的插槽名称），并且child的data属性、data属性的slot属性存在，则把slot属性值赋予name变量，搜索slots中对应name变量的属性值，若不存在，则置为空数组，该属性值引用设为slot，如果child的tag属性值为'template'，则将child的children压入slot，否则将child本身压入slot。
 - 若不满足上面的条件，则将child压入defaultSlot
4. 若defaultSlot中存在元素，且不是一个空白元素，```slots.default = defaultSlot```

##### renderMixin<a name="renderMixin">

- Vue.prototype.\_render

1. ```    const {
      render,
      staticRenderFns,
      _parentVnode
    } = vm.$options``` 解构$options取render，staticRenderFns，\_parentVnode
2.  vm.\_isMounted为true，将$slots（[initRender](#initRender)进行的初始化）中每一个属性进行通过[cloneVNodes](#cloneVNodes)克隆，并重新挂载到$slots上面。
3. ```if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = []
    }```
4. ```vm.$vnode = _parentVnode```
5. ```vnode = render.call(vm._renderProxy, vm.$createElement)```,将vm.\_renderProxy注入render函数作为this，$createElement（[initRender](#initRender)中定义）作为参数，执行render函数。\_renderProxy在[initMixin](#initMixin)中定义，若为生产环境，则其就是vm。
6. vnode不是VNode的实例，非生产环境下提示'Multiple root nodes returned from render function. Render function should return a single root node.'
7. ```vnode.parent = _parentVnode```
8. 返回vnode

#### state.js
##### initState<a name="initState">
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

##### initProps<a name="initProps">
处理$options上传入的prop相关，使其加载到vm实例上。
1. 在$options上取props、propsData。```observerState.shouldConvert = isRoot```如果不是根组件，该prop的值上就不建立观测者
2. ```const keys = vm.$options._propKeys = Object.keys(props)```
3. 遍历keys，生产环境：``` defineReactive(vm, key, validateProp(key, props, propsData, vm))```，该属性添加观测者，其本身及后代都会转化为getter，setter
4. 若非生产环境，且```vm.$parent && !observerState.isSettingProps```(isSettingProps默认为false), 则通过传入defineReactive 的customSetter提示警告：不要改变prop的值，因为该组件有父组件, 父组件重新渲染会重写prop，所以应该是用该prop上的data和计算属性。
5. ```observerState.shouldConvert = true```

##### initData<a name="initData">
1. 取$options.data为data，若为function，则绑定vm为this，执行后置为data，并绑定在vm.\_data。
2. data不是PlainObject，提示'data functions should return an object.'
3. ```const keys = Object.keys(data);const props = vm.$options.props```,遍历keys，若props上已存在该key，则提示使用prop default value而不是data
4. 若props上无该key，则使用proxy，定义vm[key]的get，set，在vm.\_data上存取该属性。
5. ```observe(data)```为data设立观测者，data的属性及其后代则都会被转化getter，setter
6. ```data.__ob__ && data.__ob__.vmCount++```使观测者vmCount+1

##### initComputed<a name="initComputed">
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

##### makeComputedGetter<a name="makeComputedGetter">
传入参数：```getter: Function, owner: Component```
该函数加工getter，返回一个新的函数作为getter
1. 在该属性上建立watcher钩子```const watcher = new Watcher(owner, getter, noop, {lazy: true})```
2. 新getter函数内：watcher.dirty为true，则执行```watcher.evaluate()```,该watcher因为定义时传入lazy:true,所以dirty默认为true,在执行evaluate后会置为false。
3. 新getter函数内：若Dep.target存在，即是某个watcher在初始化或运行时需要读取该computed值，则调用watcher.depend()，使第1步建立的闭包watcher收集的所有deps对象（evaluate时通过遍历后代触发getter收集的）都监听该watcher（Dep.target也会收集到该闭包watcher的deps）。从而deps中的对象notify时（原getter指向的vm中data或props某个属性变化时），会同时执行该watcher及闭包watcher。
4. 返回watcher.value，watcher.value在evaluate时，被赋予原始getter的执行结果。

##### initMethods<a name="initMethods">
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

##### initWatch<a name="initWatch">
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

### observer<a name="observer">
#### array.js
预先准备arrayMethods对象，根据Array原型重定义push、unshift、splice方法，当这些方法造成元素增减时，通过第1步定义的`__ob__`属性取得observer对象并调用observeArray方法，该原型方法将对数组中每个元素执行[observe](#observe)函数，若元素上没有观测者对象，则会递归建立（防止新增元素没有对应的observer对象），然后执行ob.dep.notify()，触发dep的subs中每个watcher对象的update方法。
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
1. 将observer对象作为value的`__ob__`属性。
2. 若value为数组：取得在array.js中导出的arrayMethods对象，在模块内而后通过[hasProto](#hasProto)方法检查value的__proto__属性是否存在，若存在，则将arrayMethods对象直接赋为value的__proto__，否则，将arrayMethods的属性复制到value上，从而实现数组增减的监听。然后调用observeArray方法，对数组中每个元素执行[observe](#observe)函数，若元素上没有观测者对象，则会递归建立。
3. 若value不是数组，则执行walk方法，对value上的每个属性都执行defineReactive函数，
4. 这样将由defineReactive为入口形成递归，无论初始的value为数组还是对象，只要其属性或子元素是object，都会执行defineReactive，从而添加监听的getter，setter

##### observe<a name="observe">
尝试为一个值建立一个observer实例或是或者直接返回一个已经存在的observer。注意该函数将会在传入值上通过new Observer递归建立观测者，在其属性及属性后代上使用getter，setter监听。
传入值value若不是[object](#isObject)则直接返回，若value存在`__ob__`属性并且`__ob__`为Observer实例，则返回`__ob__`。
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
expOrFn为指向被监视对象的路径或是函数，但都是表示找到被监视对象的方法。被监视对象必须为已转化getter，setter的对象（props或data），这样执行get方法时，才能将当前watcher加入到其闭包dep的监听数组中，从而实现调用setter时执行cb。注意无需把监视对象返回，只要expOrFn中读取了该对象，即会被该对象的闭包dep捕获（lazy为true时不会被在初始化阶段捕获）

##### 初始化
以下剖析watcher对象上的各属性的初始化：
- this.getter<a name="watchergetter">
若expOrFn为函数，则将其直接赋为实例的getter，否则通过[parsePath](#parsePath)得到一个获取对象路径的函数赋与this.getter，如果表达式中包含.$或不是字符串，则getter的赋值将失败，此时将getter赋为空函数，并且若process.env.NODE_ENV不是production，则提示警告：
`Failed watching path: "${expOrFn}"
Watcher only accepts simple dot-delimited paths. or full control, use a function instead.`
该方法执行时会触发[defineReactive](#defineReactive)定义的参数obj属性路径path下的get方法，这样该属性绑定的闭包dep、属性val的`__ob__.dep`、若是数组则包含数组元素的dep,都将执行depend方法，监听本watcher，本watcher也将收集这些dep对象存于deps。
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

###### addDep<a name="addDep">
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
传入val，读取`val.__ob__.dep.id`，并保存于模块定义 的seenObjects中（Set，非重复），递归读取val的每个属性或数组元素，执行同样操作。由于存在`__ob__`,在读取val属性的时候会执行defineReactive定义的get方法，进而执行：defineReactive函数闭包中的dep对象、val.__ob__.dep，若val为数组，则还有数组元素`__ob__`的dep，以上dep对象的depend方法，确保Dep.target(watcher对象)在subs数组中，dep对象出现在watcher对象的newDeps数组中。
这样，当任何这些属性变化时，将触发对应闭包的dep对象的notify方法，执行当前watcher的update。

#### dep.js
定义Dep类，初始化时this.id为模块保存的uid+1
，this.subs为watcher对象的数组，初始化时置为空数组。

##### Dep.target<a name="Deptarget">
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

#### depend<a name="depend">
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

##### isObject<a name="isObject">
```
export function isObject (obj: mixed): boolean {
  return obj !== null && typeof obj === 'object'
}
```

##### isPlainObject<a name="isPlainObject">
```
const toString = Object.prototype.toString
const OBJECT_STRING = '[object Object]'
export function isPlainObject (obj: any): boolean {
  return toString.call(obj) === OBJECT_STRING
}
```

##### isPrimitive<a name="isPrimitive">
```
export function isPrimitive (value: any): boolean {
  return typeof value === 'string' || typeof value === 'number'
}
```

##### remove<a name="remove">
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

##### camelize<a name="camelize">
将连字符变为驼峰形式
```
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})
```

##### capitalize<a name="capitalize">
将字符串的首字母大写
```
export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})
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
##### parsePath<a name="parsePath">
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

##### def<a name="def">
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
##### nextTick<a name="nextTick">
1. 定义nextTickHandler，执行内部callbacks中的所有任务。
2. 定义timerFunc，若Promise存在使用Promise.resolve().then(nextTickHandler).
3. 否则使用MutationObserver
4. 否则使用setTimeout
使用pending作为flag，若true，则直接把任务加入callbacks即可，因为正在执行，否则触发timerFunc

##### hasProto<a name="hasProto">
```
// can we use __proto__?
export const hasProto = '__proto__' in {}
```

#### options.js

##### mergeOptions<a name="mergeOptions">
参数：
```
parent: Object,
child: Object,
vm?: Component
```

##### resolveAsset<a name="resolveAsset">
处理assets，assets包括directives，components，transitions，filters
该函数仅仅是从传入的options中按照type和id取得asset并返回
参数：
```
options: Object,
type: string,
id: string,
warnMissing?: boolean
```
1. 判断```options[type][id]```是否存在，若不存在,将id使用[camelize](#camelize)变为驼峰形式，再次尝试
2. 若仍未找到，使用[capitalize](#capitalize)将驼峰形式id首字母大写，再次尝试寻找。
3. 找到返回。未找到且在非生产环境，提示：Failed to resolve ....


#### props.js
##### validateProp<a name="validateProp">
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
3. value仍为undefined，```value = getPropDefaultValue(vm, prop, key)```因为默认值是函数，value为函数计算的结果，所以是一个新值，所以暂时置observerState.shouldConvert为true，然后```observe(value)```,为这个新值添加观测者,它的属性都会转化getter，setter。[observe](#observe)
4. 如果非生产环境，执行assertProp // TODO
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
#### create-element.js
##### createElement
检查data，调用_createElement并返回结果，返回结果为vnode对象

##### \_createElement
参数：
```
context: Component,
tag?: string | Class<Component> | Function | Object,
data?: VNodeData,
children?: VNodeChildren | void
```
1. 传入的data上有`__ob__`属性，非生产环境下提示：Avoid using observed data object as vnode data Always create fresh vnode data objects in each render!，并直接返回。
2. tag不存在，返回空节点[emptyVNode](#emptyVNode)。
3. tag若为字符串:
  1. ```const ns = config.getTagNamespace(tag)```getTagNamespace仅仅识别MathML和svg元素，若是一般元素，则返回undefined
  2. tag若是保留标签（html或svg标签）```return new VNode(tag, data, normalizeChildren(children, ns),undefined, undefined, ns,context)```[ ](#normalizeChildren)
  3. 若tag不是保留标签，调用resolveAsset,尝试寻找$options.components[tag],即寻找该tag所代表的组件asset，赋予Ctor，然后调用[createComponent](#createComponent)返回```createComponent(Ctor, data, context, children, tag)```。
  4. 若tag既不是保留标签，也找不到对应的组件的asset，则有可能是未知命名空间的奇怪元素，同第2步，直接构造VNode返回，在运行时再尝试解析

4. tag不为字符串，直接构造组件，调用```createComponent(tag, data, context, children)```并返回。

#### create-component.js
##### createComponent
参数：
```
Ctor: Class<Component> | Function | Object | void,
data?: VNodeData,
context: Component,
children?: VNodeChildren,
tag?: string
```

1. 不存在Ctor，直接返回。
2. Ctor为对象，调用Vue.extend（在[initExtend](#initExtend)中定义），以Ctor为extendOption创建Vue的子类，并覆盖Ctor
3. 经过以上两步，Ctor的类型只可能是function，即组件类或异步组件的工厂函数，若类型不是function，在非生产环境下提示'Invalid Component definition'
4. 如果Ctor.cid不存在，说明其为异步组件，若其resolved属性存在，`Ctor = Ctor.resolved`,否则，调用[resolveAsyncComponent](#resolveAsyncComponent)
5. 调用[extractProps](#extractProps)提取props，存于propsData，为构建vnode准备。
6. 如果该子组件为函数式组件（Ctor.options.functional为true），调用[createFunctionalComponent](#createFunctionalComponent)并返回。参照：https://github.com/vuejs/vue/releases/tag/v2.0.0-alpha.5
7. `const listeners = data.on;data.on = data.nativeOn` // TODO
8. Ctor.options.abstract为true，则组件为抽象组件，除了props & listeners外都不保，所以`data = {}`
9. `mergeHooks(data)` 调用[mergeHooks](#mergeHooks),补充可能缺少的钩子
10. 构造vnode：
  - tag：`vue-component-${Ctor.cid}${name ? `-${name}` : ''}`
  - data: data
  - children: undefined
  - text: undefined
  - elm： undefined
  - ns： undefined
  - context： context
  - componentOptions：{ Ctor, propsData, listeners, tag, children }
11. 返回构造的vnode

##### mergeHooks
参数： `data: VNodeData`

1. data.hook不存在，则置为{}
2. 在create-component.js模块已预先定义```const hooks = { init, prepatch, insert, destroy }
 const hooksToMerge = Object.keys(hooks)```init, prepatch, insert, destroy为已经定义好的钩子。遍历hooksToMerge，键值为(key,ours)
3. data.hook[key]存在，调用[mergeHook](#mergeHook)，传入ours, fromParent，得到的函数赋予data.hook[key]； 否则直接把模块中预定义的ours赋予data.hook[key]。

##### mergeHook
```
function mergeHook (a: Function, b: Function): Function {
  // since all hooks have at most two args, use fixed args
  // to avoid having to use fn.apply().
  return (_, __) => {
    a(_, __)
    b(_, __)
  }
}
```

##### hook.prepatch<a name="hooks.prepatch">
参数：
```
oldVnode: MountedComponentVNode,
vnode: MountedComponentVNode
```
1. 先将旧vnode的组件实例赋予新的vnode：`const child = vnode.child = oldVnode.child`
2. 调用child的原型方法[_updateFromParent](#_updateFromParent)，传入vnode.componentOptions相关参数，这样就更新了组件实例。

##### hook.init<a name="hooks.init">
参数： `vnode: VNodeWithData, hydrating: boolean`

1. 调用createComponentInstanceForVnode生成组件实例并挂载至vnode.child
2. `child.$mount(hydrating ? vnode.elm : undefined, hydrating)` 这个会调用子组件的_mount,形成递归，完成子组件的后代组件的渲染和监控。
3. 这个钩子在patch -> createElm中的调用，所以一个vm实例中的组件是在其patch的时候才会递归渲染，在render函数执行后，子组件的vnode只是一个空壳，其生成实例后，才会挂载到vnode.child，注意实例内部也有自己的根vnode，和上层子组件的vnode并不是一个。

##### createComponentInstanceForVnode
在init钩子中调用，通过vnode构造组件
参数：
```
vnode: any, // we know it's MountedComponentVNode but flow doesn't
parent: any // activeInstance in lifecycle state
```
1. 处理options
   <pre> const vnodeComponentOptions = vnode.componentOptions
    const options: InternalComponentOptions = {
      \_isComponent: true,
      parent,
      propsData: vnodeComponentOptions.propsData,
      \_componentTag: vnodeComponentOptions.tag,
      \_parentVnode: vnode,
      \_parentListeners: vnodeComponentOptions.listeners,
      \_renderChildren: vnodeComponentOptions.children
    }
    // check inline-template render functions
    const inlineTemplate = vnode.data.inlineTemplate
    if (inlineTemplate) {
      options.render = inlineTemplate.render
      options.staticRenderFns = inlineTemplate.staticRenderFns
    }
    </pre>
2. 通过组件类来构造组件`return new vnodeComponentOptions.Ctor(options)`


##### createFunctionalComponent
参数：
```
Ctor: Class<Component>,
propsData: ?Object,
data: VNodeData,
context: Component,
children?: VNodeChildren
```
返回：`VNode | void`

1. 遍历Ctor.options.props，调用[validateProp](#validateProp)验证每个prop，并转每个prop属性的getter setter
2. 执行Ctor.options.render，this绑定null，传入的参数createElement为绑定this为Object.create(context)的[createElement](#createElement)，render的第二个参数为：```{
    props,
    data,
    parent: context,
    children: normalizeChildren(children),
    slots: () => resolveSlots(children, context)
  }
  ```
3. 返回render执行后得到的vnode

##### extractProps
遍历子组件类的props，按照其中的key，从父组件vnode中提取数据并返回。注意这里仅仅是提取数据，默认值处理及数据验证将在子组件自己那里进行。
参数： `data: VNodeData, Ctor: Class<Component>`
1. 取Ctor.options.props为propOptions，不存在则直接返回。
2. 将data解构为attrs, props, domProps，如果三者中有任何一个存在，则遍历propOptions。
3. 调用[checkProp](#checkProp), 按照props，attrs，domProps顺序将propOptions中对应的key提取，并组成对象res
4. 返回res

#### checkProp
参数：
```
res: Object,
hash: ?Object,
key: string,
altKey: string,
preserve?: boolean
```

返回：boolean
```
if (hash) {
  if (hasOwn(hash, key)) {
    res[key] = hash[key]
    if (!preserve) {
      delete hash[key]
    }
    return true
  } else if (hasOwn(hash, altKey)) {
    res[key] = hash[altKey]
    if (!preserve) {
      delete hash[altKey]
    }
    return true
  }
}
return false
```

##### resolveAsyncComponent
处理异步组件。
参数：
```
factory: Function,
cb: Function
```
返回`Class<Component>`
// TODO

#### helpers.js
##### updateListeners<a name="updateListeners">
  共传入4个参数:
  ```
  on: Object, // 新的监听键值对
  oldOn: Object, // 旧的监听键值对
  add: Function, // 添加事件监听的方法
  remove: Function // 移除事件监听的方法
  ```

  on及oldOn的一般形式：
  ```{
      'event_name': {
        fn: handler
        invoker: (...args) => { handler.apply(null,args)}
      }
    } 或 {
        'event_name': [...handlers]
    } 或 {
        'event_name': handler
    }
  ```

  1. 遍历on中的所有name，`cur = on[name];old = oldOn[name]`，若cur不存在，且在非生产环境下，则`Handler for event "${name}" is undefined.`
  2. old不存在，即原监听事件不存在：`capture = name.charAt(0) === '!';event = capture ? name.slice(1) : name`。
    - 若cur为数组，即如上例中第二种形式，则调用[arrInvoker](#arrInvoker)，合并handler，挂载到cur.invoker，并执行add。`add(event, (cur.invoker = arrInvoker(cur)), capture)`
    - cur不是数组，但其上invoker属性不存在,则其为上例中第三种形式，这时`fn = cur;cur = on[name] = {};cur.fn = fn;cur.invoker = fnInvoker(cur)`,[fnInvoker](#fnInvoker)仅仅是包装一层，判断参数数量，优化速度。
  3. old存在，且`cur !== old`，使用cur覆盖old中存在的任何东西，而后`on[name] = old`
  4. 检测oldOn中存在，但on中已经不存在的name, 调用remove。

##### arrInvoker<a name="arrInvoker">
  接受一个handler组成的数组：`arr: Array<Function>`
  返回一个新的handler函数，该函数接受事件ev，遍历arr中的所有handler，若ev只有一个，则`arr[i](ev)` 否则 `arr[i].apply(null, arguments)`,即是合并handlers后返回一个新的handler

##### fnInvoker<a name="fnInvoker">
  接受一个handler：`o: { fn: Function }`
  ```
  return function (ev) {
  const single = arguments.length === 1
  single ? o.fn(ev) : o.fn.apply(null, arguments)
 }
 ```

##### normalizeChildren<a name="normalizeChildren">
参数：
```
children: any,
ns: string | void,
nestedIndex: number | void
```
返回值：```Array<VNode> | void```
1. ```  if (isPrimitive(children)) {
    return [createTextVNode(children)]
  }``` [isPrimitive](#isPrimitive)判断children是否为基本类型（number和string），返回```[createTextVNode(children)]```
2. 若children为数组，遍历它每个元素，在此之前创建空数组res保存处理结果，在进行如下处理后，将res返回。
 - 若元素val仍为数组，则递归调用normalizeChildren。
 - 否则，若val为基本类型，则检测res最后一个元素，若其存在，并且有text属性（为文本节点），则直接把val转化为字符串并追加到text属性后面。最后一个元素不存在，或不是文本节点，则使用[createTextVNode](#createTextVNode)创建文本节点并加入到res中。
 - 若元素val为VNode对象，
   - 先判断它是否为文本节点，若其实文本节点，且res中最后一个也是文本节点，则把它合并到res最后一个元素上。
   - 若val非文本节点，进行如下操作后，将其加入res中:
     - 检查第二个参数ns是否存在，若存在，则使用[applyNS](#applyNS)设置命名空间
     - 设置默认key
         <pre>// default key for nested array children (likely generated by v-for)
          if (c.tag && c.key == null && nestedIndex != null) {
            c.key = `__vlist_${nestedIndex}_${i}__`
          }</pre>


##### createTextVNode<a name="createTextVNode">
接受一个字符串，包装为vnode对象并返回。
```
function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}
```

##### applyNS<a name="applyNS">
若节点不存在命名空间，则把它及它的所有子节点的命名空间置为传入的ns。
```
function applyNS (vnode, ns) {
  if (vnode.tag && !vnode.ns) {
    vnode.ns = ns
    if (vnode.children) {
      for (let i = 0, l = vnode.children.length; i < l; i++) {
        applyNS(vnode.children[i], ns)
      }
    }
  }
}
```

#### patch.js
通过工厂createPatchFunction构建并返回patch函数
cbs<a name="cbs-patch">为闭包变量，一般形式为
<pre>{
  create: [function updateAttrs(oldVnode,vnode){...}, function updateClass (){...} ...],
  update: [...],
  postpatch: [...],
  remove: [...],
  destroy: [...]
 }</pre>
 这些数组中的函数，若是浏览器端，则取自/platforms/web/runtime/modules 因为服务器渲染和web渲染并不相同



##### patch<a name="patch">
`const insertedVnodeQueue = []`
参数：oldVnode, vnode, hydrating, removeOnly
1. oldVnode不存在，调用createElm渲染新的根元素`createElm(vnode, insertedVnodeQueue)`
2. oldVnode存在： 判断oldVnode.nodeType是否存在，nodeType存在表示为真实元素（Vnode上无nodeType属性）
3. 不是真实元素(为虚拟元素)，并调用[sameVnode](#sameVnode)判断Vnode是相同的（除了data可能不同）：调用[patchVnode](#patchVnode)处理
//TODO

##### patchVnode<a name="patchVnode">
  参数： `oldVnode, vnode, insertedVnodeQueue, removeOnly`

  1. `oldVnode === vnode`，引用地址都相同，还更新个啥，直接返回
  2. 新旧vnode都是静态的，且key相同，新vnode的isCloned为true，则无需渲染，直接` vnode.elm = oldVnode.elm`
  3. 如果vnode.data.hook.prepatch存在（正常情况下，会在第一次渲染时采用create-component.js中的[prepatch](#hooks.prepatch),执行完后，组件实例和组件实例的后代都会被递归更新）
  4. `const elm = vnode.elm = oldVnode.elm` 直接把旧vnode上已渲染好的DOM赋予vnode.elm
  5. vnode.data存在并且vnode可修补（调用[isPatchable](#isPatchable)检查），则遍历cbs.update，（[cbs](#cbs-patch)为闭包变量，直接操作DOM）。执行cbs.update中的每个回调，vnode.data.hook.update存在，则也执行这个钩子。至此真实DOM通过cbs.update更新完成。
  6. `const oldCh = oldVnode.children;const ch = vnode.children` vnode.text不存在，说明其不是文本节点：
    - oldCh和ch都存在

##### sameVnode<a name="sameVnode">

##### createElm<a name="createElm">
参数：`vnode, insertedVnodeQueue, nested`

1. `const data = vnode.data` data及相关属性若不为null，执行data.hook.init(vnode), 这个钩子会直接调用Vue.$mount构造这个vnode代表的子组件。
2. [data.hook.init](#hook.init)存在并执行后，如果vnode是一个子组件，那么它肯定已经有一个子实例（vnode.child存在，表示它的组件实例），并mount上去了，子组件也已放置在vnode.elm，调用[initComponent](#initComponent)，把vnode.elm返回。
3. `const children = vnode.children;const tag = vnode.tag;`
4. tag存在，则调用createElement（document.createElement）或createElementNS（document.createElementNS）生成DOM，并挂载到vnode.elm上。
5. `createChildren(vnode, vnode.children, insertedVnodeQueue)`递归创建子节点DOM并附加到vnode.elm上。
6. vnode.data存在，调用[invokeCreateHooks](#invokeCreateHooks)，填充DOM的样式、属性事件等。
7. tag不存在：vnode.isComment为true，调用dom方法createComment，根据vnode.text生成注释节点，赋予vnode.elm，否则调用createTextNode生成文本节点。
8. 返回vnode.elm


##### invokeCreateHooks<a name="invokeCreateHooks">
1. cbs为上层的createPatchFunction定义并的闭包变量。参见[cbs](#cbs-patch)
2. `cbs.create[i](emptyNode, vnode)` 填充DOM的样式、属性、事件、过渡效果等
3. vnode.data.hook存在：create钩子存在，`i.create(emptyNode, vnode)`;insert钩子存在，`insertedVnodeQueue.push(vnode)`

##### createChildren
参数：vnode, children, insertedVnodeQueue
1. children为数组，则遍历它们，递归调用[createElm](#createElm)生成DOM，并使用appendChild加入到vnode.elm中。
2. vnode.text存在（文本或数值），调用createTextNode将其包装成文本节点，加入到vnode.elm中。

##### setScope
在vnode.elm上添加scopeId属性，从而使scoped CSS能正常施加。
参数：vnode
1. vnode.context.$options.\_scopeId存在，`setAttribute(vnode.elm, vnode.context.$options._scopeId, '')`
2. activeInstance.$options.\_scopeId存在，且activeInstance与vnode.context不同，`setAttribute(vnode.elm, activeInstance.$options._scopeId, '')`,把父级的scopeId属性也加上
3. `setScope(vnode)` 调用[setScope](#setScope) 在dom上添加scopedId属性
4. `createChildren(vnode, children, insertedVnodeQueue)`

##### initComponent
参数：`vnode, insertedVnodeQueue`
1. vnode.data.pendingInsert存在，将其压入insertedVnodeQueue
2. `vnode.elm = vnode.child.$el`
3. 调用[isPatchable](#isPatchable)检查vnode是否可通过修补更新，若可以，调用[invokeCreateHooks](#invokeCreateHooks)



##### isPatchable<a name="isPatchable">
  不断的查找vnode.child.\_vnode.child，\_vnode属性在vm.\_update中赋值，child存在表示vnode曾经已经渲染并mount过，所以_vnode表示当时的vnode状态，这样不断取child，直到child不存在，就追溯到了最开始的状态，这时若vnode的tag属性存在（有构造函数或vue类配置object），这样可通过这个构造函数来生成组件，则说明可修补，之所以要追溯到最原始的vnode，是应为，一旦渲染过一次，vnode的tag就会变成'vue-component-....'这种字符串（在[createComponent](#createComponent)中处理的）。

  若vnode并不是组件，则其也没有child属性，但它的tag一定存在，所以一定也可修补。


```
function isPatchable (vnode) {
  while (vnode.child) {
    vnode = vnode.child._vnode
  }
  return isDef(vnode.tag)
}
```


#### vnode.js
##### VNode类<a name="VNode-class">
虚拟DOM对象的类。
```
tag: string | void;
data: VNodeData | void;
children: Array<VNode> | void;
text: string | void;
elm: Node | void;
ns: string | void;
context: Component | void; // rendered in this component's scope
key: string | number | void;
componentOptions: VNodeComponentOptions | void;
child: Component | void; // component instance
parent: VNode | void; // compoennt placeholder node
raw: boolean; // contains raw HTML? (server only)
isStatic: boolean; // hoisted static node
isRootInsert: boolean; // necessary for enter transition check
isComment: boolean; // empty comment placeholder?
isCloned: boolean; // is a cloned node? 标记是否为克隆节点
```
初始化：
```
this.tag = tag
this.data = data
this.children = children
this.text = text
this.elm = elm
this.ns = ns
this.context = context
this.key = data && data.key
this.componentOptions = componentOptions
this.child = undefined
this.parent = undefined
this.raw = false
this.isStatic = false
this.isRootInsert = true
this.isComment = false
this.isCloned = false
```
该类仅保存这些信息，没有原型方法。

##### emptyVNode<a name="emptyVNode">
返回一个空节点
```
export const emptyVNode = () => {
  const node = new VNode()
  node.text = ''
  node.isComment = true
  return node
}
```

##### cloneVNodes<a name="cloneVNodes">
调用cloneVNode克隆vnode数组
```
export function cloneVNodes (vnodes: Array<VNode>): Array<VNode> {
  const res = new Array(vnodes.length)
  for (let i = 0; i < vnodes.length; i++) {
    res[i] = cloneVNode(vnodes[i])
  }
  return res
}
```

##### cloneVNode
暴力浅克隆，仅适用于静态节点
```
// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.ns,
    vnode.context,
    vnode.componentOptions
  )
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isCloned = true
  return cloned
}
```

## 流程及测试

```
import Vue from 'vue'

  describe('dataChange', () => {
    it('should force update', done => {
      const vm = new Vue({
        data: {
          a: {},
          ok: true

        },
        template: '<div><test v-if="ok"><p>test1slottt</p></test><p>{{ a.b }}</p></div>',
        components: {
          test: {
            template: '<em><a></a><test2><p>test1111inner</p></test2> t11111<slot></slot></em>',
            data: {testdata: 'test2-slot'},
            components : {
              test2 :{
                template: '<b><slot></slot>{{testdata}}</b>'
              }
            }

          }
        }
      }).$mount()
      // expect(vm.$el.textContent).toBe('')
      vm.a.b = 'foo'
      console.log('render completed-------------------------');
      // console.log(vm.$el);
      waitForUpdate(() => {
        // should not work because adding new property
        // expect(vm.$el.textContent).toBe('')

        vm.$forceUpdate()
      }).then(() => {
        // expect(vm.$el.textContent).toBe('foo')
      }).then(done)
    })
  })
  ```
  结果及流程：
  ```
LOG: 'creatingElement:p;children:test1slottt'
LOG: 'creatingElement:test;children:[object Object]'
LOG: 'creatingComponent:vue-component-1-test;children:[object Object]'
LOG: 'creatingElement:p;children:'
LOG: 'creatingElement:div;children:[object Object],[object Object]'
LOG: 'render complete:div'
LOG: 'updating:div'
LOG: 'patch:div'
LOG: 'render and update by watcher'
LOG: 'render function:function anonymous() {
with(this){return _h('em',[_m(0),_h('test2',[_m(1)])," t11111",_t("default")])}
}'
LOG: 'creatingElement:a;children:undefined'
LOG: 'creatingElement:p;children:test1111inner'
LOG: 'creatingElement:test2;children:[object Object]'
LOG: 'creatingComponent:vue-component-2-test2;children:[object Object]'
LOG: 'creatingElement:em;children:[object Object],[object Object], t11111,[object Object]'
LOG: 'render complete:em'
LOG: 'updating:em'
LOG: 'patch:em'
LOG: 'render and update by watcher'
LOG: 'render function:function anonymous() {
with(this){return _h('b',[_t("default"),_s(testdata)])}
}'
LOG: 'creatingElement:b;children:[object Object],'
LOG: 'render complete:b'
LOG: 'updating:b'
LOG: 'patch:b'
LOG: 'render completed-------------------------'
LOG: '$forceUpdate:undefined'
LOG: 'render and update by watcher'
LOG: 'render function:function anonymous() {
with(this){return _h('div',[(ok)?_h('test',[_m(0)]):_e(),_h('p',[_s(a.b)])])}
}'
LOG: 'creatingElement:test;children:[object Object]'
LOG: 'creatingComponent:vue-component-1-test;children:[object Object]'
LOG: 'creatingElement:p;children:foo'
LOG: 'creatingElement:div;children:[object Object],[object Object]'
LOG: 'render complete:div'
LOG: 'updating:div'
LOG: 'patch:div'
LOG: 'patchVnode:div;data:undefined'
LOG: 'patchVnode:vue-component-1-test;data:[object Object]'
LOG: 'prepatch:vue-component-1-test'
LOG: '_updateFromParent:vue-component-1-test'
LOG: '$forceUpdate:[object Object]'
LOG: 'patchVnode:p;data:undefined'
LOG: 'render and update by watcher'
LOG: 'render function:function anonymous() {
with(this){return _h('em',[_m(0),_h('test2',[_m(1)])," t11111",_t("default")])}
}'
LOG: 'creatingElement:test2;children:[object Object]'
LOG: 'creatingComponent:vue-component-2-test2;children:[object Object]'
LOG: 'creatingElement:em;children:[object Object],[object Object], t11111,[object Object]'
LOG: 'render complete:em'
LOG: 'updating:em'
LOG: 'patch:em'
LOG: 'patchVnode:em;data:undefined'
LOG: 'patchVnode:a;data:undefined'
LOG: 'patchVnode:vue-component-2-test2;data:[object Object]'
LOG: 'prepatch:vue-component-2-test2'
LOG: '_updateFromParent:vue-component-2-test2'
LOG: '$forceUpdate:[object Object]'
LOG: 'patchVnode:undefined;data:undefined'
LOG: 'patchVnode:p;data:undefined'
LOG: 'render and update by watcher'
LOG: 'render function:function anonymous() {
with(this){return _h('b',[_t("default"),_s(testdata)])}
}'
LOG: 'creatingElement:b;children:[object Object],'
LOG: 'render complete:b'
LOG: 'updating:b'
LOG: 'patch:b'
LOG: 'patchVnode:b;data:undefined'
LOG: 'patchVnode:p;data:undefined'
```
