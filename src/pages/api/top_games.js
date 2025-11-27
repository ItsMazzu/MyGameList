// src/pages/api/top_games.js
import { getTopGames } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  try {
    // Pega os Top 5 jogos do banco (ou o número que você definir)
    const topGames = await getTopGames(5);

    return res.status(200).json({
      message: 'Jogos em destaque carregados com sucesso.',
      data: topGames,
    });
  } catch (error) {
    console.error('❌ ERRO NO BANCO DE DADOS (API top_games):', error.message);
    return res.status(500).json({
      message: 'Erro interno do servidor ao carregar jogos em destaque.',
      error: error.message,
    });
  }
}
