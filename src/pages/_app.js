import '../styles/globals.scss';
import Header from '../components/layout/Header';
import AuthProvider from '../context/AuthContext'; // Importa o provedor

function MyApp({ Component, pageProps }) {
  return (
    // Envolve toda a aplicação com o Provedor de Autenticação
    <AuthProvider>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      {/* Footer ficaria aqui, se tivéssemos um */}
    </AuthProvider>
  );
}

export default MyApp;