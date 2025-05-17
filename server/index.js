import express, { json } from 'express';
import cors from 'cors';
import { query } from './config/db';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// Rota de teste
app.get('/', (_req, res) => {
    res.json({ message: 'API do Lucrofrio Manager funcionando!' });
});

// Rota de login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await query(
            'SELECT u.id, u.nome_completo, u.email, u.funcao, e.id as empresa_id, e.nome as empresa_nome FROM usuarios u JOIN empresas e ON u.empresa_id = e.id WHERE u.email = $1 AND u.senha = $2',
            [email, password]
        );

        if (result.rows.length > 0) {
            // Não envie a senha de volta
            const user = result.rows[0];
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
