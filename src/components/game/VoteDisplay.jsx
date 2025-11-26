import React from 'react';
import styles from '../../styles/components/VoteDisplay.module.scss';

// Ícones de Upvote e Downvote (SVG simples como placeholder)
const UpvoteIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.56L5.78 9.03a.75.75 0 01-1.06-1.06l4.5-4.5a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L10.75 5.56v10.69a.75.75 0 01-.75.75z" clipRule="evenodd" />
  </svg>
);

const DownvoteIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.69l3.47-3.47a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06l3.47 3.47V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
  </svg>
);


const VoteDisplay = ({ game, rank }) => {
  // Lógica de votação (simulada)
  const handleVote = (type) => {
    console.log(`${type} em: ${game.title}`);
    // Futuramente: Conectar com o Firebase Firestore
  };

  return (
    <div className={styles.voteDisplayCard}>
      
      {/* Posição no Ranking */}
      <div className={styles.rank}>#{rank}</div>

      {/* Capa do Jogo (Placeholder) */}
      <div className={styles.cover}>
        {/* Usaria o componente Next/Image aqui: <Image src={game.coverUrl} ... /> */}
        <img 
          src={`https://placehold.co/70x90/262626/a0a0a0?text=CAPA`} 
          alt={`Capa do jogo ${game.title}`} 
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/70x90/262626/a0a0a0?text=CAPA" }}
        />
      </div>

      {/* Informações do Jogo */}
      <div className={styles.info}>
        <h3 className={styles.title}>{game.title}</h3>
        <p className={styles.genre}>{game.genre}</p>
      </div>

      {/* Pontuação e Ações de Voto */}
      <div className={styles.scoreSection}>
        {/* CORREÇÃO: Força o locale 'pt-BR' para garantir que o separador de milhar seja a vírgula (,) no servidor e no cliente. */}
        <div className={styles.score}>{game.score.toLocaleString('pt-BR')}</div>
        <div className={styles.voteActions}>
          <button 
            className={`${styles.voteButton} ${styles.upvote}`} 
            onClick={() => handleVote('Upvote')}
            aria-label={`Upvote em ${game.title}`}
          >
            <UpvoteIcon />
          </button>
          <button 
            className={`${styles.voteButton} ${styles.downvote}`} 
            onClick={() => handleVote('Downvote')}
            aria-label={`Downvote em ${game.title}`}
          >
            <DownvoteIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteDisplay;