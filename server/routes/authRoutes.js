import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/auth/register
router.post('/register', async (req, res) => {
  console.log('Body recebido no login:', req.body);
  const { nome_completo, email, senha, funcao, empresa_id } = req.body;

  try {
    const userCheck = await query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const result = await query(
      'INSERT INTO usuarios (nome_completo, email, senha, funcao, empresa_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome_completo, email, hashedPassword, funcao, empresa_id]
    );

    const user = result.rows[0];

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        funcao: user.funcao
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        funcao: user.funcao
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          nome_completo: user.nome_completo,
          email: user.email,
          funcao: user.funcao,
          empresa_id: user.empresa_id
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @route   GET api/auth/usuarios
router.get('/usuarios', auth, async (req, res) => {
  try {
    if (req.user.funcao !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    const result = await query('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @route   GET api/auth/usuarios/:id
router.get('/usuarios/:id', auth, async (req, res) => {
  try {
    if (req.user.funcao !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    const result = await query('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @route   PUT api/auth/usuarios/:id
router.put('/usuarios/:id', auth, async (req, res) => {
  try {
    if (req.user.funcao !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    const { nome_completo, email, senha, funcao, empresa_id } = req.body;

    const userCheck = await query('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    let sql = '';
    let values = [];

    if (senha) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(senha, salt);

      sql = `
        UPDATE usuarios 
        SET nome_completo = $1, email = $2, senha = $3, funcao = $4, empresa_id = $5
        WHERE id = $6
        RETURNING *
      `;
      values = [nome_completo, email, hashedPassword, funcao, empresa_id, req.params.id];
    } else {
      sql = `
        UPDATE usuarios 
        SET nome_completo = $1, email = $2, funcao = $3, empresa_id = $4
        WHERE id = $5
        RETURNING *
      `;
      values = [nome_completo, email, funcao, empresa_id, req.params.id];
    }

    const result = await query(sql, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @route   DELETE api/auth/usuarios/:id
router.delete('/usuarios/:id', auth, async (req, res) => {
  try {
    if (req.user.funcao !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    const userCheck = await query('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    await query('DELETE FROM usuarios WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Usuário removido' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

export default router;
