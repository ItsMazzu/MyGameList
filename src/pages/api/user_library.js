// /src/pages/api/user_library.js
import { getUserLibrary } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(200).json({ success: true, data: [] }); // 👈 evita erro
    }

    const library = await getUserLibrary(userId);

    res.status(200).json({ success: true, data: library });
  } catch (error) {
    console.error('❌ ERRO NO BANCO (API user_library):', error);
    res.status(500).json({
      success: false,
      error: 'Falha ao buscar dados da biblioteca.'
    });
  }
}
