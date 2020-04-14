const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/users')

const getToken = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { body } = request
  const token = getToken(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.title || !body.url) {
    return response.status(400).send({ error: 'missing title or url' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const res = await blog.save()
  const saveResult = await Blog.findById(res._id)
    .populate('user', { username: 1, name: 1 })

  user.blogs = user.blogs.concat(saveResult._id)
  await user.save()

  response.status(201).json(saveResult)
})

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const token = getToken(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(id)
  const user = await User.findById(blog.user)

  user.blogs = user.blogs.filter((b) => blog._id !== b)
  await user.save()

  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogRouter.post('/:id/comments', async (request, response) => {
  const { id } = request.params
  const { body } = request
  const blog = await Blog.findById(id)

  const updatedBlog = {
    user: blog.user,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    comments: blog.comments.concat(body.comment),
  }

  const res = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true })
  const updateResult = await Blog.findById(res._id)
    .populate('user', { username: 1, name: 1 })

  response.json(updateResult)
})

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { body } = request
  console.log(body)
  const token = getToken(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.find({ username: body.user.username })
  console.log(user[0])

  const blog = {
    user: user[0]._id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }

  const res = await Blog.findByIdAndUpdate(id, blog, { new: true })
  const updateResult = await Blog.findById(res._id)
    .populate('user', { username: 1, name: 1 })

  response.status(201).json(updateResult)
})

module.exports = blogRouter
