export class TaskList {
  constructor(id) {
    this.id = id;
    this.tasks = [];
    this.completedTasks = [];
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

  getCompletedTasks() {
    return this.completedTasks;
  }

  // update delete , edit, and duplicate features to handle completed list as well
  deleteTask(taskId) {
    const allTypesOfTasks = [...this.getTasks(), ...this.getCompletedTasks()];
    const foundTask = allTypesOfTasks.find((t) => t.id === taskId);
    if (!foundTask) throw new Error("task object was not found");
    const isCompleted = foundTask.isCompleted === true;

    if (isCompleted) {
      this.completedTasks = this.completedTasks.filter((t) => t.id !== taskId);
    } else {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    }
  }

  duplicateTask(taskId) {
    const allTypesOfTasks = [...this.getTasks(), ...this.getCompletedTasks()];
    const foundTask = allTypesOfTasks.find((t) => t.id === taskId);
    if (!foundTask) throw new Error("task object was not found");
    const isCompleted = foundTask.isCompleted === true;

    const duplicatedTask = { ...foundTask };

    if (isCompleted) {
      duplicatedTask.id = this.generateId();
      duplicatedTask.createdAt = Date.now();
      const indexOfOriginalTask = this.getCompletedTasks().indexOf(foundTask);
      this.getCompletedTasks().splice(
        indexOfOriginalTask + 1,
        0,
        duplicatedTask,
      );
    } else {
      duplicatedTask.id = this.generateId();
      const indexOfOriginalTask = this.getTasks().indexOf(foundTask);
      this.getTasks().splice(indexOfOriginalTask + 1, 0, duplicatedTask);
    }
    return duplicatedTask;
  }

  formatExactDate(t) {
    const timestamp = Date.now();
    return new Date(timestamp).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  markTaskAsCompleted(taskId) {
    const taskToComplete = this.getTasks().find((t) => t.id === taskId);
    if (!taskToComplete) throw new Error("Task object was not found");
    const completedTaskIndex = this.getTasks().findIndex(
      (t) => t.id === taskId,
    );
    if (completedTaskIndex === -1) return;
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    const copyCompletedTask = {
      id: this.generateId(),
      text: taskToComplete.text,
      isCompleted: true,
      description: taskToComplete.description,
      completedAt: this.formatExactDate(),
    };

    this.getCompletedTasks().push(copyCompletedTask);
    return {
      copyCompletedTask,
      completedTaskIndex /* return the index of the original task object to use it for the undo operation*/,
      taskToComplete, // return the original active task for undo operation
    };
  }

  undoCompletedTask(taskObject, index, completedTaskId) {
    if (this.getTasks().length === 0) this.getTasks().push(taskObject);
    else if (this.getTasks().length > 0)
      this.getTasks().splice(index, 0, taskObject);

    this.completedTasks = this.completedTasks.filter(
      (t) => t.id !== completedTaskId,
    );
  }

  generateId() {
    // Try crypto.randomUUID first
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback for older mobile browsers
    return Date.now() + "-" + Math.random().toString(36).substring(2, 9);
  }

  editTaskOrDescription(taskId) {
    const allTypesOfTasks = [...this.getTasks(), ...this.getCompletedTasks()];
    const taskTodEdit = allTypesOfTasks.find((t) => t.id === taskId);
    if (!taskTodEdit) throw new Error("task object was not found");
    return taskTodEdit;
  }

  addTask(text) {
    const newTask = {
      id: this.generateId(),
      text: text,
      createdAt: Date.now(),
      isCompleted: false,
      description: null,
    };
    this.getTasks().push(newTask);
    this.emitChange(newTask);
  }
}
