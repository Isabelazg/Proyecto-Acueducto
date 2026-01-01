# Sistema de Gestión de Acueducto

Sistema completo para llevar el control de ingresos y egresos de un acueducto comunitario, con gestión de personas, pagos mensuales y gastos.

> 📖 **Para usuarios finales:** Ver [INSTRUCCIONES.md](INSTRUCCIONES.md) para instalar y usar el sistema.  
> 👨‍💻 **Para desarrolladores:** Continúa leyendo este README.

## 🚀 Características

- **Gestión de Personas**: Agregar, activar/desactivar personas que deben pagar la cuota mensual
- **Cuotas Flexibles**: Sistema híbrido que permite:
  - Definir una cuota mensual global para todos
  - Establecer cuotas individuales para casos especiales
  - Solo las personas activas aparecen en el listado de pagos
- **Control por Periodo**: Vista mensual con:
  - Definición de cuota mensual global
  - Registro de pagos por persona (usando cuota individual o global)
  - Registro de otros ingresos (donaciones, subsidios, etc.)
  - Registro de gastos/egresos
  - Estadísticas detalladas del mes
- **Reportes en Excel**: Descarga completa de datos mensuales con 4 hojas:
  - Resumen general del periodo
  - Detalle de pagos por persona
  - Listado de gastos
  - Otros ingresos del mes
- **Balance General**: Vista del balance total acumulado (ingresos totales - egresos)
- **Interfaz moderna**: React con Tailwind CSS y DaisyUI

## 📁 Estructura del Proyecto

```
Proyecto/
├── backend/          # API REST con Node.js + Express
│   ├── src/
│   │   ├── routes/   # Rutas de la API (people.js, periods.js, balance.js)
│   │   ├── lib/      # Utilidades y validación (Zod)
│   │   ├── db.js     # Configuración de base de datos SQLite
│   │   ├── app.js    # Configuración de Express
│   │   └── server.js # Servidor HTTP
│   ├── data.db       # Base de datos SQLite (se crea automáticamente)
│   └── package.json
│
└── frontend/         # React + Vite + Tailwind
    ├── src/
    │   ├── components/   # Componentes reutilizables (Layout)
    │   ├── features/     # Páginas por funcionalidad
    │   │   ├── period/   # Gestión de periodos mensuales
    │   │   ├── people/   # Gestión de personas y cuotas individuales
    │   │   └── balance/  # Vista de balance general
    │   ├── lib/          # API client (Axios) y utilidades
    │   ├── App.jsx       # Router principal
    │   └── main.jsx      # Entry point
    └── package.json
```

## 🛠️ Tecnologías

### Backend
- **Node.js** con Express
- **SQLite** con better-sqlite3 (base de datos ligera, sin ORM)
- **Zod** para validación de datos
- **CORS** habilitado

### Frontend
- **React 19** (sin TypeScript)
- **Vite 7** como build tool
- **React Router v7** para navegación
- **TanStack Query v5** (React Query) para gestión de estado y cache
- **Axios** para llamadas HTTP
- **XLSX** para generación de reportes Excel
- **Tailwind CSS** + **DaisyUI** para estilos

## 📦 Instalación

### 1. Backend

```powershell
cd backend
npm install

# Iniciar servidor (modo desarrollo)
npm run dev
```

El backend correrá en `http://localhost:3001`

La base de datos SQLite se crea automáticamente con las tablas necesarias en la primera ejecución.

### 2. Frontend

```powershell
cd frontend
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend correrá en `http://localhost:5173`

## 🎯 Uso

1. **Personas**: Ve a la sección "Personas" para:
   - Agregar las personas que deben pagar la cuota
   - Asignar cuotas individuales opcionales (si alguien paga una cantidad diferente)
   - Activar/desactivar personas según sea necesario
2. **Definir Cuota Global**: En "Periodo", define la cuota mensual global (ej: $15,000)
3. **Registrar Pagos**: Marca quién pagó en el mes actual
   - Si la persona tiene cuota individual, se usará ese monto
   - Si no, se usará la cuota global del periodo
4. **Registrar Gastos**: Agrega los gastos del mes (reparaciones, materiales, etc.)
5. **Otros Ingresos**: Registra ingresos adicionales (donaciones, subsidios, ayudas)
6. **Descargar Reporte**: Usa el botón "Descargar Excel" para obtener un reporte completo del mes
7. **Ver Balance**: Consulta el balance general acumulado de todos los periodos

## 📋 API Endpoints

### Personas
- `GET /api/people?active=true|false` - Lista de personas (filtro opcional por estado)
- `POST /api/people` - Crear persona (body: `{ name, monthlyFee? }`)
- `PATCH /api/people/:id` - Actualizar persona (body: `{ name?, active?, monthlyFee? }`)

### Periodos
- `GET /api/periods/:period/summary` - Resumen completo del periodo (formato: YYYY-MM)
  - Incluye: cuota global, personas con pagos, gastos, otros ingresos, totales
- `PUT /api/periods/:period/fee` - Definir cuota mensual global (body: `{ amount }`)
- `POST /api/periods/:period/payments` - Registrar pago (body: `{ personId }`)
  - Usa cuota individual de la persona o cuota global del periodo
- `DELETE /api/periods/payments/:id` - Eliminar pago
- `POST /api/periods/:period/expenses` - Registrar gasto (body: `{ amount, description, spentAt? }`)
- `DELETE /api/periods/expenses/:id` - Eliminar gasto
- `POST /api/periods/:period/other-incomes` - Registrar otro ingreso (body: `{ amount, description, receivedAt? }`)
- `DELETE /api/periods/other-incomes/:id` - Eliminar otro ingreso

### Balance
- `GET /api/balance` - Balance total acumulado
  - Incluye: total ingresos (cuotas + otros), total egresos, balance neto

## 🔧 Configuración

### Backend
Crea un archivo `.env` en `/backend` (opcional):
```env
PORT=3001
DB_FILE=./data.db
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
- Selector de mes para navegar entre periodos
- 5 tarjetas de estadísticas:
  - Cuota mensual global
  - Cuotas pagadas (con contador de personas)
  - Otros ingresos
  - Egresos del mes
  - Balance del periodo
- Botón de descarga de reporte Excel
- Tabla de pagos por persona (muestra cuota individual si existe, sino la global)
- Formulario y tabla de gastos del mes
- Formulario y tabla de otros ingresos

### Página de Personas
- Filtros: Activos / Inactivos / Todos
- Lista de personas con:
  - Nombre
  - Cuota individual (o indicador "Usa global")
  - Estado (Activo/Inactivo)
  - Botones para editar cuota y activar/desactivar
- Formulario para agregar nuevas personas con cuota individual opcional

### Página de Balance
- Balance total acumulado histórico
- Total de ingresos (cuotas + otros ingresos)
- Total de egresos

## 🚧 Desarrollo

Para agregar nuevas funcionalidades:

1. **Backend**: Agrega rutas en `/backend/src/routes/`
2. **Frontend**: 
   - Agrega función API en `/frontend/src/lib/api.js`
   - Crea/actualiza componentes en `/frontend/src/features/`

## 📝 Notas

- Los montos se manejan en **pesos colombianos** (sin decimales)
- Los periodos usan formato **YYYY-MM** (ej: 2025-12)
- La base de datos SQLite se crea automáticamente en `/backend/data.db`
- **Sistema híbrido de cuotas**:
  - Si una persona tiene `monthlyFee` definido, se usa ese monto
  - Si no, se usa la cuota global del periodo (`monthly_fee` table)
  - Ideal para cuando algunos pagan diferente por acuerdos especiales
- **Reporte Excel** incluye 4 hojas:
  1. Resumen general con totales
  2. Detalle de pagos por persona
  3. Listado de gastos
  4. Otros ingresos del periodo
- Solo las personas **activas** aparecen en la lista de pagos del periodo

## 🗄️ Esquema de Base de Datos

```sql
-- Tabla de personas
person (id, name, active, monthly_fee, created_at, updated_at)

-- Cuota mensual global por periodo
monthly_fee (period, amount, created_at, updated_at)

-- Pagos realizados
payment (id, person_id, period, amount, paid_at, note)

-- Gastos/egresos
expense (id, period, amount, description, spent_at)

-- Otros ingresos (donaciones, subsidios, etc.)
other_income (id, period, amount, description, received_at)
```

## 📦 Despliegue Local (Para Usuario Final)

El sistema se puede entregar como un **ejecutable standalone** que NO requiere instalar nada.

### Para el desarrollador - Crear el paquete:

```powershell
# 1. Construir frontend y ejecutable
.\CONSTRUIR.bat

# 2. Crear carpeta portable
.\EMPAQUETAR.bat

# 3. Comprimir la carpeta Acueducto_Portable
# 4. Entregar al usuario
```

### Para el usuario final:

El usuario recibe:
```
Acueducto_Portable/
├── Acueducto.exe       ← Ejecutable (incluye Node.js)
├── INICIAR.bat         ← Doble clic para iniciar
├── INSTRUCCIONES.md    ← Guía de uso
└── public/             ← Interfaz web
```

**Uso:**
1. Descomprimir en cualquier carpeta
2. Doble clic en `INICIAR.bat`
3. ¡Listo! (sin instalaciones)

**Requisitos del usuario:** ✅ NINGUNO

El ejecutable incluye:
- Node.js embebido
- Todo el backend
- La interfaz web
- Solo falta crear `data.db` (se crea automáticamente)

## 🤝 Contribuir

Este proyecto está diseñado para ser fácilmente extendible. Algunas ideas:

- ✅ ~~Exportar datos a Excel~~ (Ya implementado)
- ✅ ~~Despliegue local fácil~~ (Ya implementado)
- Agregar reportes anuales consolidados
- Gráficos de evolución del balance con Chart.js
- Notificaciones de pagos pendientes vía WhatsApp
- Sistema de recordatorios automáticos
- Historial de cambios en cuotas individuales
- Sistema de autenticación con roles (administrador/tesorero/consulta)
- Backup automático de la base de datos
- Modo offline con sincronización

---
