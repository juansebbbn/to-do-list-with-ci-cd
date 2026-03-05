import { describe, it, expect } from 'vitest';
import { TaskService } from './task_service';
import { Priority, TaskStatus } from '../core/task_model';
describe('TaskService (in-memory)', () => {
    it('creates, updates and deletes tasks', async () => {
        const svc = new TaskService();
        const created = await svc.create({
            title: 'Prueba',
            description: 'descripcion',
            priority: Priority.HIGH,
        });
        expect(created.id).toBeTruthy();
        const all = await svc.getAll();
        expect(all.length).toBe(1);
        const updated = await svc.updateStatus(created.id, TaskStatus.COMPLETED);
        expect(updated).toBeDefined();
        expect(updated?.status).toBe(TaskStatus.COMPLETED);
        const stats = await svc.getStats();
        expect(stats.total).toBe(1);
        expect(stats.completed).toBe(1);
        await svc.delete(created.id);
        const after = await svc.getAll();
        expect(after.length).toBe(0);
    });
});
