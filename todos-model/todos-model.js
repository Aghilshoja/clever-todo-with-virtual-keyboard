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

  duplicateTask(taskId) {
    const foundTask = this.getTasks().find((t) => t.id === taskId);
    if (!foundTask) throw new Error("task object was not found");
    const indexOfFoundTask = this.getTasks().indexOf(foundTask);
    if (indexOfFoundTask === -1) return;
    const duplicatedTask = { ...foundTask };
    duplicatedTask.id = this.generateId();
    this.getTasks().splice(indexOfFoundTask + 1, 0, duplicatedTask);
    return duplicatedTask;
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
