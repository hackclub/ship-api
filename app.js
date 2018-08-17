const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const { sequelize } = require('./models')

const app = express()

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

// Routes
app.use('/v1/projects', require('./controllers/v1/projects'))
app.use('/v1/topics', require('./controllers/v1/topics'))

const port = process.env.PORT || 3000

sequelize.authenticate()
    .then(() => {
        console.log('Connected to database')
        app.listen(port, () => console.log(`Listening on port ${port}`))
    })
    .catch(console.error)