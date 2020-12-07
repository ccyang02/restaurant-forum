const db = require('../../models')
const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: async (req, res, next) => {
    const data = await categoryService.getCategories(req, res, next)
    return res.json(data)
  },
}

module.exports = categoryController