import { useState } from 'react';
import './SolicitudesRescate.css';

const monedas = [
  { codigo: 'USD', simbolo: '$', nombre: 'Dólar estadounidense' },
  { codigo: 'EUR', simbolo: '€', nombre: 'Euro' },
  { codigo: 'VES', simbolo: 'Bs.', nombre: 'Bolívar venezolano' },
  { codigo: 'COP', simbolo: '$', nombre: 'Peso colombiano' },
];

export default function SolicitudesRescate({ addLog }) {
  const [solicitudes, setSolicitudes] = useState([
    { id: 'SOL-01', nombre: 'Ana Torres', cedula: 'V-12345678', situacion: 'Atrapada en escombros tras derrumbe', pruebas: 'Fotos de ubicación, coordenadas GPS', estado: 'pendiente' },
    { id: 'SOL-02', nombre: 'Carlos Rivas', cedula: 'V-87654321', situacion: 'Familia aislada por inundación en techo de vivienda', pruebas: 'Video de la zona, testigos', estado: 'pendiente' },
  ]);

  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [situacion, setSituacion] = useState('');
  const [pruebas, setPruebas] = useState('');
  const [modalPago, setModalPago] = useState(null);
  const [metodoPago, setMetodoPago] = useState('transferencia');
  const [moneda, setMoneda] = useState('USD');
  const [costoRescate, setCostoRescate] = useState(50);

  const agregarSolicitud = (e) => {
    e.preventDefault();
    if (!nombre || !situacion) return;
    const nueva = {
      id: `SOL-${String(solicitudes.length + 1).padStart(2, '0')}`,
      nombre, cedula, situacion, pruebas: pruebas || 'Sin pruebas adjuntas', estado: 'pendiente'
    };
    setSolicitudes(prev => [...prev, nueva]);
    addLog(`📋 Nueva solicitud de rescate: ${nombre} — ${situacion}`);
    setNombre(''); setCedula(''); setSituacion(''); setPruebas('');
  };

  const abrirPago = (sol) => setModalPago(sol.id);

  const confirmarPago = () => {
    setSolicitudes(prev => prev.map(s =>
      s.id === modalPago
        ? { ...s, estado: 'aprobado', metodoPago, moneda, costoRescate }
        : s
    ));
    const sol = solicitudes.find(s => s.id === modalPago);
    addLog(`✅ Rescate APROBADO para ${sol.nombre} — ${metodoPago} en ${moneda} ($${costoRescate})`);
    setModalPago(null);
  };

  const rechazar = (id) => {
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: 'rechazado' } : s));
    const sol = solicitudes.find(s => s.id === id);
    addLog(`❌ Solicitud de rescate RECHAZADA: ${sol.nombre}`);
  };

  const pendientes = solicitudes.filter(s => s.estado === 'pendiente');
  const historial = solicitudes.filter(s => s.estado !== 'pendiente');

  return (
    <section className="solicitudes-panel">
      <h2>🚨 Solicitudes de Rescate</h2>

      <div className="solicitudes-grid">
        <div className="solicitudes-col">
          <h3>Registrar Solicitud</h3>
          <form className="sol-form" onSubmit={agregarSolicitud}>
            <div className="form-grupo">
              <label>Nombre del damnificado</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre completo" />
            </div>
            <div className="form-grupo">
              <label>Cédula</label>
              <input value={cedula} onChange={e => setCedula(e.target.value)} placeholder="V-12345678" />
            </div>
            <div className="form-grupo">
              <label>Situación / Emergencia</label>
              <textarea value={situacion} onChange={e => setSituacion(e.target.value)} placeholder="Describa la situación..." rows={2} />
            </div>
            <div className="form-grupo">
              <label>Pruebas / Evidencias</label>
              <textarea value={pruebas} onChange={e => setPruebas(e.target.value)} placeholder="Fotos, videos, testigos, coordenadas..." rows={2} />
            </div>
            <button type="submit" disabled={!nombre || !situacion}>Registrar Solicitud</button>
          </form>
        </div>

        <div className="solicitudes-col">
          <h3>Pendientes ({pendientes.length})</h3>
          {pendientes.length === 0 ? (
            <div className="empty-msg">No hay solicitudes pendientes</div>
          ) : (
            <div className="sol-lista">
              {pendientes.map(s => (
                <div key={s.id} className="sol-card pendiente">
                  <div className="sol-card-header">
                    <span className="sol-nombre">{s.nombre}</span>
                    <span className="sol-id">{s.id}</span>
                  </div>
                  {s.cedula && <div className="sol-detalle">Cédula: {s.cedula}</div>}
                  <div className="sol-detalle"><strong>Situación:</strong> {s.situacion}</div>
                  <div className="sol-detalle"><strong>Pruebas:</strong> {s.pruebas}</div>
                  <div className="sol-acciones">
                    <button className="btn-aprobar" onClick={() => abrirPago(s)}>✓ Aprobar</button>
                    <button className="btn-rechazar" onClick={() => rechazar(s.id)}>✕ Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {historial.length > 0 && (
        <details className="sol-historial">
          <summary>Historial ({historial.length})</summary>
          {historial.map(s => (
            <div key={s.id} className={`sol-card ${s.estado}`}>
              <div className="sol-card-header">
                <span className="sol-nombre">{s.nombre}</span>
                <span className={`sol-estado-badge ${s.estado}`}>{s.estado}</span>
              </div>
              <div className="sol-detalle">{s.situacion}</div>
              {s.estado === 'aprobado' && (
                <div className="sol-detalle">Pago: {s.metodoPago} en {s.moneda} — ${s.costoRescate}</div>
              )}
            </div>
          ))}
        </details>
      )}

      {modalPago && (
        <div className="modal-overlay" onClick={() => setModalPago(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Confirmar Rescate</h3>
            <p>Seleccione el método de pago y moneda para el rescate de <strong>{solicitudes.find(s => s.id === modalPago)?.nombre}</strong></p>
            <div className="modal-form">
              <div className="form-grupo">
                <label>Método de pago</label>
                <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="criptomoneda">Criptomoneda</option>
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                  <option value="giro">Giro postal</option>
                </select>
              </div>
              <div className="form-grupo">
                <label>Moneda</label>
                <select value={moneda} onChange={e => setMoneda(e.target.value)}>
                  {monedas.map(m => (
                    <option key={m.codigo} value={m.codigo}>{m.simbolo} {m.nombre} ({m.codigo})</option>
                  ))}
                </select>
              </div>
              <div className="form-grupo">
                <label>Costo del rescate ($)</label>
                <input type="number" min="1" value={costoRescate} onChange={e => setCostoRescate(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="modal-acciones">
              <button className="btn-aprobar" onClick={confirmarPago}>Confirmar y Aprobar</button>
              <button className="btn-rechazar" onClick={() => setModalPago(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
