// src/pages/api/games/update-covers.js
import { getGamesNeedingCover, updateGameCover } from '../../../lib/db';

const RAWG_KEY = process.env.RAWG_KEY;

// Proteção: RAWG exige User-Agent
const RAWG_HEADERS = {
  'User-Agent': 'MyGameList/1.0 (https://localhost)'
};

export default async function handler(req, res) {
  try {
    const limit = parseInt(req.query.limit || "10", 10);

    const games = await getGamesNeedingCover();
    const limitedGames = games.slice(0, limit);

    if (!RAWG_KEY) {
      return res.status(500).json({ error: "RAWG_KEY não configurada no .env" });
    }

    let updated = 0;
    const errors = [];

    for (const game of limitedGames) {
      try {
        console.log(`🔍 Buscando capa para: ${game.title}`);

        const searchUrl = `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(game.title)}`;
        const searchResponse = await fetch(searchUrl, { headers: RAWG_HEADERS });

        const searchData = await searchResponse.json();

        if (!searchData.results || searchData.results.length === 0) {
          console.log(`⚠️ Nenhum resultado encontrado para ${game.title}`);
          continue;
        }

        const bestMatch = searchData.results[0];
        const coverUrl = bestMatch.background_image;

        if (!coverUrl) {
          console.log(`⚠️ Jogo encontrado, mas sem imagem: ${game.title}`);
          continue;
        }

        // Atualiza no banco
        await updateGameCover(game.id, coverUrl);
        console.log(`✅ Capa salva no banco: ${coverUrl}`);

        updated++;

      } catch (err) {
        errors.push({ game: game.title, message: err.message });
      }
    }

    return res.status(200).json({
      message: "Processo concluído.",
      updated,
      errors
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
