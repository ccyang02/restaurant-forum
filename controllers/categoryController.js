const db = require('../models')
const categoryService = require('./services/categoryService')
const Category = db.Category

let categoryController = {
  getCategories: async (req, res, next) => {
    const data = await categoryService.getCategories(req, res, next)
    return res.render('admin/categories', data)
  },

  postCategory: async (req, res, next) => {
    const data = await categoryService.postCategory(req, res, next)
    if (data.status === 'success') {
      return res.redirect('/admin/categories')
    }
    req.flash('error_messages', data.message)
    return res.redirect('back')
  },

  putCategory: async (req, res, next) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', 'name didn\'t exist')
        return res.redirect('back')
      }
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },
}

module.exports = categoryController