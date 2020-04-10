const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/users')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await helper.populateInitialUsers()

  const users = await helper.usersInDb()

  await helper.populateInitialBlogs(users)
})

describe('simple:', () => {
  test('blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)

    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)

    expect(response.body.length).toBe(helper.initialUsers.length)
  })

  test('login success', async () => {
    const details = {
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password,
    }

    const response = await api
      .post('/login')
      .send(details)
      .expect(200)

    expect(response.body.token).toBeDefined()
  })

  test('login fail', async () => {
    const details = {
      username: helper.initialUsers[1].username,
      password: helper.initialUsers[0].password,
    }

    const response = await api
      .post('/login')
      .send(details)
      .expect(401)

    expect(response.body.error).toContain('invalid username or password')
  })
})

describe('adding data', () => {
  test('adding user success', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'test',
      name: 'Test Name',
      password: 'testPassword',
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(200)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
  })

  test('adding user fail', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      name: 'Test Name',
      password: 'testPassword',
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
