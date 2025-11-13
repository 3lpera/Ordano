# Documentación de Ordano - Gestor de Grupos de Estudio

## Descripción General

Ordano es una aplicación web para la gestión de grupos de estudio que permite a los usuarios organizar grupos, tareas, clases y exámenes en un solo lugar. La aplicación está construida con tecnología web moderna y utiliza una arquitectura cliente-servidor.

---

## Estructura del Proyecto

```
ordano/
├── client/                  # Aplicación React (Frontend alternativo)
├── public/                  # Aplicación principal HTML/CSS/JS
├── server/                  # Servidor backend TypeScript
├── shared/                  # Esquemas compartidos
├── data/                    # Almacenamiento JSON
└── server.js                # Servidor Express principal
```

---

## Archivos Principales

### 📁 Configuración del Proyecto

#### `package.json`
**Descripción**: Archivo de configuración de Node.js que define las dependencias, scripts y metadatos del proyecto.

**Funcionalidad**:
- Define todas las dependencias npm necesarias
- Configura scripts para desarrollo, construcción y producción
- Especifica la versión de Node.js requerida

**Dependencias principales**:
- Express: Framework del servidor web
- React: Biblioteca de interfaz de usuario
- Vite: Herramienta de construcción y desarrollo
- Drizzle: ORM para base de datos
- Wouter: Enrutamiento del lado del cliente

---

#### `tsconfig.json`
**Descripción**: Configuración del compilador de TypeScript.

**Funcionalidad**:
- Define opciones de compilación de TypeScript
- Configura rutas de módulos
- Establece el objetivo de compilación (ES2020)

---

#### `vite.config.ts`
**Descripción**: Configuración de Vite para el desarrollo y construcción.

**Funcionalidad**:
- Configura el servidor de desarrollo
- Define alias de importación (@, @assets, @shared)
- Integra plugins de React y herramientas de Replit
- Configura el proxy para el servidor backend

---

#### `tailwind.config.ts`
**Descripción**: Configuración de Tailwind CSS para estilos.

**Funcionalidad**:
- Define el tema de colores
- Configura utilidades personalizadas
- Establece modo oscuro
- Define animaciones y fuentes

---

### 📁 Backend (Servidor)

#### `server.js`
**Descripción**: Servidor Express principal que maneja toda la lógica del backend.

**Funcionalidad**:
- Servidor HTTP en puerto 5000
- API RESTful para grupos, tareas, clases y exámenes
- Sistema de archivos JSON para persistencia de datos
- Middleware para JSON y archivos estáticos

**Endpoints principales**:

**Grupos de Estudio** (`/api/groups`):
- `GET /api/groups` - Obtener todos los grupos
- `GET /api/groups/:id` - Obtener un grupo específico
- `POST /api/groups` - Crear nuevo grupo
- `PUT /api/groups/:id` - Actualizar grupo
- `DELETE /api/groups/:id` - Eliminar grupo

**Tareas** (`/api/todos`):
- `GET /api/todos` - Obtener todas las tareas
- `GET /api/todos/:id` - Obtener tarea específica
- `POST /api/todos` - Crear nueva tarea
- `PUT /api/todos/:id` - Actualizar tarea
- `PATCH /api/todos/:id/toggle` - Alternar estado completado
- `DELETE /api/todos/:id` - Eliminar tarea

**Clases** (`/api/classes`):
- `GET /api/classes` - Obtener todas las clases
- `GET /api/classes/:id` - Obtener clase específica
- `POST /api/classes` - Crear nueva clase
- `PUT /api/classes/:id` - Actualizar clase
- `DELETE /api/classes/:id` - Eliminar clase

**Exámenes** (`/api/exams`):
- `GET /api/exams` - Obtener todos los exámenes
- `GET /api/exams/:id` - Obtener examen específico
- `POST /api/exams` - Crear nuevo examen
- `PUT /api/exams/:id` - Actualizar examen
- `DELETE /api/exams/:id` - Eliminar examen

**Funciones auxiliares**:
- `initializeData()` - Inicializa archivos JSON si no existen
- `readData(file)` - Lee datos de archivo JSON
- `writeData(file, data)` - Escribe datos a archivo JSON

---

#### `server/index.ts`
**Descripción**: Punto de entrada del servidor TypeScript.

**Funcionalidad**:
- Inicia el proceso del servidor Node.js
- Maneja señales del sistema (SIGINT, SIGTERM)
- Proporciona logging del estado del servidor
- Gestiona errores de inicio del servidor

---

#### `server/routes.ts`
**Descripción**: Define las rutas del servidor y la lógica de enrutamiento.

**Funcionalidad**:
- Organiza endpoints de la API
- Integra con el sistema de almacenamiento
- Valida datos de entrada usando esquemas Zod

---

#### `server/storage.ts`
**Descripción**: Capa de abstracción de almacenamiento de datos.

**Funcionalidad**:
- Define interfaz `IStorage` para operaciones CRUD
- Implementa `MemStorage` para almacenamiento en memoria
- Proporciona métodos para todas las entidades (grupos, tareas, clases, exámenes)

---

#### `server/vite.ts`
**Descripción**: Configuración de integración de Vite con Express.

**Funcionalidad**:
- Sirve la aplicación frontend en desarrollo
- Configura middleware de Vite
- Maneja archivos estáticos en producción

---

### 📁 Frontend (Aplicación Web Pública)

#### `public/index.html`
**Descripción**: Página HTML principal de la aplicación.

**Funcionalidad**:
- Estructura semántica de la aplicación
- Barra lateral de navegación con 5 secciones:
  - Inicio (Dashboard)
  - Grupos de Estudio
  - Lista de Tareas
  - Clases
  - Exámenes
- Modales para crear/editar entidades
- Encabezado móvil responsivo
- Estados vacíos para cada sección

**Secciones principales**:

1. **Vista de Inicio**:
   - Tarjetas de estadísticas (grupos, tareas, clases, exámenes)
   - Próximos exámenes
   - Tareas recientes

2. **Vista de Grupos de Estudio**:
   - Cuadrícula de tarjetas de grupos
   - Información de miembros
   - Acciones de editar/eliminar

3. **Vista de Lista de Tareas**:
   - Lista de tareas con checkboxes
   - Información de fecha de vencimiento
   - Asignación a miembros
   - Estados visuales (completado, pendiente)

4. **Vista de Clases**:
   - Cuadrícula de tarjetas de clases
   - Información de instructor y horario
   - Código de clase

5. **Vista de Exámenes**:
   - Tabla de exámenes
   - Estado (Pasado, Hoy, Esta Semana, Próximo)
   - Información de fecha, hora y ubicación

**Modales**:
- Modal de Grupo: nombre, descripción, miembros
- Modal de Tarea: título, descripción, fecha de vencimiento, asignación
- Modal de Clase: nombre, código, instructor, horario
- Modal de Examen: clase, tipo, fecha, hora, ubicación
- Modal de Confirmación de Eliminación

---

#### `public/js/app.js`
**Descripción**: Lógica principal de la aplicación del lado del cliente.

**Funcionalidad**:

**Estado de la aplicación**:
```javascript
appState = {
    groups: [],      // Grupos de estudio
    todos: [],       // Tareas
    classes: [],     // Clases
    exams: [],       // Exámenes
    currentGroup,    // Grupo en edición
    currentTodo,     // Tarea en edición
    currentClass,    // Clase en edición
    currentExam,     // Examen en edición
    deleteCallback   // Callback de eliminación
}
```

**Funciones principales**:

1. **Navegación**:
   - `initNavigation()` - Inicializa sistema de navegación
   - Maneja cambio entre vistas
   - Controla menú móvil

2. **Modales**:
   - `openModal(modalId)` - Abre modal
   - `closeModal(modalId)` - Cierra modal
   - `initModals()` - Inicializa eventos de modales

3. **Grupos**:
   - `loadGroups()` - Carga grupos desde API
   - `renderGroups()` - Renderiza tarjetas de grupos
   - `addMember()` - Agrega miembro al grupo
   - `handleGroupSubmit()` - Procesa formulario de grupo
   - `editGroup(id)` - Edita grupo existente
   - `confirmDelete('group', id)` - Confirma eliminación de grupo

4. **Tareas**:
   - `loadTodos()` - Carga tareas desde API
   - `renderTodos()` - Renderiza lista de tareas
   - `populateAssigneeSelect()` - Llena selector de asignación
   - `handleTodoSubmit()` - Procesa formulario de tarea
   - `editTodo(id)` - Edita tarea existente
   - `toggleTodo(id)` - Alterna estado completado

5. **Clases**:
   - `loadClasses()` - Carga clases desde API
   - `renderClasses()` - Renderiza tarjetas de clases
   - `handleClassSubmit()` - Procesa formulario de clase
   - `editClass(id)` - Edita clase existente

6. **Exámenes**:
   - `loadExams()` - Carga exámenes desde API
   - `renderExams()` - Renderiza tabla de exámenes
   - `populateClassSelect()` - Llena selector de clases
   - `handleExamSubmit()` - Procesa formulario de examen
   - `editExam(id)` - Edita examen existente
   - `getExamStatus(date)` - Calcula estado del examen

7. **Panel de Control**:
   - `updateDashboard()` - Actualiza estadísticas y widgets
   - Muestra próximos exámenes (máximo 5)
   - Muestra tareas recientes (máximo 5)

8. **Utilidades**:
   - `escapeHtml(text)` - Escapa HTML para prevenir XSS
   - `formatDate(dateString)` - Formatea fechas en español
   - `getDueDateStatus(dateString)` - Determina color de estado de fecha
   - `getExamStatus(dateString)` - Determina estado de examen

---

#### `public/js/api.js`
**Descripción**: Cliente API para comunicación con el servidor.

**Funcionalidad**:

**Función base**:
```javascript
apiRequest(method, endpoint, data)
```
- Realiza peticiones HTTP al servidor
- Maneja respuestas y errores
- Parsea JSON automáticamente

**APIs disponibles**:

1. **groupsAPI**:
   - `getAll()` - GET /api/groups
   - `getOne(id)` - GET /api/groups/:id
   - `create(data)` - POST /api/groups
   - `update(id, data)` - PUT /api/groups/:id
   - `delete(id)` - DELETE /api/groups/:id

2. **todosAPI**:
   - `getAll()` - GET /api/todos
   - `getOne(id)` - GET /api/todos/:id
   - `create(data)` - POST /api/todos
   - `update(id, data)` - PUT /api/todos/:id
   - `delete(id)` - DELETE /api/todos/:id
   - `toggleComplete(id)` - PATCH /api/todos/:id/toggle

3. **classesAPI**:
   - `getAll()` - GET /api/classes
   - `getOne(id)` - GET /api/classes/:id
   - `create(data)` - POST /api/classes
   - `update(id, data)` - PUT /api/classes/:id
   - `delete(id)` - DELETE /api/classes/:id

4. **examsAPI**:
   - `getAll()` - GET /api/exams
   - `getOne(id)` - GET /api/exams/:id
   - `create(data)` - POST /api/exams
   - `update(id, data)` - PUT /api/exams/:id
   - `delete(id)` - DELETE /api/exams/:id

---

#### `public/css/styles.css`
**Descripción**: Estilos CSS de la aplicación.

**Funcionalidad**:
- Variables CSS para tema
- Estilos de componentes (botones, tarjetas, modales)
- Layout responsivo con Grid y Flexbox
- Estilos de formularios
- Transiciones y animaciones
- Media queries para móvil

**Componentes estilizados**:
- Barra lateral
- Tarjetas (grupos, clases)
- Lista de tareas
- Tabla de exámenes
- Modales
- Formularios
- Botones
- Badges

---

### 📁 Frontend React (Cliente)

#### `client/src/App.tsx`
**Descripción**: Componente raíz de la aplicación React.

**Funcionalidad**:
- Configuración de React Query
- Proveedor de Tooltips
- Sistema de enrutamiento con Wouter
- Componente de Toaster para notificaciones

---

#### `client/src/main.tsx`
**Descripción**: Punto de entrada de React.

**Funcionalidad**:
- Renderiza la aplicación en el DOM
- Importa estilos globales
- Inicializa React en modo estricto

---

#### `client/src/pages/not-found.tsx`
**Descripción**: Página de error 404.

**Funcionalidad**:
- Muestra mensaje de página no encontrada
- Diseño centrado con tarjeta
- Icono de alerta
- Mensaje de ayuda para desarrolladores

---

#### `client/src/index.css`
**Descripción**: Estilos globales de la aplicación React.

**Funcionalidad**:
- Importa Tailwind CSS
- Variables CSS personalizadas
- Estilos base
- Configuración de tipografía (fuente Inter)

---

#### `client/src/lib/queryClient.ts`
**Descripción**: Configuración de React Query.

**Funcionalidad**:
- Crea instancia de QueryClient
- Configura opciones de cache
- Define fetcher por defecto
- Maneja errores de peticiones

---

#### `client/src/lib/utils.ts`
**Descripción**: Funciones utilitarias.

**Funcionalidad**:
- `cn()` - Combina clases de Tailwind CSS
- Utilidades para manejo de strings
- Helpers de validación

---

#### `client/src/hooks/use-toast.ts`
**Descripción**: Hook personalizado para notificaciones toast.

**Funcionalidad**:
- Gestiona estado de notificaciones
- Proporciona funciones para mostrar toasts
- Maneja temporizadores de auto-cierre

---

#### `client/src/components/ui/`
**Descripción**: Directorio de componentes UI reutilizables basados en Shadcn/ui.

**Componentes incluidos**:
- `button.tsx` - Botones con variantes
- `card.tsx` - Tarjetas de contenido
- `dialog.tsx` - Diálogos modales
- `form.tsx` - Componentes de formulario
- `input.tsx` - Campos de entrada
- `label.tsx` - Etiquetas de formulario
- `select.tsx` - Selectores dropdown
- `table.tsx` - Tablas de datos
- `toast.tsx` y `toaster.tsx` - Notificaciones
- `sidebar.tsx` - Barra lateral
- Y muchos más...

---

### 📁 Esquemas Compartidos

#### `shared/schema.ts`
**Descripción**: Definiciones de esquemas de datos compartidos entre frontend y backend.

**Funcionalidad**:
- Esquemas Drizzle para base de datos
- Esquemas Zod para validación
- Tipos TypeScript generados
- Define estructura de:
  - Grupos (`groups`)
  - Tareas (`todos`)
  - Clases (`classes`)
  - Exámenes (`exams`)

**Esquemas principales**:

```typescript
// Grupo de Estudio
{
  id: string (UUID)
  name: string
  description: string
  members: string[]
}

// Tarea
{
  id: string (UUID)
  title: string
  description: string
  dueDate: string | null
  assignedTo: string | null
  completed: boolean
}

// Clase
{
  id: string (UUID)
  name: string
  code: string
  instructor: string
  schedule: string
}

// Examen
{
  id: string (UUID)
  classId: string
  type: string
  date: string
  time: string
  location: string
}
```

---

### 📁 Almacenamiento de Datos

#### `data/groups.json`
**Descripción**: Almacenamiento JSON de grupos de estudio.

**Estructura**:
```json
[
  {
    "id": "uuid",
    "name": "Nombre del grupo",
    "description": "Descripción",
    "members": ["Miembro1", "Miembro2"]
  }
]
```

---

#### `data/todos.json`
**Descripción**: Almacenamiento JSON de tareas.

**Estructura**:
```json
[
  {
    "id": "uuid",
    "title": "Título de la tarea",
    "description": "Descripción",
    "dueDate": "2024-12-31",
    "assignedTo": "Nombre",
    "completed": false
  }
]
```

---

#### `data/classes.json`
**Descripción**: Almacenamiento JSON de clases.

**Estructura**:
```json
[
  {
    "id": "uuid",
    "name": "Nombre de la clase",
    "code": "MAT101",
    "instructor": "Profesor",
    "schedule": "LMV 10:00-11:00"
  }
]
```

---

#### `data/exams.json`
**Descripción**: Almacenamiento JSON de exámenes.

**Estructura**:
```json
[
  {
    "id": "uuid",
    "classId": "uuid-de-clase",
    "type": "Parcial",
    "date": "2024-12-31",
    "time": "10:00",
    "location": "Aula 101"
  }
]
```

---

### 📁 Otros Archivos

#### `drizzle.config.ts`
**Descripción**: Configuración de Drizzle ORM.

**Funcionalidad**:
- Define conexión a base de datos
- Configura migraciones
- Especifica esquemas

---

#### `postcss.config.js`
**Descripción**: Configuración de PostCSS.

**Funcionalidad**:
- Integra Tailwind CSS
- Configura autoprefixer
- Procesa estilos CSS

---

#### `design_guidelines.md`
**Descripción**: Guías de diseño de la aplicación.

**Funcionalidad**:
- Define principios de diseño
- Especifica paleta de colores
- Establece patrones de UI
- Documenta componentes

---

## Flujo de Datos

### Flujo de Creación de Entidad

1. **Usuario** hace clic en "Nuevo Grupo" (u otra entidad)
2. **app.js** abre el modal correspondiente
3. **Usuario** completa el formulario
4. **app.js** valida y envía datos a través de **api.js**
5. **api.js** hace petición POST a **server.js**
6. **server.js** valida datos y guarda en archivo JSON
7. **server.js** responde con entidad creada
8. **api.js** retorna datos a **app.js**
9. **app.js** actualiza estado y renderiza nueva entidad
10. **app.js** cierra modal y actualiza dashboard

### Flujo de Actualización de Entidad

1. **Usuario** hace clic en "Editar"
2. **app.js** carga datos existentes en el modal
3. **Usuario** modifica datos
4. **app.js** envía PUT request a través de **api.js**
5. **server.js** actualiza archivo JSON
6. **app.js** refresca vista con datos actualizados

### Flujo de Eliminación de Entidad

1. **Usuario** hace clic en "Eliminar"
2. **app.js** muestra modal de confirmación
3. **Usuario** confirma eliminación
4. **app.js** envía DELETE request a través de **api.js**
5. **server.js** elimina del archivo JSON
6. **app.js** actualiza estado y re-renderiza

---

## Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Superset tipado de JavaScript

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos
- **JavaScript ES6+** - Lógica del cliente
- **React** - Biblioteca UI (alternativa)
- **Vite** - Herramienta de construcción
- **Tailwind CSS** - Framework de utilidades CSS

### Herramientas
- **Drizzle** - ORM
- **Zod** - Validación de esquemas
- **React Query** - Gestión de estado del servidor
- **Wouter** - Enrutamiento ligero

---

## Configuración y Ejecución

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Esto inicia:
- Servidor backend en puerto 5000
- Servidor de desarrollo Vite
- Recarga en caliente (Hot reload)

### Producción

```bash
npm run build
npm start
```

---

## Características Principales

1. **Gestión de Grupos de Estudio**
   - Crear, editar y eliminar grupos
   - Agregar/quitar miembros
   - Ver todos los miembros de un grupo

2. **Lista de Tareas**
   - Crear tareas con fechas de vencimiento
   - Asignar tareas a miembros
   - Marcar tareas como completadas
   - Ver estado de tareas (vencida, hoy, próxima)

3. **Gestión de Clases**
   - Registrar clases con código e instructor
   - Definir horarios
   - Ver todas las clases

4. **Calendario de Exámenes**
   - Programar exámenes con fecha y hora
   - Vincular exámenes a clases
   - Ver estado (Pasado, Hoy, Esta Semana, Próximo)
   - Especificar ubicación

5. **Panel de Control**
   - Resumen de estadísticas
   - Próximos exámenes
   - Tareas pendientes recientes

6. **Diseño Responsivo**
   - Adaptable a móvil, tablet y escritorio
   - Menú hamburguesa en dispositivos móviles
   - Barra lateral colapsable

---

## Seguridad

- Escapado de HTML para prevenir XSS
- Validación de datos en cliente y servidor
- No hay autenticación (aplicación de demostración)

---

## Mejoras Futuras Sugeridas

1. Autenticación de usuarios
2. Base de datos real (PostgreSQL/MySQL)
3. Notificaciones push para exámenes próximos
4. Exportar datos a calendario (iCal, Google Calendar)
5. Modo oscuro
6. Búsqueda y filtrado avanzado
7. Archivos adjuntos en tareas
8. Chat de grupo
9. Análisis de progreso y estadísticas
10. Aplicación móvil nativa

---

## Licencia

Este proyecto es una aplicación de demostración educativa.

---

## Soporte

Para preguntas o problemas, por favor crea un issue en el repositorio del proyecto.

---

**Última actualización**: Noviembre 2025  
**Versión de la documentación**: 1.0
