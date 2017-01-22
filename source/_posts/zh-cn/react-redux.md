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


# connect
## connect
### createConnect


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


## wrapMapToPropsConstant
