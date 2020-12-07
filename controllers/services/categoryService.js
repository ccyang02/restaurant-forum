
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
}

module.exports = categoryService
