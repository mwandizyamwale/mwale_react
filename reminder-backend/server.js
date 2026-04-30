const app = require('./src/app')
const initDB = require('./src/models/initDB')
require('dotenv').config()

const PORT = process.env.PORT || 5000

async function start() {
  await initDB()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}

start()