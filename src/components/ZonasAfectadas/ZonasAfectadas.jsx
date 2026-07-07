import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ZonasAfectadas.css';

const hospitalIcon = L.divIcon({
  className: 'custom-icon hospital-icon',
  html: '<span>🏥</span>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const zonaIcon = L.divIcon({
  className: 'custom-icon zona-icon',
  html: '<span>🔴</span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const equipoIcon = L.divIcon({
  className: 'custom-icon equipo-icon',
  html: '<span>🔵</span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const hospitales = [
  { nombre: 'Hospital Central Universitario', ciudad: 'Caracas', coords: [10.5018, -66.8936] },
  { nombre: 'Hospital Dr. Miguel Pérez Carreño', ciudad: 'Caracas', coords: [10.4789, -66.9225] },
  { nombre: 'Centro Médico Docente La Trinidad', ciudad: 'Caracas', coords: [10.4633, -66.8681] },
  { nombre: 'Clínica El Ávila', ciudad: 'Caracas', coords: [10.4906, -66.8486] },
  { nombre: 'Hospital Dr. Domingo Luciani', ciudad: 'Caracas', coords: [10.4519, -66.8314] },
  { nombre: 'Hospital Universitario de Maracaibo', ciudad: 'Maracaibo', coords: [10.6545, -71.6245] },
  { nombre: 'Clínica Popular Los Magallanes', ciudad: 'Maracaibo', coords: [10.6400, -71.6380] },
  { nombre: 'Hospital Universitario de Valencia', ciudad: 'Valencia', coords: [10.1808, -68.0053] },
  { nombre: 'Clínica Popular San Diego', ciudad: 'Valencia', coords: [10.1595, -67.9953] },
  { nombre: 'Clínica Popular Los Jardines', ciudad: 'Barquisimeto', coords: [10.0678, -69.3389] },
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

  const handleAddMarker = useCallback((m) => {
    setMarkers(prev => [...prev, { ...m, id: Date.now() + Math.random() }]);
  }, []);

  const removeMarker = (id) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Zonas Afectadas</h2>
        <span>{markers.length} marcadores</span>
      </div>
      <div className="mapa-wrapper">
        <aside className="mapa-sidebar">
          <h3>Marcadores</h3>
          <div className="mapa-tools">
            <button
              className={`mapa-btn zona ${mode === 'zona' ? 'activo' : ''}`}
              onClick={() => setMode(mode === 'zona' ? null : 'zona')}
            >
              🔴 Zona Afectada
            </button>
            <button
              className={`mapa-btn equipo ${mode === 'equipo' ? 'activo' : ''}`}
              onClick={() => setMode(mode === 'equipo' ? null : 'equipo')}
            >
              🔵 Equipo Rescate
            </button>
            {mode && <p className="mapa-hint">Haz clic en el mapa para colocar el marcador</p>}
          </div>
          <div className="mapa-legend">
            <h4>Leyenda</h4>
            <span><span className="dot red" /> Zona Afectada</span>
            <span><span className="dot blue" /> Equipo Rescate</span>
            <span><span className="dot hosp" /> 🏥 Hospital/Clínica</span>
          </div>
          {markers.length > 0 && (
            <div className="mapa-list">
              <h4>Marcadores colocados</h4>
              {markers.map(m => (
                <div key={m.id} className="mapa-list-item">
                  <span>{m.type === 'zona' ? '🔴' : '🔵'} {m.lat.toFixed(4)}, {m.lng.toFixed(4)}</span>
                  <button onClick={() => removeMarker(m.id)} title="Eliminar">✕</button>
                </div>
              ))}
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
              <Marker key={i} position={h.coords} icon={hospitalIcon}>
                <Popup>
                  <strong>{h.nombre}</strong><br />{h.ciudad}
                </Popup>
              </Marker>
            ))}
            {markers.map(m => (
              <Marker key={m.id} position={[m.lat, m.lng]} icon={m.type === 'zona' ? zonaIcon : equipoIcon}>
                <Popup>
                  {m.type === 'zona' ? '🔴 Zona Afectada' : '🔵 Equipo de Rescate'}<br />
                  {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
