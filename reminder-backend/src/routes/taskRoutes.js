const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { getTasks, createTask, toggleTask, deleteTask } = require('../controllers/taskController')

const router = express.Router()

router.use(authMiddleware)  

router.get('/', getTasks)
router.post('/', createTask)
router.patch('/:id/toggle', toggleTask)
router.delete('/:id', deleteTask)

module.exports = router