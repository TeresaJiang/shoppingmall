# 商城系统开发shoppingmall

**技术栈和主要框架**
📦 Vue 全家桶：Vue + Vuex + Vue-router + Webpack
📡 Axios + Node.js
📌 MongoDB

项目实现了一个简易的商城系统，采用前后端分离的开发方式，Node.js提供后台接口，MongoDB做数据库。

通过Vue-router实现从商品列表页面到购物车页面以及地址等页面间跳转，项目的购物车数量在每个页面都需要使用，因此使用Vuex来集中管理。

前端所有的请求均通过Axios来实现数据接收和页面渲染。

整个商城后台通过Node.js进行实现，通过Express框架实现后端的REST接口，并以json的形式进行输出。

MongoDB中存储了goods列表和users列表，goods列表包括了商品名称，价格，Id，图片等信息，users列表包括了用户Id，用户登录名，用户登录密码，订单列表，购物车记录以及地址信息列表。

努力学习Koa2中，等待项目优化升级ing...(奈何科研在身)
