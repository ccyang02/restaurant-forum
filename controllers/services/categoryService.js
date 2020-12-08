
const db = require('../../models')
const Category = db.Category

const categoryService = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      if (req.params.id) {
        const category = await Category.findByPk(req.params.id)
        return {
          categories: categories,
          category: category.toJSON()
        }
      }
      return { categories: categories }
    } catch (error) {
      next(error)
    }
  },

  postCategory: async (req, res, next) => {
    try {
      if (!req.body.name) {
        return { status: 'error', message: 'name did not exist' }
      }
      await Category.create({ name: req.body.name })
      return { status: 'success', message: '' }
    } catch (error) {
      next(error)
    }
  },

  putCategory: async (req, res, next) => {
    try {
      if (!req.body.name) {
        return { status: 'error', message: 'name did not exist' }
      }
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)
      return { status: 'success', message: '' }
    } catch (error) {
      next(error)
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      return { status: 'success', message: '' }
    } catch (error) {
      next(error)
    }
  },
}

module.exports = categoryService
