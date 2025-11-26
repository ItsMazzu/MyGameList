import 'dotenv/config'; // Carrega o .env automaticamente
import { updateGameCover } from "./lib/db.js";

(async () => {
  try {
    await updateGameCover(6, "https://img.rawg.io/cyberpunk.jpg");
    console.log("Capa atualizada com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    process.exit(1);
  }
})();
