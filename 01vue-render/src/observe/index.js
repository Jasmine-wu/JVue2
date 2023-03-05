class Observer {
  constructor(data) {
    // 依次对数据进行劫持
    this.walk(data);
  }

  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
}

export function defineReactive(target, key, value) {
  // 如果你的value值是对象
  observe(value);
  //
  Object.defineProperty(target, key, {
    get() {
      console.log(`${key}属性值被获取了`);
      return value;
    },
    set(newValue) {
      console.log(`${key}属性值被设置了：${newValue}`);

      if (newValue === value) return;
      // 如果你设置了一个对象值
      observe(newValue);
      value = newValue;
    },
  });
}
export function observe(data) {
  // 只对对象进行劫持
  if (typeof data !== "object" || data == null) {
    return;
  }
  return new Observer(data);
}
