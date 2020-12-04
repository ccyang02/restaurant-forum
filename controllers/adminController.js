const db = require('../models')
const fs = require('fs')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
      })
      return res.render('admin/restaurants', { restaurants: restaurants })
    } catch (error) {
      next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      return res.render('admin/restaurant', {
        restaurant: restaurant
      })
    } catch (error) {
      next(error)
    }
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
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : null,
            CategoryId: req.body.categoryId
          })
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      } else {
        await Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: req.body.categoryId
        })
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      }
    } catch (error) {
      next(error)
    }
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
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },

  putRestaurant: async (req, res, next) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }

      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, async (err, img) => {
          const restaurant = await Restaurant.findByPk(req.params.id)
          await restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : restaurant.image,
            CategoryId: req.body.categoryId
          })
          req.flash('success_messages', 'restaurant was successfully to update')
          res.redirect('/admin/restaurants')
        })
      } else {
        const restaurant = await Restaurant.findByPk(req.params.id)
        await restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: restaurant.image,
          CategoryId: req.body.categoryId
        })
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      }
    } catch (error) {
      next(error)
    }
  },
}
module.exports = adminController