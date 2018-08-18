const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const SlackStrategy = require('passport-slack').Strategy
const { User, Sequelize, sequelize } = require('./models')
const { Op } = Sequelize
const app = express()

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user)
    })
})

// Set up Passport
passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/v1/users/auth/github/callback`
    },
    (accessToken, refreshToken, profile, done) => {
        const hasGitHubEmail = typeof profile.emails[0] !== 'undefined'
        User.findOrCreate({
            where: {
                [Op.or]: [
                    { email: profile.emails[0].value }, // User is already in database, but hasn't linked GitHub
                    { github_id: profile.id } // User has linked GitHub already
                ]
            },
            defaults: {
                email: hasGitHubEmail ? profile.emails[0].value : null,
                username: profile.username,
                github_id: profile.id
            }
        })
            .spread((user, created) => {
                if (created) {
                    console.log('New user created using GitHub')
                }
                done(null, user)
            })
    }
))
passport.use(new SlackStrategy(
    {
        clientID: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/v1/users/auth/slack/callback`
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOrCreate({
            where: {
                [Op.or]: [
                    { email: profile.user.email }, // User is already in database, but hasn't linked Slack
                    { slack_id: profile.user.id } // User has linked Slack already
                ]
            },
            defaults: {
                email: profile.user.email,
                username: profile.user.name,
                slack_id: profile.user.id
            }
        })
            .spread((user, created) => {
                if (created) {
                    console.log('New user created using Slack')
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
app.use('/v1/projects', require('./controllers/v1/projects'))
app.use('/v1/topics', require('./controllers/v1/topics'))
app.use('/v1/users', require('./controllers/v1/users'))

const port = process.env.PORT || 3000

sequelize.authenticate()
    .then(() => {
        console.log('Connected to database')
        app.listen(port, () => console.log(`Listening on port ${port}`))
    })
    .catch(console.error)