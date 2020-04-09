const app = require('./app')
const http = require('http')
const config = require('./utils/config')

const server = http.createServer(app)

server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})


/*

const express = require('express')
const app = express()
const cors = require('cors')
const Blog = require('./models/bloglist')

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

app.post('/api/blogs', (request, response) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
*/
