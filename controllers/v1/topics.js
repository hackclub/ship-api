const express = require('express')
const { Link, Project, Topic } = require('../../models')

const router = express.Router()

router.route('/')
    .get((req, res) => {
        Topic.findAll().then(topics => res.json(topics))
    })
    .post((req, res) => {
        Topic.create(req.body)
            .then(data => {
                res.json({ message: 'topic created', data })
            })
            .catch(e => {
                res.status(422).json({ message: e.errors[0].message })
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
            res.json({ message: 'topic updated' })
        })
    })
    .delete((req, res) => {
        Topic.destroy({ where: { id: req.params.id } }).then(() => {
            res.json({ message: 'topic deleted' })
        })
    })

router.route('/:id/projects')
    .get((req, res) => {
        Project.findAll({
            include: [
                {
                    model: Topic,
                    as: 'topics',
                    where: { id: req.params.id },
                    through: { attributes: [] }
                },
                {
                    model: Link,
                    as: 'links',
                    attributes: { exclude: ['project_id'] }
                }
            ]
        })
            .then(projects => res.json(projects))
    })

module.exports = router