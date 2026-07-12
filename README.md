# PROMIFAD — Sistema de Resiliencia y Financiación Humanitaria


Sistema web interactivo para la gestión de emergencias humanitarias, desarrollado con React + Vite. Permite coordinar donantes, equipos de rescate, personas afectadas e indemnizaciones en un solo panel.
=======
Sistema web interactivo para la gestión integral de emergencias humanitarias, desarrollado con **React + Vite** (frontend) y **Express + PostgreSQL** (backend). Permite coordinar donantes, equipos de rescate, personas afectadas, indemnizaciones, centros de acopio y un mapa colaborativo de zonas afectadas, todo en un solo panel con inicio de sesión.
>>>>>>> agregacion-donantes-admins

---

## Funcionalidades


### Panel Principal (Inicio)
=======
### 🚪 Pantalla de Inicio de Sesión
- Formulario de acceso con campos: cédula, teléfono, nombre, correo y contraseña.
- Los datos ingresados se almacenan en estado para la sesión actual.

### 🏠 Panel Principal (Inicio)
>>>>>>> agregacion-donantes-admins
- **Fase de Despliegue de Emergencia** — Simula la recaudación de fondos entre donantes para cubrir costos logísticos de respuesta inmediata.
- **Fase de Reactivación Económica** — Otorga microcréditos a emprendedores damnificados. Permite elegir el monto exacto que cada inversor aporta.
- **Dashboard / Auditoría** — Muestra saldos de cada persona y un registro de transacciones en tiempo real.


### Gestión de Donantes
=======
### 💰 Gestión de Donantes
>>>>>>> agregacion-donantes-admins
CRUD completo para administrar donantes:
- Registrar nuevos donantes con nombre, tipo de vulnerabilidad y saldo inicial.
- Visualizar listado con saldos actualizados.
- Eliminar donantes.

<<<<<<< HEAD
### Equipos de Búsqueda y Rescate
=======
### 🚒 Equipos de Búsqueda y Rescate

Administración de brigadas de rescate:
- Registrar equipos con nombre, cantidad de miembros y ubicación.
- Cambiar estado entre: `Disponible` → `Desplegado` → `En descanso`.
- Eliminar equipos.

<<<<<<< HEAD
### Personas Rescatadas
Registro de personas rescatadas durante la emergencia:
- Registrar rescates asignando el equipo rescatista y estado de salud.
- Filtrar por nombre.
- Actualizar estado de salud (`Estable`, `Crítico`, `Leve`, `Recuperado`).

### Personas Desaparecidas
Seguimiento de personas reportadas como desaparecidas:
- Reportar desapariciones con zona de última ubicación.
- Buscar por nombre.
- Marcar como rescatado (mueve automáticamente el registro a la lista de rescatados).

### Indemnización a Afectados
=======
### 🚁 Personas Rescatadas
Registro de personas rescatadas durante la emergencia:
- Registrar rescates asignando el equipo rescatista y estado de salud.
- **Importación masiva** mediante archivos Excel (.xlsx, .xls), CSV o TXT.
- Filtrar por nombre.
- Actualizar estado de salud (`Estable`, `Crítico`, `Leve`, `Recuperado`).

### ❓ Personas Desaparecidas
Seguimiento de personas reportadas como desaparecidas:
- Reportar desapariciones con zona de última ubicación.
- **Importación masiva** mediante archivos Excel (.xlsx, .xls), CSV o TXT.
- Buscar por nombre.
- Marcar como rescatado (mueve automáticamente el registro a la lista de rescatados).

### 💲 Indemnización a Afectados
>>>>>>> agregacion-donantes-admins
Compensación económica para personas damnificadas:
- Registrar indemnizaciones seleccionando persona, monto y motivo.
- Resumen visual de montos pendientes y aprobados.
- Historial completo con opción de aprobar cada indemnización.

<<<<<<< HEAD
=======
### 🏥 Contactos de Emergencia
Directorio de hospitales, clínicas y centros de acopio:
- Lista de centros médicos con teléfono, dirección y línea de emergencia.
- **Registro dinámico** — botón "+ Añadir Centro Médico o de Acopio" para agregar centros que aceptan afectados de forma gratuita.
- Los centros agregados se identifican con borde verde y sello "ENTRADA GRATUITA".

### 🗺️ Zonas Afectadas (Mapa Interactivo)
Mapa colaborativo de Venezuela con **Leaflet + OpenStreetMap**:
- **🔴 Zonas Afectadas** — Coloca marcadores rojos en el mapa haciendo clic.
- **🔵 Equipos de Rescate** — Coloca marcadores azules en el mapa haciendo clic.
- **🏥 Hospitales** — 10 hospitales y clínicas principales ya marcados con ícono hospitalario.
- Barra lateral con herramientas, leyenda y lista de marcadores colocados (con opción de eliminar).
- Popups informativos al hacer clic en cada marcador.

>>>>>>> agregacion-donantes-admins
---

## Diseño

<<<<<<< HEAD
- **Paleta:** Negro (#0a0a0a) con acentos naranja (#FF6B00), bordes sutiles y sombras.
- **Fondo:** Bandera de Venezuela tricolor (amarillo, azul, rojo) como fondo difuminado con `filter: blur(80px)`.
- **Tipografía:** Inter (sans-serif moderna) en lugar de serif clásico.
- **Navegación:** Barra superior fija con pestañas para acceder a cada módulo.
- **Distribución:** Diseño responsivo con grid de dos columnas en escritorio, colapsa a una en móvil.
=======
- **Paleta:** Fondo oscuro (#0a0a0a) con acentos naranja (#FF6B00), bordes sutiles y efectos de brillo.
- **Fondo:** Degradado de la bandera de Venezuela (amarillo, azul, rojo) como fondo difuminado con `filter: blur(80px)`.
- **Personalización:** Selector de temas (Naranja, Morado y Rosa, Morado y Azul, Blanco y Negro). *Nota: el selector de temas está disponible en el código mediante la variable `theme` en App.jsx.*
- **Tipografía:** Inter (sans-serif moderna).
- **Navegación:** Barra superior fija con pestañas e íconos representativos, más botón de cierre de sesión.
- **Responsive:** Diseño adaptable con grid de dos columnas en escritorio, colapsa a una en móvil.
>>>>>>> agregacion-donantes-admins

---

## Tecnologías

<<<<<<< HEAD
- **React 18** con hooks (useState)
- **Vite 5** como bundler
- **CSS plano** con variables personalizadas
- **ESLint** para linting
=======
| Frontend | Backend | Base de Datos |
|----------|---------|---------------|
| React 18 | Express 5 | PostgreSQL |
| Vite 5 | node-postgres (pg) | |
| Leaflet + react-leaflet 4 | dotenv | |
| SheetJS (xlsx) | cors | |
| CSS plano con variables | | |
>>>>>>> agregacion-donantes-admins

---

## Estructura del proyecto

```
<<<<<<< HEAD
src/
├── App.jsx                 # Componente principal con sistema de pestañas
├── App.css                 # Estilos del layout principal
├── index.css               # Variables CSS, fondo, estilos globales
├── main.jsx                # Punto de entrada
├── components/
│   ├── NavBar/             # Barra de navegación superior
│   ├── Dashboard/          # Panel de auditoría de saldos y logs
│   ├── FaseEmergencia/     # Fase de despliegue de emergencia
│   ├── FaseRecuperacion/   # Fase de reactivación económica (microcréditos)
│   └── Indemnizacion/      # Gestión de indemnizaciones
└── pages/
    ├── DonantesPage.jsx     # CRUD de donantes
    ├── EquiposRescatePage.jsx  # CRUD de equipos de rescate
    ├── RescatadosPage.jsx   # Registro de personas rescatadas
    ├── DesaparecidosPage.jsx   # Reporte de personas desaparecidas
    └── pages.css            # Estilos compartidos entre páginas
=======
PROMIFAD-main/
├── index.html                 # Shell HTML de la SPA
├── package.json               # Dependencias y scripts del frontend
├── vite.config.js             # Configuración de Vite (puerto 3000)
│
├── backend/
│   ├── package.json           # Dependencias del backend
│   └── server.js              # API REST (Express, puerto 5000)
│
└── src/
    ├── main.jsx               # Punto de entrada React
    ├── index.css              # Variables CSS globales, temas y estilos base
    ├── App.jsx                # Componente raíz: login, pestañas, estado global
    ├── App.css                # Estilos del layout principal
    │
    ├── components/
    │   ├── Login/             # Pantalla de inicio de sesión
    │   ├── NavBar/            # Barra de navegación con pestañas + logout
    │   ├── Dashboard/         # Auditoría de saldos y bitácora
    │   ├── FaseEmergencia/    # Fase de despliegue de emergencia
    │   ├── FaseRecuperacion/  # Microcréditos (reactivación económica)
    │   ├── Indemnizacion/     # Gestión de indemnizaciones
    │   ├── ContactoEmergencia/ # Directorio de hospitales y centros de acopio
    │   ├── ZonasAfectadas/    # Mapa interactivo de Venezuela
    │   └── FileUploadImport/  # Componente reutilizable de carga masiva
    │
    └── pages/
        ├── DonantesPage/      # CRUD de donantes
        ├── EquiposRescatePage/ # CRUD de equipos de rescate
        ├── RescatadosPage/    # Registro de rescatados + importación
        └── DesaparecidosPage/ # Reporte de desaparecidos + importación
>>>>>>> agregacion-donantes-admins
```

---

## Instalación y uso

<<<<<<< HEAD
```bash
# Instalar dependencias
=======
### Requisitos

- **Node.js** 18+
- **PostgreSQL** (con las tablas creadas)

### Backend

```bash
cd backend
npm install

# Configurar variables de entorno (.env)
# DB_USER=postgres
# DB_HOST=localhost
# DB_NAME=promifad
# DB_PASSWORD=tu_contraseña
# DB_PORT=5432

npm start
```

El servidor Express se inicia en `http://localhost:5000`.

### Frontend

```bash
# Desde la raíz del proyecto
>>>>>>> agregacion-donantes-admins
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de la build
npm run preview
```

<<<<<<< HEAD
=======
El servidor de desarrollo se inicia en `http://localhost:3000`.

### Formato para carga masiva de archivos

El componente `FileUploadImport` acepta archivos **Excel (.xlsx, .xls)**, **CSV (.csv)** o **TXT** (delimitado por coma o tabulación).

**Ejemplo — Personas Desaparecidas:**

| nombre | zona |
|--------|------|
| Juan Pérez | Caracas |
| María López | Maracaibo |

**Ejemplo — Personas Rescatadas:**

| nombre | equipo | estado |
|--------|--------|--------|
| Ana García | Brigada Alfa | Estable |
| Luis Mendoza | Brigada Beta | Crítico |

---

## API Endpoints (Backend)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/donantes` | Listar donantes |
| GET | `/api/desaparecidos` | Listar desaparecidos |
| POST | `/api/desaparecidos` | Insertar desaparecido |
| GET | `/api/rescatados` | Listar rescatados |
| POST | `/api/rescatados` | Insertar rescatado |
| GET | `/api/equipos` | Listar equipos de rescate |
| PUT | `/api/equipos/:id/estado` | Actualizar estado de equipo |
| DELETE | `/api/equipos/:id` | Eliminar equipo |
| GET | `/api/indemnizaciones` | Listar indemnizaciones |
| POST | `/api/indemnizaciones` | Insertar indemnización |
| PUT | `/api/indemnizaciones/:id/aprobar` | Aprobar indemnización |
| GET | `/api/proyectos` | Listar proyectos de recuperación |
| GET | `/api/logs` | Obtener bitácora |
| POST | `/api/logs` | Insertar entrada en bitácora |
| POST | `/api/transiciones/rescatar` | Mover desaparecido → rescatado |

>>>>>>> agregacion-donantes-admins
---

## Licencia

Proyecto académico / demostrativo — PROMIFAD.
