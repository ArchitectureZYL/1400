const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 定义用户模型的字段类型，只保留 username、introduction 和 password
const UserType = {
    username: String, // 用户名
    password: String, // 密码
    introduction: String // 个人简介
};

// 创建名为 "user" 的 Mongoose 模型
const UserModel = mongoose.model("user", new Schema(UserType));

module.exports = UserModel;