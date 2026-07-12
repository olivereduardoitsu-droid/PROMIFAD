import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ZonasAfectadas.css';

const iconMaker = (emoji, color) => L.divIcon({
  className: 'custom-icon',
  html: `<span style="font-size:1.5rem;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.5))">${emoji}</span>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const hospitalIcon = iconMaker('🏥');
const zonaIcon = iconMaker('🔴');
const equipoIcon = iconMaker('🔵');
const recuperacionIcon = iconMaker('🌱', '#00C853');
const militarIcon = iconMaker('🪖', '#8B4513');
const revisionIcon = iconMaker('🔍', '#FFC107');

const tiposMarcador = [
  { id: 'zona', label: 'Zona Afectada', emoji: '🔴', color: '#ff4444' },
  { id: 'equipo', label: 'Equipo Rescate', emoji: '🔵', color: '#4488ff' },
  { id: 'recuperacion', label: 'Zona en Recuperación', emoji: '🌱', color: '#00C853' },
  { id: 'militar', label: 'Zona Militarizada', emoji: '🪖', color: '#8B4513' },
  { id: 'revision', label: 'Revisión de Infraestructura', emoji: '🔍', color: '#FFC107' },
];

const iconMap = {
  zona: zonaIcon,
  equipo: equipoIcon,
  recuperacion: recuperacionIcon,
  militar: militarIcon,
  revision: revisionIcon,
};

const hospitalesIniciales = [
  // Caracas
  { nombre: 'Hospital Central Universitario', ciudad: 'Caracas', coords: [10.5018, -66.8936] },
  { nombre: 'Hospital Dr. Miguel Pérez Carreño', ciudad: 'Caracas', coords: [10.4789, -66.9225] },
  { nombre: 'Centro Médico Docente La Trinidad', ciudad: 'Caracas', coords: [10.4633, -66.8681] },
  { nombre: 'Clínica El Ávila', ciudad: 'Caracas', coords: [10.4906, -66.8486] },
  { nombre: 'Hospital Dr. Domingo Luciani', ciudad: 'Caracas', coords: [10.4519, -66.8314] },
  { nombre: 'Hospital de Clínicas Caracas', ciudad: 'Caracas', coords: [10.4883, -66.8736] },
  { nombre: 'Policlínica Méndez Gimón', ciudad: 'Caracas', coords: [10.4714, -66.8589] },
  // Maracaibo
  { nombre: 'Hospital Universitario de Maracaibo', ciudad: 'Maracaibo', coords: [10.6545, -71.6245] },
  { nombre: 'Clínica Popular Los Magallanes', ciudad: 'Maracaibo', coords: [10.6400, -71.6380] },
  { nombre: 'Hospital Coromoto', ciudad: 'Maracaibo', coords: [10.6692, -71.6536] },
  { nombre: 'Centro Clínico Maracaibo', ciudad: 'Maracaibo', coords: [10.6458, -71.6192] },
  // Valencia
  { nombre: 'Hospital Universitario de Valencia', ciudad: 'Valencia', coords: [10.1808, -68.0053] },
  { nombre: 'Clínica Popular San Diego', ciudad: 'Valencia', coords: [10.1595, -67.9953] },
  { nombre: 'Centro Médico Valencia', ciudad: 'Valencia', coords: [10.1725, -68.0019] },
  { nombre: 'Hospital Metropolitano del Norte', ciudad: 'Valencia', coords: [10.1914, -68.0156] },
  // Barquisimeto
  { nombre: 'Clínica Popular Los Jardines', ciudad: 'Barquisimeto', coords: [10.0678, -69.3389] },
  { nombre: 'Hospital Central de Barquisimeto', ciudad: 'Barquisimeto', coords: [10.0736, -69.3231] },
  { nombre: 'Centro Médico Barquisimeto', ciudad: 'Barquisimeto', coords: [10.0597, -69.3464] },
  // Mérida
  { nombre: 'Hospital Universitario de Los Andes', ciudad: 'Mérida', coords: [8.5983, -71.1444] },
  { nombre: 'Centro Clínico Mérida', ciudad: 'Mérida', coords: [8.5833, -71.1333] },
  // Ciudad Guayana
  { nombre: 'Hospital Universitario de Ciudad Guayana', ciudad: 'Ciudad Guayana', coords: [8.3167, -62.7000] },
  { nombre: 'Clínica Puerto Ordaz', ciudad: 'Ciudad Guayana', coords: [8.3000, -62.7167] },
  // Barcelona
  { nombre: 'Hospital Universitario Luis Razetti', ciudad: 'Barcelona', coords: [10.1333, -64.6833] },
  { nombre: 'Centro Médico Barcelona', ciudad: 'Barcelona', coords: [10.1167, -64.7000] },
  // Puerto La Cruz
  { nombre: 'Hospital Dr. Luis Ortega', ciudad: 'Puerto La Cruz', coords: [10.2167, -64.6167] },
  // Maracay
  { nombre: 'Hospital Central de Maracay', ciudad: 'Maracay', coords: [10.2469, -67.5958] },
  { nombre: 'Centro Médico Maracay', ciudad: 'Maracay', coords: [10.2333, -67.5833] },
  // San Cristóbal
  { nombre: 'Hospital Central de San Cristóbal', ciudad: 'San Cristóbal', coords: [7.7667, -72.2333] },
  { nombre: 'Centro Clínico San Cristóbal', ciudad: 'San Cristóbal', coords: [7.7500, -72.2167] },
  // Cumaná
  { nombre: 'Hospital Universitario Antonio Patricio de Alcalá', ciudad: 'Cumaná', coords: [10.4500, -64.1667] },
  // Coro
  { nombre: 'Hospital Dr. Alfredo Van Grieken', ciudad: 'Coro', coords: [11.4000, -69.6667] },
  // Maturín
  { nombre: 'Hospital Dr. Manuel Núñez Tovar', ciudad: 'Maturín', coords: [9.7500, -63.1833] },
];

function ClickHandler({ mode, onAddMarker }) {
  useMapEvents({
    click(e) {
      if (mode) {
        onAddMarker({ lat: e.latlng.lat, lng: e.latlng.lng, type: mode });
      }
    },
  });
  return null;
}

export default function ZonasAfectadas() {
  const [mode, setMode] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [hospitales, setHospitales] = useState(hospitalesIniciales);
  const [hospNombre, setHospNombre] = useState('');
  const [hospCiudad, setHospCiudad] = useState('');

  const handleAddMarker = useCallback((m) => {
    const tipo = tiposMarcador.find(t => t.id === m.type);
    setMarkers(prev => [...prev, {
      ...m,
      id: Date.now() + Math.random(),
      nombre: tipo ? tipo.label : m.type
    }]);
  }, []);

  const removeMarker = (id) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
  };

  const agregarHospital = (e) => {
    e.preventDefault();
    if (!hospNombre) return;
    setHospitales(prev => [...prev, {
      nombre: hospNombre,
      ciudad: hospCiudad || 'No especificada',
      coords: [6.4238 + (Math.random() - 0.5) * 2, -66.5897 + (Math.random() - 0.5) * 2]
    }]);
    setHospNombre('');
    setHospCiudad('');
  };

  const eliminarHospital = (idx) => {
    setHospitales(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Zonas Afectadas</h2>
        <span>{hospitales.length} hospitales · {markers.length} marcadores</span>
      </div>
      <div className="mapa-wrapper">
        <aside className="mapa-sidebar">
          <h3>Marcadores</h3>
          <div className="mapa-tools">
            {tiposMarcador.map(t => (
              <button
                key={t.id}
                className={`mapa-btn ${t.id} ${mode === t.id ? 'activo' : ''}`}
                onClick={() => setMode(mode === t.id ? null : t.id)}
                style={{
                  background: mode === t.id ? `${t.color}22` : `${t.color}11`,
                  borderColor: mode === t.id ? t.color : `${t.color}33`,
                  color: t.color,
                }}
              >
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
            {mode && <p className="mapa-hint">Haz clic en el mapa para colocar el marcador</p>}
          </div>

          <div className="mapa-legend">
            <h4>Leyenda</h4>
            {tiposMarcador.map(t => (
              <span key={t.id}><span className="dot" style={{ background: t.color }} /> {t.emoji} {t.label}</span>
            ))}
            <span><span className="dot hosp" /> 🏥 Hospital/Clínica</span>
          </div>

          <details className="mapa-add-hospital">
            <summary>➕ Añadir hospital</summary>
            <form className="hosp-form" onSubmit={agregarHospital}>
              <input value={hospNombre} onChange={e => setHospNombre(e.target.value)} placeholder="Nombre del hospital" />
              <input value={hospCiudad} onChange={e => setHospCiudad(e.target.value)} placeholder="Ciudad" />
              <button type="submit" disabled={!hospNombre}>Agregar</button>
            </form>
          </details>

          {markers.length > 0 && (
            <div className="mapa-list">
              <h4>Marcadores colocados</h4>
              {markers.map(m => {
                const tipo = tiposMarcador.find(t => t.id === m.type);
                return (
                  <div key={m.id} className="mapa-list-item">
                    <span>{(tipo?.emoji || '📍')} {m.lat.toFixed(4)}, {m.lng.toFixed(4)}</span>
                    <button onClick={() => removeMarker(m.id)} title="Eliminar">✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        <div className="mapa-container">
          <MapContainer center={[6.4238, -66.5897]} zoom={6} className="mapa-leaflet" scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler mode={mode} onAddMarker={handleAddMarker} />
            {hospitales.map((h, i) => (
              <Marker key={`hosp-${i}`} position={h.coords} icon={hospitalIcon}>
                <Popup>
                  <strong>{h.nombre}</strong><br />{h.ciudad}
                  <br /><button className="popup-btn" onClick={() => eliminarHospital(i)}>✕ Eliminar</button>
                </Popup>
              </Marker>
            ))}
            {markers.map(m => {
              const tipo = tiposMarcador.find(t => t.id === m.type);
              return (
                <Marker key={m.id} position={[m.lat, m.lng]} icon={iconMap[m.type] || zonaIcon}>
                  <Popup>
                    {tipo?.emoji || '📍'} <strong>{tipo?.label || m.type}</strong><br />
                    {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
                    <br /><button className="popup-btn" onClick={() => removeMarker(m.id)}>✕ Eliminar</button>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
