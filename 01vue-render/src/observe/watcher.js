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

    console.log("渲染完成了");
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
    this.get();
  }
}

export default Watcher;
