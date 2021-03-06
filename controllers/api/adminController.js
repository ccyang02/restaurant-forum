const db = require('../../models')
const adminService = require('../services/adminService')


const adminController = {
  getRestaurants: async (req, res, next) => {
    const data = await adminService.getRestaurants(req, res, next)
    return res.json(data)
  },

  getRestaurant: async (req, res, next) => {
    const data = await adminService.getRestaurant(req, res, next)
    return res.json(data)
  },

  postRestaurant: async (req, res, next) => {
    const data = await adminService.postRestaurant(req, res, next)
    return res.json(data)
  },

  putRestaurant: async (req, res, next) => {
    const data = await adminService.putRestaurant(req, res, next)
    return res.json(data)
  },

  deleteRestaurant: async (req, res, next) => {
    const data = await adminService.deleteRestaurant(req, res, next)
    return res.json(data)
  },
}

module.exports = adminController