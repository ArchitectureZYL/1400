// 引入 express 模块
var express = require('express');
// 创建一个 express 路由对象
var ProductRouter = express.Router();

// 引入 ProductController 模块
const ProductController = require('../controllers/ProductController');

// 引入 multer 用于文件上传
const multer = require('multer');
// 配置 multer，指定文件存储的目录
const upload = multer({
  dest: 'public/productuploads/'
});

// 定义一个 POST 请求的路由，用于上传作品的图片
ProductRouter.post("/api/product/upload", upload.single('file'), (req, res, next) => {
  // 处理 multer 可能抛出的错误
  if (req.fileValidationError) {
    return res.status(400).send(req.fileValidationError);
  } else if (!req.file) {
    return res.status(400).send('请选择要上传的文件');
  }
  // 调用 ProductController 中的 upload 方法处理上传逻辑
  ProductController.upload(req, res, next);
});

// 导出 ProductRouter 模块，以便在其他文件中使用
module.exports = ProductRouter;