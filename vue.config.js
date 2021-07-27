module.exports = {
    devServer:{
        port:8888,
        host:'localhost',
        https:false,
        open:true,
        proxy:{
            //开发环境的代理
            [process.env.VUE_APP_BASE_API]:{
                target:process.env.VUE_APP_SERVICE_URL, //代理目标地址
                changOrigin:true, //开启代理
                pathRewrite:{
                    //移除dev-api
                    ['^'+process.env.VUE_APP_BASE_API]:''
                }
            }
        }
    },
    lintOnSave:false,
    productionSourceMap:false
}