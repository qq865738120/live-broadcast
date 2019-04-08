# 微信H5直播项目

一个vue的spa项目

------

## 开发步骤

###### 1.开发环境搭建

如果没有node环境请先安装

[node]: https://nodejs.org/zh-cn/

###### 2.项目环境搭建

先将项目下载或克隆到本地然后在项目根目录下打开命令行一次运行如下命令

``` bash
# 安装依赖
npm install

# 在开发环境上运行项目，开发时使用此命令。默认是在开发环境下接入到测试环境，如果需要在开发环境上接入生产环境来调试生产环境的bug需要将项目中/config/index.js文件中的DEV_TEST变量设为false
npm run dev

# 构建并打包到使用此命令。如果需要发包到测试或生产环境，则使用此命令。打包后的文件会放到dist目录下，将dist目录下的所有文件上传到服务器即可。
npm run build

# 构建打包并查看捆绑分析器报告
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
