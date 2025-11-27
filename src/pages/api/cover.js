export default async function handler(req, res) {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({ error: "ID não enviado." });
    }

    const RAWG_KEY = process.env.RAWG_API_KEY;

    const rawgRes = await fetch(
      `https://api.rawg.io/api/games/${id}?key=${RAWG_KEY}`
    );

    const data = await rawgRes.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Erro no /api/cover:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
