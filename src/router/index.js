import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/register"
import Login from '../views/login'
import Layout from "../components/Layout.vue"
import Home from "../views/home"
import Student from "../views/student"
import Teacher from "../views/teacher"

Vue.use(VueRouter);

const routes = [
  {
    path:"/",
    name:"layout",
    component:Layout,
    redirect:'/home',
    children:[
      {
        path:"/home",
        component:Home,
        meta:{title:"首页"}
      },
      {
        path:"/teacher",
        component:Teacher,
        meta:{title:"教师"}
      }
    ]
  },
  {
    path:"/student",
    component:Layout,
    children:[
      {
        path:"/",
        component:Student,
        meta:{
          title:'学生管理'
        }
      }
    ]
  },
 {
   path:'/register',
   name:'register',
   component:Register
 },
 {
   path:'/login',
   name:'login',
   component:Login
 }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
