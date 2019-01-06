const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const Knex = require('knex')
const { kebabCase } = require('lodash')
const { Model } = require('objection')
const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const SlackStrategy = require('passport-slack').Strategy
const { User } = require('./models')
const knexConfig = require('./knexfile')

const env = process.env.NODE_ENV || 'development'
const knex = Knex(knexConfig[env])
Model.knex(knex)
const app = express()

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.query()
        .findById(id)
        .then(user => {
            done(null, user)
        })
})

// Set up Passport
passport.use(new BearerStrategy(
    (token, done) => {
        User.query()
            .findOne('auth_token', token)
            .then(user => {
                if (user) {
                    done(null, user)
                }
            })
    }
))
passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/v1/users/auth/github/callback`
    },
    (accessToken, refreshToken, profile, done) => {
        const hasGitHubEmail = profile.hasOwnProperty('emails') && profile.emails.length > 0
        const githubEmail = hasGitHubEmail ? profile.emails[0].value : null
        if (!hasGitHubEmail) {
            done(null, false)
            return
        }
        User.query()
            .where('email', githubEmail) // User is already in database, but hasn't linked GitHub
            .orWhere('github_id', profile.id) // User has linked GitHub already
            .first()
            .then(user => {
                if (!user) {
                    User.query()
                        .insert({
                            email: githubEmail,
                            username: profile.username,
                            github_id: profile.id
                        })
                        .then(newUser => {
                            done(null, newUser)
                        })
                    return
                }
                done(null, user)
            })
    }
))
passport.use(new SlackStrategy(
    {
        clientID: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/v1/users/auth/slack/callback`,
        scope: ['identity.basic']
    },
    (accessToken, refreshToken, profile, done) => {
        User.query()
            .where('email', profile.user.email) // User is already in database, but hasn't linked Slack
            .orWhere('slack_id', profile.user.id) // User has linked Slack already
            .first()
            .then(user => {
                if (!user) {
                    User.query()
                        .insert({
                            email: profile.user.email,
                            username: kebabCase(profile.username),
                            slack_id: profile.user.id
                        })
                        .then(newUser => {
                            done(null, newUser)
                        })
                    return
                }
                done(null, user)
            })
    }
))

app.use(cors({
    origin: [
        'https://ship.hackclub.com',
        'https://ship-hackclub.netlify.com',
        'http://localhost:8000'
    ]
}))
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/v1/comments', require('./controllers/v1/comments'))
app.use('/v1/projects', require('./controllers/v1/projects'))
app.use('/v1/topics', require('./controllers/v1/topics'))
app.use('/v1/upvotes', require('./controllers/v1/upvotes'))
app.use('/v1/users', require('./controllers/v1/users'))

const port = process.env.PORT || 3000

// Ensure database connection
knex.raw('SELECT 1')
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        })
    })
    .catch(console.error)