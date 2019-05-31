import { projectIndex } from '../../helpers/search'
import { Project, ProjectComment, ProjectUpvote } from '../../models'

export const getAll = (req, res) => {
    Project.query()
        .eager('[creators, images, links, topics, main_image]')
        .then(projects => res.json(projects))
}

export const create = (req, res) => {
    Project.query()
        .insert(req.body)
        .then(project => {
            const obj = { ...project.dataValues, objectID: project.id }
            projectIndex.addObject(obj)
            res.status(201).json({ message: 'project created', data: project })
        })
        .catch(e => {
            res.status(422).json({ message: e.errors[0].message })
        })
}

export const getBySlug = (req, res) => {
    Project.query()
        .findOne('slug', req.params.slug)
        .eager('[creators, images, links, topics, main_image]')
        .then(project => {
            if (!project) {
                res.status(404).json({ message: 'project not found' })
                return
            }
            res.json(project)
        })
}

export const get = (req, res) => {
    Project.query()
        .findById(req.params.id)
        .eager('[creators, images, links, topics, main_image]')
        .then(project => {
            if (!project) {
                res.status(404).json({ message: 'project not found' })
                return
            }
            res.json(project)
        })
}

export const update = (req, res) => {
    Project.query()
        .patchAndFetchById(req.params.id, req.body)
        .then(project => {
            if (!project) {
                res.json(404).json({ message: 'project not found' })
                return
            }
            const obj = { ...project, objectID: req.params.id }
            projectIndex.partialUpdateObject(obj)
            res.status(202).json({ message: 'project updated' })
        })
}

export const destroy = (req, res) => {
    Project.query()
        .deleteById(req.params.id)
        .then(deletedCount => {
            if (!deletedCount) {
                res.status(404).json({ message: 'project not found' })
                return
            }
            projectIndex.deleteObject(req.params.id)
            res.status(202).json({ message: 'project deleted' })
        })
}

export const getComments = (req, res) => {
    Project.query()
        .findById(req.params.id)
        .then(project => {
            if (!project) {
                res.status(404).json({ message: 'project not found' })
                return
            }
            project.$relatedQuery('comments')
                .then(comments => res.json(comments))
        })
}

export const createComment = (req, res) => {
    Project.query()
        .findById(req.params.id)
        .then(project => {
            if (!project) {
                res.status(404).json({ message: 'project not found' })
                return
            }
            ProjectComment.query()
                .insert({ ...req.body, project_id: req.params.id, user_id: req.user.id })
                .then(() => {
                    res.status(201).json({ message: 'comment created' })
                })
        })
}

export const getUpvotes = (req, res) => {
    Project.query()
        .findById(req.params.id)
        .then(project => {
            if (!project) {
                res.status(404).json({ message: 'project not found' })
                return
            }
            project.$relatedQuery('upvotes')
                .then(upvotes => res.json(upvotes))
        })
}

export const createUpvote = (req, res) => {
    Project.query()
        .findById(req.params.id)
        .then(project => {
            if (!project) {
                res.status(404).json({ message: 'project not found' })
                return
            }
            ProjectUpvote.query()
                .insert({ project_id: req.params.id, user_id: req.user.id })
                .then(() => {
                    res.status(201).json({ message: 'upvote created' })
                })
        })
}