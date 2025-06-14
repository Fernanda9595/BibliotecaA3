const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'biblioteca',
  port: process.env.DB_PORT || 5432,
});

pool.connect()
  .then(() => {
    console.log('Conectado ao PostgreSQL!');
    return pool.query(`
      CREATE TABLE IF NOT EXISTS livros (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255),
        autor VARCHAR(255)
      )
    `);
  })
  .catch(err => console.error('Erro na conexão com o banco:', err));

app.get('/livros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM livros');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/livros', async (req, res) => {
  const { titulo, autor } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO livros (titulo, autor) VALUES ($1, $2) RETURNING *',
      [titulo, autor]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});
