// src/pages/api/auth/signup.js

// Importa as funções do banco de dados
// ATENÇÃO: Verifique se o caminho '../../../../lib/db' está correto baseada na sua estrutura
import { createUser, checkExistingUser } from '../../../lib/db'; 

export default async function handler(req, res) {
  console.log("1. API de Cadastro foi chamada!"); // <--- LOG DE DEPURAÇÃO

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { username, email, password } = req.body;
  console.log("2. Dados recebidos:", { username, email }); // <--- LOG DE DEPURAÇÃO

  try {
    // Verifica duplicidade
    const exists = await checkExistingUser(email, username);
    if (exists) {
      console.log("3. Usuário já existe");
      return res.status(409).json({ message: 'Usuário ou email já existe.' });
    }

    // Cria usuário
    const user = await createUser(username, email, password);
    console.log("4. Usuário criado no DB:", user);

    return res.status(201).json({ message: 'Sucesso!', user });
  } catch (error) {
    console.error("ERRO FATAL NA API:", error); // Isso vai mostrar o erro real do banco no terminal
    return res.status(500).json({ message: error.message });
  }
}