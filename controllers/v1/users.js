const express = require('express')
const passport = require('passport')

const router = express.Router()

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

module.exports = router