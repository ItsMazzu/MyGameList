import { getUserLibrary } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  // --- SIMULAÇÃO DE AUTENTICAÇÃO ---
  // EM PRODUÇÃO: Você DEVE validar o token JWT/sessão aqui e extrair o userId real.
  // Certifique-se de que este ID realmente existe na sua tabela 'users'.
  const MOCK_USER_ID = 'user_test_123'; 
  
  try {
    // A função getUserLibrary fará um JOIN entre user_games e games.
    const games = await getUserLibrary(MOCK_USER_ID);

    res.status(200).json({ 
        message: 'Biblioteca carregada com sucesso.', 
        data: games
    });
  } catch (error) {
    // 🌟 MELHORIA: Logar o erro do banco de dados no terminal do servidor 🌟
    console.error('❌ ERRO NO BANCO DE DADOS (API user_library):', error.message);
    
    // Retorna JSON para o frontend, evitando o erro do '<'
    res.status(500).json({ 
        message: 'Erro interno do servidor ao carregar a biblioteca.', 
        error: error.message 
    });
  }
}