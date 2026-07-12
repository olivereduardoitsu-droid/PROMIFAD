import { useState, useEffect } from 'react';
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login';
import FaseEmergencia from './components/FaseEmergencia/FaseEmergencia';
import FaseRecuperacion from './components/FaseRecuperacion/FaseRecuperacion';
import Dashboard from './components/Dashboard/Dashboard';
import Indemnizacion from './components/Indemnizacion/Indemnizacion';
import DonantesPage from './pages/DonantesPage/DonantesPage';
import EquiposRescatePage from './pages/EquiposRescatePage/EquiposRescatePage';
import RescatadosPage from './pages/RescatadosPage/RescatadosPage';
import DesaparecidosPage from './pages/DesaparecidosPage/DesaparecidosPage';
import ContactoEmergencia from './components/ContactoEmergencia/ContactoEmergencia';
import ZonasAfectadas from './components/ZonasAfectadas/ZonasAfectadas';
import SolicitudesRescate from './components/SolicitudesRescate/SolicitudesRescate';
import DonorPortal from './components/DonorPortal/DonorPortal';
import MCDTMAdmin from './components/MCDTMAdmin/MCDTMAdmin';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [tabActiva, setTabActiva] = useState('inicio');
  const [theme, setTheme] = useState('default');

  // Estados dinámicos vinculados con PostgreSQL
  const [personas, setPersonas] = useState([]);
  const [proyecto, setProyecto] = useState({ id: '', descripcion: '', montoRequerido: 0, montoActual: 0, estado: 'PENDIENTE' });
  const [log, setLog] = useState([]);
  const [equiposRescate, setEquiposRescate] = useState([]);
  const [personasRescatadas, setPersonasRescatadas] = useState([]);
  const [personasDesaparecidas, setPersonasDesaparecidas] = useState([]);
  const [indemnizaciones, setIndemnizaciones] = useState([]);

  // Función auxiliar de fetch seguro para evitar el error del token '<'
  const fetchSeguro = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`La ruta ${url} respondió con estado ${res.status}. Se devolvió un array vacío.`);
      return []; // Fallback seguro
    }
    return res.json();
  };

  // Carga inicial sincronizada
  const cargarDatos = async () => {
    try {
      const fetchs = await Promise.all([
        fetchSeguro(`${API_BASE_URL}/donantes`),
        fetchSeguro(`${API_BASE_URL}/desaparecidos`),
        fetchSeguro(`${API_BASE_URL}/rescatados`),
        fetchSeguro(`${API_BASE_URL}/equipos`),
        fetchSeguro(`${API_BASE_URL}/indemnizaciones`),
        fetchSeguro(`${API_BASE_URL}/proyectos`),
        fetchSeguro(`${API_BASE_URL}/logs`)
      ]);

      setPersonas(fetchs[0]);
      setPersonasDesaparecidas(fetchs[1]);
      setPersonasRescatadas(fetchs[2]);
      setEquiposRescate(fetchs[3]);
      setIndemnizaciones(fetchs[4]);
      
      if (fetchs[5] && fetchs[5].length > 0) {
        setProyecto(fetchs[5][0]);
      }
      
      if (fetchs[6]) {
        setLog(fetchs[6].map(l => l.entrada || l));
      }
    } catch (error) {
      console.error("Error al sincronizar datos iniciales con PostgreSQL:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const addLog = async (message) => {
    try {
      const res = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entrada: message })
      });
      if (res.ok) {
        setLog(prev => [message, ...prev]); // Los nuevos arriba
      }
    } catch (error) {
      console.error("Error persistiendo log:", error);
    }
  };

  const handleLogin = (data) => {
    setUser(data);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    setTabActiva('inicio');
  };

  const renderTab = () => {
    switch (tabActiva) {
      case 'inicio':
        return (
          <>
            <main className="inicio-grid">
              <div className="inicio-col">
                <FaseEmergencia personas={personas} setPersonas={setPersonas} addLog={addLog} onRefresh={cargarDatos} />
                <FaseRecuperacion personas={personas} setPersonas={setPersonas} proyecto={proyecto} setProyecto={setProyecto} addLog={addLog} onRefresh={cargarDatos} />
              </div>
              <div className="inicio-col">
                <Dashboard personas={personas} proyecto={proyecto} log={log} />
              </div>
            </main>
            <SolicitudesRescate addLog={addLog} />
          </>
        );
      case 'donantes':
        return <DonantesPage personas={personas} setPersonas={setPersonas} onRefresh={cargarDatos} />;
      case 'equipos':
        return <EquiposRescatePage equiposRescate={equiposRescate} setEquiposRescate={setEquiposRescate} onRefresh={cargarDatos} />;
      case 'rescatados':
        return <RescatadosPage personasRescatadas={personasRescatadas} setPersonasRescatadas={setPersonasRescatadas} equiposRescate={equiposRescate} onRefresh={cargarDatos} />;
      case 'desaparecidos':
        return (
          <DesaparecidosPage
            personasDesaparecidas={personasDesaparecidas}
            setPersonasDesaparecidas={setPersonasDesaparecidas}
            personasRescatadas={personasRescatadas}
            setPersonasRescatadas={setPersonasRescatadas}
            onRefresh={cargarDatos}
          />
        );
      case 'indemnizacion':
        return (
          <Indemnizacion
            personas={personas}
            indemnizaciones={indemnizaciones}
            setIndemnizaciones={setIndemnizaciones}
            addLog={addLog}
            onRefresh={cargarDatos}
          />
        );
      case 'zonas-afectadas':
        return <ZonasAfectadas />;
      case 'contacto-emergencia':
        return <ContactoEmergencia />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container" data-theme={theme}>
      {loggedIn ? (
        user?.role === 'donante' ? (
          <DonorPortal user={user} onLogout={handleLogout} />
        ) : user?.role === 'mcdtm' ? (
          <MCDTMAdmin user={user} onLogout={handleLogout} />
        ) : (
          <>
            <NavBar tabActiva={tabActiva} setTabActiva={setTabActiva} onLogout={handleLogout} />
            <div className="app-content">
              <header className="app-header">
                <h1>Sistema de Resiliencia y Financiación Humanitaria</h1>
                <div className="header-line" />
              </header>
              {renderTab()}
            </div>
          </>
        )
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;