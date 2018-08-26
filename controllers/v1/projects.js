const express = require('express')
const { Project, ProjectComment, ProjectLink, Topic, User } = require('../../models')

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
                    model: ProjectLink,
                    as: 'links',
                    attributes: { exclude: ['project_id'] }
                },
                {
                    model: Topic,
                    as: 'topics',
                    through: { attributes: [] }
                }
            ]
        })
            .then(projects => res.json(projects))
    })
    .post((req, res) => {
        Project.create(req.body)
            .then(data => {
                res.status(201).json({ message: 'project created', data })
            })
            .catch(e => {
                res.status(422).json({ message: e.errors[0].message })
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
                    model: ProjectLink,
                    as: 'links',
                    attributes: { exclude: ['project_id'] }
                },
                {
                    model: Topic,
                    as: 'topics',
                    through: { attributes: [] }
                }
            ],
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
            res.status(202).json({ message: 'project updated' })
        })
    })
    .delete((req, res) => {
        Project.destroy({ where: { id: req.params.id } }).then(() => {
            res.status(202).json({ message: 'project deleted' })
        })
    })

router.route('/:id/comments')
    .get((req, res) => {
        ProjectComment.findAll({
            where: {
                project_id: req.params.id
            },
            include: {
                model: User,
                as: 'user'
            },
            attributes: { exclude: ['project_id', 'user_id'] }
        })
            .then(comments => res.json(comments))
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
                    model: ProjectLink,
                    as: 'links',
                    attributes: { exclude: ['project_id'] }
                },
                {
                    model: Topic,
                    as: 'topics',
                    through: { attributes: [] }
                }
            ],
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

module.exports = router