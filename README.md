## 这是一个webpack单页或者多页配置项目实例
> 项目主要是想做一个以webpack为基础的项目启动脚手架 <br>
  这个项目是基于 [vue-cli](https://github.com/vuejs/vue-cli) 和 [webpack-MultiPage-static](https://github.com/vhtml/webpack-MultiPage-static) 项目修改而来的，__在此特么感谢vue-cli 和 webpack-MultiPage-static__ 两个项目的作者<br><br>
 这个项目主要适合对webpack有一定基础的同学，还没了解过webpack的同学，请先到[webpack官网](https://webpack.github.io/docs/)或者[webpack概述· webpack 中文文档(2.2) - Web前端开发](http://www.css88.com/doc/webpack2/)了解，此处不做webpack基础分享.

###### 项目说明
> 这里主要在vue-cli 的webpack配置基础上借鉴 webpack-MultiPage-static项目的多入口配置，同时解决vue-cli 没有多入口的问题，也解决webpack-MultiPage-static项目本地调试不能通过ip访问的问题。


```
  # 确定电脑有npm 如果没有npm，请移步 ☞ http://nodejs.cn/ 安装

  # 请安装cnpm  https://npm.taobao.org/
  npm install -g cnpm --registry=https://registry.npm.taobao.org
  (注: 为何一定要安装cnpm, 因为本项目是用到node-sass模块, 而npm在install node-sass的时候很容易出错,所以建议是用cnpm 安装本项目需要的包)

  # 下载相关包
  cnpm install

  # 启动服务
  npm start

  # 打包项目
  npm run build
```

```
  文档持续更新，敬请期待.
  前端分支
```
