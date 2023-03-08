import { createElementVNode, createTextVNode } from "./vdom/index";
import Watcher from "./observe/watcher";
function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  // 标签节点
  if (typeof tag === "string") {
    // 根据vnode创建原生元素并将vnode和真实元素关联起来
    vnode.el = document.createElement(tag);
    // 设置真实元素的属性
    patchProps(vnode.el, data);
    // 创建子元素
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    // 创建文本节点
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

function patchProps(el, props) {
  for (const prop in props) {
    if (prop === "style") {
      for (const styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    } else {
      el.setAttribute(prop, props[prop]);
    }
  }

  return el;
}

function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    const elm = oldVnode;
    const parentEle = elm.parentNode;
    let newEle = createElm(vnode);
    // 把新元素插入的原元素的兄弟节点之前，再删除原元素
    parentEle.insertBefore(newEle, elm.nextSibling);
    parentEle.removeChild(elm);
    return newEle;
  } else {
    // diff算法
  }
}
export function initLifeCicle(Vue) {
  // 执行render函数，返回虚拟dom
  Vue.prototype._render = function () {
    const vm = this;
    // 让with函数中this指向vm
    return vm.$options.render.call(vm);
  };
  // 将虚拟dom转换成真实dom
  Vue.prototype._update = function (vnode) {
    let vm = this;
    let el = vm.$el;

    // 根据虚拟dom创建真实dom，并替换$el
    vm.$el = patch(el, vnode);

    // console.log("数据更新xxx2:", vnode);
  };

  // _c(div): 表示要创建虚拟元素节点
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments);
  };

  // _v(text) 表示创建虚拟文本节点
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  // _s(a)， 表示a是一个要序列化的差值
  Vue.prototype._s = function (value) {
    return JSON.stringify(value);
  };
}

// 挂载组件
export function mountComponent(vm, el) {
  vm.$el = el;
  // 1.调用render函数产生虚拟dom
  const updateComponent = function () {
    vm._update(vm._render());
  };
  // 初始渲染：
  new Watcher(vm, updateComponent, true);
  // 2.根据虚拟dom创建dom
  // 3.vm.$el = 真实dom
}
