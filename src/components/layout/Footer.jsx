// src/components/layout/Footer.jsx

import React from 'react';
// Importa o SASS modular
import styles from '../layout/Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} MyGameList. Todos os direitos reservados.</p>
      <p>Desenvolvido com Next.js, React e SASS.</p>
    </footer>
  );
};

export default Footer;