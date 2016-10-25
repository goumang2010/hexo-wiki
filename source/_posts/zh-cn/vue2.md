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

## entries
### web-compiler.js
默认导出compile函数，将模板编译成render函数。
参数：
```
template: string,
options?: CompilerOptions
```
注入modules和directives后调用/platforms/web/compiler/index.js中compile函数进行编译，而该compile函数仅仅将一些web平台的modules和directive及一些工具函数确保注入options后，调用/compiler/index.js中的[compile函数](#compile)，该函数是真正进行编译的函数。

### web-runtime.js
首先从'core/index'中获取Vue类
1. 安装从web/util/index,js导出的web平台专有的工具函数。
2. 安装平台运行时专有的指令和组件。分别从web/runtime/directives/和web/runtime/components/导出，组件就是web的过渡效果，指令为v-model和v-show，将它们分别加入Vue.options.components和Vue.options.directives
3. 安装平台patch函数，config.\_isServer不为true，安装'web/runtime/patch'导出的patch，该patch实际上是通过向[createPatchFunction](#createPatchFunction)传入web/runtime/node-ops（dom基本操作），core/vdom/modules/index（基本指令生成的）.
4. 构造Vue.prototype.$mount： 若非服务端，调用[query](#domQuery)加工el，这时el为Element，即DOM元素，然后调用[\_mount](#_mount)
5. 使devtools发射init事件。```devtools.emit('init', Vue)```
6. 经过以上修饰，导出Vue类

### web-runtime-with-compiler.js
闭包缓存[query](#domQuery)函数，返回`el.innerHTML`, 为idToTemplate。重构web-runtime已定义的Vue.prototype.$mount,加入编译模板template过程：
1. 调用[query](#domQuery)加工el，取得el对应的DOM，若该DOM为document.body（body标签对应的元素）或document.documentElement（html标签对应的元素），则直接返回，在非生产环境下提示，不能将Vue挂载到html或body标签上。
2. 实例$options上若不存在render函数，则取this.$options.template为template, 若template存在:
  - template为字符串，且第一个字母为#，说明其为id选择器，调用idToTemplate，取其代表元素的innerHTML赋予template
  - template.nodeType存在，说明其为DOM元素，直接取其innerHTML赋予template
  - 若不是以上两种情况，非生产环境下提示：·`invalid template option`
3. template不存在，但el存在，调用getOuterHTML并传入el，即是el.outerHTML,若该属性不存在，在el上建立个父节点（容器），然后取容器的innerHTML。
4. 经过以上过程，template存在，则调用compileToFunctions编译template生成render函数和staticRenderFns，并统统挂到$options上
5. 执行原定义的Vue.prototype.$mount。


### web-server-renderer.js
导出createRenderer和createBundleRenderer函数

## platforms - web
### compiler
#### compile
将当前目录下的/modules和/directives合并至options，然后调用compiler/index.js中的complie函数进行模板编译。

#### compileToFunctions
将模板编译为render函数
```
template: string,
options?: CompilerOptions,
vm?: Component
```

1. 使用compile编译模板，通过makeFunction将编译后的render字符串转化为函数放至res.render
2. 遍历编译后的staticRenderFns数组，将其转化为函数，重新构建数组挂在res上。
3. 使用闭包变量cache进行缓存，并返回res。


### util
#### query<a name= "domQuery" >
传入el
1. 若el不是string，直接返回el
2. 调用```document.querySelector(el)```, 若不存在，则提示无法找到，并创建一个div后返回。
3. 将找到的dom返回。

### runtime
#### directives
该目录中的内容将在web-runtime.js中加入到Vue.options.directives中，然后通过vdom处理。
##### model
导出inserted及componentUpdated函数
- inserted
  1. 若非生产环境，且vnode的tag属性不是input，select，textarea或组件时，提示v-model无法应用于除这些之外的元素
  2. tag为select，则调用setSelected

###### setSelected
// TODO

## compiler
导出真正进行模板编译的compile函数<a name="compile" >
1. 调用parse转化模板为[ASTElement](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
2. 调用optimize进行优化
3. 调用generate根据ast树生成代码并返回。

### parser
#### index.js
导出parse 生成Options，并调用parseHTML，转化DOM为ASTElement，同时也解析其中的指令。
##### options.start
转化指令，构建AST
1. 构建基本AST：<pre>
const element: ASTElement = {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs, options.isIE),
        parent: currentParent,
        children: []
      }
</pre>
2. 执行导入的各个模块中的pre-transforms
3. parse闭包内inVPre为false，执行processPre,若存在v-pre，置inVPre为true
4. 如果tag为pre，置inPre为true
5. inVPre为true，则执行processRawAttrs，否则
  - 执行processFor，processIf，processOnce，processKey
  - 执行processRef， processSlot， processComponent
  - 执行引入模块中每个transforms函数
  - 执行processAttrs

###### processAttrs


###### processFor
1. 取出v-for属性为exp，通过正则，将要遍历的对象赋予el.for
2. 遍历出的每个元素通过`/\(([^,]*),([^,]*)(?:,([^,]*))?\/`,匹配是否为括号中的元素。若不是，直接置为el.alias，否则，分别将括号中的元素赋予el.alias，el.iterator1，el.iterator2

###### processIf
1. 取出v-if属性为exp，将其赋予el.if
2. 取v-else，若存在，则`el.else = true;`

###### processOnce
```
function processOnce (el) {
  var once = getAndRemoveAttr(el, 'v-once');
  if (once != null) {
    el.once = true;
  }
}
```

###### processKey
 调用getBindingAttr取得v-bind:key或:key,赋予el.key

###### processRef
1. 调用getBindingAttr取得v-bind:ref或:ref,赋予el.ref
2. 调用checkInFor检查el是否在v-for中，将布尔值赋予el.refInFor

###### processSlot
1. 如果el的tag本身为slot，调用getBindingAttr取得v-bind:name或:name,赋予el.slotName
2. tag不是slot，调用getBindingAttr取得v-bind:slot或:slot,赋予el.slotTarget

###### processComponent
1. 调用getBindingAttr取得v-bind:is或:is,赋予el.component
2. el上如果存在inline-template属性，则`el.inlineTemplate = true`

###### processRawAttrs
将el.attrsList元素分别取出，按照{name,value}存放至el.attrs

######  processPre
```
function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}
```

#### html-parser.js
导出parseHTML函数，原型：http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
预定义各种匹配正则
 - attribute  ```/^\s*([^\s"'<>\/=]+)(?:\s*((?:=))\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/```
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" version="1.1" width="934" height="510">
      <defs>
        <style type="text/css">svg{background-color:#fff}text,tspan{font:12px Arial}path{fill-opacity:0;stroke-width:2px;stroke:#000}circle{fill:#6b6659;stroke-width:2px;stroke:#000}.anchor text,.any-character text{fill:#fff}.anchor rect,.any-character rect{fill:#6b6659}.escape text,.charset-escape text,.literal text{fill:#000}.escape rect,.charset-escape rect{fill:#bada55}.literal rect{fill:#dae9e5}.charset .charset-box{fill:#cbcbba}.subexp .subexp-label tspan,.charset .charset-label tspan,.match-fragment .repeat-label tspan{font-size:10px}.repeat-label{cursor:help}.subexp .subexp-label tspan,.charset .charset-label tspan{dominant-baseline:text-after-edge}.subexp .subexp-box{stroke:#908c83;stroke-dasharray:6,2;stroke-width:2px;fill-opacity:0}.quote{fill:#908c83}
        </style>
        </defs>
        <metadata>
          <rdf:rdf>
            <cc:license rdf:about="http://creativecommons.org/licenses/by/3.0/">
              <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction"></cc:permits>
              <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution"></cc:permits>
              <cc:requires rdf:resource="http://creativecommons.org/ns#Notice"></cc:requires>
              <cc:requires rdf:resource="http://creativecommons.org/ns#Attribution"></cc:requires>
              <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks"></cc:permits>
            </cc:license>
          </rdf:rdf>
        </metadata>
      <desc>Created with Snap</desc><g transform="matrix(1,0,0,1,15,10)" class="root"><g transform="matrix(1,0,0,1,10,0)" class="regexp match"><path d="M71,250H96M172,250H217M303,250H368"></path><g class="match-fragment" transform="matrix(1,0,0,1,0,238)"><g class="label anchor"><rect width="71" height="24"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>Start of line</tspan></text></g></g><g class="match-fragment" transform="matrix(1,0,0,1,81,228)"><path d="M0,22q10,0 10,-10v-2q0,-10 10,-10h66q10,0 10,10v2q0,10 10,10M15,22q-10,0 -10,10v2q0,10 10,10h76q10,0 10,-10v-2q0,-10 -10,-10M101,37l5,-5m-5,5l-5,-5"></path><g class="escape" transform="matrix(1,0,0,1,15,10)"><g class="label"><rect width="76" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>white space</tspan></text></g></g></g><g class="match-fragment subexp" transform="matrix(1,0,0,1,197,108)"><rect rx="3" ry="3" class="subexp-box" transform="matrix(1,0,0,1,0,14)" width="131" height="252"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="subexp-label"><tspan>group #1</tspan></text><g transform="matrix(1,0,0,1,10,24)" class="regexp match match-fragment"><path d="M10,118q-10,0 -10,10v94q0,10 10,10h86q10,0 10,-10v-94q0,-10 -10,-10M106,133l5,-5m-5,5l-5,-5"></path><g transform="matrix(1,0,0,1,10,0)" class="charset"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="86" height="208"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>None of:</tspan></text><g transform="matrix(1,0,0,1,5,19)"><g class="charset-escape" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="76" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>white space</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,27,29)"><g class="label"><rect width="22" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>"</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,28,58)"><g class="label"><rect width="20" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>'</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,25.5,87)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>&lt;</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,25.5,116)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>&gt;</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,27.5,145)"><g class="label"><rect width="21" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>/</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,25.5,174)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>=</tspan><tspan class="quote">”</tspan></text></g></g></g></g></g></g><g class="match-fragment" transform="matrix(1,0,0,1,338,0)"><path d="M0,250q10,0 10,-10v-230q0,-10 10,-10h506q10,0 10,10v230q0,10 10,10"></path><g class="subexp regexp match" transform="matrix(1,0,0,1,15,10)"><path d="M91,240H128M153,240H190M266,240H291"></path><g class="match-fragment" transform="matrix(1,0,0,1,0,218)"><path d="M0,22q10,0 10,-10v-2q0,-10 10,-10h66q10,0 10,10v2q0,10 10,10M15,22q-10,0 -10,10v2q0,10 10,10h76q10,0 10,-10v-2q0,-10 -10,-10M101,37l5,-5m-5,5l-5,-5"></path><g class="escape" transform="matrix(1,0,0,1,15,10)"><g class="label"><rect width="76" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>white space</tspan></text></g></g></g><g class="match-fragment subexp" transform="matrix(1,0,0,1,116,204)"><rect rx="3" ry="3" class="subexp-box" transform="matrix(1,0,0,1,0,14)" width="49" height="44"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="subexp-label"><tspan>group #2</tspan></text><g transform="matrix(1,0,0,1,12,24)" class="regexp match match-fragment subexp literal"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>=</tspan><tspan class="quote">”</tspan></text></g></g></g><g class="match-fragment" transform="matrix(1,0,0,1,175,218)"><path d="M0,22q10,0 10,-10v-2q0,-10 10,-10h66q10,0 10,10v2q0,10 10,10M15,22q-10,0 -10,10v2q0,10 10,10h76q10,0 10,-10v-2q0,-10 -10,-10M101,37l5,-5m-5,5l-5,-5"></path><g class="escape" transform="matrix(1,0,0,1,15,10)"><g class="label"><rect width="76" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>white space</tspan></text></g></g></g><g class="match-fragment subexp regexp" transform="matrix(1,0,0,1,291,0)"><path d="M10,75q0,-10 10,-10M215,75q0,-10 -10,-10M10,182q0,-10 10,-10M215,182q0,-10 -10,-10M10,346q0,10 10,10M215,346q0,10 -10,10M0,240q10,0 10,-10V75M225,240q-10,0 -10,-10V75M0,240q10,0 10,10V346M225,240q-10,0 -10,10V346"></path><g transform="matrix(1,0,0,1,20,0)" class="regexp-matches"><path d="M0,65h0M170,65H185M0,172h2M168,172H185M0,356h47M133,356H185"></path><g class="match" transform="matrix(1,0,0,1,0,0)"><path d="M22,65H57M103,65H148"></path><g class="match-fragment literal" transform="matrix(1,0,0,1,0,53)"><g class="label"><rect width="22" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>"</tspan><tspan class="quote">”</tspan></text></g></g><g class="match-fragment subexp" transform="matrix(1,0,0,1,32,0)"><rect rx="3" ry="3" class="subexp-box" transform="matrix(1,0,0,1,0,14)" width="96" height="88"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="subexp-label"><tspan>group #3</tspan></text><g class="regexp match match-fragment" transform="matrix(1,0,0,1,10,24)"><path d="M0,41q10,0 10,-10v-21q0,-10 10,-10h36q10,0 10,10v21q0,10 10,10M15,41q-10,0 -10,10v7q0,10 10,10h46q10,0 10,-10v-7q0,-10 -10,-10M71,56l5,-5m-5,5l-5,-5"></path><g class="charset" transform="matrix(1,0,0,1,15,10)"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="46" height="34"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>None of:</tspan></text><g transform="matrix(1,0,0,1,12,19)"><g class="literal" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="22" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>"</tspan><tspan class="quote">”</tspan></text></g></g></g></g></g></g><g class="match-fragment" transform="matrix(1,0,0,1,138,53)"><path d="M10,12q-10,0 -10,10v2q0,10 10,10h22q10,0 10,-10v-2q0,-10 -10,-10M42,27l5,-5m-5,5l-5,-5"></path><g class="literal" transform="matrix(1,0,0,1,10,0)"><g class="label"><rect width="22" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>"</tspan><tspan class="quote">”</tspan></text></g></g></g></g><g transform="matrix(1,0,0,1,2,107)" class="match"><path d="M20,65H55M101,65H146"></path><g class="match-fragment literal" transform="matrix(1,0,0,1,0,53)"><g class="label"><rect width="20" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>'</tspan><tspan class="quote">”</tspan></text></g></g><g class="match-fragment subexp" transform="matrix(1,0,0,1,30,0)"><rect rx="3" ry="3" class="subexp-box" transform="matrix(1,0,0,1,0,14)" width="96" height="88"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="subexp-label"><tspan>group #4</tspan></text><g class="regexp match match-fragment" transform="matrix(1,0,0,1,10,24)"><path d="M0,41q10,0 10,-10v-21q0,-10 10,-10h36q10,0 10,10v21q0,10 10,10M15,41q-10,0 -10,10v7q0,10 10,10h46q10,0 10,-10v-7q0,-10 -10,-10M71,56l5,-5m-5,5l-5,-5"></path><g class="charset" transform="matrix(1,0,0,1,15,10)"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="46" height="34"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>None of:</tspan></text><g transform="matrix(1,0,0,1,13,19)"><g class="literal" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="20" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>'</tspan><tspan class="quote">”</tspan></text></g></g></g></g></g></g><g class="match-fragment" transform="matrix(1,0,0,1,136,53)"><path d="M10,12q-10,0 -10,10v2q0,10 10,10h20q10,0 10,-10v-2q0,-10 -10,-10M40,27l5,-5m-5,5l-5,-5"></path><g class="literal" transform="matrix(1,0,0,1,10,0)"><g class="label"><rect width="20" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>'</tspan><tspan class="quote">”</tspan></text></g></g></g></g><g class="match match-fragment subexp" transform="matrix(1,0,0,1,27,214)"><rect rx="3" ry="3" class="subexp-box" transform="matrix(1,0,0,1,0,14)" width="131" height="252"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="subexp-label"><tspan>group #5</tspan></text><g transform="matrix(1,0,0,1,10,24)" class="regexp match match-fragment"><path d="M10,118q-10,0 -10,10v94q0,10 10,10h86q10,0 10,-10v-94q0,-10 -10,-10M106,133l5,-5m-5,5l-5,-5"></path><g transform="matrix(1,0,0,1,10,0)" class="charset"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="86" height="208"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>None of:</tspan></text><g transform="matrix(1,0,0,1,5,19)"><g class="charset-escape" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="76" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>white space</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,27,29)"><g class="label"><rect width="22" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>"</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,28,58)"><g class="label"><rect width="20" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>'</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,25.5,87)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>=</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,25.5,116)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>&lt;</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,25.5,145)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>&gt;</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,27,174)"><g class="label"><rect width="22" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>\`</tspan><tspan class="quote">”</tspan></text></g></g></g></g></g></g></g></g></g></g></g><path d="M10,250H0M879,250H904"></path><circle cx="0" cy="250" r="5"></circle><circle cx="904" cy="250" r="5"></circle></g>
    </svg>
 - startTagOpen ```/^<((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)/```
   <svg xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" version="1.1" width="583" height="190">
               <defs>
                 <style type="text/css">svg{background-color:#fff}text,tspan{font:12px Arial}path{fill-opacity:0;stroke-width:2px;stroke:#000}circle{fill:#6b6659;stroke-width:2px;stroke:#000}.anchor text,.any-character text{fill:#fff}.anchor rect,.any-character rect{fill:#6b6659}.escape text,.charset-escape text,.literal text{fill:#000}.escape rect,.charset-escape rect{fill:#bada55}.literal rect{fill:#dae9e5}.charset .charset-box{fill:#cbcbba}.subexp .subexp-label tspan,.charset .charset-label tspan,.match-fragment .repeat-label tspan{font-size:10px}.repeat-label{cursor:help}.subexp .subexp-label tspan,.charset .charset-label tspan{dominant-baseline:text-after-edge}.subexp .subexp-box{stroke:#908c83;stroke-dasharray:6,2;stroke-width:2px;fill-opacity:0}.quote{fill:#908c83}
           </style>
               </defs>
               <metadata>
                 <rdf:rdf>
                   <cc:license rdf:about="http://creativecommons.org/licenses/by/3.0/">
                     <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction"></cc:permits>
                     <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution"></cc:permits>
                     <cc:requires rdf:resource="http://creativecommons.org/ns#Notice"></cc:requires>
                     <cc:requires rdf:resource="http://creativecommons.org/ns#Attribution"></cc:requires>
                     <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks"></cc:permits>
                   </cc:license>
                 </rdf:rdf>
               </metadata>
             <desc>Created with Snap</desc><g transform="matrix(1,0,0,1,15,10)" class="root"><g transform="matrix(1,0,0,1,10,0)" class="regexp match"><path d="M71,104H81M106,104H141"></path><g class="match-fragment" transform="matrix(1,0,0,1,0,92)"><g class="label anchor"><rect width="71" height="24"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>Start of line</tspan></text></g></g><g class="match-fragment literal" transform="matrix(1,0,0,1,81,92)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>&lt;</tspan><tspan class="quote">”</tspan></text></g></g><g class="match-fragment subexp" transform="matrix(1,0,0,1,116,0)"><rect rx="3" ry="3" class="subexp-box" transform="matrix(1,0,0,1,0,14)" width="417" height="156"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="subexp-label"><tspan>group #1</tspan></text><g transform="matrix(1,0,0,1,10,24)" class="regexp match"><path d="M209,80H234M309,80H334"></path><g class="match-fragment" transform="matrix(1,0,0,1,0,0)"><path d="M0,80q10,0 10,-10v-60q0,-10 10,-10h184q10,0 10,10v60q0,10 10,10"></path><g class="subexp regexp match" transform="matrix(1,0,0,1,15,10)"><path d="M75,70H100M148,70H173"></path><g class="match-fragment charset" transform="matrix(1,0,0,1,0,10)"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="75" height="92"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>One of:</tspan></text><g transform="matrix(1,0,0,1,5,19)"><g class="charset-range" transform="matrix(1,0,0,1,1,0)"><text x="0" y="0" transform="matrix(1,0,0,1,30,16)">-</text><g class="literal" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>a</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,39,0)"><g class="label"><rect width="24" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>z</tspan><tspan class="quote">”</tspan></text></g></g></g><g transform="matrix(1,0,0,1,0,29)" class="charset-range"><text x="0" y="0" transform="matrix(1,0,0,1,31,16)">-</text><g class="literal" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="26" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>A</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,40,0)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>Z</tspan><tspan class="quote">”</tspan></text></g></g></g><g class="literal" transform="matrix(1,0,0,1,20,58)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>_</tspan><tspan class="quote">”</tspan></text></g></g></g></g><g class="match-fragment" transform="matrix(1,0,0,1,85,0)"><path d="M0,70q10,0 10,-10v-50q0,-10 10,-10h38q10,0 10,10v50q0,10 10,10M15,70q-10,0 -10,10v36q0,10 10,10h48q10,0 10,-10v-36q0,-10 -10,-10M73,85l5,-5m-5,5l-5,-5"></path><g transform="matrix(1,0,0,1,15,10)" class="charset"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="48" height="92"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>One of:</tspan></text><g transform="matrix(1,0,0,1,5,19)"><g class="charset-escape" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="38" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>word</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,8,29)"><g class="label"><rect width="22" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>-</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,8.5,58)"><g class="label"><rect width="21" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>.</tspan><tspan class="quote">”</tspan></text></g></g></g></g></g><g class="match-fragment literal" transform="matrix(1,0,0,1,173,58)"><g class="label"><rect width="21" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>:</tspan><tspan class="quote">”</tspan></text></g></g></g></g><g class="match-fragment charset" transform="matrix(1,0,0,1,234,20)"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="75" height="92"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>One of:</tspan></text><g transform="matrix(1,0,0,1,5,19)"><g class="charset-range" transform="matrix(1,0,0,1,1,0)"><text x="0" y="0" transform="matrix(1,0,0,1,30,16)">-</text><g class="literal" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>a</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,39,0)"><g class="label"><rect width="24" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>z</tspan><tspan class="quote">”</tspan></text></g></g></g><g transform="matrix(1,0,0,1,0,29)" class="charset-range"><text x="0" y="0" transform="matrix(1,0,0,1,31,16)">-</text><g class="literal" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="26" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>A</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,40,0)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>Z</tspan><tspan class="quote">”</tspan></text></g></g></g><g class="literal" transform="matrix(1,0,0,1,20,58)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>_</tspan><tspan class="quote">”</tspan></text></g></g></g></g><g class="match-fragment" transform="matrix(1,0,0,1,319,10)"><path d="M0,70q10,0 10,-10v-50q0,-10 10,-10h38q10,0 10,10v50q0,10 10,10M15,70q-10,0 -10,10v36q0,10 10,10h48q10,0 10,-10v-36q0,-10 -10,-10M73,85l5,-5m-5,5l-5,-5"></path><g class="charset" transform="matrix(1,0,0,1,15,10)"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="48" height="92"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>One of:</tspan></text><g transform="matrix(1,0,0,1,5,19)"><g class="charset-escape" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="38" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>word</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,8,29)"><g class="label"><rect width="22" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>-</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,8.5,58)"><g class="label"><rect width="21" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>.</tspan><tspan class="quote">”</tspan></text></g></g></g></g></g></g></g></g><path d="M10,104H0M518,104H553"></path><circle cx="0" cy="104" r="5"></circle><circle cx="553" cy="104" r="5"></circle></g>
            </svg>
 - startTagClose ```/^\s*(\/?)>/```
 - endTag ```/^<\/((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)[^>]*>/```
   <svg xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" version="1.1" width="707" height="190">
             <defs>
               <style type="text/css">svg{background-color:#fff}text,tspan{font:12px Arial}path{fill-opacity:0;stroke-width:2px;stroke:#000}circle{fill:#6b6659;stroke-width:2px;stroke:#000}.anchor text,.any-character text{fill:#fff}.anchor rect,.any-character rect{fill:#6b6659}.escape text,.charset-escape text,.literal text{fill:#000}.escape rect,.charset-escape rect{fill:#bada55}.literal rect{fill:#dae9e5}.charset .charset-box{fill:#cbcbba}.subexp .subexp-label tspan,.charset .charset-label tspan,.match-fragment .repeat-label tspan{font-size:10px}.repeat-label{cursor:help}.subexp .subexp-label tspan,.charset .charset-label tspan{dominant-baseline:text-after-edge}.subexp .subexp-box{stroke:#908c83;stroke-dasharray:6,2;stroke-width:2px;fill-opacity:0}.quote{fill:#908c83}
         </style>
             </defs>
             <metadata>
               <rdf:rdf>
                 <cc:license rdf:about="http://creativecommons.org/licenses/by/3.0/">
                   <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction"></cc:permits>
                   <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution"></cc:permits>
                   <cc:requires rdf:resource="http://creativecommons.org/ns#Notice"></cc:requires>
                   <cc:requires rdf:resource="http://creativecommons.org/ns#Attribution"></cc:requires>
                   <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks"></cc:permits>
                 </cc:license>
               </rdf:rdf>
             </metadata>
           <desc>Created with Snap</desc><g transform="matrix(1,0,0,1,15,10)" class="root"><g transform="matrix(1,0,0,1,10,0)" class="regexp match"><path d="M71,104H81M109,104H144M511,104H561M607,104H632"></path><g class="match-fragment" transform="matrix(1,0,0,1,0,92)"><g class="label anchor"><rect width="71" height="24"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>Start of line</tspan></text></g></g><g class="match-fragment literal" transform="matrix(1,0,0,1,81,92)"><g class="label"><rect width="28" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>&lt;/</tspan><tspan class="quote">”</tspan></text></g></g><g class="match-fragment subexp" transform="matrix(1,0,0,1,119,0)"><rect rx="3" ry="3" class="subexp-box" transform="matrix(1,0,0,1,0,14)" width="417" height="156"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="subexp-label"><tspan>group #1</tspan></text><g transform="matrix(1,0,0,1,10,24)" class="regexp match"><path d="M209,80H234M309,80H334"></path><g class="match-fragment" transform="matrix(1,0,0,1,0,0)"><path d="M0,80q10,0 10,-10v-60q0,-10 10,-10h184q10,0 10,10v60q0,10 10,10"></path><g class="subexp regexp match" transform="matrix(1,0,0,1,15,10)"><path d="M75,70H100M148,70H173"></path><g class="match-fragment charset" transform="matrix(1,0,0,1,0,10)"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="75" height="92"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>One of:</tspan></text><g transform="matrix(1,0,0,1,5,19)"><g class="charset-range" transform="matrix(1,0,0,1,1,0)"><text x="0" y="0" transform="matrix(1,0,0,1,30,16)">-</text><g class="literal" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>a</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,39,0)"><g class="label"><rect width="24" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>z</tspan><tspan class="quote">”</tspan></text></g></g></g><g transform="matrix(1,0,0,1,0,29)" class="charset-range"><text x="0" y="0" transform="matrix(1,0,0,1,31,16)">-</text><g class="literal" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="26" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>A</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,40,0)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>Z</tspan><tspan class="quote">”</tspan></text></g></g></g><g class="literal" transform="matrix(1,0,0,1,20,58)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>_</tspan><tspan class="quote">”</tspan></text></g></g></g></g><g class="match-fragment" transform="matrix(1,0,0,1,85,0)"><path d="M0,70q10,0 10,-10v-50q0,-10 10,-10h38q10,0 10,10v50q0,10 10,10M15,70q-10,0 -10,10v36q0,10 10,10h48q10,0 10,-10v-36q0,-10 -10,-10M73,85l5,-5m-5,5l-5,-5"></path><g transform="matrix(1,0,0,1,15,10)" class="charset"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="48" height="92"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>One of:</tspan></text><g transform="matrix(1,0,0,1,5,19)"><g class="charset-escape" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="38" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>word</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,8,29)"><g class="label"><rect width="22" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>-</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,8.5,58)"><g class="label"><rect width="21" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>.</tspan><tspan class="quote">”</tspan></text></g></g></g></g></g><g class="match-fragment literal" transform="matrix(1,0,0,1,173,58)"><g class="label"><rect width="21" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>:</tspan><tspan class="quote">”</tspan></text></g></g></g></g><g class="match-fragment charset" transform="matrix(1,0,0,1,234,20)"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="75" height="92"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>One of:</tspan></text><g transform="matrix(1,0,0,1,5,19)"><g class="charset-range" transform="matrix(1,0,0,1,1,0)"><text x="0" y="0" transform="matrix(1,0,0,1,30,16)">-</text><g class="literal" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>a</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,39,0)"><g class="label"><rect width="24" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>z</tspan><tspan class="quote">”</tspan></text></g></g></g><g transform="matrix(1,0,0,1,0,29)" class="charset-range"><text x="0" y="0" transform="matrix(1,0,0,1,31,16)">-</text><g class="literal" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="26" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>A</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,40,0)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>Z</tspan><tspan class="quote">”</tspan></text></g></g></g><g class="literal" transform="matrix(1,0,0,1,20,58)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>_</tspan><tspan class="quote">”</tspan></text></g></g></g></g><g class="match-fragment" transform="matrix(1,0,0,1,319,10)"><path d="M0,70q10,0 10,-10v-50q0,-10 10,-10h38q10,0 10,10v50q0,10 10,10M15,70q-10,0 -10,10v36q0,10 10,10h48q10,0 10,-10v-36q0,-10 -10,-10M73,85l5,-5m-5,5l-5,-5"></path><g class="charset" transform="matrix(1,0,0,1,15,10)"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="48" height="92"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>One of:</tspan></text><g transform="matrix(1,0,0,1,5,19)"><g class="charset-escape" transform="matrix(1,0,0,1,0,0)"><g class="label"><rect width="38" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan>word</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,8,29)"><g class="label"><rect width="22" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>-</tspan><tspan class="quote">”</tspan></text></g></g><g class="literal" transform="matrix(1,0,0,1,8.5,58)"><g class="label"><rect width="21" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>.</tspan><tspan class="quote">”</tspan></text></g></g></g></g></g></g></g><g class="match-fragment" transform="matrix(1,0,0,1,546,63)"><path d="M0,41q10,0 10,-10v-21q0,-10 10,-10h36q10,0 10,10v21q0,10 10,10M15,41q-10,0 -10,10v7q0,10 10,10h46q10,0 10,-10v-7q0,-10 -10,-10M71,56l5,-5m-5,5l-5,-5"></path><g class="charset" transform="matrix(1,0,0,1,15,10)"><rect rx="3" ry="3" class="charset-box" transform="matrix(1,0,0,1,0,14)" width="46" height="34"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,14)" class="charset-label"><tspan>None of:</tspan></text><g transform="matrix(1,0,0,1,10.5,19)"><g transform="matrix(1,0,0,1,0,0)" class="literal"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>&gt;</tspan><tspan class="quote">”</tspan></text></g></g></g></g></g><g class="match-fragment literal" transform="matrix(1,0,0,1,632,92)"><g class="label"><rect width="25" height="24" rx="3" ry="3"></rect><text x="0" y="0" transform="matrix(1,0,0,1,5,17)"><tspan class="quote">“</tspan><tspan>&gt;</tspan><tspan class="quote">”</tspan></text></g></g></g><path d="M10,104H0M667,104H677"></path><circle cx="0" cy="104" r="5"></circle><circle cx="677" cy="104" r="5"></circle></g>
          </svg>
 - doctype ```/^<!DOCTYPE [^>]+>/i```

##### parseHTML
1. ```const stack = []```用于存放每个tag
2. html为通过游标截取的模板字符串，`const textEnd = html.indexOf('<')`textEnd为0（第一个字符是<）,且lastTag不存在，即使存在，也不是script或style，则进行如下操作：
  - 通过```/^<!--/```判断是截取的html开头是否进入Comment，如果进入跳过（将游标commentEnd移到'-->'后面，直接进入下个循环。
  - 通过```/^<!\[/```判断html进入ie的条件注释下，进入则跳过它，直接进入下个循环。
  - 通过正则doctype跳过Doctype，直接进入下个循环。
  - 通过endTag匹配标签末尾，跳过这个末尾并且调用parseEndTag，即根据结尾符号进行标签转化，直接进入下个循环。
  - 通过parseStartTag直接使用startTagOpen匹配标签开头，返回{tagName, attrs:[],start:index}，并使用handleStartTag处理，然后进入下个循环。
3. textEnd >= 0：跳过'<'之前的字符，使得<成为第一个字符, 若textEnd<0 , 说明剩余的字符串中已经没有'<'，这时`text = html;html = '';`
4. lastTag存在，且为script或style ：直接匹配该标签的尾部，并使用parseEndTag处理。

###### parseStartTag <a name="parseStartTag">

###### handleStartTag <a name="handleStartTag">


###### parseEndTag
1. tagName存在，在stack数组中搜索最近的开放标签
2. 对stack数组中最近的开放标签与传入标签之间的所有标签执行options.end
3. 通过设置stack数组的length属性移出执行过options.end的对象
4. stack数组中不存在最近的开放标签：
  - 传入标签名称为br，调用options.start，只不过第3个参数unary设为true
  - 传入的标签名称为p，分别调用options.start和options.end，unary设为false

## vm实例
入口为：/src/core/index.js导出的[Vue类](#coreVue)

### $parent
若$parent为undefined,则其为根实例。

### $options
属性     | 处理文件 | 处理函数 | 说明
----     |------   |----     |----
props    | b       | c       |----
propsData| e       | f       |----
\_propKeys| h       | i       |----

## core
### index.js<a name="coreVue">
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

- Vue.prototype.\_mount<a name="\_mount" >
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

1. 调用createComponentInstanceForVnode生成组件vm实例并挂载至vnode.child
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
2. 执行Ctor.options.render，this绑定null，传入的参数createElement为绑定this为Object.create(context)的[createElement](#createElement)，render的第二个参数为：<pre>
  {
    props,
    data,
    parent: context,
    children: normalizeChildren(children),
    slots: () => resolveSlots(children, context)
  }
  </pre>
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
通过工厂createPatchFunction<a name="createPatchFunction" >构建并返回patch函数
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
    - oldCh和ch都存在，且不相同，调用[updateChildren](#updateChildren)递归更新子节点
    - ch存在，oldCh不存在，调用addVnodes插入子级DOM


##### updateChildren<a name="updateChildren">
定义各种flag：
```
let oldStartIdx = 0
let newStartIdx = 0
let oldEndIdx = oldCh.length - 1
let oldStartVnode = oldCh[0]
let oldEndVnode = oldCh[oldEndIdx]
let newEndIdx = newCh.length - 1
let newStartVnode = newCh[0]
let newEndVnode = newCh[newEndIdx]
let oldKeyToIdx, idxInOld, elmToMove, before
```
paichu
oldStartIdx -> oldEndIdx

newStartIdx -> newEndIdx

这四个flag，各自不断向中间接近，直到重合，分别取有值的位置为oldStartVnode， oldEndVnode， newStartVnode， newEndVnode：
1. sameVnode(oldStartVnode, newStartVnode) -> patchVnode递归更新
2. oldStartVnode, newStartVnode已不再相同：sameVnode(oldEndVnode, newEndVnode) -> patchVnode递归更新
3. 两个头部和尾部都已不是相同类型vnode：但sameVnode(oldStartVnode, newEndVnode)，这时说明是oldStartVnode的这个vnode向右移动了位置，同样调用patchVnode递归更新,然后```nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))```,这样直接操作DOM实施这一过程。
4. 以上情况都排除，但sameVnode(oldEndVnode, newStartVnode) 说明oldEndVnode左移了，同样调用patchVnode递归更新,然后```nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)```操作该vnode对应的DOM左移
5. 以上情况都排除：通过比较key来找出已乱序的children，注意key若非在render函数中声明，则是在[normalizeChildren](#normalizeChildren中定义的，格式为：```\_\_vlist${nestedIndex}\_${i}\_\_```
  - newStartVnode.key在剩余old队列vnode中不存在，则说明是新值的元素，直接建立并插入到oldStartVnode.elm前面。
  - newStartVnode.key在剩余old队列vnode中存在，tag不相同，则视为新元素，直接建立并插入到oldStartVnode.elm前面。（同上）
  - tag相同，调用patchVnode递归更新，并将newStartVnode.elm插入oldStartVnode.elm之前，置```oldCh[idxInOld] = undefined```
6. 在以上循环结束后，进行修正。若oldStartIdx > oldEndIdx，表示旧队列先结束，调用addVnodes插入newCh中剩余的元素。若新队列先结束，则说明有元素被删除，调用removeVnodes进行删除。

##### addVnodes<a name="addVnodes">
```
function addVnodes (parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
  for (; startIdx <= endIdx; ++startIdx) {
    nodeOps.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before)
  }
}
```


##### sameVnode<a name="sameVnode">
```
return (
  vnode1.key === vnode2.key &&
  vnode1.tag === vnode2.tag &&
  vnode1.isComment === vnode2.isComment &&
  !vnode1.data === !vnode2.data
)
```
若这些相同，则可判断其为相同的vnode，但数据可能不一样，可以运用patchVnode处理。

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
4. 不可修补： 调用registerRef



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
