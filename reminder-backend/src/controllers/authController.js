const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getPool, sql } = require('../config/db')

async function register(req, res) {
  const { username, email, password } = req.body

  if (!username || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' })

  if (username.trim().length < 2)
    return res.status(400).json({ error: 'Username must be at least 2 characters.' })

  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' })

  try {
    const pool = await getPool()

    // Check if email already exists
    const existing = await pool.request()
      .input('email', sql.NVarChar, email.toLowerCase())
      .query('SELECT id FROM users WHERE email = @email')

    if (existing.recordset.length > 0)
      return res.status(409).json({ error: 'Email already registered.' })


    const password_hash = await bcrypt.hash(password, 12)

    const result = await pool.request()
      .input('username',  sql.NVarChar, username.trim())
      .input('email', sql.NVarChar, email.toLowerCase())
      .input('password_hash', sql.NVarChar, password_hash)
      .query(`
        INSERT INTO users (username, email, password_hash)
        OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.created_at
        VALUES (@username, @email, @password_hash)
      `)

    const user = result.recordset[0]

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error during registration.' })
  }
}

async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' })

  try {
    const pool = await getPool()

    const result = await pool.request()
      .input('email', sql.NVarChar, email.toLowerCase())
      .query('SELECT * FROM users WHERE email = @email')

    const user = result.recordset[0]
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password.' })

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password.' })

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error during login.' })
  }
}

module.exports = { register, login }