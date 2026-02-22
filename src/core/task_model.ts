
export enum TaskStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED"
}


export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}


export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    createdAt: Date;
    dueDate?: Date; // Opcional, para tareas con fecha límite
}


export interface CreateTaskDTO {
    title: string;
    description: string;
    priority: Priority;
    dueDate?: string; // Viene como string (ISO) desde el JSON de la API
}


export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
    byPriority: {
        high: number;
        medium: number;
        low: number;
    };
}