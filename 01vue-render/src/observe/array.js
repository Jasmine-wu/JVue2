// 1. 获取原生数组的原型
let oldArrayProto = Array.prototype;

// 2. 创建新的数组原型
export let newArrayProto = Object.create(oldArrayProto);

let methods = [
  // 找到所有的变异方法
  "push",
  "pop",
  "shift",
  "unshift",
  "reverse",
  "sort",
  "splice",
];

// 函数劫持：在新原型上添加同样的数组方法，并在方法内部调用原生数组的该方法
methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    // 1.劫持数组方法
    const result = oldArrayProto[method].call(this, ...args);
    console.log("array method:", method);

    let inserted;
    // 劫持数组方法以后，对通过数组方法新增的内容进行劫持
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        // splice方法从第三个参数开始就是新增的数据
        inserted = args.slice(2);
      default:
        break;
    }

    let observe = this.__obj__;

    // 2.将通过数组方法新增入内容也定义成响应式数据
    if (inserted) {
      observe.observeArray(inserted);
    }

    return result;
  };
});
