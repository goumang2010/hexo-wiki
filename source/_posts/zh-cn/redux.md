
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
1. 将subscribe函数引用存储于outerSubscribe
2. 返回对象，包括subscribe方法，[$$observable]方法，返回自身

### subscribe
参数：`observer`
一个必须含有next方法的对象
1. observer不是对象，则提示observer应该是个对象。
2. 定义并调用observeState，该函数将当前state传入observer.next
3. 将observeState作为listener，传入outerSubscribe，并作为unsubscribe返回。