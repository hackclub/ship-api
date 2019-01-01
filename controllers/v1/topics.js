const express = require('express')
const { topicIndex } = require('../../helpers/search')
const { ProjectImage, ProjectLink, Topic, User } = require('../../models')

const router = express.Router()

router.route('/')
    .get((req, res) => {
        Topic.findAll().then(topics => res.json(topics))
    })
    .post((req, res) => {
        Topic.create(req.body)
            .then(data => {
                const obj = { ...data.dataValues, objectID: data.id }
                topicIndex.addObject(obj)
                res.status(201).json({ message: 'topic created', data })
            })
            .catch(e => {
                res.status(422).json({ message: e.errors[0].message })
            })
    })

router.route('/slug/:slug')
    .get((req, res) => {
        Topic.findOne({ where: { slug: req.params.slug } }).then(topic => {
            if (topic) {
                res.json(topic)
            }
            else {
                res.status(404).json({ message: 'topic not found' })
            }
        })
    })

router.route('/:id')
    .get((req, res) => {
        Topic.findById(req.params.id).then(topic => {
            if (topic) {
                res.json(topic)
            }
            else {
                res.status(404).json({ message: 'topic not found' })
            }
        })
    })
    .patch((req, res) => {
        Topic.update(req.body, { where: { id: req.params.id } }).then(() => {
            const obj = { ...req.body, objectID: req.params.id }
            topicIndex.partialUpdateObject(obj)
            res.status(202).json({ message: 'topic updated' })
        })
    })
    .delete((req, res) => {
        Topic.destroy({ where: { id: req.params.id } }).then(() => {
            topicIndex.deleteObject(req.params.id)
            res.status(202).json({ message: 'topic deleted' })
        })
    })

router.route('/:id/projects')
    .get((req, res) => {
        Topic.findById(req.params.id)
            .then(topic => {
                if (topic) {
                    topic.getProjects({
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
                        joinTableAttributes: []
                    })
                        .then(projects => res.json(projects))
                }
                else {
                    res.status(404).json({ message: 'topic not found' })
                }
            })
    })

module.exports = router