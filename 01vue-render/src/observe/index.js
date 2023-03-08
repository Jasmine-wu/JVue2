import { newArrayProto } from "./array";
import Dep from "./dep";
class Observer {
  constructor(data) {
    // 将observer实例绑定到data的自定义属性__obj__上
    // data.__ob__ = this; // bug:不能直接赋值,会有死循环问题
    // 解决：定义data的__ob__是不可以枚举的
    Object.defineProperty(data, "__obj__", {
      value: this,
      enumerable: false, //将__ob__ 变成不可枚举 （循环的时候无法获取到）
    });

    // 依次对数据进行劫持
    if (Array.isArray(data)) {
      // 1.如果数组成员是通过数组方法修改的：vm.c.push("dddd");
      // 则劫持7个数组方法 -> 函数劫持
      // data.__proto__ = {
      //   push() {
      //     console.log("xxxx");
      //   },
      // }; // 这样写，会直接覆盖掉数组的原方法
      // 正确做法：保留数组的原方法同时添加新的东西
      data.__proto__ = newArrayProto;

      // 2.如果数组成员是通过这样修改 vm.c.five = "fiviviviiv";
      // 则劫持数组里的引用类型
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }

  observeArray(data) {
    data.forEach((item) => observe(item));
  }
}

export function defineReactive(target, key, value) {
  // 如果你的value值是对象
  observe(value);

  // 每个响应式数据都有一个dep,用来收集它的依赖watcher
  let dep = new Dep();

  Object.defineProperty(target, key, {
    get() {
      console.log(dep.target);
      if (Dep.target) {
        // 首次渲染时，对用到的属性收集依赖watcher
        dep.depend();
      }

      // console.log(`${key}属性值被获取了`);
      return value;
    },
    set(newValue) {
      // console.log(`${key}属性值被设置了：${newValue}`);

      if (newValue === value) return;
      // 如果你设置的值是对象，需要对这个对象也进行劫持
      observe(newValue);
      value = newValue;

      // 当属性发生变化时，通知更新
      dep.notify();
    },
  });
}
export function observe(data) {
  // 只对对象进行劫持
  if (typeof data !== "object" || data == null) {
    return;
  }

  // 判断data是否已经被劫持
  if (data.__obj__ instanceof Observer) {
    return data.__obj__;
  }

  return new Observer(data);
}
