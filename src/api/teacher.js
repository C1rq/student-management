import request from '@/utils/request.js'

export default {
    // 获取所有教师列表
    // getList() {
    //     return request({
    //         url: '/teacher/list',
    //         method: 'get'
    //     })
    // },
    search(page, size, searchMap) {
        return request({
            url: "/teacher/list",
            method: "post",
            data: {
                page,
                size,
                searchMap
            }
        })
    },
    add(teacher) {
        return request({
            url: '/teacher',
            method: 'post',
            data: teacher
        })
    },
    // 根据ID查询教师
    getById(id) {
        return request({
            url: `/teacher?id=${id}`,
            method: 'get'
        })
    },
    update(teacher) {
        return request({
            url: "/teacher",
            method: 'put',
            data: teacher
        })
    },
    deleteById(id) {
        return request({
            url: "/teacher",
            method: 'delete',
            data: {
                id
            }
        })
    }

}