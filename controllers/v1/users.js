import crypto from 'crypto'
import { User } from '../../models'

export const auth = (req, res) => {
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

export const current = (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: 'authorization required' })
        return
    }
    res.json(req.user)
}

export const getByUsername = (req, res) => {
    User.query()
        .findOne('username', req.params.username)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'user not found' })
                return
            }
            res.json(user)
        })
}

export const get = (req, res) => {
    User.query()
        .findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'user not found' })
                return
            }
            res.json(user)
        })
}

export const getProjects = (req, res) => {
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
}

export const getUpvotes = (req, res) => {
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
}