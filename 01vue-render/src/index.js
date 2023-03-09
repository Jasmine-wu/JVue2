import { initMixin } from "./init";
import { initLifeCicle } from "./lifecycle";
import { initGlobalAPI } from "./gloablAPI";
import { nextTick } from "./observe/watcher";

function Vue(options) {
  this._init(options);
}
Vue.prototype.$nextTick = nextTick;

initMixin(Vue);
initLifeCicle(Vue);
initGlobalAPI(Vue);

export default Vue;
