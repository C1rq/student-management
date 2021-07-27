<template>
<div class="main">
    <app-link v-show="$route.path != '/home'"></app-link>
    <router-view></router-view>
</div>
</template>

<script>
import AppLink from './AppLink'
export default {
 data () {
 return {
 }
 },

 components: {AppLink},

 methods: {}
}
</script>

<style scoped>

</style>