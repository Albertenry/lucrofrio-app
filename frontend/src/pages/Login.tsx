import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('albertenry3@gmail.com'); // exemplo de usuário existente
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [isRecovering, setIsRecovering] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoverySuccess, setRecoverySuccess] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), // ✅ corrigido aqui
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }

            const { token, usuario } = await response.json();

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(usuario));

            // 🔐 Redirecionamento conforme a função (não 'role', e sim 'funcao')
            if (usuario.funcao === 'admin') {
                navigate('/admin/dashboard');
            } else if (usuario.funcao === 'supervisor') {
                navigate('/supervisor/dashboard');
            } else if (usuario.funcao === 'tecnico') {
                navigate('/tecnico/dashboard');
            } else {
                setError('Perfil não reconhecido.');
            }
        } catch (err) {
            setError('Erro no login: ' + (err as Error).message);
        }
    };

    const handleRecovery = (e: React.FormEvent) => {
        e.preventDefault();
        setRecoverySuccess(true);
    };

    if (isRecovering) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-primary">Recuperar Senha</h2>
                        <p className="text-gray-600 mt-2">Enviaremos instruções para seu email</p>
                    </div>

                    {recoverySuccess ? (
                        <div className="text-center">
                            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                                Email de recuperação enviado com sucesso!
                            </div>
                            <button
                                onClick={() => { setIsRecovering(false); setRecoverySuccess(false); }}
                                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                            >
                                Voltar ao Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleRecovery}>
                            <div className="mb-6">
                                <label htmlFor="recovery-email" className="block text-gray-700 text-sm font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    id="recovery-email"
                                    type="email"
                                    value={recoveryEmail}
                                    onChange={(e) => setRecoveryEmail(e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Seu email cadastrado"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    type="button"
                                    onClick={() => setIsRecovering(false)}
                                    className="text-primary hover:text-blue-700 text-sm font-medium"
                                >
                                    Voltar ao Login
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    Enviar Instruções
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    {logo ? (
                        <img src={logo} alt="Lucrofrio Manager" className="h-16 mx-auto mb-4" />
                    ) : (
                        <div className="h-16 flex items-center justify-center mb-4">
                            <h1 className="text-3xl font-bold text-primary">Lucrofrio</h1>
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-800">Lucrofrio Manager</h2>
                    <p className="text-gray-600 mt-2">Faça login para acessar o sistema</p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Seu email"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Sua senha"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-primary border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                                Lembrar-me
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsRecovering(true)}
                            className="text-primary hover:text-blue-700 text-sm font-medium"
                        >
                            Esqueceu a senha?
                        </button>
                    </div>

                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                        >
                            Entrar
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm text-gray-600">
                    <p>© 2025 Lucrofrio Manager. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
