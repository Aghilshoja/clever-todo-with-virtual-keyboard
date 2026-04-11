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

  addTask(text) {
    const newTask = {
      id: crypto.randomUUID(),
      text: text,
      createdAt: Date.now(),
      isCompleted: false,
    };
    this.getTasks().push(newTask);
    this.emitChange(newTask);
  }
}
