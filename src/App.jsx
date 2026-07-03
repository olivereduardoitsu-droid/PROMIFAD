import { useState } from 'react';
import FaseEmergencia from './components/FaseEmergencia/FaseEmergencia';
import FaseRecuperacion from './components/FaseRecuperacion/FaseRecuperacion';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  // 1. INICIALIZACIÓN DE DATOS (Capa de Dominio)
  const [personas, setPersonas] = useState([
    { id: "PER-01", nombre: "Juan Pérez", vulnerabilidad: "Ninguna", saldo: 100.0 },
    { id: "PER-02", nombre: "María López", vulnerabilidad: "Zonificación de Riesgo", saldo: 250.0 },
    { id: "PER-03", nombre: "Carlos Mendoza", vulnerabilidad: "Ninguna", saldo: 40.0 }
  ]);

  const [proyecto, setProyecto] = useState({
    id: "PROY-01",
    descripcion: "Reconstrucción Barbería El Estilo",
    montoRequerido: 300.0,
    montoActual: 0.0,
    estado: "PENDIENTE"
  });

  const [log, setLog] = useState([]);

  const addLog = (message) => setLog(prev => [...prev, message]);

  return (
    <div className="app-container">
      <header>
        <h1>Sistema de Resiliencia y Financiación Humanitaria</h1>
        <div className="divider"></div>
      </header>
      
      <main className="grid-layout">
        <div className="actions-column">
          <FaseEmergencia 
            personas={personas} 
            setPersonas={setPersonas} 
            addLog={addLog} 
          />
          <FaseRecuperacion 
            personas={personas} 
            setPersonas={setPersonas} 
            proyecto={proyecto}
            setProyecto={setProyecto}
            addLog={addLog} 
          />
        </div>
        <div className="dashboard-column">
          <Dashboard personas={personas} proyecto={proyecto} log={log} />
        </div>
      </main>
    </div>
  );
}

export default App;