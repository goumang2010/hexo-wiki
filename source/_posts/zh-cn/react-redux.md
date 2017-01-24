---
title: react-redux
excerpt: react-redux
categories: 
- FE
---

# components
## Provider
导出Provider组件类

1. 重写构造函数，将props.store赋予实例属性this.store
2. 重写getChildContext，返回`{ store: this.store, storeSubscription: null }`
3. 重写render，返回 children 中仅有的子级。否则抛出异常。

## connectAdvanced
传入selectorFactory和options，返回connect的高阶组件。

1. `const subscriptionKey = storeKey + 'Subscription'` storeKey为options中的属性
2. `const version = hotReloadingVersion++` hotReloadingVersion为模块中的变量
3. 定义contextTypes和childContextTypes，进行类型检查。
4. 传入WrappedComponent，返回wrapWithConnect函数，该函数即是构造connect组件的高阶组件。

### wrapWithConnect
参数：WrappedComponent

1. 构建selectorFactory的option
2. 构建Connect组件：
    - `this.version = version`
    - `this.state = {}`
    - `this.store = this.props[storeKey] || this.context[storeKey]` context由最上级的provider组件提供
    - `this.parentSub = props[subscriptionKey] || context[subscriptionKey]`
    - `this.setWrappedInstance = this.setWrappedInstance.bind(this)` 确保setWrappedInstance的this绑定当前实例，从而wrappedInstance可以被正确设置
    - `this.getState = this.store.getState.bind(this.store);` 确保getState被正确的绑定在store上
    - 执行initSelector和initSubscription
    - 设置Connect的静态属性
        ``` Connect.WrappedComponent = WrappedComponent
            Connect.displayName = displayName
            Connect.childContextTypes = childContextTypes
            Connect.contextTypes = contextTypes
            Connect.propTypes = contextTypes
        ```
3. process.env.NODE_ENV不为production，则处理热更新.即定义componentWillUpdate方法,如果version与实例this.version不同，则执行initSelector,如果订阅者this.subscription存在,执行this.subscription.tryUnsubscribe(),然后重新订阅this.initSubscription(),shouldHandleStateChanges为true，执行订阅者的订阅this.subscription.trySubscribe()，从而让父级的订阅器收集到当前container的onStateChange

4. `return hoistStatics(Connect, WrappedComponent)` 将WrappedComponent中的非react静态属性复制给Connect, 并返回Connect组件

#### setWrappedInstance
传入引用ref
`this.wrappedInstance = ref`

#### initSelector
1. 构建selector： `const { dispatch } = this.store;const { getState } = this;const sourceSelector = selectorFactory(dispatch, selectorFactoryOptions)`
2. 将selector包装成对象，从而检查run后的结果
    - `shouldComponentUpdate: true`
    - `props: sourceSelector(getState(), this.props)` 初始props
    - run方法，传入props，通过sourceSelector计算出nextProps，若出错则记录错误，并置shouldComponentUpdate为true，否则，若上次执行有错误，或是nextProps已与上次props不同，则`selector.props = nextProps` ,并清空错误，shouldComponentUpdate置true

#### initSubscription
shouldHandleStateChanges（connectAdvanced的参数options中的属性，指示HOC是否应监听store变化，默认为true）为true时方执行。
1. `const subscription = this.subscription = new Subscription(this.store, this.parentSub)`  ,创建监听实例。
2. 建立subscription实例的onStateChange属性，并绑定当前connect组件的this。

##### onStateChange
1. this.selector.run(this.props)，传入当前props，根据state设置新的props。
2. 如果selector.shouldComponentUpdate为false，即表示渲染完成，直接执行subscription.notifyNestedSubs，将收集的子级lisener（一般是子级的onStateChange）执行（子级的onStateChange会递归执行所有后代的onStateChange）
3. 如果selector.shouldComponentUpdate为true，则定义组件componentDidUpdate，在渲染完毕后执行subscription.notifyNestedSubs,然后清除componentDidUpdate
4. 通过react组件的setState刷新UI

#### addExtraProps
1. `if (!withRef && !renderCountProp) return props` 若既不需要使用getWrappedInstance暴露WrappedComponent，或是renderCountProp也是默认值，直接返回传入的props
2. withRef为true，浅复制props，将props的ref属性设为this.setWrappedInstance
3. renderCountProp存在，props的renderCountProp属性置为this.renderCount++（初始为0）

#### render
1. 置selector.shouldComponentUpdate为false
2. 若selector.error存在，抛出错误
3. `return createElement(WrappedComponent, this.addExtraProps(selector.props))`
注意是使用的createElement的一种重载。



# utils
## Subscription.js
### createListenerCollection
建立listener集合

1. 设置current和next两个数组
2. 返回对象，该对象属性包括：

#### clear
清空next和current

#### notify
将next赋予current，并执行其中每个成员。

#### subscribe
传入listener

1. 设置闭包flag isSubscribed为true
2. 如果current和next指向的对象相同，则复制current对象并赋予next，并在next中加入传进来的listener，
3. 返回unsubscribe函数。isSubscribed为false或current为null直接返回。若否，置isSubscribed为false，next和current指向不同，并把listener从next中移除。



### Subscription类
#### constructor
传入store, parentSub，并置为实例属性。`this.unsubscribe = null;this.listeners = nullListeners`  nullListeners为`{ notify() {} }`
#### addNestedSub
传入listener

1. 执行trySubscribe，确保this.unsubscribe和this.listeners存在。
2. `return this.listeners.subscribe(listener)` 将listener加入listeners集合中

#### notifyNestedSubs
`this.listeners.notify()` 将收集的lisenter统统执行。

#### isSubscribed
`return Boolean(this.unsubscribe)`

#### trySubscribe
unsubscribe不存在，若parentSub存在 ，将unsubscribe置为`this.parentSub.addNestedSub(this.onStateChange)`,注意onStateChange是在connectAdvanced.initSubscription()设置。若parentSub不存在，置为`this.store.subscribe(this.onStateChange)` 这样，子级的onStateChange就可以被父级的订阅器subscription收集，当父级订阅器notifyNestedSubs时，就会执行子级的onStateChange

调用createListenerCollection创建监听器集合作为实例属性listeners

#### tryUnsubscribe

```if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
      this.listeners.clear()
      this.listeners = nullListeners
    }
```


# connect
## connect
### createConnect
传入
```
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory
```
构建connect函数


## selectorFactory
返回selector工厂函数，参数：

```
 {
  initMapStateToProps,
  initMapDispatchToProps,
  initMergeProps,
  ...options
}
```

1. 将对象中的各函数都传入dispatch、options，保存为mapStateToProps，mapDispatchToProps,mergeProps
2. 通过options.pure选择， pureFinalPropsSelectorFactory还是impureFinalPropsSelectorFactory作为selectorFactory。pure为true，返回的selector函数将记住结果，并允许connectAdvanced的shouldComponentUpdate返回false，否则永远返回新的对象，并且shouldComponentUpdate总是返回true。
3. selectorFactory传入mapStateToProps，mapDispatchToProps，mergeProps，dispatch，options，
构建出选择函数(nextState: any, nextOwnProps: any) => any

### impureFinalPropsSelectorFactory
1. 接收mapStateToProps，mapDispatchToProps，mergeProps，dispatch。
2. 构建并返回不纯净的属性选择器:
    ```
    (state, ownProps) => mergeProps(
        mapStateToProps(state, ownProps),
        mapDispatchToProps(dispatch, ownProps),
        ownProps
    )
    ```

### pureFinalPropsSelectorFactory
1. 接收参数
    ```
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    dispatch,
    { areStatesEqual, areOwnPropsEqual, areStatePropsEqual ```
2. 设置hasRunAtLeastOnce作为指示是否初始化的flag

#### handleFirstCall
1. 传入firstState, firstOwnProps，赋予state，ownProps
2. 执行mapStateToProps，mapDispatchToProps，mergeProps。
3. 设置hasRunAtLeastOnce为true，返回mergeProps执行的结果（合并后的props）

#### handleSubsequentCalls
1. 传入nextState, nextOwnProps
2. 调用areOwnPropsEqual，areStatesEqual比较state，nextState和ownProps，nextOwnProps，从而设置propsChanged，stateChanged
3. 将nextState, nextOwnProps赋予state，ownProps。
4. 如果propsChanged和stateChanged都为true，表示都改变了，返回handleNewPropsAndNewState()。
5. 仅propsChanged为true，返回handleNewProps()
6. 仅stateChanged为true，返回handleNewState()
7. 两者皆为false，表示状态和属性都没有变化，返回mergedProps（在上一次调用pureFinalPropsSelectorFactory时存储的mergedProps）

##### handleNewPropsAndNewState
1. 执行mapStateToProps
2. mapDispatchToProps.dependsOnOwnProps为true，则执行mapDispatchToProps
3. 执行mergeProps并返回结果

##### handleNewProps
1. mapStateToProps.dependsOnOwnProps为true，则执行mapStateToProps
2. mapDispatchToProps.dependsOnOwnProps为true，则执行mapDispatchToProps
3. 执行mergeProps并返回结果

##### handleNewState
1. 执行mapStateToProps，结果存为nextStateProps
2. 通过areStatePropsEqual比较nextStateProps和stateProps，并设置statePropsChanged
3. `stateProps = nextStateProps`
4. statePropsChanged为true，则执行mergeProps，结果赋予mergedProps（有些state变化并未引起state改变）
5. 返回mergedProps


## wrapMapToProps
### wrapMapToPropsConstant

### getDependsOnOwnProps


### wrapMapToPropsFunc
参数：mapToProps, methodName
返回代理选择器函数initProxySelector 
```
(dispatch: any, {displayName}: {
    displayName: any;
}) => (stateOrDispatch: any, ownProps: any) => any
```
1. 定义proxy
    ``` 
    return proxy.dependsOnOwnProps
        ? proxy.mapToProps(stateOrDispatch, ownProps)
        : proxy.mapToProps(stateOrDispatch)
    ```
2. proxy.dependsOnOwnProps通过调用getDependsOnOwnProps生成。
3. 定义detectFactoryAndVerify函数作为proxy.mapToProps，在proxy执行时调用
4. 返回proxy。proxy执行后即是返回计算后的props，无论传入mapToProps是多少阶的高阶函数。

#### detectFactoryAndVerify
1. `proxy.mapToProps = mapToProps`
2. `let props = proxy(stateOrDispatch, ownProps)` 此处即是执行了mapToProps(stateOrDispatch, ownProps)或mapToProps(stateOrDispatch)
3. 如果结果props仍为函数,将props赋予proxy.mapToProps，递归执行proxy(stateOrDispatch, ownProps),在此步后, props必然已不是函数
4. 非生产环境下，通过verifyPlainObject验证props
5. 返回props
