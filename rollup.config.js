// rollup专门用于打包采用es modules模块化规范的js文件
import babel from "rollup-plugin-babel";
export default {
  input: "./src/index.js", //打包入口文件
  output: {
    file: "./dist/vue.js", //打包出口文件
    name: "Vue", //打包以后注入到全局的全局变量名
    format: "umd", //打包文件格式es modules,iife,umd,amd,commonjs，umd兼容（commonjs+iife）,
    sourcemap: true, //可以调试源码
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
  ],
};
