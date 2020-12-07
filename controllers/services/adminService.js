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
      // return res.render('admin/restaurants', { restaurants: restaurants })
      return { restaurants: restaurants }
    } catch (error) {
      next(error)
    }
  },
}

module.exports = adminService