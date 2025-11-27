import { useEffect, useState } from 'react';
import Link from "next/link";
import styles from '../styles/pages/Home.module.scss';

export default function Home() {
  const [topGames, setTopGames] = useState([]);
  const [userLibrary, setUserLibrary] = useState([]);

  useEffect(() => {
    async function fetchTopGames() {
      const res = await fetch('/api/top_games');
      const data = await res.json();
      if (data?.data) setTopGames(data.data);
    }

    async function fetchLibrary() {
      const userId = localStorage.getItem('userId');
      if (!userId) return; 

      const res = await fetch('/api/user_library', {
        headers: { 'x-user-id': userId }
      });

      const data = await res.json();
      if (data?.data) setUserLibrary(data.data);
    }

    fetchTopGames();
    fetchLibrary();
  }, []);

  return (
    <div className={styles.container}>

      {/* HERO CLEAN */}
      <section className={styles.hero}>
        <div className={styles.heroBlur}></div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>MyGameList</h1>

          <p className={styles.heroDescription}>
            Gerencie sua biblioteca, acompanhe suas avaliações e descubra novos jogos.
            Um espaço moderno feito para jogadores que querem organizar sua jornada gamer.
          </p>

      <Link href="/signup">
        <button className={styles.addButton}>Venha fazer parte</button>
      </Link>
        </div>
      </section>

      {/* TOP GAMES */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔥 Top Jogos Mais Bem Avaliados</h2>

        <div className={styles.carousel}>
          {topGames.map((game) => (
            <div key={game.game_id} className={styles.gameCard}>
              <img src={game.game_cover} alt={game.game_title} />
              <h3>{game.game_title}</h3>

              <p className={styles.genre}>{game.genre}</p>

              <div className={styles.rating}>
                ⭐ {game.avg_rating || 'N/A'}
                <span className={styles.votes}>({game.total_votes})</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* USER LIBRARY */}
      {userLibrary.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📚 Sua Biblioteca</h2>

          <div className={styles.libraryGrid}>
            {userLibrary.slice(0, 6).map((item) => (
              <div key={item.game_id} className={styles.libraryCard}>
                <img src={item.cover_image_url} alt={item.title} />
                <h3>{item.title}</h3>
              </div>
            ))}
          </div>

          <button className={styles.viewMore}>
            Ver Biblioteca Completa →
          </button>
        </section>
      )}
    </div>
  );
}
