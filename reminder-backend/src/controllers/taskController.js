const { getPool, sql } = require('../config/mysql')

async function getTasks(req, res) {
  try {
    const pool = await getPool()
    const result = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query('SELECT * FROM tasks WHERE user_id = @user_id ORDER BY created_at DESC')
    res.json(result.recordset)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch tasks.' })
  }
}

async function createTask(req, res) {
  const { title, desc, status, priority, due } = req.body

  if (!title || !desc || !due)
    return res.status(400).json({ error: 'Title, description and due date are required.' })

  try {
    const pool = await getPool()
    const result = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .input('title', sql.NVarChar, title.trim())
      .input('desc', sql.NVarChar, desc.trim())
      .input('status', sql.NVarChar, status   || 'pending')
      .input('priority', sql.NVarChar, priority || 'med')
      .input('due', sql.Date,     due)
      .query(`
        INSERT INTO tasks (user_id, title, [desc], status, priority, due)
        OUTPUT INSERTED.*
        VALUES (@user_id, @title, @desc, @status, @priority, @due)
      `)
    res.status(201).json(result.recordset[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create task.' })
  }
}

async function toggleTask(req, res) {
  const { id } = req.params
  try {
    const pool = await getPool()
    const found = await pool.request()
      .input('id', sql.Int, id)
      .input('user_id', sql.Int, req.user.id)
      .query('SELECT * FROM tasks WHERE id = @id AND user_id = @user_id')

    if (!found.recordset.length)
      return res.status(404).json({ error: 'Task not found.' })

    const current = found.recordset[0].status
    const next = current === 'done' ? 'pending' : 'done'

    const result = await pool.request()
      .input('status', sql.NVarChar, next)
      .input('id', sql.Int, id)
      .input('user_id', sql.Int, req.user.id)
      .query(`
        UPDATE tasks SET status = @status
        OUTPUT INSERTED.*
        WHERE id = @id AND user_id = @user_id
      `)

    res.json(result.recordset[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to toggle task.' })
  }
}

async function deleteTask(req, res) {
  const { id } = req.params
  try {
    const pool = await getPool()
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('user_id', sql.Int, req.user.id)
      .query('DELETE FROM tasks WHERE id = @id AND user_id = @user_id')

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ error: 'Task not found.' })

    res.json({ message: 'Task deleted.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete task.' })
  }
}

module.exports = { getTasks, createTask, toggleTask, deleteTask }
