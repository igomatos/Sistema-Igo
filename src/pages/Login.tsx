import { useState } from 'react';
import logoRaquel from '@/assets/logo-raquel.png';
import { supabase } from '@/lib/supabase';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleEntrar = async () => {

    if (!email || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }

    try {

      setCarregando(true);
      setErro('');

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        setErro('E-mail ou senha inválidos.');
        return;
      }

      onLogin();

    } catch (err) {

      setErro('Erro ao fazer login.');

    } finally {

      setCarregando(false);

    }
  };

  return (
    <div className="min-h-screen bg-[#F6EAEA] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 border border-[#EADDE1]">

        <div className="flex justify-center mb-8">
          <div className="w-72 h-36 rounded-[28px] bg-white shadow-md flex items-center justify-center px-6 py-4">
            <img
              src={logoRaquel}
              alt="Raquel Lima Medical Protection"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h1 className="text-3xl font-black text-[#111827] text-center">
          Bem-vindo
        </h1>

        <div className="mt-8 space-y-4">

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 rounded-2xl border border-[#EADDE1] px-4 outline-none transition focus:border-[#F47FA0]"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full h-14 rounded-2xl border border-[#EADDE1] px-4 outline-none transition focus:border-[#F47FA0]"
          />

          {erro && (
            <div className="text-sm text-red-500 font-medium text-center">
              {erro}
            </div>
          )}

          <button
            onClick={handleEntrar}
            disabled={carregando}
            className="w-full h-14 rounded-2xl bg-[#F47FA0] text-white font-bold text-lg shadow-lg shadow-pink-200 hover:bg-[#ec6f94] transition-all duration-300 hover:scale-[1.02]"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

        </div>

      </div>

    </div>
  );
}