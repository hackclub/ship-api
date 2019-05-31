import { ProjectComment } from '../../models'

export const get = (req, res) => {
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
}

export const update = (req, res) => {
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

export const destroy = (req, res) => {
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