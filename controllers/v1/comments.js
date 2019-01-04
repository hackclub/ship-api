const express = require('express')
const passport = require('passport')
const { ProjectComment } = require('../../models')

const router = express.Router()

router.route('/:id')
    .get((req, res) => {
        ProjectComment.findById(req.params.id)
            .then(comment => {
                if (comment) {
                    res.json(comment)
                }
                else {
                    res.status(404).json({ message: 'comment not found' })
                }
            })
    })
    .patch(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            ProjectComment.update(req.body, { where: { id: req.params.id } })
                .then(() => {
                    res.status(202).json({ message: 'comment updated' })
                })
        }
    )
    .delete(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            ProjectComment.destroy({ where: { id: req.params.id } })
                .then(() => {
                    res.status(202).json({ message: 'comment deleted' })
                })
        }
    )

module.exports = router