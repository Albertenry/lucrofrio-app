import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Cria instância do Pool
const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "lucrofrio",
    password: process.env.DB_PASS || "root",
    port: Number(process.env.DB_PORT) || 5432,
});

// Health-check
app.get("/health", (_req, res) => {
    res.send("OK");
});

// Rota de usuários: use app.get, não app.use
app.get(
    "/users",
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await pool.query("SELECT * FROM usuarios;");
            res.json(result.rows);
        } catch (err) {
            next(err);
        }
    }
);

// Error handler middleware
app.use(
    (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 API rodando na porta ${PORT}`);
});
