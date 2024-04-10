import { observe } from "./observe/index";
export function initState(vm) {
  let opt = vm.$options;

  if (opt.data) {
    initData(vm);
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key];
    },
    // fix bug: 通过vm.a给属性设置新值，数据没有更新的问题
    set(newValue) {
      vm[target][key] = newValue;
    },
  });
}

function initData(vm) {
  let data = vm.$options.data;
  vm._data = data;
  // vue2 Vue实例可以是对象也可以是函数，组件实例必须是函数
  // vue3 Vue实例必须是函数
  data = typeof data === "function" ? data.call(vm) : data;

  observe(data);

  // 将vm._data代理到vm
  for (let key in data) {
    proxy(vm, "_data", key);
  }
}
