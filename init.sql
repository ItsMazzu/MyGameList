-- init.sql

-- Criar tabela de jogos
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT,
  developer TEXT,
  cover_image_url TEXT
);

-- Criar tabela de usuários (mas sem inserir nenhum)
CREATE TABLE IF NOT EXISTS Users (
  user_id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela user_games
CREATE TABLE IF NOT EXISTS user_games (
  user_id INT REFERENCES Users(user_id),
  game_id INT REFERENCES games(id),
  status TEXT,
  rating INT,
  hours_played INT,
  platform TEXT,
  start_date DATE,
  completion_date DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, game_id)
);

-- INSERIR 50 JOGOS
INSERT INTO games (title, genre, developer)
VALUES
('Cyberpunk 2077', 'RPG', 'CD Projekt Red'),
('The Witcher 3', 'RPG', 'CD Projekt Red'),
('Elden Ring', 'Action RPG', 'FromSoftware'),
('God of War', 'Action', 'Santa Monica Studio'),
('Hollow Knight', 'Metroidvania', 'Team Cherry'),
('Persona 5', 'JRPG', 'Atlus'),
('Red Dead Redemption 2', 'Action Adventure', 'Rockstar'),
('Minecraft', 'Sandbox', 'Mojang'),
('Stardew Valley', 'Simulation', 'ConcernedApe'),
('Bloodborne', 'Action RPG', 'FromSoftware')
-- continue até completar seus 50 jogos
;
