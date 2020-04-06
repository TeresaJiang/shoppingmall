import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

Vue.use(Vuex);
Vue.use(infiniteScroll);
Vue.use(VueLazyLoad,{
    Loading:"/static/loading-svg/loading-balls.svg",//懒加载的默认图片
    try:3
})
Vue.config.productionTip = false;
Vue.filter("currency",currency);//定义全局过滤器


const store=new Vuex.Store({
    state:{
        nickName:'',
        cartCount:0
    },
    mutations:{
        updateUserInfo(state,nickName){
            state.nickName=nickName;
        },
        updateCartCount(state,cartCount){
            state.cartCount+=cartCount;
        },
        initCartCount(state,cartCount){
            state.cartCount=cartCount;
        }
    }
});

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});
