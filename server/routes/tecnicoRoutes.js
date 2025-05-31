import express from 'express';
import auth from '../middleware/auth.js';
import { query } from '../config/db.js'; // <- aqui é o ajuste principal

const router = express.Router();

router.get('/ordens', auth, async (req, res) => {
    try {
        const tecnicoId = req.user.id;

        const result = await query(
            `SELECT o.*, c.nome as cliente_nome, c.endereco as cliente_endereco 
             FROM ordens_servico o
             JOIN clientes c ON o.cliente_id = c.id
             WHERE o.tecnico_id = $1
             ORDER BY o.criado_em DESC`,
            [tecnicoId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

router.put('/ordens/:id/status', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, hora_chegada, hora_saida } = req.body;
        const tecnicoId = req.user.id;

        const ordemCheck = await query(
            'SELECT * FROM ordens_servico WHERE id = $1 AND tecnico_id = $2',
            [id, tecnicoId]
        );

        if (ordemCheck.rows.length === 0) {
            return res.status(401).json({ msg: 'Não autorizado' });
        }

        const result = await query(
            `UPDATE ordens_servico 
             SET status = $1, hora_chegada = $2, hora_saida = $3
             WHERE id = $4 AND tecnico_id = $5
             RETURNING *`,
            [status, hora_chegada, hora_saida, id, tecnicoId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

router.get('/solicitacoes', auth, async (req, res) => {
    try {
        const tecnicoId = req.user.id;

        const result = await query(
            `SELECT s.* 
             FROM solicitacoes s
             JOIN ordens_servico o ON s.ordem_id = o.id
             WHERE o.tecnico_id = $1
             ORDER BY s.id DESC`,
            [tecnicoId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

router.get('/avaliacao', auth, async (req, res) => {
    try {
        const tecnicoId = req.user.id;

        const result = await query(
            `SELECT AVG(avaliacao) as media_avaliacao, COUNT(*) as total_ordens
             FROM ordens_servico
             WHERE tecnico_id = $1 AND status = 'Concluído'`,
            [tecnicoId]
        );

        const tempoResult = await query(
            `SELECT AVG(
                EXTRACT(EPOCH FROM (hora_saida::timestamp - hora_chegada::timestamp))/60
            ) as tempo_medio_minutos
             FROM ordens_servico
             WHERE tecnico_id = $1 
             AND status = 'Concluído'
             AND hora_chegada IS NOT NULL 
             AND hora_saida IS NOT NULL`,
            [tecnicoId]
        );

        res.json({
            avaliacao: result.rows[0].media_avaliacao || 0,
            total_ordens: result.rows[0].total_ordens || 0,
            tempo_medio: tempoResult.rows[0].tempo_medio_minutos || 0
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

router.get('/sugestoes/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const tecnicoId = req.user.id;

        const ordem = await query(
            `SELECT o.*, c.nome as cliente_nome
             FROM ordens_servico o
             JOIN clientes c ON o.cliente_id = c.id
             WHERE o.id = $1 AND o.tecnico_id = $2`,
            [id, tecnicoId]
        );

        if (ordem.rows.length === 0) {
            return res.status(401).json({ msg: 'Não autorizado' });
        }

        const descricao = ordem.rows[0].descricao.toLowerCase();

        let ferramentas = [];
        let instrucoes = [];

        if (descricao.includes('gelo') || descricao.includes('evaporador')) {
            ferramentas = ['Soprador térmico', 'Alicate de corte', 'Multímetro', 'Chave de fenda'];
            instrucoes = [
                'Desligue o equipamento da tomada antes de iniciar o serviço',
                'Verifique se há acúmulo de gelo no evaporador',
                'Utilize o soprador térmico para derreter o gelo com cuidado',
                'Verifique se o sistema de degelo está funcionando corretamente',
                'Teste o termostato para garantir que está operando na temperatura correta'
            ];
        } else if (descricao.includes('contactor') || descricao.includes('cabo')) {
            ferramentas = ['Alicate', 'Chave de fenda', 'Chave Philips', 'Multímetro', 'Fita isolante'];
            instrucoes = [
                'Desligue a energia antes de iniciar o serviço',
                'Identifique o contactor com defeito',
                'Desconecte os cabos, marcando suas posições',
                'Substitua o contactor por um novo do mesmo modelo',
                'Reconecte os cabos nas posições corretas',
                'Teste o funcionamento após a instalação'
            ];
        } else if (descricao.includes('rendimento') || descricao.includes('ilha')) {
            ferramentas = ['Manifold', 'Termômetro infravermelho', 'Vacuômetro', 'Detector de vazamento'];
            instrucoes = [
                'Verifique a pressão do sistema de refrigeração',
                'Meça a temperatura de saída do ar',
                'Verifique se há vazamentos no sistema',
                'Limpe os condensadores se necessário',
                'Verifique o nível de refrigerante e complete se necessário'
            ];
        } else {
            ferramentas = ['Kit de ferramentas básicas', 'Multímetro', 'Manifold', 'Termômetro'];
            instrucoes = [
                'Realize uma inspeção visual completa do equipamento',
                'Verifique conexões elétricas e mecânicas',
                'Teste o funcionamento do sistema',
                'Documente todas as observações e medições',
                'Comunique ao cliente as condições encontradas'
            ];
        }

        res.json({
            ordem: ordem.rows[0],
            sugestoes: {
                ferramentas,
                instrucoes
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

export default router;
