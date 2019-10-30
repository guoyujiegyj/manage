// 项目开发阶段需要的 babel插件
const devBabel = []
if(process.env.NODE_ENV=== 'production'){
  devBabel.push('transform-undefined-to-void')
}
module.exports = {
  'presets': [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    // 打包时需要移除所有的console
    ...devBabel
  ]
  
}
