<template>
 <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- $route.path 表示小标题可以跳转回小标题页面 此页面功能不实现 -->
        <el-breadcrumb-item :to="{ path: $route.path }" class="line">{{$route.meta.title}}</el-breadcrumb-item>
</el-breadcrumb>
</template>

<script>
export default {
 data () {
 return {
 }
 },

 components: {},

 methods: {}
}
</script>

<style scoped>
.el-breadcrumb{
    left: 0;
    height: 10px;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.2);
}
.line{
    border-left: 3px solid springgreen;
    padding-left:15px;
}
</style>