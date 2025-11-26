// --- PONTO CENTRAL DE DADOS: CONEXÃO REAL COM POSTGRESQL E FUNÇÕES DE AUTENTICAÇÃO ---

// Importações diretas para melhor compatibilidade com o ambiente Next.js
import { Pool } from "pg";
import bcrypt from "bcrypt";

const saltRounds = 10; // Custo do hash para bcrypt

// Verifica o modo de produção
const isProduction = process.env.NODE_ENV === "production";

// Constrói a string de conexão. O Next.js carrega o .env automaticamente no servidor.
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Checagem de segurança e feedback
if (!process.env.DB_NAME) {
  console.error(
    "🔴 [ERRO FATAL] As variáveis de ambiente do PostgreSQL (DB_*) não estão configuradas. Verifique seu arquivo .env."
  );
}

// Cria a piscina de conexões
const pool = new Pool({
  connectionString: connectionString,
  // Necessário para conexões em hosts de produção (ex: Vercel/Heroku)
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Listener de erro para o Pool (importante para monitoramento)
pool.on("error", (err, client) => {
  console.error(
    "🔴 [ERRO CRÍTICO] Erro no Pool de conexões do PostgreSQL:",
    err
  );
});

// Teste de Conexão: Otimizado para falhar rapidamente se as credenciais estiverem erradas
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(
      "❌ [ERRO DE CONEXÃO] Falha ao conectar ao PostgreSQL. Motivo:",
      err.message
    );
    console.warn(
      "Dica: Verifique se o seu DB local está ativo (PostgreSQL/DBeaver) e se o .env está correto (Usuário, Senha, Porta)."
    );
  } else {
    console.log(
      `🟢 [DB OK] Conectado com sucesso ao banco de dados "${process.env.DB_NAME}" em: ${res.rows[0].now}`
    );
  }
});

// --------------------------------------------------------------------------
// FUNÇÕES DE AUTENTICAÇÃO REAL (Integração com Users e bcrypt)
// --------------------------------------------------------------------------

/**
 * Verifica se um email ou username já existe no PostgreSQL.
 * @param {string} email
 * @param {string} username
 * @returns {Promise<boolean>}
 */
export async function checkExistingUser(email, username) {
  const queryText = `
    SELECT 1 
    FROM Users 
    WHERE email = $1 OR username = $2
    LIMIT 1;
  `;
  const result = await pool.query(queryText, [email, username]);
  return result.rows.length > 0;
}

/**
 * Cria um novo usuário na tabela Users, criptografando a senha.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Dados do usuário criado (sem hash)
 */
export async function createUser(username, email, password) {
  // 1. Gera o hash da senha
  const password_hash = await bcrypt.hash(password, saltRounds);

  // 2. Query de inserção no PostgreSQL
  const queryText = `
    INSERT INTO Users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING user_id, username, email;
  `;

  try {
    const result = await pool.query(queryText, [
      username,
      email,
      password_hash,
    ]);

    return result.rows[0];
  } catch (error) {
    // Erro de integridade (unique violation)
    if (error.code === "23505") {
      throw new Error("Email ou nome de usuário já cadastrado.");
    }
    // Propaga outros erros de DB
    throw error;
  }
}

/**
 * Autentica o usuário verificando email e comparando o hash da senha.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object | null>} Dados do usuário autenticado (ou null se falhar)
 */
export async function authenticateUser(email, password) {
  // 1. Busca o usuário pelo email
  const queryText = `
    SELECT user_id, username, email, password_hash 
    FROM Users 
    WHERE email = $1;
  `;
  const result = await pool.query(queryText, [email]);
  const user = result.rows[0];

  if (!user) {
    return null; // Usuário não encontrado
  }

  // 2. Compara a senha fornecida com o hash armazenado
  const match = await bcrypt.compare(password, user.password_hash);

  if (match) {
    // Retorna os dados do usuário (excluindo o hash)
    const { password_hash, ...userData } = user;
    return userData;
  }

  return null; // Senha incorreta
}

// --------------------------------------------------------------------------
// FUNÇÕES DE DADOS (Adicionadas para o Registro/Tracking de Jogos)
// --------------------------------------------------------------------------

/**
 * Adiciona ou atualiza o registro de um jogo na lista do usuário (Tabela user_games).
 * Utiliza o padrão UPSERT (INSERT ON CONFLICT UPDATE) para atomicidade.
 * @param {object} params
 * @param {string} params.userId - ID do usuário.
 * @param {number} params.gameId - ID do jogo.
 * @param {string} params.status - Status do rastreamento ('Jogando', 'Concluído', etc).
 * @param {number | null} [params.rating] - Avaliação (1-10).
 * @param {number | null} [params.hoursPlayed] - Horas jogadas.
 * @param {string} [params.platform] - Plataforma jogada.
 * @param {string | null} [params.startDate] - Data de início (formato YYYY-MM-DD).
 * @param {string | null} [params.completionDate] - Data de conclusão (formato YYYY-MM-DD).
 * @returns {Promise<object>} O registro do user_games inserido/atualizado.
 */
export async function addOrUpdateUserGame({
  userId,
  gameId,
  status,
  rating,
  hoursPlayed,
  startDate,
  completionDate,
  platform,
}) {
  // Garante que os campos numéricos e de data sejam formatados corretamente
  const hours = hoursPlayed ? parseInt(hoursPlayed, 10) : null;
  const gameRating = rating ? parseInt(rating, 10) : null;
  const start = startDate || null;
  const completion = completionDate || null;

  // Query UPSERT (INSERT ON CONFLICT UPDATE) na tabela user_games
  const query = `
    INSERT INTO user_games (user_id, game_id, status, rating, hours_played, platform, start_date, completion_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (user_id, game_id) DO UPDATE
    SET 
        status = EXCLUDED.status,
        rating = EXCLUDED.rating,
        hours_played = EXCLUDED.hours_played,
        platform = EXCLUDED.platform,
        start_date = EXCLUDED.start_date,
        completion_date = EXCLUDED.completion_date,
        updated_at = NOW() -- Assume que você tem uma coluna updated_at na user_games
    RETURNING *;
  `;

  const values = [
    userId,
    gameId,
    status,
    gameRating,
    hours,
    platform || null,
    start,
    completion,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error(
      "Erro ao adicionar/atualizar jogo do usuário (user_games):",
      error.message
    );
    throw new Error("Falha no banco de dados ao salvar o registro do jogo.");
  }
}

// --------------------------------------------------------------------------
// EXPORTAÇÕES GERAIS
// --------------------------------------------------------------------------
// Função para trazer os jogos do banco e exibir na página /games
export async function getAllGames() {
  const query = `
    SELECT id, title, genre, developer, cover_image_url
    FROM games
    ORDER BY id DESC
  `;
  const result = await pool.query(query);
  return result.rows;
}
//Atualiza as capas dos jogos
export async function updateGameCover(gameId, coverUrl) {
  const query = `UPDATE games SET cover_image_url = $1 WHERE id = $2`;
  await pool.query(query, [coverUrl, gameId]);
}
//Atualiza as capas dos jogos no banco que precisam
export async function getGamesNeedingCover() {
  const result = await pool.query(`
    SELECT id, title
    FROM games
    WHERE cover_image_url IS NULL OR cover_image_url = ''
  `);

  return result.rows;
}
// Busca os jogos que o usuário favoritou e traz para exibir na página /library
export async function getUserLibrary(userId) {
  // NOTA: Usamos 'cover_image_url' para a capa, consistente com outras funções deste db.js.
  const queryText = `
    SELECT
        ug.status,
        ug.rating,
        ug.hours_played,
        ug.platform,
        ug.start_date,
        ug.completion_date,
        g.id AS game_id,
        g.title AS game_title,
        g.cover_image_url AS game_cover
    FROM 
        user_games ug
    JOIN 
        games g ON ug.game_id = g.id
    WHERE 
        ug.user_id = $1
    ORDER BY 
        ug.updated_at DESC;
  `;

  try {
    const result = await pool.query(queryText, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar a biblioteca do usuário:', error.message);
    throw new Error('Falha ao buscar dados da biblioteca no banco de dados.');
  }
}


//Export para trazer os jogos mais votados para a HomePage

export async function getTopGames(limit = 5) {
  const query = `
    SELECT
      g.id AS game_id,
      g.title AS game_title,
      g.cover_image_url AS game_cover,
      g.genre,
      ROUND(AVG(ug.rating)::numeric, 2) AS avg_rating,
      COUNT(ug.id) AS total_votes
    FROM games g
    LEFT JOIN user_games ug ON ug.game_id = g.id
    GROUP BY g.id
    ORDER BY avg_rating DESC NULLS LAST, total_votes DESC
    LIMIT $1;
  `;
  const values = [limit];

  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Erro ao buscar Top Games no DB:', err.message);
    throw err;
  }
}



// Re-exporta tudo para que a API possa usar o pool se necessário
export { pool };
