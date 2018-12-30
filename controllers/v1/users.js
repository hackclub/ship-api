const crypto = require('crypto')
const express = require('express')
const passport = require('passport')
const { ProjectImage, ProjectLink, Topic, User } = require('../../models')

const router = express.Router()

router.route('/auth/github')
    .get(passport.authenticate('github', { scope: ['user:email'] }))

router.route('/auth/github/callback')
    .get(
        passport.authenticate('github', { failureRedirect: `${process.env.SITE_URL}/login?status=failed` }),
        (req, res) => {
            const authToken = crypto.randomBytes(32).toString('hex')
            const data = {
                auth_token: authToken,
                auth_token_created_at: new Date().toISOString()
            }
            User.update(data, { where: { id: req.user.id } }).then(() => {
                res.redirect(`${process.env.SITE_URL}/login?status=success&auth_token=${authToken}`)
            })
        }
    )

router.route('/auth/slack')
    .get(passport.authenticate('slack'))

router.route('/auth/slack/callback')
    .get(
        passport.authenticate('slack', { failureRedirect: `${process.env.SITE_URL}/login?status=failed` }),
        (req, res) => {
            const authToken = crypto.randomBytes(32).toString('hex')
            const data = {
                auth_token: authToken,
                auth_token_created_at: new Date().toISOString()
            }
            User.update(data, { where: { id: req.user.id } }).then(() => {
                res.redirect(`${process.env.SITE_URL}/login?status=success&auth_token=${authToken}`)
            })
        }
    )

router.route('/current')
    .get(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            if (!req.user) {
                res.status(401).json({ message: 'authorization required' })
                return
            }
            res.json(req.user)
        }
    )

router.route('/username/:username')
    .get((req, res) => {
        User.findOne({ where: { username: req.params.username } }).then(user => {
            if (user) {
                res.json(user)
            }
            else {
                res.status(404).json({ message: 'user not found' })
            }
        })
    })

router.route('/:id')
    .get((req, res) => {
        User.findById(req.params.id).then(user => {
            if (user) {
                res.json(user)
            }
            else {
                res.status(404).json({ message: 'user not found' })
            }
        })
    })

router.route('/:id/projects')
    .get((req, res) => {
        User.findById(req.params.id)
            .then(user => {
                if (user) {
                    user.getProjects({
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
                            }
                        ],
                        joinTableAttributes: []
                    })
                        .then(projects => res.json(projects))
                }
                else {
                    res.status(404).json({ message: 'user not found' })
                }
            })
    })

module.exports = router