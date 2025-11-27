import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  // Função chamada após um login bem-sucedido
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('mgl_user', JSON.stringify(userData)); 

    // Redireciona para a nova página principal do usuário logado
    router.push('/mylist'); 
  };

  // Função para fazer logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mgl_user');
    router.push('/login'); 
  };

  // Efeito para carregar o usuário do Local Storage na inicialização
  useEffect(() => {
    const storedUser = localStorage.getItem('mgl_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao carregar usuário do Local Storage:", e);
        localStorage.removeItem('mgl_user');
      }
    }
    setLoading(false); 
  }, []);

  const contextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// --------------------------------------------------------
// NOVO: Adiciona a exportação padrão para corrigir o erro em _app.js
// --------------------------------------------------------
export default AuthProvider;