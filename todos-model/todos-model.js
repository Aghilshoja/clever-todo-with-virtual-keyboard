export class TaskList {
  static EVENTS = {
    MARK_TASK_AS_DUE: "markTaskAsDue",
    RENDER_TASK: "renderTask",
  };

  constructor(id) {
    this.id = id;
    this.tasks = [];
    this.completedTasks = [];
    this.notifiedTasks = new Set();
    this.listeners = {
      renderTask: [],
      markTaskAsDue: [],
    };
    this.taskHistory = {
      deletedTasks: [],
      editedTasks: [],
      completedTasks: [],
      addedTasks: [],
    };
  }

  subscribe(eventType, listeners) {
    if (this.listeners[eventType]) this.listeners[eventType].push(listeners);
  }

  emitChange(eventType, taskInfo) {
    if (this.listeners[eventType])
      this.listeners[eventType].forEach((listener) => listener(taskInfo, this));
  }

  getTasks() {
    return this.tasks;
  }

  getCompletedTasks() {
    return this.completedTasks;
  }

  getAllTasks() {
    return [...this.getTasks(), ...this.getCompletedTasks()];
  }

  deleteTask(taskId) {
    const foundTask = this.getTask(taskId);
    if (!foundTask) throw new Error("task object was not found");

    this.removeNotifications(taskId);

    const isCompleted = foundTask.isCompleted === true;

    const deletedTask = {
      id: this.generateId(),
      text: foundTask.text,
      description: foundTask.description,
      dueDate: foundTask.dueDate,
      isCompleted: foundTask.isCompleted,
      deletedAt: Date.now(),
    };
    this.taskHistory.deletedTasks.push(deletedTask);

    if (isCompleted) {
      this.completedTasks = this.completedTasks.filter((t) => t.id !== taskId);
    } else {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    }
  }

  removeNotifications(taskIds) {
    const ids = Array.isArray(taskIds) ? taskIds : [taskIds];

    for (const taskId of ids) {
      this.notifiedTasks.delete(taskId);
    }
  }

  deleteSeveralTasks(taskIds) {
    const tasksToDelete = this.getAllTasks().filter((task) =>
      taskIds.includes(task.id),
    );

    tasksToDelete.forEach((task) => {
      const deletedTask = {
        id: this.generateId(),
        text: task.text,
        deletedAt: Date.now(),
        isCompleted: task.isCompleted,
        description: task.description,
        dueDate: task.dueDate,
      };
      this.taskHistory.deletedTasks.push(deletedTask);
    });

    this.tasks = this.tasks.filter((task) => !taskIds.includes(task.id));
    this.completedTasks = this.completedTasks.filter(
      (task) => !taskIds.includes(task.id),
    );

    this.removeNotifications(taskIds);
  }

  duplicateTask(taskId) {
    const foundTask = this.getTask(taskId);
    if (!foundTask) throw new Error("task object was not found");
    const isCompleted = foundTask.isCompleted === true;

    const duplicatedTask = { ...foundTask };

    const duplicatedTaskk = {
      id: this.generateId(),
      text: duplicatedTask.text,
      createdAt: Date.now(),
      isCompleted: duplicatedTask.isCompleted,
      description: duplicatedTask.description,
      dueDate: duplicatedTask.dueDate,
    };

    if (isCompleted) {
      const indexOfOriginalTask = this.getCompletedTasks().indexOf(foundTask);
      this.getCompletedTasks().splice(
        indexOfOriginalTask + 1,
        0,
        duplicatedTaskk,
      );
    } else {
      const indexOfOriginalTask = this.getTasks().indexOf(foundTask);
      this.getTasks().splice(indexOfOriginalTask + 1, 0, duplicatedTaskk);
    }
    return duplicatedTask;
  }

  duplicateSeveralTasks(taskIds) {
    const copiesOfDuplicatedTasks = [];

    const firstTask = this.getTask(taskIds[0]);
    const isCompletedList = firstTask?.isCompleted === true;

    const sourceList = isCompletedList
      ? this.getCompletedTasks()
      : this.getTasks();
    const newList = [];

    sourceList.forEach((task) => {
      newList.push(task);

      if (taskIds.includes(task.id)) {
        const duplicatedTask = {
          id: this.generateId(),
          text: task.text,
          createdAt: Date.now(),
          isCompleted: task.isCompleted,
          description: task.description,
          dueDate: task.dueDate,
        };
        copiesOfDuplicatedTasks.push(duplicatedTask);
        newList.push(duplicatedTask);
      }
    });

    if (isCompletedList) {
      this.completedTasks = newList;
    } else {
      this.tasks = newList;
    }

    return copiesOfDuplicatedTasks;
  }

  markTaskAsCompleted(taskId) {
    const taskToComplete = this.getTasks().find((t) => t.id === taskId);
    if (!taskToComplete) throw new Error("Task object was not found");
    const completedTaskIndex = this.getTasks().findIndex(
      (t) => t.id === taskId,
    );
    if (completedTaskIndex === -1) return;

    this.tasks.filter((t) => t.id !== taskId);
    const completedTask = {
      id: this.generateId(),
      text: taskToComplete.text,
      completedAt: Date.now(),
      isCompleted: true,
      description: taskToComplete.description,
      dueDate: taskToComplete.dueDate,
    };

    this.taskHistory.completedTasks.push(completedTask);

    this.getCompletedTasks().push(completedTask);
    return {
      completedTask,
      completedTaskIndex /* return the index of the original task object to use it for the undo operation*/,
      taskToComplete, // return the original active task for undo operation
    };
  }

  markSeveralTasksAsCompleted(taskIds) {
    const tasksToComplete = this.tasks.filter((task) =>
      taskIds.includes(task.id),
    );

    this.tasks = this.tasks.filter((task) => !taskIds.includes(task.id));

    tasksToComplete.forEach((task) => {
      const completedTask = {
        text: task.text,
        completedAt: Date.now(),
        id: task.id,
        isCompleted: task.isCompleted,
        description: task.description,
        dueDate: task.dueDate,
      };

      this.taskHistory.completedTasks.push(completedTask);
      this.getCompletedTasks().push(completedTask);
    });
  }

  moveTaskFromCompletedToActive(taskId) {
    const taskToUncomplete = this.getCompletedTasks().find(
      (t) => t.id === taskId,
    );
    if (!taskToUncomplete) throw new Error("task object was not found");
    const indexOfTaskToUncomplete =
      this.getCompletedTasks().indexOf(taskToUncomplete);
    if (indexOfTaskToUncomplete === -1) return;
    this.completedTasks = this.completedTasks.filter((t) => t.id !== taskId);
    const activeTask = {
      id: this.generateId(),
      isCompleted: false,
      createdAt: Date.now(),
      text: taskToUncomplete.text,
      description: taskToUncomplete.description,
      dueDate: taskToUncomplete.dueDate,
    };
    this.getTasks().push(activeTask);
    return {
      taskToUncomplete,
      indexOfTaskToUncomplete,
      activeTask,
    };
  }

  uncompleteSeveralTasks(taskIds) {
    const tasksToUncomplete = this.completedTasks.filter((task) =>
      taskIds.includes(task.id),
    );

    this.completedTasks = this.completedTasks.filter(
      (task) => !taskIds.includes(task.id),
    );

    tasksToUncomplete.forEach((task) => {
      const uncompletedTask = {
        isCompleted: false,
        createAt: Date.now(),
        id: this.generateId(),
        createdAt: Date.now(),
        text: task.text,
        description: task.description,
        dueDate: task.dueDate,
      };
      this.getTasks().push(uncompletedTask);
    });
  }

  undoCompletedTask(taskObject, index, completedTaskId) {
    if (this.getTasks().length === 0) this.getTasks().push(taskObject);
    else if (this.getTasks().length > 0)
      this.getTasks().splice(index, 0, taskObject);

    this.completedTasks = this.completedTasks.filter(
      (t) => t.id !== completedTaskId,
    );
  }

  undoSeveralCompletedTasks(originalTasksOrder, taskIds) {
    this.completedTasks = this.completedTasks.filter(
      (task) => !taskIds.includes(task.id),
    );

    this.tasks = originalTasksOrder;
  }

  undoUncompletedTask(originalTaskObject, index, uncompletedTaskId) {
    if (this.getCompletedTasks().length === 0)
      this.getCompletedTasks().push(originalTaskObject);
    else if (this.getCompletedTasks().length > 0)
      this.getCompletedTasks().splice(index, 0, originalTaskObject);

    this.tasks = this.tasks.filter((t) => t.id !== uncompletedTaskId);
  }

  undoSeveralUncompletedTasks(originalTasksOrder, taskIds) {
    this.tasks = this.tasks.filter((task) => !taskIds.includes(task.id));

    // restore the original order of completed tasks after undo by snapshot taken before uncompleting tasks
    this.completedTasks = originalTasksOrder;
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
    const taskToEdit = this.getTask(taskId);

    if (!taskToEdit) throw new Error("task object was not found");
    return taskToEdit;
  }

  createInsertionContext(selectedTaskId, text) {
    const selectedTask = this.getTask(selectedTaskId);

    if (!selectedTask) return;

    const targetList = selectedTask.isCompleted
      ? this.getCompletedTasks()
      : this.getTasks();

    const newTask = {
      id: this.generateId(),
      text: text,
      createdAt: Date.now(),
      isCompleted: selectedTask.isCompleted,
      description: null,
    };

    const selectedIndex = targetList.indexOf(selectedTask);

    return {
      newTask,
      selectedIndex,
      targetList,
    };
  }

  addTaskAboveSelectedTask(selectedTaskId, text) {
    const taskToAdd = this.createInsertionContext(selectedTaskId, text);
    const { newTask, targetList, selectedIndex } = taskToAdd;

    targetList.splice(selectedIndex + 1, 0, newTask);

    return newTask;
  }

  addTaskBelowSelectedTask(selectedTaskId, text) {
    const taskToAdd = this.createInsertionContext(selectedTaskId, text);
    const { newTask, targetList, selectedIndex } = taskToAdd;

    targetList.splice(selectedIndex, 0, newTask);

    return newTask;
  }

  setDueDate(taskId, taskDueDate, hasTime) {
    const taskToSetItsDueDate = this.getTask(taskId);
    if (!taskToSetItsDueDate) throw new Error("task object was not found");

    if (!(taskDueDate instanceof Date)) throw new Error("no date object !");

    taskToSetItsDueDate.hasTime = hasTime;
    this.removeNotifications(taskId);
    taskToSetItsDueDate.dueDate = taskDueDate.getTime();
  }

  setMultipleDueDates(taskIds, dueDate, hasTime) {
    const targetedTasks = this.getAllTasks().filter((task) =>
      taskIds.includes(task.id),
    );

    if (targetedTasks.length === 0) {
      throw new Error("No matching task objects were found.");
    }

    if (!(dueDate instanceof Date)) throw new Error("no date object !");

    targetedTasks.forEach((task) => {
      task.dueDate = dueDate.getTime();
      task.hasTime = hasTime;
    });
  }

  async showNotification(task) {
    const image = "app-logo.png";
    const title = "Clever Task Manager";
    const body = `${task.text} is due now`;

    try {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification(title, {
        body,
        tag: `task-${task.id}`,
        icon: image,
        requireInteraction: true,
        data: {
          taskId: task.id,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  async checkDueDates() {
    const now = Date.now();

    for (const task of this.getAllTasks()) {
      if (!task.dueDate) continue;

      if (this.notifiedTasks.has(task.id)) continue;

      if (task.dueDate <= now) {
        await this.showNotification(task);
        this.notifiedTasks.add(task.id);
        this.emitChange(TaskList.EVENTS.MARK_TASK_AS_DUE, task.id);
      }
    }
  }

  async initializeNotifications() {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") return;

    setInterval(() => {
      this.checkDueDates();
    }, 1000);
  }

  getTask(taskId) {
    return this.getAllTasks().find((task) => task.id === taskId) || null;
  }

  addTask(text) {
    const newTask = {
      id: this.generateId(),
      text: text,
      createdAt: Date.now(),
      isCompleted: false,
      description: null,
      dueDate: null,
    };
    this.taskHistory.addedTasks.push(newTask);
    this.getTasks().push(newTask);
    this.emitChange(TaskList.EVENTS.RENDER_TASK, newTask);
  }
}
