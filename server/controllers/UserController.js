const UserService = require("../../services/UserService");
const JWT = require("../utils/JWT");

const UserController = {
    // 注册控制
    register: async (req, res) => {
        const {
            username,
            password
        } = req.body;

        try {
            // 调用 UserService 的注册方法
            await UserService.register({
                username,
                password
            });
            res.send({
                ActionType: "OK",
                message: "注册成功"
            });
        } catch (error) {
            res.status(500).send({
                code: "-1",
                error: "注册失败：" + error.message
            });
        }
    },

    // 登录控制器
    login: async (req, res) => {
        try {
            // req.body 
            var result = await UserService.login(req.body);

            if (result.length === 0) {
                res.send({
                    code: "-1",
                    error: "用户名密码不匹配"
                });
            } else {
                // 生成 token
                const token = JWT.generate({
                    _id: result[0]._id,
                    username: result[0].username
                }, "7d");

                res.header("Authorization", token);
                res.send({
                    ActionType: "OK",
                    data: {
                        username: result[0].username, // 用户名
                        introduction: result[0].introduction, // 简介
                        avatar: result[0].avatar // 头像
                    }
                });
            }
        } catch (error) {
            res.status(500).send({
                code: "-1",
                error: "登录失败：" + error.message
            });
        }
    },

    // 上传头像和更新个人介绍
    upload: async (req, res) => {
        const {
            username,
            introduction
        } = req.body;
        const token = req.headers["authorization"].split(" ")[1];
        const avatar = req.file ? `/avataruploads/${req.file.filename}` : "";
        var payload = JWT.verify(token);

        try {
            // 调用 service 模块更新数据
            await UserService.upload({
                _id: payload._id,
                username,
                introduction,
                avatar
            });

            if (avatar) {
                res.send({
                    ActionType: "OK",
                    data: {
                        username,
                        introduction,
                        avatar
                    }
                });
            } else {
                res.send({
                    ActionType: "OK",
                    data: {
                        username,
                        introduction
                    }
                });
            }
        } catch (error) {
            res.status(500).send({
                code: "-1",
                error: "更新失败：" + error.message
            });
        }
    }
};

module.exports = UserController;