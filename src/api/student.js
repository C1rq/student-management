import request from '@/utils/request'
export default {
    // 分页查询
    search(page, size, searchMap) {
        return request({
            url: '/student/list',
            method: 'post',
            data: {
                page,
                size,
                searchMap
            }
        })
    },
    // 新增学生
    add(student) {
        return request({
            url: '/students',
            method: 'post',
            data: student
        })
    },
    // 根据ID查询学生
    getById(id) {
        return request({
            url: `/students?id=${id}`,
            method: 'get'
        })
    },
    // 根据id修改学生信息
    update(student) {
        return request({
            url: '/students',
            method: "put",
            data: student
        })
    },
    // 根据ID删除学生信息
    deleteById(id) {
        return request({
            url: '/students',
            method: 'delete',
            data: {
                id: id
            }
        })
    }
}