import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const SignupPage = () => {
  // Renderiza o componente de formulário com a prop isLogin = false
  return <AuthForm isLogin={false} />;
};

export default SignupPage;