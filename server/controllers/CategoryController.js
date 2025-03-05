const categoryService = require('../services/CategoryService');

// 创建分类的控制器方法
async function createCategory(req, res) {
  const {
    name
  } = req.body;
  if (!name) {
    return res.status(400).json({
      message: '分类名称不能为空'
    });
  }
  try {
    const category = await categoryService.createCategory(name);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

// 删除分类的控制器方法
async function deleteCategory(req, res) {
  const {
    id
  } = req.params;
  try {
    await categoryService.deleteCategory(id);
    res.status(200).json({
      message: '分类删除成功'
    });
  } catch (error) {
    if (error.message === '分类未找到') {
      res.status(404).json({
        message: error.message
      });
    } else {
      res.status(500).json({
        message: error.message
      });
    }
  }
}

module.exports = {
  createCategory,
  deleteCategory
};