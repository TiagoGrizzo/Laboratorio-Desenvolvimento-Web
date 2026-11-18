import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Ecopontos from './pages/Ecopontos';
import Lixeiras from './pages/Lixeiras';

// Componentes temporários ou importados das suas páginas
function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>EcoFluxo - Home</h1>
      <p>Bem-vindo ao sistema de gestão de ecopontos e lixeiras!</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <Link to="/login" style={{ padding: '10px 20px', background: '#22c55e', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Entrar / Login</Link>
        <Link to="/ecopontos" style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Ver Ecopontos</Link>
        <Link to="/lixeiras" style={{ padding: '10px 20px', background: '#10b981', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Ver Lixeiras</Link>
      </div>
    </div>
  );
}

function EcopontosPage() {
  return <div style={{ padding: '20px' }}><h2>Gerenciamento de Ecopontos (Listagem e Cadastro)</h2></div>;
}

function LixeirasPage() {
  return <div style={{ padding: '20px' }}><h2>Gerenciamento de Lixeiras (Listagem e Cadastro)</h2></div>;
}

function App() {
  return (
    <Router>
      <nav style={{ background: '#1f2937', padding: '15px', color: '#fff', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Início</Link>
        <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
        <Link to="/ecopontos" style={{ color: '#fff', textDecoration: 'none' }}>Ecopontos</Link>
        <Link to="/lixeiras" style={{ color: '#fff', textDecoration: 'none' }}>Lixeiras</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ecopontos" element={<Ecopontos />} />
        <Route path="/lixeiras" element={<Lixeiras />} />
      </Routes>
    </Router>
  );
}

export default App;