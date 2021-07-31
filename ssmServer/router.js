var express = require("express");
var md5 = require("blueimp-md5");
var User = require("./user");
var Teacher = require("./teacher");
var Student = require("./Student");
const user = require("./user");
var router = express.Router();

// 注册
router.post("/user/register", function (req, res) {
    var body = req.body;
    User.find({
        $or: [
            {
                username: body.username
            },
            {
                nickname: body.nickname
            }
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (data.length !== 0) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "账号或昵称已存在"
            })
        }
        body.token = md5(md5(body.username) + "C1rq");
        new User(body).save(function (err, data) {
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: "server error 存储失败！"
                })
            }
            console.log("okk");
            return res.json({
                code: 2000,
                flag: true,
                message: "注册成功！"
            })
        })
    })
});
// 登录
router.post("/user/login", function (req, res) {
    var body = req.body;
    console.log("body", body);
    User.findOne({
        username: body.username,
        password: body.password
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error login'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '账号或密码不存在'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '验证成功',
            data: {
                token: data.token
            }
        })
    })
}, function (err, data) {

});
// 获取用户信息
router.get("/user/info", function (req, res) {
    var body = req.query;
    User.findOne({
        token: body.token
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error getUserInfo"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "token 已过期"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "获取信息成功",
            data: {
                "nickname": data.nickname,
                "id": data._id,
            }
        })
    })
})
//退出登录
router.post("/user/logout", function (req, res) {
    var body = req.body;
    User.findOne({
        token: body.token
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: 'token找不到或已过期'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '已退出'
        })
    })
})
// 获取所有教师列表
router.get("/teacher/list", function (req, res) {
    Teacher.find({}, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: "3000",
                flag: false,
                message: "server error"
            });

        }
        const count = data.length;
        return res.status(200).json({
            code: "2000",
            flag: "true",
            message: "查询成功",
            data: {
                total: count,
                rows: data
            }
        })
    })
})
// 获取教室列表，分页
router.post("/teacher/list", function (req, res) {
    // 前台传过来的查询条件
    let page = req.body.page || 1;
    let size = req.body.size || 10;
    // 真正的查询条件
    let searchMap = req.body.searchMap || {};
    let obj = {};
    searchMap.jobnumber ? obj["jobnumber"] = searchMap.jobnumber : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.role ? obj["role"] = searchMap.role : obj;
    searchMap.entrydate ? obj["entrydate"] = searchMap.entrydate : obj;
    Teacher.find(obj, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        let count = data.length;
        // skip 刨除前面的多少条数据  limit：刨除后要往后查多少条  exec 前面的方法执行完毕再执行这个添加回调函数
        Teacher.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec(function (err, data) {
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: "server error"
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: "查询成功",
                data: {
                    "total": count,
                    "rows": data
                }
            })
        })
    })
})
// 新增教师
router.post("/teacher", function (req, res) {
    new Teacher(req.body).save(function (err) {
        console.log(req.body);
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: '添加失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "添加成功！"
        })
    })
});
// 根据ID查询教师
router.get("/teacher", function (req, res) {
    Teacher.findById(req.query.id, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "根据 Id查询教师失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "根据Id查询成功",
            data: data
        })
    })
})
// 根据ID 修改教师信息
router.put("/teacher", function (req, res) {
    var id = req.body._id;
    Teacher.findByIdAndUpdate(id, req.body, function (err) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "根据ID修改教师信息失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "修改教师信息成功"

        })
    })
})
// 根据ID删除教师
router.delete('/teacher', function (req, res) {
    Teacher.findByIdAndRemove(req.body.id, function (err) {
        console.log(req.body);
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "删除教师失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "删除教师成功"
        })
    })
});
// 获取学生列表 带分页
router.post("/Student/list", function (req, res) {
    // 前台传过来的查询条件
    let page = req.body.page || 1;
    let size = req.body.size || 10;
    // 真正的查询条件
    let searchMap = req.body.searchMap || {};
    let obj = {};
    searchMap.stunum ? obj["stunum"] = searchMap.stunum : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.admissiondate ? obj["admissiondate"] = searchMap.admissiondate : obj;
    searchMap.teacher ? obj["teacher"] = searchMap.teacher : obj;
    searchMap.class ? obj["class"] = searchMap.class : obj;

    Student.find(obj, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        let count = data.length;
        // skip 刨除前面的多少条数据  limit：刨除后要往后查多少条  exec 前面的方法执行完毕再执行这个添加回调函数
        Student.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec(function (err, data) {
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: "server error"
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: "查询成功",
                data: {
                    "total": count,
                    "rows": data
                }
            })
        })
    })
})
// 新增学生
router.post("/students", function (req, res) {
    new Student(req.body).save(function (err) {
        console.log(req.body);
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: '新增学生失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '新增学生成功'
        })
    })
})
//根据Id查询学生
router.get("/students", function (req, res) {
    Student.findById(req.query.id, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: '根据Id查询学生失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "根据Id查询学生成功",
            data: data
        })
    })
})
// 根据Id修改学生信息
router.put("/students", function (req, res) {
    var id = req.body._id;
    Student.findByIdAndUpdate(id, req.body, function (err) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "根据Id修改学生信息失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "修改成功"
        })
    })
})
//根据Id删除学生
router.delete("/students", function (req, res) {
    Student.findByIdAndRemove(req.body.id, function (err) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "根据id删除学生信息失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "删除成功"

        })
    })
})
// 校验密码是否正确
router.post("/user/pwd", function (req, res) {
    var body = req.body;
    user.findOne({
        _id: body.userId,
        password: body.password
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                message: "校验密码是否正确，服务器错误",
                flag: false
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "密码错误",
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "校验密码成功",
        })
    })
})
// 修改密码
router.put("/user/pwd", function (req, res) {
    var id = req.body.userId;
    User.findOne({
        _id: id
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                message: '修改密码校验，服务器错误',
                flag: false
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                message: "密码不正确！",
                flag: false
            })
        }
        data.password = req.body.password;
        user.findByIdAndUpdate(id,data, function (err) {
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    message: "修改密码服务器错误",
                    flag: false
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: "修改密码成功"
            })
        })
    })
})
module.exports = router;