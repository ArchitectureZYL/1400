const UserModel = require("../models/UserModel");

const UserService = {
    // 注册服务
    register: async ({
        username,
        password
    }) => {
        return UserModel.add({
            username,
            password
        })
    },

    // 登录服务，根据用户名和密码查找用户
    login: async ({
        username,
        password
    }) => {
        return UserModel.find({
            username,
            password
        });
    },

    // 更新用户信息服务，根据用户ID更新用户名和简介
    upload: async ({
        _id,
        username,
        introduction
    }) => {
        return UserModel.updateOne({
            _id
        }, {
            username,
            introduction
        });
    },

    // 更新用户列表服务，根据用户ID更新用户信息
    putList: async (body) => {
        return UserModel.updateOne({
            _id: body._id
        }, body);
    }
};

module.exports = UserService;