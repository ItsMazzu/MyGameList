import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 1. Cria o Contexto
const AuthContext = createContext();

/**
 * Hook customizado para usar o contexto de autenticação em qualquer lugar.
 * @returns {{
 * user: object | null,
 * isAuthenticated: boolean,
 * login: (userData: object) => void,
 * logout: () => void,
 * loading: boolean
 * }}
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

// 2. Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Verifica se o usuário está autenticado
  const isAuthenticated = !!user;

  // Efeito para carregar o usuário do localStorage ao iniciar (simulação de sessão)
  useEffect(() => {
    // Na produção, isso faria uma chamada para validar um token JWT
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao carregar usuário do localStorage:", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // Indica que a checagem inicial terminou
  }, []);

  /**
   * Função chamada após login bem-sucedido ou cadastro.
   * Salva os dados do usuário e marca como logado.
   * @param {object} userData - Dados do usuário retornado pela API (ex: id, username, email)
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Função para realizar o logout.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Redireciona para a home ou página de login após o logout
    router.push('/');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  // Enquanto o carregamento inicial (do localStorage) estiver em curso, 
  // pode-se exibir um indicador de carregamento, mas para simplificar,
  // vamos apenas retornar os filhos.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportamos o componente padrão (AuthProvider) e o hook (useAuth)
export default AuthProvider;