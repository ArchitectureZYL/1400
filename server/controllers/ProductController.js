const ProductModel = require('../models/ProductModel');

// 创建一个新作品
const createProduct = async (req, res) => {
  try {
    const newProduct = new ProductModel(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

// 获取所有作品
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// 根据 ID 获取单个作品
const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: '作品未找到'
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// 根据 ID 更新作品信息
const updateProductById = async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body, {
        new: true
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        message: '作品未找到'
      });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

// 根据 ID 删除作品
const deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        message: '作品未找到'
      });
    }
    res.status(200).json({
      message: '作品已删除'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById
};