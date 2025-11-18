import React from 'react';
import Link from 'next/link';
import VoteDisplay from '../components/game/VoteDisplay';
import SearchBar from '../components/ui/SearchBar'; // Importa a SearchBar
import styles from '../styles/pages/Home.module.scss'; // SASS do Hero Section
import rankingStyles from '../styles/components/VoteDisplay.module.scss'; // SASS para o container do ranking

// Dados simulados para o Top 5
const topGames = [
  { id: 1, title: 'Elden Ring', genre: 'Ação, RPG', score: 98520 },
  { id: 2, title: 'Cyberpunk 2077', genre: 'RPG, Ficção Científica', score: 95410 },
  { id: 3, title: 'The Witcher 3', genre: 'RPG, Fantasia', score: 92150 },
  { id: 4, title: 'Hades', genre: 'Roguelike, Ação', score: 88700 },
  { id: 5, title: 'Red Dead Redemption 2', genre: 'Ação, Aventura', score: 85300 },
];

const HomePage = () => {
  const handleSearch = (searchTerm) => {
    console.log("Buscar por:", searchTerm);
    // Futuramente: redirecionar para a página /games com o termo de busca
    // router.push(`/games?q=${searchTerm}`);
  };

  return (
    <>
      {/* HERO SECTION */}
      <div className={styles.heroSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.textColumn}>
            <h1 className={styles.title}>O seu melhor local para review</h1>
            <p className={styles.subtitle}>
              Descubra, avalie e acompanhe os jogos que você adora. Junte-se a uma comunidade de jogadores e encontre sua próxima aventura. Sua jornada épica começa aqui!
            </p>
            <div className={styles.actions}>
              <Link href="/games" className={`${styles.button} ${styles.browseButton}`}>
                Navegar pelo Catálogo
              </Link>
              <Link href="/signup" className={`${styles.button} ${styles.joinButton}`}>
                Junte-se a Comunidade
              </Link>
            </div>
          </div>
          <div className={styles.imageColumn}>
            <div className={styles.placeholder}>
              [Image Placeholder]
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <SearchBar onSearch={handleSearch} />

      {/* TOP VOTED GAMES SECTION */}
      <div className={rankingStyles.rankingContainer}> {/* Reutilizando o estilo do container do ranking */}
        <h2 className={rankingStyles.heading}>Jogos mais votados</h2> {/* Título para a seção */}
        
        {topGames.map((game, index) => (
          <VoteDisplay 
            key={game.id} 
            game={game} 
            rank={index + 1} 
          />
        ))}
      </div>
    </>
  );
};

export default HomePage;