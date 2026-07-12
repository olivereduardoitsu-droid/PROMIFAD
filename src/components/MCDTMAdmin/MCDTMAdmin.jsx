import './MCDTMAdmin.css';

export default function MCDTMAdmin({ user, onLogout }) {
  return (
    <div className="mcdtm-wrapper">
      <div className="mcdtm-topbar">
        <div className="mcdtm-brand">
          <span className="mcdtm-logo">◈</span> MCDTM
        </div>
        <div className="mcdtm-user">
          <span className="mcdtm-badge">SUPER ADMIN</span>
          <span className="mcdtm-saludo">{user?.nombre || 'Administrador'}</span>
          <button className="mcdtm-logout" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div className="mcdtm-content">
        <header className="mcdtm-header">
          <h1>Panel de Administración MCDTM</h1>
          <p className="mcdtm-subtitle">Sistema de Monitoreo y Control para Desastres y Tragedias Mayores</p>
          <div className="mcdtm-acceso-badge">ACCESO NIVEL 5 — CÓDIGO MCDTM VERIFICADO</div>
        </header>

        <div className="mcdtm-grid">
          <div className="mcdtm-card resumen">
            <h3>📊 Resumen del Sistema</h3>
            <div className="mcdtm-stats">
              <div className="mcdtm-stat">
                <span className="mcdtm-stat-num">—</span>
                <span>Donantes registrados</span>
              </div>
              <div className="mcdtm-stat">
                <span className="mcdtm-stat-num">—</span>
                <span>Equipos de rescate</span>
              </div>
              <div className="mcdtm-stat">
                <span className="mcdtm-stat-num">—</span>
                <span>Personas rescatadas</span>
              </div>
              <div className="mcdtm-stat">
                <span className="mcdtm-stat-num">—</span>
                <span>Desaparecidos activos</span>
              </div>
              <div className="mcdtm-stat">
                <span className="mcdtm-stat-num">—</span>
                <span>Indemnizaciones</span>
              </div>
              <div className="mcdtm-stat">
                <span className="mcdtm-stat-num">—</span>
                <span>Solicitudes de rescate</span>
              </div>
            </div>
          </div>

          <div className="mcdtm-card acceso">
            <h3>🔑 Acceso Directo</h3>
            <p className="mcdtm-card-desc">Utilice la barra de navegación superior del sistema principal para acceder a cada módulo.</p>
            <div className="mcdtm-modulos">
              <span>⚙️ Gestión de Donantes</span>
              <span>🚁 Equipos de Rescate</span>
              <span>🆘 Personas Rescatadas</span>
              <span>🔍 Personas Desaparecidas</span>
              <span>💰 Indemnizaciones</span>
              <span>🚨 Solicitudes de Rescate</span>
              <span>🗺️ Zonas Afectadas</span>
              <span>📞 Contacto de Emergencia</span>
            </div>
          </div>

          <div className="mcdtm-card monitoreo">
            <h3>📡 Monitoreo en Tiempo Real</h3>
            <p className="mcdtm-card-desc">Los datos del sistema se sincronizan automáticamente con la base de datos PostgreSQL. Cualquier cambio realizado por los operadores se refleja instantáneamente.</p>
            <div className="mcdtm-indicadores">
              <div className="mcdtm-ind">
                <span className="mcdtm-ind-dot verde" />
                <span>Base de datos: <strong>CONECTADA</strong></span>
              </div>
              <div className="mcdtm-ind">
                <span className="mcdtm-ind-dot verde" />
                <span>API REST: <strong>OPERATIVA</strong></span>
              </div>
              <div className="mcdtm-ind">
                <span className="mcdtm-ind-dot amarillo" />
                <span>Última sincronización: <strong>Automática</strong></span>
              </div>
            </div>
          </div>

          <div className="mcdtm-card informacion">
            <h3>ℹ️ Información del Operador</h3>
            <div className="mcdtm-info-grid">
              <div><span>Cédula:</span> <strong>{user?.cedula || '—'}</strong></div>
              <div><span>Nombre:</span> <strong>{user?.nombre || '—'}</strong></div>
              <div><span>Nacionalidad:</span> <strong>{user?.nacionalidad || '—'}</strong></div>
              <div><span>Código:</span> <strong className="mcdtm-codigo">MCDTM</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
