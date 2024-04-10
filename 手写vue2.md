# 1. 搭建rollup项目环境

# 2. Vue响应式原理实现
## 1.data对象属性劫持

   1. 如果你新设置的值是对象
   2. 如果你的data属性值是对象
   3. 通过vm.属性值直接获取
## 2. 实现对数组的劫持

### 1. 劫持数组方法，通过劫持7个能改变原数组的数组方法,concat/slice不会改变原数组=》函数劫持
### 2. 劫持数组方法以后，对通过数组方法新增的数组成员也进行响应式处理
### 3. 数组成员里有对象，则也需要劫持
### 4. 解决死循环问题,,使用Object.defineProperty 定义对象属性是不可枚举
# 3. 模版解析，转换成抽象语法树

## 0. cmpileToFuction

## 1. 解析模版常用方案：

​	1. 方案一：模版引擎解析模版 - > 每次数据变化，都需要对整个模版进行正则替换->性能差 vue1.0

​	2. 方案二：采用虚拟dom, 数据变化后比较虚拟dom，只更新变化的地方

 Vue 运行时版本和完成版的区别，运行时版本是不包含模版编译的，即没有compileToFunction函数，compileToFunction将模版转换成了render函数，render函数返回结果就是虚拟dom。使用vue-cli创建的项目用的就是运行时版本，文件后缀名都是.vue并通过插件vue-loader 进行模版编译



具体实现：
### 1.使用正则+栈+树解析tempalte，构造抽象语法树


# 4. 根据抽象语法书，生成render函数
### _render()
### 1.根据抽象语法树构造代码code
### 2.with+new Function替换虚拟代码里的变量，生成render函数。

```js

let render = new Function(`with(this){return ${code}}`)
```



### render函数的执行结果就是虚拟dom. 注意，以后data数据变动了，就可以直调用render函数

# 6. 执行render方法，返回虚拟dom

###  vm._render()

# 5. 根据虚拟dom创建真实dom，并进行替换

## 5.1 初始渲染时，将根据vnode创建的真实dom直接替换掉vm.$el

### vm.__update(vm._render())

如果删除自身？

- 获取el的父节点
- 根据vnode创建真实dom，并将vnode和真实dom关联起来
- 通过父节点，insertBeforce将真实dom，插入的el元素的兄弟节点前面
- 通过父节点，删除el

vm.$el = 新创建的真实dom



## 5.2 diff时，只替换发生了更新的真实dom
# 6. 当数据变化时，自动更新视图 - 观察者模式



实现自动更新：

- 每个组件对应一个watcher。
  - 当组件（或根实例）初渲染时，new watcher(), 内部会记录下当前watcher，Dep.target = this, 并调用渲染逻辑，渲染完成再置空

	- 给每个属性添加一个dep收集者，只收集模版中使用了属性（get方法中）的依赖watcher
	- 在watcher封装渲染逻辑（vm.__update(vm._render())）
	- 一旦属性变化（set方法），通知对应的dep里存放的watcher更新（重新渲染）

关键点：如何watcher和dep互相关联起来呢？

- 在watcher里的渲染逻辑之前，将Dep.target = this;,记录当前watcher， 在当前渲染逻辑执行完之后Dep.target =null，置空

- 在属性被使用时候（get），收集依赖时,dep.depend()
  - depend(): 调用Dep.target.addDep(this), 在watcher里,放dep放到deps数组中，并调用dep里的addSubs将watcher放到到dep的subs数组中

# 优化：异步更新数据，实现数据更新批处理
前面的缺点： 每次数据变化(set)，都会重新更新视图（render）
优化：一个组件只有一个watcher，将组件内每次数据变化缓存起来，数据更新完毕，再调用一次watcher的渲染逻辑进行视图更新
效果：不管你组件内，修改了多少次属性，都只会刷新一次视图。

原理：每次数据更新发生时，用一个数组缓存watcher，开一个异步任务nextTick, 依次执行wathcer里的渲染逻辑

## $nextTick实现
将nextTick里的回调函数放到一个队列里，开一个异步任务（Promise=> MutationObserver->setImediate->setTimeout异步任务语法降级出炉-为了兼容IE），在里面依次执行回调函数

# mixin混入的实现
Vue实例options和用户mixin 混入的选项的合并，先执行mixin混入的再执行Vue实例的options