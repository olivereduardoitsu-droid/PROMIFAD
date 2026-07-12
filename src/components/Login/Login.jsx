import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('admin');
  const [codigo, setCodigo] = useState('');
  const [form, setForm] = useState({
    cedula: '',
    telefono: '',
    nombre: '',
    correo: '',
    nacionalidad: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCodigoSubmit = (e) => {
    e.preventDefault();
    if (codigo.toUpperCase() === 'MCDTM') {
      onLogin({ ...form, role: 'mcdtm', codigo });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ ...form, role });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">PROMIFAD</div>
        <h2 className="login-title">Sistema de Resiliencia y Financiación Humanitaria</h2>
        <div className="login-divider" />

        <div className="login-roles">
          <button
            className={`role-btn ${role === 'admin' ? 'activo' : ''}`}
            onClick={() => setRole('admin')}
          >
            ⚙️ Administrador
          </button>
          <button
            className={`role-btn ${role === 'donante' ? 'activo' : ''}`}
            onClick={() => setRole('donante')}
          >
            🤝 Donante
          </button>
        </div>

        <p className="login-subtitle">
          {role === 'admin'
            ? 'Acceso completo al sistema de gestión humanitaria'
            : 'Portal exclusivo para realizar donaciones'}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Cédula</span>
            <input name="cedula" type="text" value={form.cedula} onChange={handleChange} placeholder="V-12345678" required />
          </label>
          <label className="login-field">
            <span>Teléfono</span>
            <input name="telefono" type="tel" value={form.telefono} onChange={handleChange} placeholder="0412-1234567" required />
          </label>
          <label className="login-field">
            <span>Nombre completo</span>
            <input name="nombre" type="text" value={form.nombre} onChange={handleChange} placeholder="Nombre y Apellido" required />
          </label>
          <label className="login-field">
            <span>Correo electrónico</span>
            <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="correo@ejemplo.com" required />
          </label>
          <label className="login-field">
            <span>Nacionalidad</span>
            <input name="nacionalidad" type="text" value={form.nacionalidad} onChange={handleChange} placeholder="Venezolana, Colombiana, etc." required />
          </label>
          <label className="login-field">
            <span>Contraseña</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </label>
          <button type="submit" className="login-submit">
            {role === 'admin' ? 'Ingresar al sistema' : 'Entrar como Donante'}
          </button>
        </form>

        <div className="login-divider" />
        <details className="login-codigo-section">
          <summary>🔐 Acceso con código especial</summary>
          <form onSubmit={handleCodigoSubmit} className="codigo-form">
            <label className="login-field">
              <span>Código de acceso</span>
              <input
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="Ingrese el código"
                autoComplete="off"
              />
            </label>
            <button type="submit" className="login-submit" disabled={!codigo}>
              Entrar con código
            </button>
          </form>
        </details>
      </div>
    </div>
  );
}
