const express = require('express')
const { ProjectUpvote } = require('../../models')

const router = express.Router()

router.route('/:id')
    .get((req, res) => {
        ProjectUpvote.findById(req.params.id)
            .then(upvote => {
                if (upvote) {
                    res.json(upvote)
                }
                else {
                    res.status(404).json({ message: 'upvote not found' })
                }
            })
    })
    .delete((req, res) => {
        ProjectUpvote.destroy({ where: { id: req.params.id } })
            .then(() => {
                res.status(202).json({ message: 'upvote deleted' })
            })
    })

module.exports = router