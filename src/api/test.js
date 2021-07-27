import request from '@/utils/request';
// request({
//         method:"get",
//         url:"/db.json"
//         }).then(response=>{
//         console.log(response.data);
//         })
export default{
    getMsg(){
        return request({
            method:"get",
            url:"/db.json"
        })
    }
}