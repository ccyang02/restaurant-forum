const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('./services/adminService')

const adminController = {

  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users })
    } catch (error) {
      next(error)
    }
  },

  putUsers: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      await user.update({ isAdmin: !user.isAdmin })
      req.flash('success_messages', 'user was successfully to update')
      res.redirect('/admin/users')
    } catch (error) {
      next(error)
    }
  },

  getRestaurants: async (req, res, next) => {
    const data = await adminService.getRestaurants(req, res, next)
    return res.render('admin/restaurants', data)
  },

  getRestaurant: async (req, res, next) => {
    const data = await adminService.getRestaurant(req, res, next)
    return res.render('admin/restaurant', data)
  },

  createRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/create', {
        categories: categories
      })
    } catch (error) {
      next(error)
    }
  },

  postRestaurant: async (req, res, next) => {
    const data = await adminService.postRestaurant(req, res, next)
    if (data.status === 'error') {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    req.flash('success_messages', data['message'])
    res.redirect('/admin/restaurants')
  },

  editRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      const restaurant = await Restaurant.findByPk(req.params.id)
      return res.render('admin/create', {
        categories: categories,
        restaurant: restaurant.toJSON()
      })
    } catch (error) {
      next(error)
    }
  },

  deleteRestaurant: async (req, res, next) => {
    const data = await adminService.deleteRestaurant(req, res, next)
    if (data.status === 'success') {
      return res.redirect('/admin/restaurants')
    }
  },

  putRestaurant: async (req, res, next) => {
    const data = await adminService.putRestaurant(req, res, next)
    if (data.status === 'success') {
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    }
    req.flash('error_messages', data.message)
    return res.redirect('back')
  },
}
module.exports = adminController