import crypto from 'crypto'
import express from 'express'
import passport from 'passport'
import { User } from '../../models'

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
            User.query()
                .patchAndFetchById(req.user.id, data)
                .then(() => {
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
            User.query()
                .patchAndFetchById(req.user.id, data)
                .then(() => {
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
        User.query()
            .findOne('username', req.params.username)
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'user not found' })
                    return
                }
                res.json(user)
            })
    })

router.route('/:id')
    .get((req, res) => {
        User.query()
            .findById(req.params.id)
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'user not found' })
                    return
                }
                res.json(user)
            })
    })

router.route('/:id/projects')
    .get((req, res) => {
        User.query()
            .findById(req.params.id)
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'user not found' })
                    return
                }
                user.$relatedQuery('projects')
                    .eager('[creators, images, links, topics, main_image]')
                    .then(projects => res.json(projects))
            })
    })

router.route('/:id/upvotes')
    .get((req, res) => {
        User.query()
            .findById(req.params.id)
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'user not found' })
                    return
                }
                user.$relatedQuery('upvotes')
                    .then(upvotes => res.json(upvotes))
            })
    })

export default router