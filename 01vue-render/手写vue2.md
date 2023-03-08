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
# 6. 使用观察者模式，收集属性的变化，
- 一个属性有一个dep收集者
- 每个组件有一个watcher
- dep用来收集依赖watcher
当前watcher是哪个实例