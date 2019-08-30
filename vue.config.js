const path = require('path')
// const { SkeletonPlugin } = require('page-skeleton-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

// const PrerenderSPAPlugin = require('prerender-spa-plugin')
// 合拍服务配置
// location ^~ /meet/ {
//     alias /data0/wwwroot/HEPAI-H5/meet-website-online/;
// }
module.exports = {
    publicPath: './',
    // assetsDir: 'meet',
    outputDir: process.env.NODE_ENV == 'development' ? 'devdist' : 'dist',
    css: { //向所有 Sass 样式传入共享的全局变量 一次配置全局使用，这个scss每个文件都需要
        loaderOptions: {
            sass: {
                data: `@import "~@/style/common";`,
            }
        }
    },
    lintOnSave: false, //关闭eslint
    productionSourceMap: false, // 如果不需要生产的源映射，将其设置为false可以加速生产构建。
    // devServer: { //配置服务器
    //     port:8086,
    //     open:true,
    //     https:false,
    //     overlay: {
    //         warnings: true,
    //         errors: true
    //     }
    // },
    configureWebpack: { //覆盖webpack默认配置
        resolve: {   // 配置解析别名
            alias: {
                '@': path.resolve(__dirname, './src'),
                // '@h':path.resolve(__dirname, './src/assets/hotcss'),
                // '@s':path.resolve(__dirname, './src/assets/style'),
                // '@i':path.resolve(__dirname, './src/assets/images'),
            }
        },
        plugins: [
            // new SkeletonPlugin({
            //     pathname: path.resolve(__dirname, './shell'), // 用来存储 shell 文件的地址
            //     staticDir: path.resolve(__dirname, './dist'), // 最好和 `output.path` 相同
            //     routes: ['/'], // 将需要生成骨架屏的路由添加到数组中
            //     excludes: ['.van-nav-bar', '.van-tabbar']  // 需要忽略的css选择器
            // }),
            // new PrerenderSPAPlugin({
            //     // Required - The path to the webpack-outputted app to prerender.
            //     staticDir: path.join(__dirname, 'dist'),
            //     // Required - Routes to render.
            //     // routes: [ '/', '/product', '/contact' ],
            //     routes: ['/', '/registration', '/success', '/instruction'],
            // })
        ]
    },
    // chainWebpack: (config) => {   // 解决vue-cli3脚手架创建的项目压缩html 干掉<!-- shell -->导致骨架屏不生效
    //     if (process.env.NODE_ENV !== 'development') {
    //         config.plugin('html').tap(opts => {
    //             opts[0].minify.removeComments = false
    //             return opts
    //         })
    //     }

    // }
}