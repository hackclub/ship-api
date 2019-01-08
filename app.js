import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import Knex from 'knex'
import { kebabCase } from 'lodash'
import morgan from 'morgan'
import { Model } from 'objection'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { Strategy as SlackStrategy } from 'passport-slack'
import winston from 'winston'
import { User } from './models'
import knexConfig from './knexfile'

const env = process.env.NODE_ENV || 'development'
const knex = Knex(knexConfig[env])
Model.knex(knex)
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
            timestamp: true
        })
    ],
    exitOnError: false
})
logger.stream.write = message => {
    logger.info(message)
}
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
                            github_id: profile.id,
                            avatar_url: profile.photos[0].value
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
                            slack_id: profile.user.id,
                            avatar_url: profile.user.image_192
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

app.use(morgan('combined', { stream: logger.stream }))
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
import CommentsController from './controllers/v1/comments'
import ProjectsController from './controllers/v1/projects'
import TopicsController from './controllers/v1/topics'
import UpvotesController from './controllers/v1/upvotes'
import UsersController from './controllers/v1/users'
app.use('/v1/comments', CommentsController)
app.use('/v1/projects', ProjectsController)
app.use('/v1/topics', TopicsController)
app.use('/v1/upvotes', UpvotesController)
app.use('/v1/users', UsersController)

const port = process.env.PORT || 3000

// Ensure database connection
knex.raw('SELECT 1')
    .then(() => {
        logger.info('Connected to database')
        app.listen(port, () => {
            logger.info(`Listening on port ${port}`)
        })
    })
    .catch(logger.error)