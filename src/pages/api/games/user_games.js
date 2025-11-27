import { addOrUpdateUserGame } from "../../../lib/db";
// NOTA: Em um ambiente real, você faria a verificação do token de autenticação aqui
// para obter o userId com segurança.

// Simulação de obtenção do userId do token
function getUserIdFromRequest(req) {
  return req.body.user_id; // Agora vem do front via AuthContext
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    // ATENÇÃO: Substitua por sua lógica de autenticação segura.
    const userId = req.body.user_id;

    if (!userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const gameData = req.body;

    // Validação básica
    if (!gameData.game_id || !gameData.status) {
      return res.status(400).json({
        message: "Dados incompletos (game_id e status são obrigatórios).",
      });
    }

    // Converte game_id para integer se necessário (dependendo do seu schema)
    gameData.game_id = parseInt(gameData.game_id);

    const result = await addOrUpdateUserGame({
      userId,
      gameId: parseInt(gameData.game_id),
      status: gameData.status,
      rating: gameData.rating ? parseInt(gameData.rating) : null,
      hoursPlayed: gameData.hours_played
        ? parseInt(gameData.hours_played)
        : null,
      platform: gameData.platform || null,
      startDate: gameData.start_date || null,
      completionDate: gameData.completion_date || null,
    });

    res.status(200).json({
      message: `Jogo salvo com sucesso na sua lista.`,
      operation: result.operation,
    });
  } catch (error) {
    console.error(
      "Erro ao processar requisição de jogo do usuário:",
      error.message
    );
    res.status(500).json({
      message: error.message || "Erro interno do servidor ao salvar o jogo.",
    });
  }
}
