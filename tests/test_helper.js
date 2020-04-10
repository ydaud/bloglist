const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/users')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Angular patterns',
    author: 'Michael Chan',
    url: 'https://angularpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

const initialUsers = [
  {
    username: 'root',
    name: 'superuser',
    password: 'root',
  },
  {
    username: 'mChan',
    name: 'Michael Chan',
    password: 'myPassword',
  },
  {
    username: 'dijkstra',
    name: 'Edger W. Dijkstra',
    password: 'myPasswordToo',
  },
]

const generateHash = async () => {
  let hashedUsers = []
  for (let i = 0; i < initialUsers.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const passwordHash = await bcrypt.hash(initialUsers[i].password, 10)
    const user = { ...initialUsers[i], passwordHash }
    delete user.password
    hashedUsers = hashedUsers.concat(user)
  }
  return hashedUsers
}

const populateInitialUsers = async () => {
  const hashedUsers = await generateHash()

  const userObjects = hashedUsers.map((user) => new User(user))
  const promiseArray = userObjects.map((user) => user.save())
  await Promise.all(promiseArray)
}

const populateInitialBlogs = async (users) => {
  const blogObjects = initialBlogs.map((blog) => {
    const user = users.find((u) => u.name === blog.author)._id
    blog = new Blog({ ...blog, user })
    return blog
  })
  let promiseArray = blogObjects.map((blog) => blog.save())
  const blogs = await Promise.all(promiseArray)

  blogs.forEach((blog) => {
    const user = users.find((u) => u._id === blog.user)
    user.blogs = user.blogs.concat(blog._id)
  })
  promiseArray = users.map((user) => user.save())
  users = await Promise.all(promiseArray)
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user')
  return blogs
}

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  initialBlogs,
  blogsInDb,
  initialUsers,
  usersInDb,
  generateHash,
  populateInitialUsers,
  populateInitialBlogs,
}
