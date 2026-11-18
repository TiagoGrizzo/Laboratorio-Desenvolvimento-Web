import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo2fa, setCodigo2fa] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      const response = await fetch('http://localhost:5000/ecofluxo/login', {
        credentials:'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao realizar login.');
      }

      setMensagem('Código de verificação enviado para o seu e-mail!');
      setStep('2fa');
    } catch (err: any) {
      setErro(err.message || 'Erro de conexão com o servidor.');
    }
  };

  const handleVerify2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await fetch('http://localhost:5000/ecofluxo/verify-2fa', {
        credentials:'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo: codigo2fa }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Código inválido.');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      alert('Login realizado com sucesso!');
      navigate('/ecopontos');
    } catch (err: any) {
      setErro(err.message || 'Erro ao verificar o código.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif', background: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>EcoFluxo - Tela de Login (Gestor)</h2>

      {erro && <div style={{ color: 'red', marginBottom: '10px', padding: '8px', background: '#ffebee' }}>{erro}</div>}
      {mensagem && <div style={{ color: 'green', marginBottom: '10px', padding: '8px', background: '#e8f5e9' }}>{mensagem}</div>}

      {step === 'login' ? (
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>E-mail:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Senha:</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#2e7d32', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}>
            Entrar
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify2faSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: '#555' }}>
            Digite o código de 6 dígitos enviado para o e-mail: <strong>{email}</strong>
          </p>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Código 2FA:</label>
            <input 
              type="text" 
              value={codigo2fa} 
              onChange={(e) => setCodigo2fa(e.target.value)} 
              placeholder="Ex: 123456"
              required 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', letterSpacing: '2px', textAlign: 'center', fontSize: '16px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#2e7d32', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}>
            Verificar Código
          </button>
          <button 
            type="button" 
            onClick={() => setStep('login')} 
            style={{ padding: '5px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Voltar / Alterar e-mail
          </button>
        </form>
      )}
    </div>
  );
}