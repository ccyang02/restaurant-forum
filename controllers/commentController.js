const db = require('../models')
Comment = db.Comment

const commentController = {
  postComment: async (req, res, next) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id,
      })
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (error) {
      next(error)
    }
  },

  deleteComment: async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      const destroyedComment = await comment.destroy()
      return res.redirect(`/restaurants/${destroyedComment.RestaurantId}`)
    } catch (error) {
      next(error)
    }
  },
}

module.exports = commentController
