export class TaskList {
  static EVENTS = {
    MARK_TASK_AS_DUE: "markTaskAsDue",
    RENDER_TASK: "renderTask",
  };

  constructor(id) {
    this.id = id;
    this.tasks = [];
    this.notifiedTasks = new Set();
    this.sections = [];
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

  getSectionList(sectionId) {
    return this.sections.find((section) => section.id === sectionId);
  }

  getTaskFromlists(sectionId, taskId) {
    let sectionList = null;
    let foundTask = null;
    if (sectionId) {
      sectionList = this.getSectionList(sectionId);
      if (!sectionList) return null;
      foundTask = sectionList.tasks.find((task) => task.id === taskId);
      if (!foundTask) return null;
      return {
        foundTask,
        sectionList,
      };
    } else {
      foundTask = this.getTask(taskId);
      if (!foundTask) return null;
      return { foundTask };
    }
  }

  deleteSection(sectionId) {
    const section = this.sections.find((section) => section.id === sectionId);

    if (!section) throw new Error("section object was not found");

    this.sections = this.sections.filter((section) => section.id !== sectionId);

    const ids = section.tasks.map((t) => t.id);

    this.removeNotifications(ids);
  }

  deleteTask(taskId, sectionId) {
    const result = this.getTaskFromlists(sectionId, taskId);
    if (!result) throw new Error("task object was not found");

    const { sectionList, foundTask } = result;

    this.removeNotifications(taskId);

    const deletedTask = {
      id: this.generateId(),
      text: foundTask.text,
      description: foundTask.description,
      dueDate: foundTask.dueDate,
      isCompleted: foundTask.isCompleted,
      deletedAt: Date.now(),
    };
    this.taskHistory.deletedTasks.push(deletedTask);

    if (sectionList) {
      sectionList.tasks = sectionList.tasks.filter(
        (task) => task.id !== taskId,
      );
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

  getSeveralTasksFromList(sectionId, taskIds) {
    let sectionList = null;
    let foundTasks = null;
    if (sectionId) {
      sectionList = this.getSectionList(sectionId);
      if (!sectionList) return null;
      foundTasks = sectionList.tasks.filter((task) =>
        taskIds.includes(task.id),
      );
      if (!foundTasks) return null;
      return {
        foundTasks,
        sectionList,
      };
    } else {
      foundTasks = this.getTasks().filter((task) => taskIds.includes(task.id));
      if (!foundTasks) return null;
      return { foundTasks };
    }
  }

  deleteSeveralTasks(taskIds, sectionId) {
    const result = this.getSeveralTasksFromList(sectionId, taskIds);
    if (!result) throw new Error("no tasks to delete found ");
    const { sectionList, foundTasks } = result;

    const tasksToDelete = foundTasks;

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

    if (sectionList) {
      sectionList.tasks = sectionList.tasks.filter(
        (task) => !taskIds.includes(task.id),
      );
    } else {
      this.tasks = this.tasks.filter((task) => !taskIds.includes(task.id));
    }

    this.removeNotifications(taskIds);
  }

  duplicateSection(sectionId) {
    const sectionToDuplicate = this.getSectionList(sectionId);
    if (!sectionToDuplicate) throw new Error("no section found ");

    const duplicatedSection = {
      sectionName: sectionToDuplicate.sectionName,
      description: sectionToDuplicate.description,
      id: this.generateId(),
      tasks: sectionToDuplicate.tasks.map((task) => ({
        ...task,
        id: this.generateId(),
      })),
    };

    const indexOfOriginalSection = this.sections.indexOf(sectionToDuplicate);
    if (indexOfOriginalSection === -1) return;

    this.sections.splice(indexOfOriginalSection + 1, 0, duplicatedSection);

    return duplicatedSection;
  }

  duplicateTask(taskId, sectionId) {
    const result = this.getTaskFromlists(sectionId, taskId);
    if (!result) throw new Error("no task to duplicate  found");
    const { sectionList, foundTask } = result;

    const duplicatedTask = {
      id: this.generateId(),
      text: foundTask.text,
      createdAt: Date.now(),
      isCompleted: foundTask.isCompleted,
      description: foundTask.description,
      dueDate: foundTask.dueDate,
    };

    if (sectionList) {
      const indexOfOriginalTask = sectionList.tasks.indexOf(foundTask);
      if (indexOfOriginalTask === -1) return;

      sectionList.tasks.splice(indexOfOriginalTask + 1, 0, duplicatedTask);
    } else {
      const indexOfOriginalTask = this.getTasks().indexOf(foundTask);
      if (indexOfOriginalTask === -1) return;
      this.getTasks().splice(indexOfOriginalTask + 1, 0, duplicatedTask);
    }
    return duplicatedTask;
  }

  duplicatedTask(task) {
    return {
      id: this.generateId(),
      text: task.text,
      createdAt: Date.now(),
      isCompleted: task.isCompleted,
      description: task.description,
      dueDate: task.dueDate,
      originalId: task.id,
    };
  }

  duplicateSeveralTasks(taskIds, sectionId) {
    let copiesOfDuplicatedTasks = [];

    let sectionList = null;

    if (sectionId) sectionList = this.getSectionList(sectionId);

    let sourceList = null;

    if (sectionList) sourceList = this.sections;
    else sourceList = this.getTasks();

    const newList = [];

    sourceList.forEach((task) => {
      if ("sectionName" in task) {
        for (const sectionTask of task.tasks) {
          newList.push(sectionTask);
          if (taskIds.includes(sectionTask.id)) {
            const duplicatedTask = this.duplicatedTask(sectionTask);
            copiesOfDuplicatedTasks.push(duplicatedTask);
            newList.push(duplicatedTask);
          }
        }
      } else {
        newList.push(task);
        if (taskIds.includes(task.id)) {
          const duplicatedTask = this.duplicatedTask(task);
          copiesOfDuplicatedTasks.push(duplicatedTask);
          newList.push(duplicatedTask);
        }
      }
    });

    if (sectionList) sectionList.tasks = newList;
    else this.tasks = newList;

    return copiesOfDuplicatedTasks;
  }

  markTaskAsCompleted(taskId, sectionId) {
    const result = this.getTaskFromlists(sectionId, taskId);
    if (!result) throw new Error("no task to complete");

    const { foundTask } = result;

    const taskToComplete = foundTask;

    taskToComplete.isCompleted = true;

    const completedTask = {
      id: this.generateId(),
      text: taskToComplete.text,
      completedAt: Date.now(),
      isCompleted: true,
      description: taskToComplete.description,
      dueDate: taskToComplete.dueDate,
    };

    this.taskHistory.completedTasks.push(completedTask);

    return taskToComplete;
  }

  markSeveralTasksAsCompleted(taskIds, sectionId) {
    const result = this.getSeveralTasksFromList(sectionId, taskIds);
    if (!result) throw new Error("no tasks to complete");
    const { foundTasks } = result;

    const tasksToComplete = foundTasks;

    tasksToComplete.forEach((task) => (task.isCompleted = true));

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
    });

    return tasksToComplete;
  }

  moveTaskFromCompletedToActive(taskId, sectionId) {
    const result = this.getTaskFromlists(sectionId, taskId);
    if (!result) throw new Error("no task to uncomplete");

    const { foundTask } = result;

    const taskToUncomplete = foundTask;

    taskToUncomplete.isCompleted = false;

    return taskToUncomplete;
  }

  uncompleteSeveralTasks(taskIds, sectionId) {
    const result = this.getSeveralTasksFromList(sectionId, taskIds);
    if (!result) throw new Error("no tasks to uncomplete ");
    const { foundTasks } = result;

    const tasksToUncomplete = foundTasks;

    tasksToUncomplete.forEach((task) => (task.isCompleted = false));

    return tasksToUncomplete;
  }

  undoCompletedTask(taskObject) {
    taskObject.isCompleted = false;
  }

  undoSeveralCompletedTasks(undoneTasks, isSectionList, sectionList) {
    if (isSectionList) sectionList.tasks = undoneTasks;
    else this.tasks = undoneTasks;
  }

  undoUncompletedTask(task) {
    task.isCompleted = true;
  }

  undoSeveralUncompletedTasks(undoneTasks, isSectionList, sectionList) {
    if (isSectionList) sectionList.tasks = undoneTasks;
    else this.tasks = undoneTasks;
  }

  generateId() {
    // Try crypto.randomUUID first
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback for older mobile browsers
    return Date.now() + "-" + Math.random().toString(36).substring(2, 9);
  }

  editTaskOrDescription(taskId, sectionId) {
    const result = this.getTaskFromlists(sectionId, taskId);
    if (!result) throw new Error("task object was not found");

    const { foundTask } = result;

    const taskToEdit = foundTask;

    return taskToEdit;
  }

  createInsertionContext(selectedTaskId, text, sectionId) {
    let selectedTask = null;
    let sourceList = null;

    if (sectionId) {
      const sectionList = this.getSectionList(sectionId);
      if (!sectionList) return;
      sourceList = sectionList.tasks;
      selectedTask = sectionList.tasks.find(
        (task) => task.id === selectedTaskId,
      );
    } else {
      selectedTask = this.getTask(selectedTaskId);
      sourceList = this.getTasks();
    }

    if (!selectedTask) return;

    const newTask = {
      id: this.generateId(),
      text: text,
      createdAt: Date.now(),
      isCompleted: false,
      description: null,
      dueDate: null,
    };

    const selectedIndex = sourceList.indexOf(selectedTask);

    return {
      newTask,
      selectedIndex,
      sourceList,
    };
  }

  addTaskAboveSelectedTask(selectedTaskId, text, sectionId) {
    const { newTask, selectedIndex, sourceList } = this.createInsertionContext(
      selectedTaskId,
      text,
      sectionId,
    );

    sourceList.splice(selectedIndex + 1, 0, newTask);

    return newTask;
  }

  addTaskBelowSelectedTask(selectedTaskId, text) {
    const { newTask, selectedIndex, sourceList } = this.createInsertionContext(
      selectedTaskId,
      text,
      sectionId,
    );

    sourceList.splice(selectedIndex + 1, 0, newTask);

    return newTask;
  }

  getAllTasks() {
    const activeTasks = this.getTasks() ?? [];

    const sectionTasks = (this.sections ?? []).flatMap(
      (section) => section.tasks ?? [],
    );

    return [...activeTasks, ...sectionTasks];
  }

  setDueDate(taskId, taskDueDate, hasTime, sectionId) {
    if (!taskDueDate) {
      console.warn("no date provided ");
      return;
    }
    const result = this.getTaskFromlists(sectionId, taskId);
    if (!result) throw new Error("no task to schedule");

    const { foundTask } = result;

    const taskToSetItsDueDate = foundTask;

    taskToSetItsDueDate.hasTime = hasTime;
    this.removeNotifications(taskId);
    taskToSetItsDueDate.dueDate = taskDueDate.getTime();
  }

  setMultipleDueDates(taskIds, dueDate, hasTime, sectionId) {
    if (!dueDate) return;
    const result = this.getSeveralTasksFromList(sectionId, taskIds);
    if (!result) throw new Error("no tasks to schedule");

    const { foundTasks } = result;

    const targetedTasks = foundTasks;

    if (targetedTasks.length === 0) {
      throw new Error("No matching task objects were found.");
    }

    targetedTasks.forEach((task) => {
      this.removeNotifications(task.id);
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

  getTask(taskId, sectionId) {
    if (sectionId) {
      const sectionList = this.sections.find((task) => task.id === sectionId);
      if (!sectionList) return null;
      return sectionList.tasks.find((task) => task.id === taskId);
    } else {
      return this.getTasks().find((task) => task.id === taskId) || null;
    }
  }

  addTaskToSection(sectionId, text) {
    const foundSectionList = this.sections.find(
      (task) => task.id === sectionId,
    );

    const task = {
      id: this.generateId(),
      text: text,
      createdAt: Date.now(),
      isCompleted: false,
      description: null,
      dueDate: null,
    };

    foundSectionList.tasks.push(task);

    return task;
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
