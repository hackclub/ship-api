const express = require('express')
const { Project } = require('../../models')

const router = express.Router()

router.route('/')
    .get((req, res) => {
        Project.findAll().then(projects => res.json(projects))
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
        Project.findById(req.params.id).then(project => {
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