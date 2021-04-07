module.exports = {
  root: true,
  env: {
    node: true
  },
  globals:{
    'axios':true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "no-console": "off", //禁止使用console
    "no-const-assign": 2, //禁止修改const声明的变量
    "no-multi-spaces": 1, //不能用多余的空格
    "no-dupe-keys": 2, //在创建对象字面量时不允许键重复 {a:1,a:1}
    "no-dupe-args": 2, //函数参数不能重复
    "no-duplicate-case": 2, //switch中的case标签不能重复
    "no-empty": 2, //块语句中的内容不能为空
    "no-empty-character-class": 2, //正则表达式中的[]内容不能为空
    "no-extra-parens": 2, //禁止非必要的括号
    "no-extra-semi": 2, //禁止多余的冒号
    "no-func-assign": 2, //禁止重复的函数声明
    "no-irregular-whitespace": 2, //不能有不规则的空格
    "no-mixed-spaces-and-tabs": [
      2,
      false
    ], //禁止混用tab和空格
    "linebreak-style": [
      0,
      "windows"
    ],//换行风格
    // "quotes": [1, "single"], //引号类型 `` "" ''
    "no-multi-str": 2, //字符串不能用\换行
    "no-redeclare": 2, //禁止重复声明变量
    "no-undef": 1, //不能有未定义的变量
    "no-undef-init": 2, //变量初始化时不能直接给它赋值为undefined
    "no-unreachable": 2, //不能有无法执行的代码
    "no-unused-vars": [
      2,
      {
        "vars": "all",
        "args": "after-used"
      }
    ],//不能有声明后未被使用的变量或参数
    "no-useless-call": 2, //禁止不必要的call和apply
    "no-var": 0, //禁用var，用let和const代替
    "no-with": 2, //禁用with
    "array-bracket-spacing": [
      2,
      "never"
    ], //是否允许非空数组里面有多余的空格
    "block-scoped-var": 0, //块语句中使用var
    "comma-dangle": [
      2,
      "never"
    ],//对象字面量项尾不能有逗号
    "dot-notation": [
      0,
      {
        "allowKeywords": true
      }
    ],//避免不必要的方括号
    "indent": [
      2,
      2
    ],//缩进风格
    "eol-last":2
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
