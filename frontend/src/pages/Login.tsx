import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    console.log("🚀 Login montado");
    const navigate = useNavigate();
    const [email, setEmail] = useState("albertenry2@gmail.com");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: chamar API /auth/login e receber token + role
        // Exemplo de fluxo simulado:
        console.log("Entrando com:", { email, password });
        // Em produção, após sucesso:
        navigate("/admin"); // ou /empresa, /tecnico conforme o role
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-primary mb-6">
                    lucrofrio-manager
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div className="flex justify-between text-sm">
                        <button
                            type="button"
                            onClick={() => alert("Enviar link de recuperação por e-mail")}
                            className="text-primary hover:underline"
                        >
                            Esqueci minha senha
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
