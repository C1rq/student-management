<template>
 <div>
 <app-header></app-header> 
 <app-navbar></app-navbar> 
 <app-main></app-main> 

 </div>
</template>

<script>
import AppHeader from './Appheader';
import AppNavbar from './AppNavbar';
import AppMain from './Appmain';
export default {
 data () {
 return {
 }
 },

 components: {
        AppHeader,
         AppNavbar,
         AppMain
 },

 methods: {}
}
</script>

<style scoped>
    .header{
        color: aliceblue;
        position: absolute;
        line-height: 51px;
        padding: 0;
        top: 0;
        left: 0;
        right: 0;
        background-color: #2d3c4d;
    }
    .navbar{
        position: absolute;
        width: 230px;
        top: 50px;
        left: 0;
        bottom: 0;
        overflow-y: auto;
        background-color: #545c65;
    }
    .main{
        position: absolute;
        top: 50px;
        left: 230px;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        padding: 10px;
    }
</style>