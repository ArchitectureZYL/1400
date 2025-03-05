const mongoose = require('mongoose');

// 定义分类模型的 Schema，仅包含 name 字段
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

// 创建 Category 模型
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;