import { getAllGames, updateGameCover } from '../../../lib/db';


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const games = await getAllGames();

    // 🔥 Para cada jogo, consultar a RAWG API usando a rota interna /api/cover
    const gamesWithCovers = await Promise.all(
      games.map(async (game) => {
        try {
          const coverRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/cover?id=${game.id}`
          );

          if (!coverRes.ok) {
            console.warn("Falha ao buscar capa para", game.title);
            return { ...game, cover: null };
          }

          const coverData = await coverRes.json();

          return {
            ...game,
            cover: coverData.cover_url || null
          };
        } catch (err) {
          console.error("Erro RAWG cover:", err);
          return { ...game, cover: null };
        }
      })
    );

    return res.status(200).json(gamesWithCovers);
  } catch (error) {
    console.error("Erro ao carregar games:", error);
    return res.status(500).json({ message: "Erro ao carregar jogos." });
  }
}


// =============== RAWG API ===============

async function fetchCoverFromRAWG(title) {
  try {
    const apiKey = process.env.RAWG_API_KEY;

    const response = await fetch(
      `https://api.rawg.io/api/games?search=${encodeURIComponent(title)}&key=${apiKey}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    return data.results[0].background_image || null;
  } catch (err) {
    console.error("Erro ao buscar capa da RAWG:", err);
    return null;
  }
}
