import React from 'react';
import styles from '../../styles/components/GameCarousel.module.scss';

// Dados simulados para o carrossel
const mockCovers = [
  { id: 1, title: 'Elden Ring', img: 'https://placehold.co/120x160/1a1a1a/ffffff?text=ER' },
  { id: 2, title: 'Cyberpunk 2077', img: 'https://placehold.co/120x160/222222/ffffff?text=CP' },
  { id: 3, title: 'The Witcher 3', img: 'https://placehold.co/120x160/333333/ffffff?text=TW3' },
  { id: 4, title: 'Hades', img: 'https://placehold.co/120x160/444444/ffffff?text=HD' },
  { id: 5, title: 'RDR 2', img: 'https://placehold.co/120x160/555555/ffffff?text=RDR2' },
  { id: 6, title: 'Doom Eternal', img: 'https://placehold.co/120x160/666666/ffffff?text=DOOM' },
  { id: 7, title: 'GOW', img: 'https://placehold.co/120x160/777777/ffffff?text=GOW' },
  { id: 8, title: 'Horizon', img: 'https://placehold.co/120x160/888888/ffffff?text=HZ' },
];

const GameCarousel = ({ title = "Explore New Games" }) => {
  return (
    <div className={styles.carouselSection}>
      <h2 className={styles.carouselTitle}>{title}</h2>
      
      {/* Container que habilita a rolagem horizontal (overflow-x: auto) */}
      <div className={styles.carouselContainer}>
        {mockCovers.map(game => (
          <div key={game.id} className={styles.gameCard}>
            <img 
              src={game.img} 
              alt={`Capa de ${game.title}`} 
              className={styles.gameCover}
            />
            <p className={styles.gameTitle}>{game.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameCarousel;