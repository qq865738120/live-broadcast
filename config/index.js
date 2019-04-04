'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

let env = 'dev'
try { window; window.location.origin.indexOf("soukong") > -1
                ? (env = "pro")
                : (env = "dev"); } catch (e) {}
let host;
try { window; host = window.location.origin; } catch (e) {}
const DEV_TEST = false // 如果需要开发环境下调试生产环境的问题请设为false

const devConfig = {
  environment: 'local', //本地环境配为local，线上环境配为online
  host: 'http://180.180.180.172', //本地环境，与本地计算机ip保持一致
  path: '/api',
  relHost: 'http://xmt.soukong.cn'
}

const proConfig = {
  environment: "online", //本地环境配为local，线上环境配为online
  host, //正式环境
  path: "",
  relHost: host //实际真实域名，该配置会影响对接老项目的url跳转
};

let app = devConfig
if(env === 'pro') {
  app = proConfig
}

module.exports = {
  app,
  DEV_TEST,
  dev: {
    // Paths
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    proxyTable: {
      // 配置代理
      "/api": {
        target: DEV_TEST ? "http://xmt.soukong.cn" : "http://fm.soukong.cn",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    },

    // Various Dev Server settings
    host: app.host.split("//")[1], // can be overwritten by process.env.HOST
    // host: '192.168.10.101',
    port: 80, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: "cheap-module-eval-source-map",

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, "../dist/index.html"),

    // Paths
    assetsRoot: path.resolve(__dirname, "../dist"),
    assetsSubDirectory: "static",
    assetsPublicPath: "./",
    proxyTable: {
      // 配置代理
      "/api": {
        target: "http://xmt.soukong.cn",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    },

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: "#source-map",

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
