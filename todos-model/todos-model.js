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

  // update delete , edit, and duplicate features to handle completed list as well
  deleteTask(taskId) {
    const allTypesOfTasks = [...this.getTasks(), ...this.getCompletedTasks()];
    const foundTask = allTypesOfTasks.find((t) => t.id === taskId);
    if (!foundTask) throw new Error("task object was not found");

    this.removeNotifications(taskId);

    const isCompleted = foundTask.isCompleted === true;

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
    this.tasks = this.tasks.filter((task) => !taskIds.includes(task.id));
    this.completedTasks = this.completedTasks.filter(
      (task) => !taskIds.includes(task.id),
    );

    this.removeNotifications(taskIds);
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

  duplicateSeveralTasks(taskIds) {
    const copiesOfDuplicatedTasks = [];

    const allTasks = [...this.getTasks(), ...this.getCompletedTasks()];
    const firstTask = allTasks.find((t) => taskIds.includes(t.id));
    const isCompletedList = firstTask?.isCompleted === true;

    const sourceList = isCompletedList
      ? this.getCompletedTasks()
      : this.getTasks();
    const newList = [];

    sourceList.forEach((task) => {
      newList.push(task);

      if (taskIds.includes(task.id)) {
        const duplicatedTask = {
          ...task,
          id: this.generateId(),
          createdAt: Date.now(),
          isCompleted: isCompletedList,
          originalId: task.id,
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

    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    const copyCompletedTask = {
      ...taskToComplete,
      id: this.generateId(),
      isCompleted: true,
      completedAt: Date.now(),
    };

    this.getCompletedTasks().push(copyCompletedTask);
    return {
      copyCompletedTask,
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
        ...task,
        isCompleted: true,
        createdAt: Date.now(),
      };
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
      ...taskToUncomplete,
      id: this.generateId(),
      isCompleted: false,
      createdAt: Date.now(),
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
        ...task,
        isCompleted: false,
        createAt: Date.now(),
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
    const allTypesOfTasks = [...this.getTasks(), ...this.getCompletedTasks()];
    const taskTodEdit = allTypesOfTasks.find((t) => t.id === taskId);
    if (!taskTodEdit) throw new Error("task object was not found");
    return taskTodEdit;
  }

  createInsertionContext(selectedTaskId, text) {
    const allTasks = [...this.getTasks(), ...this.getCompletedTasks()];
    const selectedTask = allTasks.find((task) => task.id === selectedTaskId);

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
    const allTasks = [...this.getTasks(), ...this.getCompletedTasks()];
    const taskToSetItsDueDate = allTasks.find((task) => task.id === taskId);
    if (!taskToSetItsDueDate) throw new Error("task object was not found");

    if (!(taskDueDate instanceof Date)) throw new Error("no date object !");

    taskToSetItsDueDate.hasTime = hasTime;
    this.removeNotifications(taskId);
    taskToSetItsDueDate.dueDate = taskDueDate.getTime();
  }

  setMultipleDueDates(taskIds, dueDate, hasTime) {
    const allTasks = [...this.getTasks(), ...this.getCompletedTasks()];
    const targetedTasks = allTasks.filter((task) => taskIds.includes(task.id));

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
    const allTasks = [...this.getTasks(), ...this.getCompletedTasks()];
    const now = Date.now();

    for (const task of allTasks) {
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
    const allTasks = [...this.getTasks(), ...this.getCompletedTasks()];

    return allTasks.find((task) => task.id === taskId) || null;
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
    this.getTasks().push(newTask);
    this.emitChange(TaskList.EVENTS.RENDER_TASK, newTask);
  }
}
