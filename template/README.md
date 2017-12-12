# 分期商城前后端分离构建系统
> mstore-build

### git仓库地址：http://git.ppdaicorp.com/zoujie/mstore-build.git

## Build Setup

``` bash
# 第一步安装依赖
npm install

# 第二步启动本地服务器，默认端口为8080
npm run dev

# 第三步页面开发完毕之后执行构建，构建后的文件会放在dist目录下
npm run build
```
## 特别注意
> config目录下的index.js中的htmlRoot为页面产出路径，为后端仓库的视图目录

## 本地数据接口联调
本地数据统一以JSON格式放在项目根目录的data文件夹中，二级文件夹对应每个页面，比如我们要进行本地数据联调，可以按照以下步骤：
> 在data文件下新建一个对应页面的文件夹，再在新建的文件夹中新建一个json文件，比如：/data/index/getBanner.json
> 启动本地服务 npm run dev
> axios请求本地接口 比如：/data/index/getBanner.json

## 远程数据调试
远程数据调试主要通过配置proproxyTable来进行代理转发，具体实现可直接看config目录下的index.js

## EXPRESS路由转发，实现本地与线上无差别访问
> 目前是在dev-server.js中直接配置，以后可以剥离出来

## 接口请求转发
> 将线上的接口地址直接转发为本地的数据，方便调试