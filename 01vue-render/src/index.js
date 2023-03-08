import { initMixin } from "./init";
import { initLifeCicle } from "./lifeCicle";
import { nextTick } from "./observe/watcher";

function Vue(options) {
  this._init(options);
}
Vue.prototype.$nextTick = nextTick;

initMixin(Vue);
initLifeCicle(Vue);

export default Vue;
