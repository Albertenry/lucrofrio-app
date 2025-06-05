import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query as dbQuery } from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Função auxiliar para gerar token JWT
const gerarToken = (user) => {
  const payload = {
    user: {
      id: user.id,
      email: user.email,
      funcao: user.funcao,
    },
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { nome_completo, email, senha, funcao, empresa_id, login } = req.body;

  if (!nome_completo || !email || !login || !senha || !funcao || !empresa_id) {
    return res.status(400).json({ msg: 'Todos os campos são obrigatórios.' });
  }

  try {
    const emailFormatado = email.toLowerCase();

    const userCheck = await dbQuery('SELECT * FROM usuarios WHERE email = $1', [emailFormatado]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'Usuário já existe com este e-mail.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const result = await dbQuery(
      'INSERT INTO usuarios (nome_completo, email, login, senha, funcao, empresa_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome_completo, emailFormatado, login || emailFormatado, hashedPassword, funcao, empresa_id]
    );

    const user = result.rows[0];
    const token = gerarToken(user);

    res.json({ token, user });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err.message);
    res.status(500).send('Erro no servidor.');
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha.trim()) {
    return res.status(400).json({ msg: 'E-mail e senha válidos são obrigatórios.' });
  }

  try {
    const emailFormatado = email.toLowerCase();

    const result = await dbQuery('SELECT * FROM usuarios WHERE email = $1', [emailFormatado]);
    if (result.rows.length === 0) {
      return res.status(401).json({ msg: 'Credenciais inválidas.' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Credenciais inválidas.' });
    }

    const token = gerarToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        nome_completo: user.nome_completo,
        email: user.email,
        funcao: user.funcao,
        empresa_id: user.empresa_id,
      },
    });
  } catch (err) {
    console.error('Erro ao fazer login:', err.message);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// @route   GET /api/auth/usuarios
router.get('/usuarios', auth, async (req, res) => {
  try {
    if (req.user.funcao !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado.' });
    }

    const result = await dbQuery('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err.message);
    res.status(500).send('Erro no servidor.');
  }
});

// @route   GET /api/auth/usuarios/:id
router.get('/usuarios/:id', auth, async (req, res) => {
  try {
    if (req.user.funcao !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado.' });
    }

    const result = await dbQuery('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err.message);
    res.status(500).send('Erro no servidor.');
  }
});

// @route   PUT /api/auth/usuarios/:id
router.put('/usuarios/:id', auth, async (req, res) => {
  try {
    if (req.user.funcao !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado.' });
    }

    const { nome_completo, email, senha, funcao, empresa_id, login } = req.body;

    const userCheck = await dbQuery('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    let sql = '';
    let values = [];

    if (senha) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(senha, salt);
      sql = `
        UPDATE usuarios 
        SET nome_completo = $1, email = $2, senha = $3, funcao = $4, empresa_id = $5, login = $6
        WHERE id = $7
        RETURNING *
      `;
      values = [nome_completo, email, hashedPassword, funcao, empresa_id, login || email, req.params.id];
    } else {
      sql = `
        UPDATE usuarios 
        SET nome_completo = $1, email = $2, funcao = $3, empresa_id = $4, login = $5
        WHERE id = $6
        RETURNING *
      `;
      values = [nome_completo, email, funcao, empresa_id, login || email, req.params.id];
    }

    const result = await dbQuery(sql, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err.message);
    res.status(500).send('Erro no servidor.');
  }
});

// @route   DELETE /api/auth/usuarios/:id
router.delete('/usuarios/:id', auth, async (req, res) => {
  try {
    if (req.user.funcao !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado.' });
    }

    const userCheck = await dbQuery('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    await dbQuery('DELETE FROM usuarios WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Usuário removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err.message);
    res.status(500).send('Erro no servidor.');
  }
});

export default router;
