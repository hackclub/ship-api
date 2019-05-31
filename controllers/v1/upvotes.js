import { ProjectUpvote } from '../../models'

export const get = (req, res) => {
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
}

export const destroy = (req, res) => {
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