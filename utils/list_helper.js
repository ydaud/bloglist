// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (currMax, blog) => (blog.likes > currMax.likes
    ? blog
    : currMax)

  return blogs.length === 0
    ? null
    : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  const authors = blogs.reduce((list, blog) => {
    const b = list[blog.author]
      ? list[blog.author].blogs
      : 0
    list[blog.author] = {
      author: blog.author,
      blogs: b + 1,
    }
    return list
  }, {})

  const resultArray = Object.values(authors)

  const reducer = (currMax, author) => (author.blogs > currMax.blogs
    ? author
    : currMax)

  return blogs.length === 0
    ? null
    : resultArray.reduce(reducer, resultArray[0])
}


const mostLikes = (blogs) => {
  const authors = blogs.reduce((list, blog) => {
    const num = list[blog.author] ? list[blog.author].likes + blog.likes : blog.likes
    list[blog.author] = {
      author: blog.author,
      likes: num,
    }
    return list
  }, {})

  const resultArray = Object.values(authors)

  const reducer = (currMax, author) => (author.likes > currMax.likes
    ? author
    : currMax)

  return blogs.length === 0
    ? null
    : resultArray.reduce(reducer, resultArray[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
