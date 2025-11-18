import { authenticateUser } from '../../../lib/db';

export default async function loginHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    // Chama a função que verifica a senha e o hash no PostgreSQL
    const user = await authenticateUser(email, password);

    if (user) {
      // Login bem-sucedido. Retorna dados básicos do usuário.
      return res.status(200).json({ 
        message: 'Login bem-sucedido!',
        user: { 
            id: user.user_id, // Mapeado do PostgreSQL
            username: user.username,
            email: user.email
        }
      });
    } else {
      // Falha na autenticação (usuário não existe ou senha incorreta)
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

  } catch (error) {
    console.error('ERRO NO LOGIN (API):', error);
    return res.status(500).json({ message: error.message || 'Erro interno do servidor ao tentar fazer login.' });
  }
}