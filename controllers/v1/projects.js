import { Router } from 'express'
import passport from 'passport'
import { projectIndex } from '../../helpers/search'
import { Project, ProjectComment, ProjectUpvote } from '../../models'

const router = Router()

router.route('/')
    .get((req, res) => {
        Project.query()
            .eager('[creators, images, links, topics, main_image]')
            .then(projects => res.json(projects))
    })
    .post(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
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
    )

router.route('/slug/:slug')
    .get((req, res) => {
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
    })

router.route('/:id')
    .get((req, res) => {
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
    })
    .patch(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
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
    )
    .delete(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
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
    )

router.route('/:id/comments')
    .get((req, res) => {
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
    })
    .post(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
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
    )

router.route('/:id/upvotes')
    .get((req, res) => {
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
    })
    .post(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
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
    )

export default router