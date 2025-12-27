# Sistema de Gestión de Acueducto

Sistema completo para llevar el control de ingresos y egresos de un acueducto comunitario, con gestión de personas, pagos mensuales y gastos.

## 🚀 Características

- **Gestión de Personas**: Agregar, activar/desactivar personas que deben pagar la cuota mensual
- **Control por Periodo**: Vista mensual con:
  - Definición de cuota mensual
  - Registro de pagos por persona
  - Registro de gastos/egresos
  - Estadísticas del mes
- **Balance General**: Vista del balance total acumulado (ingresos - egresos)
- **Interfaz moderna**: React con Tailwind CSS y DaisyUI

## 📁 Estructura del Proyecto

```
Proyecto/
├── backend/          # API REST con Node.js + Express
│   ├── src/
│   │   ├── routes/   # Rutas de la API
│   │   ├── lib/      # Utilidades y validación
│   │   └── server.js
│   ├── prisma/       # Esquema de base de datos
│   └── package.json
│
└── frontend/         # React + Vite + Tailwind
    ├── src/
    │   ├── components/   # Componentes reutilizables
    │   ├── features/     # Páginas por funcionalidad
    │   │   ├── period/   # Gestión de periodos
    │   │   ├── people/   # Gestión de personas
    │   │   └── balance/  # Vista de balance
    │   ├── lib/          # API client y utilidades
    │   └── App.jsx
    └── package.json
```

## 🛠️ Tecnologías

### Backend
- **Node.js** con Express
- **SQLite** con better-sqlite3 (base de datos ligera)
- **Zod** para validación
- **CORS** habilitado

### Frontend
- **React 19** (sin TypeScript)
- **Vite** como build tool
- **React Router** para navegación
- **TanStack Query** (React Query) para gestión de estado y cache
- **Axios** para llamadas HTTP
- **Tailwind CSS** + **DaisyUI** para estilos

## 📦 Instalación

### 1. Backend

```powershell
cd backend
npm install

# Crear y aplicar migraciones de base de datos
npx prisma migrate dev --name init

# Iniciar servidor (modo desarrollo)
npm run dev
```

El backend correrá en `http://localhost:3001`

### 2. Frontend

```powershell
cd frontend
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend correrá en `http://localhost:5173`

## 🎯 Uso

1. **Personas**: Ve a la sección "Personas" para agregar las personas que deben pagar la cuota
2. **Definir Cuota**: En "Periodo", define la cuota mensual (ej: $50,000)
3. **Registrar Pagos**: Marca quién pagó en el mes actual
4. **Registrar Gastos**: Agrega los gastos del mes (reparaciones, materiales, etc.)
5. **Ver Balance**: Consulta el balance general acumulado

## 📋 API Endpoints

### Personas
- `GET /api/people` - Lista de personas
- `POST /api/people` - Crear persona
- `PATCH /api/people/:id` - Actualizar persona

### Periodos
- `GET /api/periods/:period/summary` - Resumen del periodo (formato: YYYY-MM)
- `PUT /api/periods/:period/fee` - Definir cuota mensual
- `POST /api/periods/:period/payments` - Registrar pago
- `DELETE /api/periods/payments/:id` - Eliminar pago
- `POST /api/periods/:period/expenses` - Registrar gasto
- `DELETE /api/periods/expenses/:id` - Eliminar gasto

### Balance
- `GET /api/balance` - Balance total acumulado

## 🔧 Configuración

### Backend
Crea un archivo `.env` en `/backend`:
```env
PORT=3001
DATABASE_URL="file:./dev.db"
```

### Frontend
Crea un archivo `.env` en `/frontend`:
```env
VITE_API_URL=http://localhost:3001/api
```

## 🏗️ Arquitectura Frontend

El frontend sigue una **arquitectura por features**:

- **features/**: Cada módulo (people, period, balance) tiene su propia carpeta con componentes y lógica
- **components/**: Componentes compartidos (Layout, navegación)
- **lib/**: Utilidades y configuración (API client, formatters)

### Patrón de Estado
- React Query maneja el estado del servidor (cache, refetch, mutations)
- useState local solo para estado de UI (formularios, modales)

## 📱 Capturas de Funcionalidad

### Página de Periodo
- Selector de mes
- Estadísticas del mes (ingresos, egresos, balance)
- Tabla de pagos por persona
- Tabla de gastos del mes

### Página de Personas
- Lista de personas activas/inactivas
- Agregar nuevas personas
- Activar/desactivar personas

### Página de Balance
- Balance total acumulado
- Total de ingresos históricos
- Total de egresos históricos

## 🚧 Desarrollo

Para agregar nuevas funcionalidades:

1. **Backend**: Agrega rutas en `/backend/src/routes/`
2. **Frontend**: 
   - Agrega función API en `/frontend/src/lib/api.js`
   - Crea/actualiza componentes en `/frontend/src/features/`

## 📝 Notas

- Los montos se manejan en **pesos colombianos** (sin decimales)
- Los periodos usan formato **YYYY-MM** (ej: 2025-12)
- La base de datos SQLite se crea automáticamente en `/backend/dev.db`

## 🤝 Contribuir

Este proyecto está diseñado para ser fácilmente extendible. Algunas ideas:

- Agregar reportes mensuales en PDF
- Gráficos de evolución del balance
- Notificaciones de pagos pendientes
- Exportar datos a Excel
- Sistema de autenticación

---

Desarrollado con ❤️ para la gestión de acueductos comunitarios
