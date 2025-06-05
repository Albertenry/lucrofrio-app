import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
    // Obter token do header
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'Sem token, autorização negada' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adiciona usuário ao objeto request
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Erro na verificação do token:', err.message);

        const isDev = process.env.NODE_ENV !== 'production';
        res.status(401).json({
            msg: 'Token inválido',
            ...(isDev && { error: err.message })
        });
    }
};

export default auth;
