import { Router } from 'express'
import passport from 'passport'
import { ProjectComment } from '../../models'

const CommentsController = Router()

CommentsController.route('/:id')
    .get((req, res) => {
        ProjectComment.query()
            .findById(req.params.id)
            .eager('user')
            .then(comment => {
                if (!comment) {
                    res.status(404).json({ message: 'comment not found' })
                    return
                }
                res.json(comment)
            })
    })
    .patch(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            ProjectComment.query()
                .patchAndFetchById(req.params.id, req.body)
                .then(comment => {
                    if (!comment) {
                        res.status(404).json({ message: 'comment not found' })
                        return
                    }
                    res.status(202).json({ message: 'comment updated' })
                })
        }
    )
    .delete(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            ProjectComment.query()
                .deleteById(req.params.id)
                .then(deletedCount => {
                    if (!deletedCount) {
                        res.status(404).json({ message: 'comment not found' })
                        return
                    }
                    res.status(202).json({ message: 'comment deleted' })
                })
        }
    )

export default CommentsController