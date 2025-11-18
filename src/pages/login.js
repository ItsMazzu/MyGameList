import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const LoginPage = () => {
  // Renderiza o componente de formulário com a prop isLogin = true
  return <AuthForm isLogin={true} />;
};

export default LoginPage;