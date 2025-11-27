import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/pages/Games.module.scss';

// Autenticação e Modal
import { useAuth } from '../../context/AuthContext';
import TrackGameModal from '../../components/game/TrackGameModal';

const GamesPage = () => {
  // --- ESTADOS DO SISTEMA ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [platform, setPlatform] = useState('all');
  const [genre, setGenre] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 12;

  // Autenticação
  const { isAuthenticated = true } = useAuth();

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // --- ESTADOS DO BANCO ---
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);

  // ================================
  // 📌 BUSCAR JOGOS DO BANCO
  // ================================
useEffect(() => {
  async function loadGames() {
    try {
      const response = await fetch('/api/games/mylist_games');
      if (!response.ok) throw new Error("Erro ao buscar jogos do servidor.");

      const data = await response.json();

      // NORMALIZAÇÃO PARA O FRONT
      const normalized = data.map(g => ({
        ...g,
        cover: g.cover_image_url
      }));

      setGames(normalized);
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    } finally {
      setLoadingGames(false);
    }
  }

  loadGames();
}, []);
  // ================================
  // 📌 FILTRAGEM
  // ================================
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (platform === 'all' || game.platform === platform) &&
    (genre === 'all' || game.genre === genre)
  ).sort((a, b) => {
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  // ================================
  // 📌 PAGINAÇÃO
  // ================================
  const indexLast = currentPage * gamesPerPage;
  const indexFirst = indexLast - gamesPerPage;
  const currentGames = filteredGames.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const paginate = (num) => setCurrentPage(num);

  // ================================
  // 📌 MODAL
  // ================================
  const handleOpenModal = (game) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para adicionar jogos à sua lista!');
      return;
    }
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleTrackSuccess = (operation) => {
    const msg = operation === 'inserted'
      ? 'Jogo adicionado com sucesso!'
      : 'Registro atualizado com sucesso!';

    setFeedbackMessage(msg);

    setTimeout(() => setFeedbackMessage(null), 4000);

    setIsModalOpen(false);
  };

  // ================================
  // 📌 LOADING
  // ================================
  if (loadingGames) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Carregando jogos...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Descobrir Jogos | MyGameList</title>
      </Head>

      <div className={styles.gamesPage}>
        <h1 className={styles.pageTitle}>Descubra Seu Próximo Jogo Favorito</h1>

        {feedbackMessage && (
          <div className={styles.successMessage}>{feedbackMessage}</div>
        )}

        {/* Barra de Busca e Filtros */}
        <div className={styles.filtersContainer}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Buscar por título, gênero ou plataforma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>&#128269;</span>
          </div>

          <div className={styles.dropdowns}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.dropdown}>
              <option value="rank">Ordenar por: Rank</option>
              <option value="name">Ordenar por: Nome</option>
            </select>

            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={styles.dropdown}>
              <option value="all">Plataforma: Todas</option>
              <option value="PC">PC</option>
              <option value="PS5">PS5</option>
              <option value="Xbox">Xbox</option>
              <option value="Switch">Switch</option>
              <option value="Mobile">Mobile</option>
            </select>

            <select value={genre} onChange={(e) => setGenre(e.target.value)} className={styles.dropdown}>
              <option value="all">Gênero: Todos</option>
              <option value="Action">Ação</option>
              <option value="RPG">RPG</option>
              <option value="Adventure">Aventura</option>
              <option value="Strategy">Estratégia</option>
            </select>
          </div>
        </div>

        {/* Grid de jogos */}
        <div className={styles.gamesGrid}>
          {currentGames.map(game => (
            <div
              key={game.id}
              className={styles.gameCard}
              onClick={() => handleOpenModal(game)}
              title={`Clique para adicionar ${game.title} à sua lista`}
            >
              <img src={game.cover} alt={game.title} className={styles.gameCover} />

              <div className={styles.gameTitleOverlay}>
                <span>{game.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className={styles.pagination}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`${styles.paginationButton} ${currentPage === i + 1 ? styles.active : ''}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedGame && (
        <TrackGameModal
          game={selectedGame}
          onClose={() => setIsModalOpen(false)}
          onTrackSuccess={handleTrackSuccess}
        />
      )}
    </>
  );
};

export default GamesPage;
