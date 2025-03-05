const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 定义“作品”模型的字段类型
const ProductType = {
  username: String, // 用户名
  title: String, // 作品标题
  category: String, // 作品分类
  introduction: String, // 作品简介
  image: String // 作品图片
}

// 创建名为 "product" 的 Mongoose 模型
const ProductModel = mongoose.model("product", new Schema(ProductType));

module.exports = ProductModel;