import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext'; // Importa o hook de Auth
import styles from '../layout/Header.module.scss';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth(); // Obtém o estado e a função do contexto
  
  // Define o destino do link "Home": /mylist se logado, / se deslogado.
  const homeLinkDestination = isAuthenticated ? '/mylist' : '/';

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        {/* Logo: usa o destino condicional */}
        <Link href={homeLinkDestination}>
          MyGameList
        </Link>
      </div>
      
      <nav className={styles.nav}>
        {/* Link Home: usa o destino condicional */}
        <Link href={homeLinkDestination} className={styles.navItem}>Home</Link>
        
        <Link href="/games" className={styles.navItem}>Jogos</Link>
        
        {/* Renderização condicional baseada no estado de autenticação */}
        {isAuthenticated ? (
          // Se estiver logado
          <>
            <span className={styles.greeting}>Olá, {user.username}!</span>
            <button onClick={logout} className={`${styles.navItem} ${styles.logoutButton}`}>
              Sair
            </button>
          </>
        ) : (
          // Se não estiver logado
          <>
            <Link href="/login" className={styles.navItem}>Login</Link>
            <Link href="/signup" className={`${styles.navItem} ${styles.signupButton}`}>
              Cadastre-se
            </Link>
          </>
        )}
        
      </nav>
    </header>
  );
};

export default Header;