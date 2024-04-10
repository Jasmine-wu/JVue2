// 观察者模式，实现数据变化，自动且精准的更新视图
// 1.每个组件都有一个watcher实例
// 2.每个属性都有一个dep用来收集他的依赖watcher
// 3.一旦属性变化，找到这个属性的dep里存放的watcher，调用渲染逻辑进行视图更新

// 关键点：如何要dep和watcher关联起来呢？
import Dep from "./dep";
let id = 0;
class Watcher {
  constructor(vm, fn, options) {
    this.id = id++;
    this.isRenderFn = options; // 标识回调函数是否是渲染函数
    this.deps = [];
    this.getter = fn;
    this.depIds = new Set();
    // 1.初始渲染一次
    this.get();
  }
  // 调用回调函数
  get() {
    // 将dep和watcher关联起来
    Dep.target = this;
    this.getter();
    Dep.target = null;

    console.log("重新渲染完成");
  }
  addDep(dep) {
    // 去重
    let id = dep.id;
    if (!this.depIds.has(id)) {
      // 让watcher记住dep
      this.deps.push(dep);
      this.depIds.add(id);
      dep.addSub(this); //让dep记住watcher
    }
  }

  // 2.发生了数据更新，重新渲染
  update() {
    // 数据更新优化：异步更新数据，一个组件内等所有属性更新完毕，再调用一次渲染逻辑，更新视图，而不是set一次数据就更新一次视图
    // this.get();
    queueWatcher(this);
  }

  run() {
    // 执行渲染逻辑
    this.get();
  }
}

let queue = [];
let has = {};
let pedding = false;

function flushScheduleQueue() {
  // 注意：刷新的过程中可能也会有watcher加进来
  let flushQueue = queue.slice(0);
  queue = [];
  has = {};
  pedding = false;
  flushQueue.forEach((watcher) => watcher.run());
}
function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
    if (!pedding) {
      nextTick(flushScheduleQueue, 0);
    }
  }
}

// nextTick 没有直接使用某个api 而是采用优雅降级的方式
// 内部先采用的是promise （ie不兼容）  MutationObserver(h5的api)  可以考虑ie专享的 setImmediate  setTimeout

let timerFunc;
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks);
  };
} else if (MutationObserver) {
  let observer = new MutationObserver(flushCallbacks); // 这里传入的回调是异步执行的
  let textNode = document.createTextNode(1);
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    textNode.textContent = 2;
  };
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks);
  };
}

let callbacks = [];
let waiting = false;
function flushCallbacks() {
  let cbs = callbacks.slice(0);
  waiting = false;
  callbacks = [];
  cbs.forEach((cb) => cb()); // 按照顺序依次执行
}

export function nextTick(cb) {
  callbacks.push(cb); // 维护nextTick中的cakllback方法
  if (!waiting) {
    // timerFunc()
    // Promise.resolve().then(flushCallbacks)
    timerFunc(flushCallbacks);

    waiting = true;
  }
}

export default Watcher;
