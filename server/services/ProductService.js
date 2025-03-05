const ProductModel = require('../models/ProductModel');

// 创建一个新作品
const createProduct = async (productData) => {
  try {
    const newProduct = new ProductModel(productData);
    return await newProduct.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

// 获取所有作品
const getAllProducts = async () => {
  try {
    return await ProductModel.find();
  } catch (error) {
    throw new Error(error.message);
  }
};

// 根据 ID 获取单个作品
const getProductById = async (productId) => {
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error('作品未找到');
    }
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 根据 ID 更新作品信息
const updateProductById = async (productId, updateData) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData, {
        new: true
      }
    );
    if (!updatedProduct) {
      throw new Error('作品未找到');
    }
    return updatedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 根据 ID 删除作品
const deleteProductById = async (productId) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw new Error('作品未找到');
    }
    return {
      message: '作品已删除'
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById
};