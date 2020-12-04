const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID


const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res, next) => {
    try {
      if (req.body.passwordCheck !== req.body.password) {
        req.flash('error_messages', '兩次密碼輸入不同！')
        return res.redirect('/signup')
      }

      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) {
        req.flash('error_messages', '信箱重複！')
        return res.redirect('/signup')
      }
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (error) {
      next(error)
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { include: [Comment, { model: Comment, include: [Restaurant] }] })
      return res.render('user', { profile: user.toJSON() })
    } catch (error) {
      next(error)
    }
  },

  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      return res.render('useredit', { profile: user.toJSON() })
    } catch (error) {
      next(error)
    }
  },

  putUser: async (req, res, next) => {
    try {
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          const user = await User.findByPk(req.params.id)
          await user.update({
            name: req.body.name,
            image: file ? img.data.link : user.image
          })
          req.flash('success_messages', 'user was successfully to update')
          res.redirect(`/users/${req.params.id}`)
        })
      } else {
        const user = await User.findByPk(req.params.id)
        await user.update({ name: req.body.name })
        req.flash('success_messages', 'user was successfully to update')
        res.redirect(`/users/${req.params.id}`)
      }
    } catch (error) {
      next(error)
    }
  },
}

module.exports = userController