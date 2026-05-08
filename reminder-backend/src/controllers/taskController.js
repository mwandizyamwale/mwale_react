const pool = require("../config/mysql");

async function getTasks(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
}

async function createTask(req, res) {
  const { title, description, status, priority, due_date } = req.body;

  if (!title || !description)
    return res.status(400).json({ error: "Title and description required." });

  try {
    const [result] = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        description,
        status || "pending",
        priority || "med",
        due_date || null,
      ]
    );

    const [newTask] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newTask[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task." });
  }
}

async function toggleTask(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT status FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (!rows.length)
      return res.status(404).json({ error: "Task not found." });

    const next = rows[0].status === "done" ? "pending" : "done";

    await pool.query(
      "UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?",
      [next, id, req.user.id]
    );

    const [updated] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle task." });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Task not found." });

    res.json({ message: "Task deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task." });
  }
}

module.exports = { getTasks, createTask, toggleTask, deleteTask };
