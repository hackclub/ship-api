const express = require('express')
const { Project, ProjectURL, Topic } = require('../../models')

const router = express.Router()

router.route('/')
    .get((req, res) => {
        Project.findAll({
            include: [
                {
                    model: Topic,
                    as: 'topics',
                    through: { attributes: [] }
                },
                {
                    model: ProjectURL,
                    as: 'urls',
                    attributes: { exclude: ['project_id'] }
                }
            ]
        })
            .then(projects => res.json(projects))
    })
    .post((req, res) => {
        Project.create(req.body)
            .then(data => {
                res.json({ message: 'project created', data })
            })
            .catch(e => {
                res.status(422).json({ message: e.errors[0].message })
            })
    })

router.route('/:id')
    .get((req, res) => {
        const allowedFields = ['id', 'slug']
        const canSearchBy = field => allowedFields.includes(field)
        const searchBy = canSearchBy(req.query.by) ? req.query.by : 'id'
        if (searchBy === 'id' && !Number.isInteger(parseInt(req.params.id))) {
            res.json({ message: '`id` needs to be an integer' })
            return
        }
        Project.findOne({
            include: [
                {
                    model: Topic,
                    as: 'topics',
                    through: { attributes: [] }
                },
                {
                    model: ProjectURL,
                    as: 'urls',
                    attributes: { exclude: ['project_id'] }
                }
            ],
            where: { [searchBy]: req.params.id }
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
            res.json({ message: 'project updated' })
        })
    })
    .delete((req, res) => {
        Project.destroy({ where: { id: req.params.id } }).then(() => {
            res.json({ message: 'project deleted' })
        })
    })

module.exports = router