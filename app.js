const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const logger = require('./utils/logging')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')

logger.info('connecting to', config.DB_URI)

mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error("error connecting to MongoDB:", error)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
