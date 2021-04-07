module.exports = {
  presets: [
    '@vue/app',
    [
      "@babel/preset-env"
      // {
      //   "targets": {
      //     "chrome": "70",
      //     "ie": "11"
      //   },
      //   "corejs": { "version": 3, "proposals": true },
      //   "useBuiltIns": "usage"
      // }
    ]
  ],
  plugins:[
    [
      "component",
      {
        "libraryName":"southgisui",
        styleLibrary:{
          'base':false,
          "styleLibraryName": "sgui-theme"
        },
        'style':false
      }
    ],
    [
      "@babel/plugin-transform-runtime" 
      // {
      //   "absoluteRuntime": false,
      //   "corejs": 3,
      //   "helpers": true,
      //   "regenerator": true,
      //   "useESModules": false,
      //   "version": "7.0.0-beta.0"
      // }
    ],
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
}


