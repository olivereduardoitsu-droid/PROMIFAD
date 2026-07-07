import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    cedula: '',
    telefono: '',
    nombre: '',
    correo: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(form);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">PROMIFAD</div>
        <h2 className="login-title">Sistema de Resiliencia y Financiación Humanitaria</h2>
        <div className="login-divider" />
        <p className="login-subtitle">Ingrese sus datos para acceder al sistema</p>
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
            <span>Contraseña</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </label>
          <button type="submit" className="login-submit">Ingresar al sistema</button>
        </form>
      </div>
    </div>
  );
}
