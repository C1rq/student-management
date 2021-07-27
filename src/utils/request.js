import axios from 'axios';
import { Loading, Message } from 'element-ui';
// axios.get("/db.json").then(response =>{
//     console.log(response.data);
// })
// axios({
//     method:"get",
//     url:"/db.json",

// }).then(response=>{
//     console.log(response.data);
// })


// 封装axios
const request = axios.create({
  // baseURL:'/',
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});

const loading = {
  loadingInstance: null,
  open: function () {
    if (this.loadingInstance === null) {
      this.loadingInstance = Loading.service({
        text: "玩命加载中...",
        target: ".main",  //你要添加遮罩层的模块
        background: "rgba(0,0,0,0.5)"
      })
    }
  },
  close: function () {
    if (this.loadingInstance !== null) {
      this.loadingInstance.close();
    }
    this.loadingInstance = null;
  }
}

// Add a request interceptor  添加一个请求拦截器
request.interceptors.request.use(function (config) {
  // Do something before request is sent 请求拦截
  loading.open();

  return config;
}, function (error) {
  // Do something with request error 抛出异常
  loading.close();

  return Promise.reject(error);
});

// Add a response interceptor 添加一个响应拦截器
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger 响应拦截
  // Do something with response data
  const resp = response.data;
  if (resp.code != 2000) {
    Message({
      message: resp.message,
      type: "warning",
      duration: 5 * 1000,
    })
  }

  loading.close();

  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger 抛出异常
  // Do something with response error
  Message({
    message: resp.error,
    type: "error",
    duration: 5 * 1000,  //message提示框停留时间
  })
  loading.close();
  return Promise.reject(error);
});
// request({
//     method:"get",
//     url:"/db.json"
// }).then(response=>{
//     console.log(response.data);
// })
export default request;