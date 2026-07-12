import './FaseEmergencia.css';

export default function FaseEmergencia({ addLog, onRefresh }) {
  const costoEnvio = 120.0;

  const ejecutarFaseEmergencia = async () => {
    await addLog(">>> [INICIANDO FASE 1: DESPLIEGUE DE EMERGENCIA]");
    
    try {
      const res = await fetch('http://localhost:5000/api/fases/emergencia', { 
        method: 'POST' 
      });
      
      if (res.ok) {
        const data = await res.json();
        // Procesamos los logs que devuelve el backend
        for (const msg of data.operaciones) {
          await addLog(msg);
        }
        onRefresh();
      } else {
        await addLog("Error: No se pudo completar el despliegue.");
      }
    } catch (error) {
      console.error("Error al procesar fase de emergencia:", error);
      await addLog("Error de conexión con el servidor.");
    }
  };

  return (
    <section className="fase-panel">
      <h2>I. Despliegue de Emergencia</h2>
      <p>Costo logístico requerido: <strong>${costoEnvio.toFixed(2)}</strong></p>
      <button onClick={ejecutarFaseEmergencia}>
        Ejecutar Despliegue
      </button>
    </section>
  );
}