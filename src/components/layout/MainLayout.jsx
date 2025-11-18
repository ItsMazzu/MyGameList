// src/components/layout/MainLayout.jsx

import React from 'react';
import Header from './Header';
import Footer from './Footer';

// O MainLayout irá garantir que todas as páginas tenham Header e Footer
const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;