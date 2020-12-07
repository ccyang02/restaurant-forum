const db = require('../../models')
const adminService = require('../services/adminService')
const Restaurant = db.Restaurant
const Category = db.Category

const adminController = {
  getRestaurants: async (req, res, next) => {
    const data = await adminService.getRestaurants(req, res, next)
    return res.json(data)
  },
}

module.exports = adminController