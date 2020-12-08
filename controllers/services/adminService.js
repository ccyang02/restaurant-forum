const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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

  postRestaurant: async (req, res, next) => {
    try {
      if (!req.body.name) {
        return { status: 'error', message: 'name did not exist.' }
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)

        async function imgurUpload() {
          return new Promise((resolve, reject) => {
            imgur.upload(file.path, async (err, img) => {
              try {
                await Restaurant.create({
                  name: req.body.name,
                  tel: req.body.tel,
                  address: req.body.address,
                  opening_hours: req.body.opening_hours,
                  description: req.body.description,
                  image: file ? img.data.link : null,
                  CategoryId: req.body.categoryId
                })
                resolve('Done')
              } catch (error) {
                reject(error)
              }
            })
          })
        }

        await imgurUpload()
        return { status: 'success', message: 'restaurant was successfully created' }
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
        return { status: 'success', message: 'restaurant was successfully created' }
      }
    } catch (error) {
      next(error)
    }
  },

  putRestaurant: async (req, res, next) => {
    try {
      if (!req.body.name) {
        return {
          status: 'error', message: 'name did not exist'
        }
      }

      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        async function imgurUpload() {
          return new Promise((resolve, reject) => {
            imgur.upload(file.path, async (err, img) => {
              try {
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
                resolve('Done')
              } catch (error) {
                reject(error)
              }
            })
          })
        }

        await imgurUpload()
        return { status: 'success', message: 'restaurant was successfully to update' }
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
        return { status: 'success', message: 'restaurant was successfully to update' }
      }
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