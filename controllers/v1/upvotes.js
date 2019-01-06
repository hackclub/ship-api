const express = require('express')
const passport = require('passport')
const { ProjectUpvote } = require('../../models')

const router = express.Router()

router.route('/:id')
    .get((req, res) => {
        ProjectUpvote.query()
            .findById(req.params.id)
            .eager('user')
            .then(upvote => {
                if (!upvote) {
                    res.status(404).json({ message: 'upvote not found' })
                    return
                }
                res.json(upvote)
            })
    })
    .delete(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            ProjectUpvote.query()
                .deleteById(req.params.id)
                .then(deletedCount => {
                    if (!deletedCount) {
                        res.status(404).json({ message: 'upvote not found' })
                        return
                    }
                    res.status(202).json({ message: 'upvote deleted' })
                })
        }
    )

module.exports = router