import { useEffect, useState } from 'react';

export default function Ecopontos() {
  const [ecopontos, setEcopontos] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [descricao, setDescdescricao] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregarEcopontos = () => {
    fetch('http://localhost:5000/ecofluxo/ecopontos', {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.erro || 'Erro ao carregar ecopontos.');
        setEcopontos(data);
      })
      .catch((err) => setErro(err.message));
  };

  useEffect(() => {
    carregarEcopontos();
  }, []);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      const res = await fetch('http://localhost:5000/ecofluxo/createEcoponto', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          nome, 
          latitude, // Enviando como string, exatamente como o Prisma espera no seu model!
          longitude, 
          descricao 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.erro || 'Erro ao cadastrar ecoponto.');

      setSucesso('Ecoponto cadastrado com sucesso!');
      setNome('');
      setLatitude('');
      setLongitude('');
      setDescdescricao('');
      carregarEcopontos();
    } catch (err: any) {
      setErro(err.message);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#2e7d32', marginBottom: '20px' }}>🌱 Gestão de Ecopontos</h2>

      {/* Formulário de Cadastro */}
      <form onSubmit={handleCadastrar} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e0e0e0' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>Cadastrar Novo Ecoponto</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Nome do Ecoponto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ flex: 1, minWidth: '200px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Latitude (ex: -22.1234)"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            style={{ flex: 1, minWidth: '150px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Longitude (ex: -47.1234)"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            style={{ flex: 1, minWidth: '150px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={descricao}
            onChange={(e) => setDescdescricao(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cadastrar
          </button>
        </div>
        {erro && <p style={{ color: '#c62828', marginTop: '10px', fontSize: '14px' }}>{erro}</p>}
        {sucesso && <p style={{ color: '#2e7d32', marginTop: '10px', fontSize: '14px' }}>{sucesso}</p>}
      </form>

      {/* Listagem em Cards */}
      {ecopontos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f1f8f5', borderRadius: '8px', color: '#555' }}>
          <p>Nenhum ecoponto cadastrado.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {ecopontos.map((ponto) => (
            <div key={ponto.id || ponto._id} style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>ID: {ponto.id || ponto._id}</span>
                <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  Ativo
                </span>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '18px' }}>{ponto.nome}</h3>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>🌐 Lat: {ponto.latitude} | Long: {ponto.longitude}</p>
              {ponto.descricao && <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>📝 {ponto.descricao}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}