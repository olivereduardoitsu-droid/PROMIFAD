import { useState } from 'react';
import './DonantesPage.css';

export default function DonantesPage({ personas, setPersonas, onRefresh }) {
  const [nombre, setNombre] = useState('');
  const [vulnerabilidad, setVulnerabilidad] = useState('Ninguna');
  const [saldo, setSaldo] = useState('');

  const [donaciones, setDonaciones] = useState([
    { id: 'DON-01', donanteId: 'PER-01', objeto: 'Alimentos no perecederos', cantidad: 50 },
    { id: 'DON-02', donanteId: 'PER-01', objeto: 'Ropa', cantidad: 30 },
    { id: 'DON-03', donanteId: 'PER-02', objeto: 'Medicinas', cantidad: 20 },
    { id: 'DON-04', donanteId: 'PER-03', objeto: 'Agua embotellada', cantidad: 100 },
  ]);

  const [donanteSel, setDonanteSel] = useState('');
  const [objeto, setObjeto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [donanteExpandido, setDonanteExpandido] = useState(null);

  const agregarDonante = async (e) => {
    e.preventDefault();
    if (!nombre || !saldo) return;
    try {
      const res = await fetch('http://localhost:5000/api/donantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, vulnerabilidad, saldo: parseFloat(saldo) })
      });
      if (res.ok) {
        setNombre('');
        setVulnerabilidad('Ninguna');
        setSaldo('');
        onRefresh();
      }
    } catch (error) {
      console.error("Error agregando donante:", error);
    }
  };

  const eliminarDonante = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donantes/${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (error) {
      console.error("Error eliminando donante:", error);
    }
  };

  const agregarDonacion = (e) => {
    e.preventDefault();
    if (!donanteSel || !objeto || !cantidad) return;
    const nueva = {
      id: `DON-${String(donaciones.length + 1).padStart(2, '0')}`,
      donanteId: donanteSel,
      objeto,
      cantidad: parseInt(cantidad)
    };
    setDonaciones(prev => [...prev, nueva]);
    setObjeto('');
    setCantidad('');
  };

  const donacionesPorDonante = (donanteId) =>
    donaciones.filter(d => d.donanteId === donanteId);

  const totalFondos = personas.reduce((sum, p) => sum + parseFloat(p.saldo || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Gestión de Donantes</h2>
        <span>{personas.length} registros · Total: ${totalFondos.toFixed(2)}</span>
      </div>

      <div className="page-grid">
        <div className="page-card">
          <h3>Registrar Donante</h3>
          <form className="form-grid" onSubmit={agregarDonante}>
            <div className="form-grupo full">
              <label>Nombre completo</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del donante" />
            </div>
            <div className="form-grupo">
              <label>Vulnerabilidad</label>
              <select value={vulnerabilidad} onChange={e => setVulnerabilidad(e.target.value)}>
                <option value="Ninguna">Ninguna</option>
                <option value="Zonificación de Riesgo">Zonificación de Riesgo</option>
                <option value="Desplazamiento Forzado">Desplazamiento Forzado</option>
                <option value="Pérdida Total">Pérdida Total</option>
              </select>
            </div>
            <div className="form-grupo">
              <label>Saldo inicial ($)</label>
              <input type="number" step="0.01" min="0" value={saldo} onChange={e => setSaldo(e.target.value)} placeholder="0.00" />
            </div>
            <button type="submit" disabled={!nombre || !saldo}>Agregar Donante</button>
          </form>
        </div>

        <div className="page-card">
          <h3>Lista de Donantes</h3>
          {personas.length === 0 ? (
            <div className="empty-msg">No hay donantes registrados</div>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Vulnerabilidad</th>
                    <th>Saldo</th>
                    <th>Donaciones</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {personas.map(p => {
                    const donacionesDonante = donacionesPorDonante(p.id);
                    const expandido = donanteExpandido === p.id;
                    return (
                      <>
                        <tr key={p.id}>
                          <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.id}</td>
                          <td>{p.nombre}</td>
                          <td>{p.vulnerabilidad}</td>
                          <td style={{ color: 'var(--orange-accent)', fontWeight: 600 }}>${parseFloat(p.saldo).toFixed(2)}</td>
                          <td>
                            <button
                              className="acciones-btn"
                              onClick={() => setDonanteExpandido(expandido ? null : p.id)}
                              title="Ver donaciones"
                            >
                              {donacionesDonante.length} ítems {expandido ? '▲' : '▼'}
                            </button>
                          </td>
                          <td>
                            <button className="acciones-btn" onClick={() => eliminarDonante(p.id)} title="Eliminar">✕</button>
                          </td>
                        </tr>
                        {expandido && (
                          <tr key={`${p.id}-donaciones`} className="donaciones-row">
                            <td colSpan={6} style={{ padding: '0.5rem 0.8rem 0.8rem 0.8rem' }}>
                              <div className="donaciones-lista">
                                {donacionesDonante.length === 0 ? (
                                  <span className="sin-donaciones">Sin donaciones registradas</span>
                                ) : (
                                  donacionesDonante.map(d => (
                                    <div key={d.id} className="donacion-item">
                                      <span className="donacion-objeto">{d.objeto}</span>
                                      <span className="donacion-cantidad">× {d.cantidad}</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="page-card" style={{ marginTop: '1.5rem' }}>
        <h3>Registrar Donación de Objetos</h3>
        <form className="form-grid" onSubmit={agregarDonacion} style={{ maxWidth: '500px' }}>
          <div className="form-grupo full">
            <label>Donante</label>
            <select value={donanteSel} onChange={e => setDonanteSel(e.target.value)}>
              <option value="">Seleccionar donante...</option>
              {personas.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-grupo">
            <label>Objeto donado</label>
            <input value={objeto} onChange={e => setObjeto(e.target.value)} placeholder="Ej: Alimentos, Ropa, Medicinas" />
          </div>
          <div className="form-grupo">
            <label>Cantidad</label>
            <input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="10" />
          </div>
          <button type="submit" disabled={!donanteSel || !objeto || !cantidad}>Registrar Donación</button>
        </form>
      </div>
    </div>
  );
}
