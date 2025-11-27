// src/pages/mylist.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import styles from '../components/layout/MainLayout.module.scss';

// Componente para o card de destaque (Top 3)
const FeaturedGameCard = ({ game, rank }) => (
  <div
    className={`${styles.featuredCard} ${rank === 1 ? styles.rank1Card : ''}`}
    style={{ backgroundImage: `url(${game.game_cover || 'https://placehold.co/300x400/3f51b5/ffffff?text=No+Cover'})` }}
  >
    <div className={styles.overlay}>
      <span className={styles.rank}>#{rank}</span>
      <h3 className={styles.title}>{game.game_title}</h3>
      <p className={styles.votes}>{game.votes || 0} Upvotes</p>
    </div>
  </div>
);

// Seção de Jogos Mais Populares (Top Games)
const TopGamesSection = ({ games }) => (
  <div style={{ marginTop: '2.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <h2 className={styles.h2}>Mais Jogos Populares</h2>
      <a href="/games" className={styles.viewAllLink}>Ver Todos</a>
    </div>

    <div className={styles.topGamesList}>
      {games.slice(0, 5).map((game, index) => (
        <div key={game.game_id || index} className={styles.gameListItem}>
          <div className={styles.details}>
            <span className={styles.rankNumber}>{index + 1}</span>
            <span className={styles.gameTitle}>{game.game_title}</span>
          </div>
          <div className={styles.actions}>
            <span className={styles.votesText}>{game.votes || 0} Upvotes</span>
            <button className={styles.addButton}>
              <span style={{ fontSize: '1.25rem', marginRight: '5px' }}>+</span> Adicionar à Lista
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MyListPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [games, setGames] = useState([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);

  // Proteção de rota
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Buscar jogos do usuário
  useEffect(() => {
    const fetchUserGames = async () => {
      if (!user?.id || !isAuthenticated) return;

      setIsLoadingGames(true);

      try {
        const response = await fetch('/api/user_library', {
          headers: { 'x-user-id': user.id },
        });

        if (!response.ok) {
          let errorMessage = 'Erro ao buscar jogos';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {}
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setGames(data.data || []);
      } catch (err) {
        console.error('Erro ao carregar jogos do usuário:', err);
      } finally {
        setIsLoadingGames(false);
      }
    };

    fetchUserGames();
  }, [user, isAuthenticated]);

  if (loading || !isAuthenticated || isLoadingGames) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#1A1A1A',
        color: '#FFFFFF',
        fontSize: '1.5rem',
      }}>
        Carregando lista...
      </div>
    );
  }

  const userName = user?.username || 'Usuário';

  return (
    <>
      <Head>
        <title>Minha Jogatina | MyGameList</title>
      </Head>

      <div className={styles.mainContainer}>
        {/* Mantemos o layout de 3 colunas, mas deixamos as colunas laterais vazias */}
        <main className={styles.mainContent}>
          <header>
            <h1 className={styles.h1}>
              Bem-vindo(a) de volta, <span className={styles.userNameHighlight}>{userName}</span>!
            </h1>
            <p className={styles.subtitle}>
              Aqui está o progresso dos seus jogos acompanhados.
            </p>
          </header>

          {/* Top 3 jogos mais recentes */}
          <div className={styles.featuredGrid}>
            {games.slice(0, 3).map((game, index) => (
              <FeaturedGameCard key={game.game_id} game={game} rank={index + 1} />
            ))}
          </div>

          {/* Jogos mais populares / restantes */}
          <TopGamesSection games={games} />
        </main>
      </div>

      <footer className="pt-4 text-sm text-gray-500 text-center">
        Dados fornecidos por <a href="https://rawg.io" target="_blank">RAWG</a>
      </footer>
    </>
  );
};

export default MyListPage;
