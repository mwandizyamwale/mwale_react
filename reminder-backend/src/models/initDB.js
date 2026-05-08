const { getPool } = require('../config/mysql')

async function initDB() {
  const pool = await getPool()

  await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM sysobjects WHERE name='users' AND xtype='U'
    )
    CREATE TABLE users (
      id INT IDENTITY(1,1) PRIMARY KEY,
      username NVARCHAR(100)  NOT NULL,
      email NVARCHAR(255)  NOT NULL UNIQUE,
      password_hash NVARCHAR(255)  NOT NULL,
      created_at DATETIME2  DEFAULT GETDATE()
    )
  `)

  await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM sysobjects WHERE name='tasks' AND xtype='U'
    )
    CREATE TABLE tasks (
      id INT IDENTITY(1,1) PRIMARY KEY,
      user_id INT            NOT NULL,
      title NVARCHAR(100) NOT NULL,
      [desc] NVARCHAR(MAX) NOT NULL,
      status NVARCHAR(20) NOT NULL DEFAULT 'pending',
      priority NVARCHAR(10) NOT NULL DEFAULT 'med',
      due DATE NOT NULL,
      created_at DATETIME2  DEFAULT GETDATE(),
      CONSTRAINT fk_tasks_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  console.log('Database tables ready.')
}

module.exports = initDB
