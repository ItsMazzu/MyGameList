import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// Importação do SASS/SCSS
import styles from '../../styles/pages/Auth.module.scss';
// NOVO: Importa o hook useAuth para gerenciar o estado global
import { useAuth } from '../../context/AuthContext'; 

// Prop 'isLogin' define se o formulário será de Login (true) ou Cadastro (false)
const AuthForm = ({ isLogin }) => {
  const router = useRouter(); 
  // OBTÉM a função de login e o estado de autenticação do contexto
  const { login, isAuthenticated, loading: authLoading } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Apenas para cadastro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redireciona se o usuário JÁ estiver autenticado e não estiver na página inicial
  // Isso garante que ele não veja o formulário de login/cadastro se já estiver logado.
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
        router.replace('/mylist'); // Ou para a página principal do seu app
    }
  }, [isAuthenticated, authLoading, router]);

  // Lógica de Submissão
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevenindo submissão se o contexto ainda estiver carregando
    if (authLoading) return; 
    
    setLoading(true);
    setError(null);
    
    // Define o endpoint e os dados
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body = isLogin 
      ? JSON.stringify({ email, password })
      : JSON.stringify({ username, email, password });
    
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      const data = await res.json();
      console.log("RESPOSTA DO BACKEND:", data);

      if (!res.ok) {
        // Se a resposta não for OK (400, 401, 409, 500)
        setError(data.message || `Erro ${res.status}: Falha na operação.`);
        return;
      }
      
      // Sucesso na operação
      if (isLogin) {
        // PASSO CRUCIAL: Chama a função login do contexto para salvar o usuário e o token no localStorage
        // O AuthContext é responsável por definir isAuthenticated = true e redirecionar para '/mylist'
        login(data.user); 
        // Não é necessário chamar router.push aqui, pois o AuthContext já o faz.
        
      } else {
        // Sucesso no Cadastro: Redireciona para a página de Login
        router.push('/login'); 
      }

    } catch (err) {
      console.error("Erro de conexão ou ao enviar formulário:", err);
      setError("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };


  const title = isLogin ? 'Acessar MyGameList' : 'Criar Conta';
  const buttonText = isLogin ? 'Entrar' : 'Cadastrar';
  const switchMessage = isLogin 
    ? { text: 'Não tem uma conta?', linkText: 'Cadastre-se', href: '/signup' }
    : { text: 'Já tem uma conta?', linkText: 'Faça Login', href: '/login' };
    
  // Exibe tela de carregamento se o AuthContext estiver verificando a autenticação
  if (authLoading || isAuthenticated) {
    return (
      <div className={styles.loadingScreen}>
        Carregando autenticação...
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>{title}</h2>

        {/* Mensagem de Erro */}
        {/* Usando o estilo direto para a cor, mas você deve integrar isso ao Auth.module.scss */}
        {error && <p className={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit}>
          
          {/* Campo de Nome de Usuário (Apenas Cadastro) */}
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Nome de Usuário</label>
              <input 
                id="username" 
                type="text" 
                className={styles.input} 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          {/* Campo de E-mail */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input 
              id="email" 
              type="email" 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Campo de Senha */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Senha</label>
            <input 
              id="password" 
              type="password" 
              className={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {/* Botão de Envio */}
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Carregando...' : buttonText}
          </button>
        </form>

        {/* Link para alternar entre Login e Cadastro */}
        <div className={styles.switchLink}>
          {switchMessage.text}
          <Link href={switchMessage.href} className={styles.switchLinkAnchor}>
            {switchMessage.linkText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;