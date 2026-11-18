import { useEffect, useState } from 'react';

export default function Lixeiras() {
  const [lixeiras, setLixeiras] = useState<any[]>([]);
  const [uuidSensor, setUuidSensor] = useState('');
  const [tipo, setTipo] = useState('PLASTICO');
  const [volumeMax, setVolumeMax] = useState('');
  const [nivelCheio, setNivelCheio] = useState('');
  const [ecopontoId, setEcopontoId] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregarLixeiras = () => {
    fetch('http://localhost:5000/ecofluxo/lixeiras', {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.erro || 'Erro ao carregar lixeiras.');
        setLixeiras(data);
      })
      .catch((err) => setErro(err.message));
  };

  useEffect(() => {
    carregarLixeiras();
  }, []);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      const res = await fetch('http://localhost:5000/ecofluxo/createLixeira', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          uuid_sensor: uuidSensor, 
          tipo, 
          volume_max: Number(volumeMax), 
          nivel_cheio: Number(nivelCheio), 
          ecoponto_id: Number(ecopontoId) 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.erro || 'Erro ao cadastrar lixeira.');

      setSucesso('Lixeira cadastrada com sucesso!');
      setUuidSensor('');
      setTipo('PLASTICO');
      setVolumeMax('');
      setNivelCheio('');
      setEcopontoId('');
      carregarLixeiras();
    } catch (err: any) {
      setErro(err.message);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#2e7d32', marginBottom: '20px' }}>🗑️ Gestão de Lixeiras</h2>

      {/* Formulário com o Enum de Tipos */}
      <form onSubmit={handleCadastrar} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e0e0e0' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>Cadastrar Nova Lixeira</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="UUID do Sensor (ex: sens-01)"
            value={uuidSensor}
            onChange={(e) => setUuidSensor(e.target.value)}
            required
            style={{ flex: 1, minWidth: '180px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{ flex: 1, minWidth: '160px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white' }}
          >
            <option value="PLASTICO">Plástico</option>
            <option value="PAPEL">Papel</option>
            <option value="VIDRO">Vidro</option>
            <option value="METAL">Metal</option>
            <option value="ORGANICO">Orgânico</option>
          </select>
          <input
            type="number"
            placeholder="Volume Máximo (ex: 100)"
            value={volumeMax}
            onChange={(e) => setVolumeMax(e.target.value)}
            required
            style={{ flex: 1, minWidth: '140px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="number"
            placeholder="Nível Cheio (ex: 80)"
            value={nivelCheio}
            onChange={(e) => setNivelCheio(e.target.value)}
            required
            style={{ flex: 1, minWidth: '140px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="number"
            placeholder="ID do Ecoponto (ex: 1)"
            value={ecopontoId}
            onChange={(e) => setEcopontoId(e.target.value)}
            required
            style={{ flex: 1, minWidth: '140px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cadastrar
          </button>
        </div>
        {erro && <p style={{ color: '#c62828', marginTop: '10px', fontSize: '14px' }}>{erro}</p>}
        {sucesso && <p style={{ color: '#2e7d32', marginTop: '10px', fontSize: '14px' }}>{sucesso}</p>}
      </form>

      {/* Listagem em Cards */}
      {lixeiras.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f1f8f5', borderRadius: '8px', color: '#555' }}>
          <p>Nenhuma lixeira cadastrada.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {lixeiras.map((lixeira) => (
            <div key={lixeira.id || lixeira._id} style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>ID: {lixeira.id || lixeira._id}</span>
                <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  Sensor: {lixeira.uuid_sensor}
                </span>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '18px' }}>{lixeira.tipo}</h3>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>📦 Vol. Máx: {lixeira.volume_max} | Nível: {lixeira.nivel_cheio}</p>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>📍 Ecoponto ID: {lixeira.ecoponto_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}