---
title: redux
excerpt: redux
categories: 
- FE
---

# createStore
参数
```
reducer, preloadedState, enhancer
```

1. 若preloadedState为函数，并且enhancer未传入,将preloadedState赋予enhancer，preloadedState置空。
也就是两个参数时，第二个参数是enhancer。
2. 若传入的enhancer不是函数，则提示enhancer应该是函数。
3. enhancer不为空，enhancer(createStore)(reducer, preloadedState)，则是将本身传入enhancer，enhancer
的形式为next => (reducer, preloadedState) => store，这样实际将原生createStore置为最后工序。
4. reducer不是函数，提示reducer应该为函数。
5. 将reducer和preloadedState使用currentReducer，currentState保存。isDispatching
标识是否正在分发，默认为false。
6. 分发`{ type: ActionTypes.INIT }`的action
7. 返回对象：

```
{
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
```

## ensureCanMutateNextListeners
确保nextListeners可改变。若nextListeners和currentListeners是同一数组，使用slice复制
currentListeners并赋予nextListeners

## getState
返回currentState

## subscribe
参数： listener, listener将在每次dispatch时调用。
1. listener不是函数，提示listener应该是函数。
2. 建立isSubscribed为flag默认为true
3. 调用ensureCanMutateNextListeners，确保nextListeners和currentListeners
是不同数组。
4. 将listener加入nextListeners中。
5. 返回unsubscribe函数,改函数置isSubscribed为false，并将listener从nextListeners去除。

## dispatch
1. action不是plain object,提示actions必须为plain object, 需要使用中间件
才能使用异步action。
2. isDispatching为true，标识正在分发其他actions, 抛出错误，reducer现在不能进行分发。
3. 置isDispatching为true，并执行currentReducer(currentState, action),得到的结果赋予currentState，
并将isDispatching置回false
4. 将nextListeners置为currentListeners，并执行其中每个listener
5. 返回action

## replaceReducer
参数：nextReducer
1. 如果nextReducer不是函数, 提示nextReducer应该为函数。
2. nextReducer赋予currentReducer
3. 分发dispatch({ type: ActionTypes.INIT })

## observable
该函数作为[$$observable]的方法返回

1. 将subscribe函数引用存储于outerSubscribe
2. 返回对象，包括subscribe方法，[$$observable]方法，返回自身.
3. 调用方法：store[$$observable]().subscribe({next: (currentState) => {dosometing...}}) 从而实现根据state的监视。

### subscribe
参数：`observer`
一个必须含有next方法的对象
1. observer不是对象，则提示observer应该是个对象。
2. 定义并调用observeState，该函数将当前state传入observer.next
3. 将observeState作为listener，传入outerSubscribe，并作为unsubscribe返回。在这步中，由于outerSubscribe即是外层的subscribe函数，从而将
observeState加入到nextListeners中，在下次dispatch时将会被执行。

# combineReducers
传入reducers，导出combineReducers函数，合并reduces，返回一个reducer

1. `const reducerKeys = Object.keys(reducers)`
2. 遍历reducerKeys，筛选出合法的reducer，存入finalReducers。
3. `const finalReducerKeys = Object.keys(finalReducers)`
4. 使用[assertReducerSanit](#assertReducerSanity)校验finalReducers。
5. 返回新的combination reducer，首先抛出校验错误。 遍历finalReducers，
更新每个state[key]，合并为nextState并返回。

## assertReducerSanity
1. 遍历传入的reducers
2. const initialState = reducer(undefined, { type: ActionTypes.INIT })
3. 如果得到的初始状态initialState为undefined，则警告Reducer初始化返回undefined，如果不想给reducer设值，可以返回null而不是undefined
4. 将type为个随机值的action传入reducer，若返回的为undefined，则提示，若传入的action是个未知的action，
应该返回未更改的当前状态。


// TODO

# applyMiddleware
参数： `...middlewares`，每个中间件形式为`({ getState, dispatch }) => next => action`

1. 返回根据中间件包装createStore的函数。
2. 执行createStore，结果为store，取得原始`dispatch = store.dispatch`
3. 复制store中的getState，dispatch构成middlewareAPI
4. 将传入的每个中间件对middlewareAPI进行应用，从而都变为`next => action`
5. 使用compose进行串联， 最后的next传入原始的store.dispatch，从而实现了所有中间件对原始store.dispatch的包裹。
6. 使用包装后的dispatch代替原store.dispatch，并返回这个修饰后的store。

## compose
使用累加器不断包裹串联函数效果

`return funcs.reduce((a, b) => (...args) => a(b(...args)))`

# bindActionCreators
参数： `actionCreators, dispatch`

1. actionCreators为函数，直接调用bindActionCreator包装后返回新的函数。
2. actionCreators既不是函数，也不是对象，则发出警告。
3. actionCreators为对象，将其每个属性使用bindActionCreator包装，并重组成对象，返回。

## bindActionCreator
使用dispatch包装actionCreator，使其可以直接dispatch生成的action


