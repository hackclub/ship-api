const express = require('express')
const passport = require('passport')
const { User } = require('../../models')

const router = express.Router()

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

router.route('/auth/github')
    .get(passport.authenticate('github', { scope: ['user:email'] }))

router.route('/auth/github/callback')
    .get(
        passport.authenticate('github', { failureRedirect: `${process.env.SITE_URL}/login` }),
        (req, res) => {
            res.redirect(process.env.SITE_URL)
        }
    )

router.route('/auth/slack')
    .get(passport.authenticate('slack'))

router.route('/auth/slack/callback')
    .get(
        passport.authenticate('slack', { failureRedirect: `${process.env.SITE_URL}/login` }),
        (req, res) => {
            res.redirect(process.env.SITE_URL)
        }
    )

router.route('/current')
    .get((req, res) => {
        if (!req.user) {
            res.json({ message: 'authorization required' })
            return
        }
        res.json(req.user)
    })

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

module.exports = router