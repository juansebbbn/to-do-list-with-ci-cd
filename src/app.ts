import express, { type Request, type Response } from "express";
import { TaskService } from "./service/task_service.js";
import { TaskStatus, Priority, type CreateTaskDTO } from "./core/task_model.js";

const app = express();
const PORT = 3000;
const taskService = new TaskService();

app.use(express.json());

// --- ENDPOINTS ---

// 1. Obtener todas las tareas (con filtro opcional por status)
// Ejemplo: /tasks?status=PENDING
app.get("/tasks", async (req: Request, res: Response) => {
  const status = req.query.status as TaskStatus;
  const tasks = await taskService.getAll(status);
  res.json(tasks);
});

// 2. Obtener estadísticas detalladas
app.get("/tasks/stats", async (_req: Request, res: Response) => {
  const stats = await taskService.getStats();
  res.json(stats);
});

// 3. Obtener recordatorios urgentes (Prioridad ALTA y vence pronto)
app.get("/tasks/urgent", async (_req: Request, res: Response) => {
  const urgent = await taskService.getUrgentReminders();
  res.json(urgent);
});

// 4. Crear una nueva tarea
app.post("/tasks", async (req: Request, res: Response) => {
  // Forzamos el tipado del body para que TS sepa qué campos esperar
  const body = req.body as CreateTaskDTO;
  const { title, description, priority, dueDate } = body;

  if (!title || !priority) {
    return res.status(400).json({ error: "Título y Prioridad son requeridos" });
  }

  // Validamos que la prioridad sea un valor válido del Enum
  if (!Object.values(Priority).includes(priority as Priority)) {
    return res.status(400).json({ error: "Prioridad inválida" });
  }
  try {
    // Construimos el objeto base
    const taskData: any = {
      title,
      description: description || "",
      priority: priority as Priority,
    };

    // Solo agregamos dueDate si el usuario lo envió
    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    const newTask = await taskService.create(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la tarea" });
  }
});

// 5. Actualizar estado (Marcar como completada, etc)
app.patch("/tasks/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (!Object.values(TaskStatus).includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  const updated = await taskService.updateStatus(id, status);
  if (!updated) return res.status(404).json({ error: "Tarea no encontrada" });

  res.json(updated);
});

// 6. Eliminar tarea
app.delete("/tasks/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  await taskService.delete(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`
    ✅ Servidor corriendo en http://localhost:${PORT}
    📊 Stats: http://localhost:${PORT}/tasks/stats
    🚨 Urgentes: http://localhost:${PORT}/tasks/urgent
    `);
  console.log(`cwd: ${process.cwd()}`);
});
