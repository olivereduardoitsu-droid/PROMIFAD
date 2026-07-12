import { useState } from 'react';
import './EquiposRescatePage.css';

export default function EquiposRescatePage({ equiposRescate, onRefresh }) {
  const [nombre, setNombre] = useState('');
  const [miembros, setMiembros] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [tiempoLlegada, setTiempoLlegada] = useState('');
  const [contacto, setContacto] = useState('');

  const agregarEquipo = async (e) => {
    e.preventDefault();
    if (!nombre || !miembros) return;

    try {
      const res = await fetch('http://localhost:5000/api/equipos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          miembros: parseInt(miembros),
          ubicacion,
          nacionalidad,
          tiempoLlegada,
          contacto
        })
      });
      if (res.ok) {
        setNombre('');
        setMiembros('');
        setUbicacion('');
        setNacionalidad('');
        setTiempoLlegada('');
        setContacto('');
        onRefresh();
      }
    } catch (error) {
      console.error("Error agregando brigada:", error);
    }
  };

  const toggleEstado = async (eq) => {
    const siguienteEstado = eq.estado === 'Disponible' ? 'Desplegado' :
                            eq.estado === 'Desplegado' ? 'En descanso' : 'Disponible';
    try {
      const res = await fetch(`http://localhost:5000/api/equipos/${eq.id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: siguienteEstado })
      });
      if (res.ok) onRefresh();
    } catch (error) {
      console.error("Error actualizando estado de brigada:", error);
    }
  };

  const eliminarEquipo = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/equipos/${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (error) {
      console.error("Error eliminando brigada:", error);
    }
  };

  const retirarEquipo = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/equipos/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Retirado' })
      });
      if (res.ok) onRefresh();
    } catch (error) {
      console.error("Error retirando brigada:", error);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Equipos de Búsqueda y Rescate</h2>
        <span>{equiposRescate.length} equipos</span>
      </div>

      <div className="page-grid">
        <div className="page-card">
          <h3>Registrar Equipo</h3>
          <form className="form-grid" onSubmit={agregarEquipo}>
            <div className="form-grupo full">
              <label>Nombre del equipo</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Brigada Alfa" />
            </div>
            <div className="form-grupo full">
              <label>Nacionalidad</label>
              <input value={nacionalidad} onChange={e => setNacionalidad(e.target.value)} placeholder="Venezolana, Colombiana, etc." />
            </div>
            <div className="form-grupo">
              <label>Miembros</label>
              <input type="number" min="1" value={miembros} onChange={e => setMiembros(e.target.value)} placeholder="5" />
            </div>
            <div className="form-grupo">
              <label>Tiempo de llegada</label>
              <input value={tiempoLlegada} onChange={e => setTiempoLlegada(e.target.value)} placeholder="Ej: 15 min, 1 hora" />
            </div>
            <div className="form-grupo full">
              <label>Contacto</label>
              <input value={contacto} onChange={e => setContacto(e.target.value)} placeholder="Teléfono o responsable" />
            </div>
            <div className="form-grupo">
              <label>Ubicación</label>
              <input value={ubicacion} onChange={e => setUbicacion(e.target.value)} placeholder="Zona de operación" />
            </div>
            <button type="submit" disabled={!nombre || !miembros}>Registrar Equipo</button>
          </form>
        </div>

        <div className="page-card">
          <h3>Equipos Registrados</h3>
          {equiposRescate.length === 0 ? (
            <div className="empty-msg">No hay equipos registrados</div>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Nacionalidad</th>
                    <th>Miembros</th>
                    <th>Llegada</th>
                    <th>Contacto</th>
                    <th>Ubicación</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {equiposRescate.map(eq => (
                    <tr key={eq.id}>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{eq.id}</td>
                      <td style={{ fontWeight: 600 }}>{eq.nombre}</td>
                      <td><span className="nacionalidad-badge">{eq.nacionalidad || '—'}</span></td>
                      <td>{eq.miembros}</td>
                      <td>{eq.tiempollegada || eq.tiempoLlegada || '—'}</td>
                      <td>{eq.contacto || '—'}</td>
                      <td>{eq.ubicacion}</td>
                      <td>
                        <span className={`estado-badge ${(eq.estado || '').toLowerCase().replace(' ', '-')}`}>
                          {eq.estado}
                        </span>
                      </td>
                      <td>
                        <div className="acciones-grupo">
                          <button className="acciones-btn" onClick={() => toggleEstado(eq)} title="Cambiar estado">↻</button>
                          <button className="acciones-btn retirar" onClick={() => retirarEquipo(eq.id)} title="Retirar equipo">🚫</button>
                          <button className="acciones-btn eliminar" onClick={() => eliminarEquipo(eq.id)} title="Eliminar definitivamente">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}