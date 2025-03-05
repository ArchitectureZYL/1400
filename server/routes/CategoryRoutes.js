const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

// 创建分类的路由
router.post('/api/category', categoryController.createCategory);

// 删除分类的路由
router.delete('/api/category/:id', categoryController.deleteCategory);

module.exports = router;