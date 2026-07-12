import { useState } from 'react';
import './DonorPortal.css';

export default function DonorPortal({ user, onLogout }) {
  const [tab, setTab] = useState('donar');
  const [monto, setMonto] = useState('');
  const [objeto, setObjeto] = useState('');
  const [cantidad, setCantidad] = useState('');

  const [donaciones, setDonaciones] = useState([
    { tipo: 'monetaria', monto: 50, fecha: new Date().toLocaleDateString('es-ES'), estado: 'Completado' },
    { tipo: 'objeto', objeto: 'Arroz', cantidad: 20, fecha: new Date().toLocaleDateString('es-ES'), estado: 'Entregado' },
  ]);

  const donarDinero = (e) => {
    e.preventDefault();
    if (!monto || parseFloat(monto) <= 0) return;
    setDonaciones(prev => [{
      tipo: 'monetaria',
      monto: parseFloat(monto),
      fecha: new Date().toLocaleDateString('es-ES'),
      estado: 'Pendiente'
    }, ...prev]);
    setMonto('');
  };

  const donarObjeto = (e) => {
    e.preventDefault();
    if (!objeto || !cantidad) return;
    setDonaciones(prev => [{
      tipo: 'objeto',
      objeto,
      cantidad: parseInt(cantidad),
      fecha: new Date().toLocaleDateString('es-ES'),
      estado: 'Pendiente'
    }, ...prev]);
    setObjeto('');
    setCantidad('');
  };

  const totalDonado = donaciones.reduce((sum, d) =>
    d.tipo === 'monetaria' ? sum + (d.monto || 0) : sum, 0
  );

  const totalObjetos = donaciones.filter(d => d.tipo === 'objeto').length;

  return (
    <div className="donor-wrapper">
      <div className="donor-topbar">
        <div className="donor-brand">PROMIFAD</div>
        <div className="donor-user">
          <span className="donor-saludo">Bienvenido, <strong>{user?.nombre || 'Donante'}</strong></span>
          <button className="donor-logout" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div className="donor-content">
        <header className="donor-header">
          <h1>Portal del Donante</h1>
          <div className="header-line" />
          <p className="donor-subtitle">Gracias por tu solidaridad. Cada aporte cuenta para ayudar a quienes más lo necesitan.</p>
        </header>

        <div className="donor-stats">
          <div className="donor-stat-card">
            <span className="donor-stat-icon">💰</span>
            <span className="donor-stat-val">${totalDonado.toFixed(2)}</span>
            <span className="donor-stat-label">Donado en dinero</span>
          </div>
          <div className="donor-stat-card">
            <span className="donor-stat-icon">📦</span>
            <span className="donor-stat-val">{totalObjetos}</span>
            <span className="donor-stat-label">Donaciones en objetos</span>
          </div>
          <div className="donor-stat-card">
            <span className="donor-stat-icon">🤝</span>
            <span className="donor-stat-val">{donaciones.length}</span>
            <span className="donor-stat-label">Total de donaciones</span>
          </div>
        </div>

        <div className="donor-tabs">
          <button className={`donor-tab ${tab === 'donar' ? 'activo' : ''}`} onClick={() => setTab('donar')}>💰 Donar</button>
          <button className={`donor-tab ${tab === 'historial' ? 'activo' : ''}`} onClick={() => setTab('historial')}>📋 Mi Historial</button>
        </div>

        {tab === 'donar' ? (
          <div className="donor-options">
            <div className="donor-card">
              <h3>💵 Donar Dinero</h3>
              <form onSubmit={donarDinero} className="donor-form">
                <div className="form-grupo">
                  <label>Monto a donar ($)</label>
                  <input type="number" step="0.01" min="1" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0.00" />
                </div>
                <button type="submit" disabled={!monto || parseFloat(monto) <= 0}>Donar Dinero</button>
              </form>
            </div>

            <div className="donor-card">
              <h3>📦 Donar Objetos</h3>
              <form onSubmit={donarObjeto} className="donor-form">
                <div className="form-grupo">
                  <label>Objeto</label>
                  <input value={objeto} onChange={e => setObjeto(e.target.value)} placeholder="Ej: Alimentos, Ropa, Medicinas" />
                </div>
                <div className="form-grupo">
                  <label>Cantidad</label>
                  <input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="10" />
                </div>
                <button type="submit" disabled={!objeto || !cantidad}>Donar Objetos</button>
              </form>
            </div>
          </div>
        ) : (
          <div className="donor-card">
            <h3>📋 Historial de Donaciones</h3>
            {donaciones.length === 0 ? (
              <div className="empty-msg">Aún no has realizado donaciones</div>
            ) : (
              <div className="donor-historial">
                {donaciones.map((d, i) => (
                  <div key={i} className="donor-hist-item">
                    <div className="hist-top">
                      <span className="hist-tipo">
                        {d.tipo === 'monetaria' ? '💰 Donación monetaria' : '📦 Donación de objetos'}
                      </span>
                      <span className={`hist-estado ${d.estado.toLowerCase()}`}>{d.estado}</span>
                    </div>
                    <div className="hist-detalle">
                      {d.tipo === 'monetaria'
                        ? `$${d.monto.toFixed(2)}`
                        : `${d.objeto} × ${d.cantidad}`
                      } · {d.fecha}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
