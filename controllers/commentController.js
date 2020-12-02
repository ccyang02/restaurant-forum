const db = require('../models')
Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      restaurant: req.body.restaurantId,
      userId: req.user.id,
    })
      .then(comments => {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
  },
}

module.exports = commentController
