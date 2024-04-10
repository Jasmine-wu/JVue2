import { parseHTML } from "./parse";
// 将模版编译成render函数
export function compileToFunction(template) {
  //   console.log("template is: ", template);

  // 1.将模版转换成抽象语法树
  let ast = parseHTML(template);
  // console.log("ast :", ast);

  // 2.根据抽象语法书生成代码
  let code = codegen(ast);
  //   console.log("code:", code);

  // 3.根据代码生成render函数
  // 所有模版引擎的实现原理: with + new Function
  code = `with(this){ return ${code}}`;
  const render = new Function(code);
  // console.log(render);

  return render;
}

function genProps(attrs) {
  let str = ""; // {name,value}
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === "style") {
      // color:red;background:red => {color:'red'}
      let obj = {};
      attr.value.split(";").forEach((item) => {
        // qs 库
        let [key, value] = item.split(":");
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`; // a:b,c:d,
  }
  return `{${str.slice(0, -1)}}`;
}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量
function gen(node) {
  if (node.type === 1) {
    return codegen(node);
  } else {
    // 文本
    let text = node.text;
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      //_v( _s(name)+'hello' + _s(name))
      let tokens = [];
      let match;
      defaultTagRE.lastIndex = 0;
      let lastIndex = 0;
      // split
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index; // 匹配的位置  {{name}} hello  {{name}} hello
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${tokens.join("+")})`;
    }
  }
}
function genChildren(children) {
  return children.map((child) => gen(child)).join(",");
}

function codegen(ast) {
  let children = genChildren(ast.children);
  // console.log(children);

  let code = `_c('${ast.tag}',${
    ast.attrs.length > 0 ? genProps(ast.attrs) : "null"
  }${ast.children.length ? `,${children}` : ""})`;

  // console.log(code);
  return code;
}
