require('dotenv').config()

const { PORT } = process.env
let { DB_URI } = process.env

const { NODE_ENV } = process.env

if (NODE_ENV === 'test') {
  DB_URI = process.env.TEST_DB_URI
}

module.exports = {
  PORT,
  DB_URI,
  NODE_ENV,
}
