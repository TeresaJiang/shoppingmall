<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
          <div class="container">
            <div class="filter-nav">
              <span class="sortby">Sort by:</span>
              <a href="javascript:void(0)" class="default cur">Default</a>
              <a href="javascript:void(0)" class="price" @click="sortGoods()">Price <svg class="icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}"><use xmlns xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use></svg></a>
              <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
            </div>
            <div class="accessory-result">
              <!-- filter -->
              <div class="filter" id="filter" v-bind:class="{'filterby-show':filterBy}">
                <dl class="filter-price">
                  <dt>Price:</dt>
                  <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">All</a></dd>
                  <dd v-for="(price,index) in priceFilter" @click="setPriceFilter(index)">
                    <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked===index}">{{price.startPrice}} - {{price.endPrice}}</a>
                  </dd>
                </dl>
              </div>

              <!-- search result accessories list -->
              <div class="accessory-list-wrap">
                <div class="accessory-list col-4">
                  <ul>
                    <li v-for="item in goodsList">
                      <div class="pic">
                        <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                      </div>
                      <div class="main">
                        <div class="name">{{item.productName}}</div>
                        <div class="price">{{item.salePrice}}</div>
                        <div class="btn-area">
                          <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                    <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
            <p slot="message">
                请先登录，否则无法加入到购物车中！
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="mdShow=false">关闭</a>
            </div>
        </modal>
        <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
            <p slot="message">
                <svg class="icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>加入购物车成功</span>
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
                <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
            </div>
        </modal>
        <nav-footer></nav-footer>
    </div>
</template>
<style>
    
</style>
<script>
    import './../assets/css/base.css'
    import './../assets/css/product.css'
    import './../assets/css/login.css'
    import NavHeader from '@/components/NavHeader'
    import NavFooter from '@/components/NavFooter'
    import NavBread from '@/components/NavBread'
    import Modal from '@/components/Modal'
    import axios from 'axios'
    export default{
        data(){
            return{
                goodsList:[],
                sortFlag:true,
                page:1,
                pageSize:8,
                busy:true,
                loading:false,//是否显示loading
                mdShow:false,
                mdShowCart:false,
                priceFilter:[
                  {
                    startPrice:'0.00',
                    endPrice:'100.00'
                  },
                  {
                    startPrice:'100.00',
                    endPrice:'500.00'
                  },
                  {
                    startPrice:'500.00',
                    endPrice:'1000.00'
                  },
                  {
                    startPrice:'1000.00',
                    endPrice:'2000.00'
                  }
                ],
                priceChecked:'all',//默认选择all
                filterBy:false,//控制价格过滤的显示与隐藏
                overLayFlag:false//控制遮罩的显示与隐藏
            }
        },
        components:{
            NavHeader,
            NavFooter,
            NavBread,
            Modal
        },
        mounted:function(){
            this.getGoodsList();//初次加载
        },
        methods:{
            getGoodsList(flag){
                var param={
                    page:this.page,
                    pageSize:this.pageSize,
                    sort:this.sortFlag?1:-1,//1升序，-1降序
                    priceLevel:this.priceChecked
                }
                this.loading=true;
                axios.get("/goods/list",{params:param}).then((response)=>{
                    var res=response.data;
                    this.loading=false;//请求结束，loading不显示
                    if(res.status==="0"){//请求成功
                        if(flag){//需要拼接数据
                            this.goodsList=this.goodsList.concat(res.result.list);
                            if(res.result.count===0){//没有数据了，滚动失效
                                this.busy=true;
                            }else{
                                this.busy=false;//下次再滚动仍会发送请求
                            }
                        }else{//第一次请求不用拼接数据
                            this.goodsList=res.result.list;
                            this.busy=false;
                        }                        
                    }else{
                        this.goodsList=[];
                    }

                });
            },
            showFilterPop(){
                this.filterBy=true;
                this.overLayFlag=true;
            },
            closePop(){
                this.filterBy=false;
                this.overLayFlag=false;
            },
            sortGoods(){
                this.sortFlag = !this.sortFlag;
                this.page=1;
                this.getGoodsList();
            },
            setPriceFilter(index){
                this.priceChecked=index;
                this.closePop();
                this.page=1;
                this.getGoodsList();
            },
            loadMore(){ 
                this.busy=true;//true:滚动时方法禁用，false:滚动时加载loadMore方法
                setTimeout(()=>{
                    this.page++;
                    this.getGoodsList(true);//分页需要累加

                },500);

            },
            addCart(productId){
                axios.post("/goods/addCart",{
                    productId:productId
                }).then((response)=>{
                    let res=response.data;
                    console.log(res);
                    if(res.status=="0"){
                        this.mdShowCart=true;
                        this.$store.commit("updateCartCount",1);
                    }else{
                        this.mdShow=true;
                    }
                })
            },
            closeModal(){
                this.mdShow=false;
            }
        }
    }
</script>