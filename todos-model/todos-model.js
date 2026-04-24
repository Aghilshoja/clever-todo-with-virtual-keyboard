export class TaskList {
  constructor(id) {
    this.id = id;
    this.tasks = [];
    this.listeners = [];
  }

  subscribe(listeners) {
    this.listeners.push(listeners);
  }

  emitChange(eachTask) {
    this.listeners.forEach((listener) => listener(this, eachTask));
  }

  getTasks() {
    return this.tasks;
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
  }

  generateId() {
    // Try crypto.randomUUID first
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback for older mobile browsers
    return Date.now() + "-" + Math.random().toString(36).substring(2, 9);
  }

  addTask(text) {
    const newTask = {
      id: this.generateId(),
      text: text,
      createdAt: Date.now(),
      isCompleted: false,
    };
    this.getTasks().push(newTask);
    this.emitChange(newTask);
  }
}
