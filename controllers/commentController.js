const db = require('../models')
Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    console.log('>> rid: ', req.body.restaurantId)
    console.log('>> uid: ', req.user.id)
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id,
    })
      .then(comments => {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
  },
}

module.exports = commentController
