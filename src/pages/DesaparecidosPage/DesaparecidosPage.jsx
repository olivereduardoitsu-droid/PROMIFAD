import { useState, useRef } from 'react';
import FileUploadImport from '../../components/FileUploadImport/FileUploadImport';
import './DesaparecidosPage.css';

const columns = [
  { key: 'nombre', label: 'Nombre', required: true },
  { key: 'zona', label: 'Zona', required: false },
];

export default function DesaparecidosPage({
  personasDesaparecidas,
  personasRescatadas,
  onRefresh
}) {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [zona, setZona] = useState('');
  const [tiempoSinVer, setTiempoSinVer] = useState('');
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const fileInputRef = useRef(null);

  const [confirmacion, setConfirmacion] = useState(null);
  const [cedulaConfirm, setCedulaConfirm] = useState('');
  const [fotoConfirmada, setFotoConfirmada] = useState(false);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const agregarDesaparecido = async (e) => {
    e.preventDefault();
    if (!nombre) return;
    try {
      const res = await fetch('http://localhost:5000/api/desaparecidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          cedula: cedula || '',
          zona: zona || 'Desconocida',
          tiempo_sin_ver: tiempoSinVer || '',
          foto: fotoPreview || ''
        })
      });
      if (res.ok) {
        setNombre(''); setCedula(''); setZona(''); setTiempoSinVer('');
        setFoto(null); setFotoPreview('');
        onRefresh();
      }
    } catch (error) {
      console.error("Error al reportar desaparecido:", error);
    }
  };

  const abrirConfirmacion = (desaparecido) => {
    setConfirmacion(desaparecido);
    setCedulaConfirm('');
    setFotoConfirmada(false);
  };

  const confirmarRescate = async () => {
    if (!confirmacion) return;
    const cedulaCoincide = cedulaConfirm === confirmacion.cedula;
    if (!cedulaCoincide) {
      alert('La cédula no coincide con el reporte de desaparición.');
      return;
    }
    if (!fotoConfirmada) {
      alert('Debe confirmar visualmente que la foto corresponde a la persona rescatada.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/transiciones/rescatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: confirmacion.id,
          nombre: confirmacion.nombre,
          zona: confirmacion.zona,
          cedula: confirmacion.cedula
        })
      });
      if (res.ok) {
        setConfirmacion(null);
        onRefresh();
      }
    } catch (error) {
      console.error("Error al procesar el rescate del desaparecido:", error);
    }
  };

  const importarDesaparecidos = async (registros) => {
    for (const r of registros) {
      if (!r.nombre) continue;
      await fetch('http://localhost:5000/api/desaparecidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: r.nombre,
          cedula: r.cedula || '',
          zona: r.zona || 'Desconocida',
          tiempo_sin_ver: r.tiempo_sin_ver || r.tiempoSinVer || ''
        })
      });
    }
    onRefresh();
  };

  const filtrados = personasDesaparecidas.filter(d =>
    d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (d.cedula && d.cedula.includes(busqueda))
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>Personas Desaparecidas</h2>
        <span>{personasDesaparecidas.length} reportes</span>
      </div>

      <div className="page-grid">
        <div className="page-card">
          <h3>Reportar Desaparición</h3>
          <form className="form-grid" onSubmit={agregarDesaparecido}>
            <div className="form-grupo full">
              <label>Nombre completo</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre de la persona" />
            </div>
            <div className="form-grupo">
              <label>Cédula</label>
              <input value={cedula} onChange={e => setCedula(e.target.value)} placeholder="V-12345678" />
            </div>
            <div className="form-grupo">
              <label>Zona</label>
              <input value={zona} onChange={e => setZona(e.target.value)} placeholder="Zona donde se vio por última vez" />
            </div>
            <div className="form-grupo">
              <label>Tiempo sin ver</label>
              <input value={tiempoSinVer} onChange={e => setTiempoSinVer(e.target.value)} placeholder="Ej: 2 días, 1 semana" />
            </div>
            <div className="form-grupo full">
              <label>Foto de la persona</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFoto} style={{ fontSize: '0.75rem' }} />
              {fotoPreview && (
                <div className="foto-preview">
                  <img src={fotoPreview} alt="Vista previa" />
                </div>
              )}
            </div>
            <button type="submit" disabled={!nombre}>Reportar Desaparición</button>
          </form>
          <FileUploadImport columns={columns} onImport={importarDesaparecidos} label="desaparecidos" />
        </div>

        <div className="page-card">
          <h3>Personas Desaparecidas</h3>
          <input
            style={{ marginBottom: '0.8rem', width: '100%' }}
            placeholder="Buscar por nombre o cédula..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {filtrados.length === 0 ? (
            <div className="empty-msg">No hay reportes de desaparición</div>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Cédula</th>
                    <th>Última vez</th>
                    <th>Tiempo</th>
                    <th>Zona</th>
                    <th>Foto</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map(d => (
                    <tr key={d.id}>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{d.id}</td>
                      <td>{d.nombre}</td>
                      <td>{d.cedula || '—'}</td>
                      <td>{new Date(d.ultima_vista || d.ultimaVista || Date.now()).toLocaleDateString('es-ES')}</td>
                      <td>{d.tiempo_sin_ver || d.tiempoSinVer || '—'}</td>
                      <td>{d.zona}</td>
                      <td>
                        {d.foto ? (
                          <img src={d.foto} alt={d.nombre} className="foto-thumb" />
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Sin foto</span>
                        )}
                      </td>
                      <td>
                        <button className="acciones-btn" onClick={() => abrirConfirmacion(d)} title="Marcar como rescatado">
                          ✓ Rescatado
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {confirmacion && (
        <div className="modal-overlay" onClick={() => setConfirmacion(null)}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>Confirmar Rescate</h3>
            <p>Verifique que la persona rescatada coincide con <strong>{confirmacion.nombre}</strong></p>

            {confirmacion.foto && (
              <div className="confirm-foto">
                <img src={confirmacion.foto} alt="Foto del desaparecido" />
              </div>
            )}

            <div className="confirm-campos">
              <div className="form-grupo">
                <label>Cédula de la persona rescatada</label>
                <input
                  value={cedulaConfirm}
                  onChange={e => setCedulaConfirm(e.target.value)}
                  placeholder="Ingrese la cédula para verificar"
                />
                {cedulaConfirm && confirmacion.cedula && (
                  <span className={`confirm-validacion ${cedulaConfirm === confirmacion.cedula ? 'valida' : 'invalida'}`}>
                    {cedulaConfirm === confirmacion.cedula ? '✓ Cédula coincide' : '✕ La cédula no coincide'}
                  </span>
                )}
              </div>
              <div className="form-grupo">
                <label>
                  <input
                    type="checkbox"
                    checked={fotoConfirmada}
                    onChange={e => setFotoConfirmada(e.target.checked)}
                    style={{ marginRight: '0.5rem', width: 'auto' }}
                  />
                  Confirmo que la foto corresponde a la persona rescatada
                </label>
              </div>
            </div>

            <div className="modal-acciones">
              <button
                className="btn-aprobar"
                onClick={confirmarRescate}
                disabled={!cedulaConfirm || !fotoConfirmada}
              >
                Confirmar Rescate
              </button>
              <button className="btn-rechazar" onClick={() => setConfirmacion(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
