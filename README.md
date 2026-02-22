# Gestión de Tareas (Node + TypeScript)

Proyecto simple de ejemplo: una API REST para gestionar tareas.

Características principales
- Endpoints para crear, listar, actualizar estado y borrar tareas.
- `TaskService` por defecto corre en memoria (sin persistencia) en esta rama.
- Tests básicos con Vitest y workflow de CI configurado.

Instalación y desarrollo
1. Instalar dependencias:
```powershell
npm ci
```
2. Ejecutar en modo desarrollo:
```powershell
npm run dev
```
3. Compilar TypeScript:
```powershell
npm run build
```

API (resumen)
- GET `/tasks` — devuelve todas las tareas (opcional `?status=PENDING|COMPLETED`).
- POST `/tasks` — crear tarea. Body JSON: `{ title, description, priority, dueDate? }`.
- PATCH `/tasks/:id/status` — actualizar `status` (por ejemplo `COMPLETED`).
- DELETE `/tasks/:id` — eliminar tarea.

Notas sobre persistencia
- Actualmente la implementación cargada funciona solo en memoria: los datos se pierden al reiniciar el proceso.

CI / GitHub Actions
- Archivo: `.github/workflows/ci.yml`.
- Qué hace: en push/PR a `main` o `master` ejecuta:
  - Instalación con `npm ci`.
  - Compilación TypeScript (`npm run build`).
  - Type-check con `tsc --noEmit`.
  - Ejecuta tests (`npm test`) — hoy usa `vitest`.
  - Matriz de Node: prueba en Node 18.x y 20.x.


Archivo principal
- `src/app.ts` arranca un servidor Express en `http://localhost:3000`.
