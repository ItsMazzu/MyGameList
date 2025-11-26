import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
// Importando o estilo de layout
import styles from '../components/layout/MainLayout.module.scss';

// Dados mockados para simular a lista de jogos do usuário
const MOCK_GAMES = [
  { id: 1, title: 'Elden Ring', platform: 'PC', status: 'Playing', rating: 9, hours: 150, votes: '150,321', imageUrl: 'https://placehold.co/300x400/3f51b5/ffffff?text=Elden+Ring' },
  { id: 2, title: 'The Witcher 3: Wild Hunt', platform: 'PS5', status: 'Completed', rating: 10, hours: 250, votes: '142,105', imageUrl: 'https://placehold.co/300x400/f50057/ffffff?text=Witcher+3' },
  { id: 3, title: 'Red Dead Redemption 2', platform: 'Xbox', status: 'On Hold', rating: null, hours: 80, votes: '138,554', imageUrl: 'https://placehold.co/300x400/2a2a2a/ffffff?text=RDR2' },
  { id: 4, title: 'God of War (2018)', platform: 'PC', status: 'Completed', rating: 10, hours: 60, votes: '125,987', imageUrl: 'https://placehold.co/300x400/4CAF50/ffffff?text=GoW' },
  { id: 5, title: 'Baldurs Gate 3', platform: 'PC', status: 'Backlog', rating: null, hours: 0, votes: '121,450', imageUrl: 'https://placehold.co/300x400/FFC107/ffffff?text=BG3' },
];

// Componente para o card de destaque (Top 3)
const FeaturedGameCard = ({ game, rank }) => (
  <div 
    // Usando as classes SCSS e aplicando a classe rank1Card condicionalmente
    className={`${styles.featuredCard} ${rank === 1 ? styles.rank1Card : ''}`}
    style={{ backgroundImage: `url(${game.imageUrl})` }}
  >
    <div className={styles.overlay}>
      <span className={styles.rank}>#{rank}</span>
      <h3 className={styles.title}>{game.title}</h3>
      <p className={styles.votes}>{game.votes} Upvotes</p>
    </div>
  </div>
);

// Componente para a barra lateral de Ações Rápidas
const QuickActions = () => (
  <div className={`${styles.leftSidebar} ${styles.card}`}>
    <h2 className={styles.h2}>Ações Rápidas</h2>
    
    <div className={styles.actionItem}>
      <span className={styles.icon}>+</span>
      <div>
        <div className={styles.title}>Rastrear um Novo Jogo</div>
        <div className={styles.description}>Adicione à sua lista de jogos acompanhados</div>
      </div>
    </div>
    
    <div className={styles.actionItem}>
      <span className={styles.icon}>&#9776;</span>
      <div>
        <div className={styles.title}>Criar uma Lista</div>
        <div className={styles.description}>Organize seus favoritos</div>
      </div>
    </div>

    <div className={styles.actionItem}>
      <span className={styles.icon}>&#9733;</span>
      <div>
        <div className={styles.title}>Avaliar um Jogo</div>
        <div className={styles.description}>Compartilhe sua opinião</div>
      </div>
    </div>
  </div>
);

// Componente para o Feed de Atividades
const CommunityFeed = () => (
  <div className={`${styles.rightSidebar} ${styles.card}`}>
    <h2 className={styles.h2}>Feed da Comunidade</h2>
    <div className={styles.communityFeed}>
      <div className={styles.feedItem}>
        <div className={styles.avatar}>BG</div>
        <div className={styles.text}>
          <strong>BraveGamer92</strong> acabou de avaliar 
          <a href="#">Cyberpunk 2077</a> com 5 estrelas.
        </div>
      </div>
      <div className={styles.feedItem}>
        <div className={styles.avatar}>PQ</div>
        <div className={styles.text}>
          <strong>Pixel_Queen</strong> adicionou <a href="#">Stardew Valley</a> à sua lista "Cozy Games".
        </div>
      </div>
      <div className={styles.feedItem}>
        <div className={styles.avatar}>LL</div>
        <div className={styles.text}>
          <strong>LevelUpLeo</strong> está rastreando <a href="#">Hades II</a>.
        </div>
      </div>
    </div>
    <div className={styles.topGamesList}>
      <a href="#" className={styles.viewAllLink} style={{ display: 'block', textAlign: 'center' }}>
        Ver Mais Atividade
      </a>
    </div>
  </div>
);

// Componente para a seção de jogos mais votados
const TopGamesSection = ({ games }) => (
  <div style={{ marginTop: '2.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className={styles.h2}>Mais Jogos Populares</h2>
        <Link href="/games" className={styles.viewAllLink}>
            Ver Todos
        </Link>
    </div>
    
    <div className={styles.topGamesList}>
      {/* Pega do 4º jogo em diante */}
      {games.slice(3, 5).map((game, index) => (
        <div key={game.id} className={styles.gameListItem}>
          <div className={styles.details}>
            <span className={styles.rankNumber}>{index + 4}</span>
            <span className={styles.gameTitle}>{game.title}</span>
          </div>
          <div className={styles.actions}>
            <span className={styles.votesText}>{game.votes} Upvotes</span>
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
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  // Lógica de Proteção de Rota
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]); 

  if (loading || !isAuthenticated) {
    // Usando uma div simples sem estilos de layout complexos, focando na cor de fundo
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1A1A1A', color: '#FFFFFF', fontSize: '1.5rem' }}>
        Carregando lista...
      </div>
    );
  }
  
  // O nome do usuário vem do contexto
  const userName = user?.username || 'Usuário';

  return (
    <>
      <Head>
        <title>Dashboard | MyGameList</title>
      </Head>
      
      {/* Container Principal de 3 Colunas (Definido em MainLayout.module.scss) */}
      <div className={styles.mainContainer}>
        
        {/* COLUNA 1: Ações Rápidas (Left Sidebar) */}
        

        {/* COLUNA 2: CONTEÚDO PRINCIPAL (Central) */}
        <main className={styles.mainContent}>
          
          {/* Cabeçalho de Boas-vindas */}
          <header>
            <h1 className={styles.h1}>
              Bem-vindo(a) de volta, <span className={styles.userNameHighlight}>{userName}</span>!
            </h1>
            <p className={styles.subtitle}>
              Aqui estão os jogos mais bem ranqueados desta semana.
            </p>
          </header>

          {/* Destaques (Top 3) */}
          <div className={styles.featuredGrid}>
            {MOCK_GAMES.slice(0, 3).map((game, index) => (
              <FeaturedGameCard key={game.id} game={game} rank={index + 1} />
            ))}
          </div>

          {/* Jogos Mais Populares */}
          <TopGamesSection games={MOCK_GAMES} />
          
        </main>

        {/* COLUNA 3: FEED DA COMUNIDADE (Right Sidebar) */}
        
        
      </div>
    </>
  );
  <footer className="pt-4 text-sm text-gray-500 text-center">
  Data provided by <a href="https://rawg.io" target="_blank">RAWG</a>
</footer>

};

export default MyListPage;