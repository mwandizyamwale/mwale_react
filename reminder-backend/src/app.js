const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))  
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/', (req, res) => res.json({ message: 'Reminder API is running.' }))

module.exports = app