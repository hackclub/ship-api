const express = require('express')
const passport = require('passport')
const { topicIndex } = require('../../helpers/search')
const { Topic } = require('../../models')

const router = express.Router()

router.route('/')
    .get((req, res) => {
        Topic.query().then(topics => res.json(topics))
    })
    .post(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            Topic.query()
                .insert(req.body)
                .then(topic => {
                    const obj = { ...topic.dataValues, objectID: topic.id }
                    topicIndex.addObject(obj)
                    res.status(201).json({ message: 'topic created', data: topic })
                })
                .catch(e => {
                    res.status(422).json({ message: e.errors[0].message })
                })
        }
    )

router.route('/slug/:slug')
    .get((req, res) => {
        Topic.query()
            .findOne('slug', req.params.slug)
            .then(topic => {
                if (!topic) {
                    res.status(404).json({ message: 'topic not found' })
                    return
                }
                res.json(topic)
            })
    })

router.route('/:id')
    .get((req, res) => {
        Topic.query()
            .findById(req.params.id)
            .then(topic => {
                if (!topic) {
                    res.status(404).json({ message: 'topic not found' })
                    return
                }
                res.json(topic)
            })
    })
    .patch(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            Topic.query()
                .patchAndFetchById(req.params.id, req.body)
                .then(topic => {
                    if (!topic) {
                        res.status(404).json({ message: 'topic not found' })
                        return
                    }
                    const obj = { ...topic, objectID: req.params.id }
                    topicIndex.partialUpdateObject(obj)
                    res.status(202).json({ message: 'topic updated' })
                })
        }
    )
    .delete(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            Topic.query()
                .deleteById(req.params.id)
                .then(deletedCount => {
                    if (!deletedCount) {
                        res.status(404).json({ message: 'topic not found' })
                        return
                    }
                    topicIndex.deleteObject(req.params.id)
                    res.status(202).json({ message: 'topic deleted' })
                })
        }
    )

router.route('/:id/projects')
    .get((req, res) => {
        Topic.query()
            .findById(req.params.id)
            .then(topic => {
                if (!topic) {
                    res.status(404).json({ message: 'topic not found' })
                    return
                }
                topic.$relatedQuery('projects')
                    .eager('[creators, images, links, topics, main_image]')
                    .then(projects => res.json(projects))
            })
    })

module.exports = router