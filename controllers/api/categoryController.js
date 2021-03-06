const db = require('../../models')
const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: async (req, res, next) => {
    const data = await categoryService.getCategories(req, res, next)
    return res.json(data)
  },

  postCategory: async (req, res, next) => {
    const data = await categoryService.postCategory(req, res, next)
    return res.json(data)
  },

  putCategory: async (req, res, next) => {
    const data = await categoryService.putCategory(req, res, next)
    return res.json(data)
  },

  deleteCategory: async (req, res, next) => {
    const data = await categoryService.deleteCategory(req, res, next)
    return res.json(data)
  },
}

module.exports = categoryController