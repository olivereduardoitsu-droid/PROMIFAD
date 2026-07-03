import './FaseRecuperacion.css';

export default function FaseRecuperacion({ personas, setPersonas, proyecto, setProyecto, addLog }) {
  
  const ejecutarFinanciacion = () => {
    if (proyecto.estado === "FINANCIADO") return;

    addLog(">>> [INICIANDO FASE 2: REACTIVACIÓN ECONÓMICA]");
    addLog(`Proyecto: ${proyecto.descripcion} necesita $${proyecto.montoRequerido}`);

    const inversores = personas.filter(p => p.id !== "PER-01"); // María y Carlos
    const aportePorInversor = proyecto.montoRequerido / inversores.length; // $150
    
    let montoRecolectado = 0;

    const nuevasPersonas = personas.map(persona => {
      // Roles de CoInversor
      if (persona.id !== "PER-01" && persona.saldo >= aportePorInversor) {
        montoRecolectado += aportePorInversor;
        addLog(`Inversor ${persona.nombre} co-invierte: $${aportePorInversor}`);
        return { ...persona, saldo: persona.saldo - aportePorInversor };
      }
      return persona;
    });

    if (montoRecolectado >= proyecto.montoRequerido) {
      // Rol EmprendedorDamnificado recibe fondos
      const personasFinales = nuevasPersonas.map(p => 
        p.id === "PER-01" ? { ...p, saldo: p.saldo + montoRecolectado } : p
      );
      
      setPersonas(personasFinales);
      setProyecto({ ...proyecto, montoActual: montoRecolectado, estado: "FINANCIADO" });
      addLog(`🔔 [Notificación] ¡Felicidades Juan! Tu barbería ha sido financiada.`);
      addLog("¡Éxito! El emprendimiento está plenamente FINANCIADO.");
    } else {
      setPersonas(nuevasPersonas);
      addLog("Fondos insuficientes para financiar el proyecto.");
    }
  };

  return (
    <section className="fase-panel">
      <h2>II. Reactivación Económica</h2>
      <p>Proyecto: <em>{proyecto.descripcion}</em></p>
      <p>Estado: <strong>{proyecto.estado}</strong></p>
      <button 
        onClick={ejecutarFinanciacion} 
        disabled={proyecto.estado === "FINANCIADO"}
      >
        Otorgar Microcrédito
      </button>
    </section>
  );
}