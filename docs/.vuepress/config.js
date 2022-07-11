module.exports = {
  title: "瞳，我的瞳🤤",
  description: "星瞳资源聚合站",
  head: [
    ['script', { src: 'https://cdn.staticfile.org/dom-to-image/2.6.0/dom-to-image.min.js' }],
    ['script', { src: 'https://cdn.staticfile.org/jsbarcode/3.11.5/barcodes/JsBarcode.code128.min.js' }],
  ],
  themeConfig: {
    repo: 'KyonLi/xingtong',
    repoLabel: '查看源码',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '帮助我们改善此页面！',
    lastUpdated: '上次更新',
    nextLinks: false,
    prevLinks: false,
    sidebarDepth: 0,
    sidebar: [
      '/',
      {
        title: '工具',
        collapsable: false,
        children: [
          '/card/'
        ]
      }
    ]
  },
  chainWebpack (config) {
    config.resolve.alias.set('core-js/library/fn', 'core-js/features');
  }
}
