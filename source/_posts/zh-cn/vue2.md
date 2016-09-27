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

## core
### index.js
从instance/index.js导入Vue类，根据配置文件（process.env.VUE_ENV）设置vue原型上$isServer的get方法，设置Vue静态变量version，导出Vue类。

### config.js
各项设置开关

### instance
#### index.js
定义Vue类，使用_init方法（init.js中）对options参数进行处理，将instance文件夹中定义的各Mixin函数注入Vue类，并导出。
##### initMixin
定义原型上_init方法，进行必要的初始化，并执行instance文件夹中个文件定义的初始化函数，将Vue实例注入。
###### initLifecycle
###### initEvents
###### callHook
###### initState
###### callHook
###### initRender