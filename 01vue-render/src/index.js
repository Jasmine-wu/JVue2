import { initMixin } from "./init";
import { initLifeCicle } from "./lifeCicle";
function Vue(options) {
    this._init(options);

}

initMixin(Vue);
initLifeCicle(Vue)

export default Vue;
