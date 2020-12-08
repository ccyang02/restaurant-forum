const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
      })
      return { restaurants: restaurants }
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
      return { restaurant: restaurant }
    } catch (error) {
      next(error)
    }
  },

  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      return { status: 'success', message: '' }
    } catch (error) {
      next(error)
    }
  },
}

module.exports = adminService