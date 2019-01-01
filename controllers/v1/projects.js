const express = require('express')
const { projectIndex } = require('../../helpers/search')
const { Project, ProjectComment, ProjectImage, ProjectLink, ProjectUpvote, Topic, User } = require('../../models')

const router = express.Router()

router.route('/')
    .get((req, res) => {
        Project.findAll({
            include: [
                {
                    model: User,
                    as: 'creators',
                    through: { attributes: [] }
                },
                {
                    model: ProjectImage,
                    as: 'images',
                    attributes: { exclude: ['project_id'] }
                },
                {
                    model: ProjectLink,
                    as: 'links',
                    attributes: { exclude: ['project_id'] }
                },
                {
                    model: Topic,
                    as: 'topics',
                    through: { attributes: [] }
                },
                {
                    model: ProjectImage,
                    as: 'main_image',
                    attributes: { exclude: ['project_id'] }
                }
            ],
            attributes: { exclude: ['main_image_id'] }
        })
            .then(projects => res.json(projects))
    })
    .post((req, res) => {
        Project.create(req.body)
            .then(data => {
                const obj = { ...data.dataValues, objectID: data.id }
                projectIndex.addObject(obj)
                res.status(201).json({ message: 'project created', data })
            })
            .catch(e => {
                res.status(422).json({ message: e.errors[0].message })
            })
    })

router.route('/slug/:slug')
    .get((req, res) => {
        Project.findOne({
            include: [
                {
                    model: User,
                    as: 'creators',
                    through: { attributes: [] }
                },
                {
                    model: ProjectImage,
                    as: 'images',
                    attributes: { exclude: ['project_id'] }
                },
                {
                    model: ProjectLink,
                    as: 'links',
                    attributes: { exclude: ['project_id'] }
                },
                {
                    model: Topic,
                    as: 'topics',
                    through: { attributes: [] }
                },
                {
                    model: ProjectImage,
                    as: 'main_image',
                    attributes: { exclude: ['project_id'] }
                }
            ],
            attributes: { exclude: ['main_image_id'] },
            where: { slug: req.params.slug }
        }).then(project => {
            if (project) {
                res.json(project)
            }
            else {
                res.status(404).json({ message: 'project not found' })
            }
        })
    })

router.route('/:id')
    .get((req, res) => {
        Project.findOne({
            include: [
                {
                    model: User,
                    as: 'creators',
                    through: { attributes: [] }
                },
                {
                    model: ProjectImage,
                    as: 'images',
                    attributes: { exclude: ['project_id'] }
                },
                {
                    model: ProjectLink,
                    as: 'links',
                    attributes: { exclude: ['project_id'] }
                },
                {
                    model: Topic,
                    as: 'topics',
                    through: { attributes: [] }
                },
                {
                    model: ProjectImage,
                    as: 'main_image',
                    attributes: { exclude: ['project_id'] }
                }
            ],
            attributes: { exclude: ['main_image_id'] },
            where: { id: req.params.id }
        }).then(project => {
            if (project) {
                res.json(project)
            }
            else {
                res.status(404).json({ message: 'project not found' })
            }
        })
    })
    .patch((req, res) => {
        Project.update(req.body, { where: { id: req.params.id } }).then(() => {
            const obj = { ...req.body, objectID: req.params.id }
            projectIndex.partialUpdateObject(obj)
            res.status(202).json({ message: 'project updated' })
        })
    })
    .delete((req, res) => {
        Project.destroy({ where: { id: req.params.id } }).then(() => {
            projectIndex.deleteObject(req.params.id)
            res.status(202).json({ message: 'project deleted' })
        })
    })

router.route('/:id/comments')
    .get((req, res) => {
        Project.findById(req.params.id)
            .then(project => {
                if (project) {
                    project.getComments({
                        include: {
                            model: User,
                            as: 'user'
                        },
                        attributes: { exclude: ['project_id', 'user_id'] }
                    })
                        .then(comments => res.json(comments))
                }
                else {
                    res.status(404).json({ message: 'project not found' })
                }
            })
    })
    .post((req, res) => {
        Project.findById(req.params.id)
            .then(project => {
                if (project) {
                    ProjectComment.create(req.body)
                        .then(comment => project.addComment(comment))
                        .then(() => {
                            res.status(201).json({ message: 'comment created' })
                        })
                }
            })
    })

router.route('/:id/upvotes')
    .get((req, res) => {
        Project.findById(req.params.id)
            .then(project => {
                if (project) {
                    project.getUpvotes({
                        include: {
                            model: User,
                            as: 'user'
                        },
                        attributes: { exclude: ['project_id', 'user_id'] }
                    })
                        .then(upvotes => res.json(upvotes))
                }
                else {
                    res.status(404).json({ message: 'project not found' })
                }
            })
    })
    .post((req, res) => {
        Project.findById(req.params.id)
            .then(project => {
                if (project) {
                    ProjectUpvote.create(req.body)
                        .then(upvote => project.addUpvote(upvote))
                        .then(() => {
                            res.status(201).json({ message: 'upvote created' })
                        })
                }
            })
    })

module.exports = router