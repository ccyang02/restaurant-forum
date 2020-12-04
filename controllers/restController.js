const db = require('../models')
const helper = require('../_helpers')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User
const Comment = db.Comment
const pageLimit = 10

const restController = {
  getRestaurants: async (req, res, next) => {
    try {
      let offset = 0
      const whereQuery = {}
      let categoryId = ''
      if (req.query.page) {
        offset = (req.query.page - 1) * pageLimit
      }
      if (req.query.categoryId) {
        categoryId = Number(req.query.categoryId)
        whereQuery.categoryId = categoryId
      }
      const result = await Restaurant.findAndCountAll({
        include: Category,
        where: whereQuery,
        offset: offset,
        limit: pageLimit
      })
      // data for pagination
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name,
        isFavorited: helper.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: helper.getUser(req).LikedRestaurants.map(d => d.id).includes(r.id)
      }))

      const categories = await Category.findAll({ raw: true, nest: true })

      return res.render('restaurants', {
        restaurants: data,
        categories: categories,
        categoryId: categoryId,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })
    } catch (error) {
      next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }, { model: Comment, include: [User] }]
      })
      await restaurant.increment('viewCounts')
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(helper.getUser(req).id)
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(helper.getUser(req).id)
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited: isFavorited,
        isLiked: isLiked
      })
    } catch (error) {
      next(error)
    }
  },

  getFeeds: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      })
      const comments = await Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
      Promise.all([restaurants, comments])
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    } catch (error) {
      next(error)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [User] }] })
      return res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = restController