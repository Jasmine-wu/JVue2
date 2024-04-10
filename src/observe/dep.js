// 用于收集watcher

let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    // 让watcher关联dep
    Dep.target.addDep(this);
    // Dep.target && this.subs.push(Dep.target);
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }
  // 通知wather更新
  notify() {
    this.subs.forEach((watcher) => {
      watcher.update();
    });
  }
}

//用于关联当前watcher
Dep.target = null;
export default Dep;
