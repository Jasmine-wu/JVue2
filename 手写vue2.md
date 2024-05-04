# 1. 搭建rollup项目环境

# 2. Vue响应式原理实现
## 2.1.data对象属性劫持
- 1. 如果你新设置的值是对象。
- 2. 如果你的data属性值是对象。
- 3. 通过vm.属性值直接获取。
## 2.2.实现对数组的劫持
- 1. 劫持数组方法，通过劫持7个能改变原数组的数组方法,concat/slice不会改变原数组=》函数劫持
- 2. 劫持数组方法以后，对通过数组方法新增的数组成员也进行响应式处理
- 3. 数组成员里有对象，则也需要劫持
- 4. 解决死循环问题,,使用Object.defineProperty 定义对象属性是不可枚举
# 3. 组件渲染和更新的流程
## 3.1 初次渲染：
### 3.1.1 组件实例初始化。-> 触发beforeCreated生命周期函数。
### 3.1.2 data初始化. -> 触发Created生命周期函数.
### 3.1.1 模版解析生成_render()函数。-> 触发beforeMounted
即调用compileToFuction方法：解析模版构建抽象语法树，根据抽象语法树生成转换成渲染函数render()。
- 1. 解析模版常用方案：
​	- 1. 方案一：模版引擎解析模版 - > 每次数据变化，都需要对整个模版进行正则替换->性能差 vue1.0
​	- 2. 方案二：采用虚拟dom, 数据变化后比较虚拟dom，只更新变化的地方

 Vue 运行时版本和完成版的区别，运行时版本是不包含模版编译的，即没有compileToFunction函数，compileToFunction将模版转换成了render函数，render函数返回结果就是虚拟dom。使用vue-cli创建的项目用的就是完全版。
#### 3.1.1.1 解析模版，构建抽象语法树
#### 3.1.1.2 根据抽象语法树构造代码code
#### 3.1.1.3 with+new Function替换虚拟代码里的变量，生成render函数。
```js
let render = new Function(`with(this){return ${code}}`)
```
### 3.1.2 执行渲染逻辑 -> 触发Mounted函数
调用render函数生成虚拟dom，并根据虚拟dom创建真实dom，并将真实dom挂载到$el上。
#### 3.1.2.1 执行render方法，返回虚拟dom。
- vm._render();
  ```js
   // h函数也就是createElement函数。
  Vue.component('my-component', {
  render(h) {
    return h('div', { attrs: { id: 'app' } }, [
      h('h1', 'Hello, Vue!'),
      h('p', 'This is a paragraph.')
    ]);
  }
});
  ```
#### 3.1.2.2 根据虚拟dom创建真实dom,并将真实dom挂载到$el上。
- 渲染逻辑：vm.__update(vm._render())。根据模版生成虚拟dom再替换成真实dom。
- vm.$el = 新创建的真实dom。

如果删除自身？
- 获取el的父节点
- 根据vnode创建真实dom，并将vnode和真实dom关联起来
- 通过父节点，insertBeforce将真实dom，插入的el元素的兄弟节点前面
- 通过父节点，删除el

## 3.2. 非首次渲染：即当数据发生变化时，会自动更新视图。
- 当数据变化时，会重新执行渲染逻辑。即执行render函数创建虚拟dom，再根据虚拟dom创建真实dom。
- 但它跟初次渲染不同的地方在于他会对比新旧虚拟dom，找到差异，然后根据差异只创建这几个变化的真实dom。
- 另外他还做了数据更新批处理，他会缓存你的数据更新操作放到数字，然后跌
- 具体如何做？
- 1. 每个组件有一个watcher。wacher里封装的是渲染逻辑。
- 2. 给每个属性添加一个收集者dep，dep用来收集属性依赖watcher。
- 3. 当属性变化时，当前wacher会被添加到当前属性对应的dep中。
- 4. 一旦数据变化触发set方法，则会通知dep里的依赖watcher执行渲染逻辑。
- 5. 而渲染逻辑里做的事情就是，执行渲染函数，生成一个虚拟dom树。通过diff算法，对比新旧的dom树，找到差异，根据差异创建真实dom。
- 6. 另外Vue还做了数据更新批处理，即缓存watcher，放到缓存数组里。使用nextTick函数将watcher数组放到它的回调函数中依次执行。
。nextTick实现原理它会开启一个异步任务，并将回调函数放到异步任务中执行，利用js事件循环机制来延迟更新。
- 这样不管你组件内，修改了多少次属性，都只会刷新一次视图。
- 7. 最后再更新视图，将创建真实dom替换到页面上。

关键点：如何watcher和dep互相关联起来呢？
- 在watcher里的渲染逻辑之前，将Dep.target = this;,记录当前watcher， 在当前渲染逻辑执行完之后Dep.target =null，置空
- 在属性被使用时候（get），收集依赖时,dep.depend()
  - depend(): 调用Dep.target.addDep(this), 在watcher里,放dep放到deps数组中，并调用dep里的addSubs将watcher放到到dep的subs数组中


# 4. $nextTick实现
将nextTick里的回调函数放到事件循环队列里，即开启一个异步任务（Promise=> MutationObserver->setImediate->setTimeout异步任务语法降级出炉-为了兼容IE），在里面依次执行回调函数。

