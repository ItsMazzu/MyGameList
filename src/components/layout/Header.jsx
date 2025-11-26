import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import styles from '../layout/Header.module.scss';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const homeLinkDestination = isAuthenticated ? '/mylist' : '/';

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href={homeLinkDestination}>
          MyGameList
        </Link>
      </div>

      <nav className={styles.nav}>
        {/* Home */}
        <Link href={homeLinkDestination} className={styles.navItem}>Home</Link>

        {/* Jogos */}
        <Link href="/games" className={styles.navItem}>Jogos</Link>

        {/* Minha Jogatina - somente para usuários logados */}
        {isAuthenticated && (
          <Link href="/library" className={styles.navItem}>Minha Jogatina</Link>
        )}

        {/* Área do usuário */}
        {isAuthenticated ? (
          <>
            <span className={styles.greeting}>Olá, {user.username}!</span>
            <button onClick={logout} className={`${styles.navItem} ${styles.logoutButton}`}>
              Sair
            </button>
          </>
        ) : (
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
