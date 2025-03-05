const Category = require('../models/CategoryModel');

// 创建分类的服务方法
async function createCategory(name) {
  try {
    const newCategory = new Category({
      name
    });
    return await newCategory.save();
  } catch (error) {
    throw error;
  }
}

// 删除分类的服务方法
async function deleteCategory(id) {
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw new Error('分类未找到');
    }
    return deletedCategory;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCategory,
  deleteCategory
};