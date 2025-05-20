import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const result = await query(
            `SELECT u.id, u.nome_completo, u.email, u.funcao, u.senha, u.empresa_id, e.nome as empresa_nome
             FROM usuarios u
             JOIN empresas e ON u.empresa_id = e.id
             WHERE u.email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const user = result.rows[0];

        if (!user.senha) {
            return res.status(500).json({ message: 'Senha não encontrada no banco de dados.' });
        }

        const senhaValida = await bcrypt.compare(password, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { id: user.id, nome: user.nome_completo, funcao: user.funcao },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        delete user.senha; // remove a senha antes de retornar o usuário

        res.json({ token, user });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// REGISTRO
export const registrarUsuario = async (req, res) => {
    const { empresa_id, nome_completo, email, funcao, login, senha } = req.body;

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const result = await query(
            `INSERT INTO usuarios (empresa_id, nome_completo, email, funcao, login, senha)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, nome_completo, email, funcao, empresa_id, login`,
            [empresa_id, nome_completo, email, funcao, login, senhaHash]
        );

        res.status(201).json({ usuario: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            res.status(409).json({ message: 'E-mail já cadastrado. Tente outro.' });
        } else {
            console.error('Erro ao registrar usuário:', err);
            res.status(500).json({ message: 'Erro ao registrar usuário' });
        }
    }
};
