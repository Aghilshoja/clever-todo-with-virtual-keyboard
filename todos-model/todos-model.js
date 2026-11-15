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
    this.subtasks = [];
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

  getTaskFromlists(sectionId, taskId, isSubtaskList) {
    let sectionList = null;
    let foundTask = null;

    if (!isSubtaskList)
      isSubtaskList = this.subtasks.some((task) => task.id === taskId);

    if (isSubtaskList) {
      foundTask = this.subtasks.find((task) => task.id === taskId);
      if (!foundTask) return null;
      return { foundTask };
    } else if (sectionId) {
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

  deleteSection(sectionId, subTaskIds) {
    const section = this.sections.find((section) => section.id === sectionId);

    if (!section) throw new Error("section object was not found");

    this.sections = this.sections.filter((section) => section.id !== sectionId);

    const ids = section.tasks.map((t) => t.id);

    this.subtasks = this.subtasks.filter(
      (subtask) => !subTaskIds.includes(subtask.id),
    );

    this.removeNotifications([...ids, ...subTaskIds]);
  }

  deleteTask(taskId, sectionId) {
    const isSubTaskList = this.subtasks.some((task) => task.id === taskId);

    const result = this.getTaskFromlists(sectionId, taskId, isSubTaskList);

    if (!result) throw new Error("task object was not found");

    const { sectionList, foundTask } = result;

    const descendantIds = this.getAllDescendants(taskId).map((task) => task.id);

    this.removeNotifications([taskId, ...descendantIds]);

    const deletedTask = {
      id: this.generateId(),
      text: foundTask.text,
      description: foundTask.description,
      dueDate: foundTask.dueDate,
      isCompleted: foundTask.isCompleted,
      deletedAt: Date.now(),
    };

    this.taskHistory.deletedTasks.push(deletedTask);

    const idsToRemove = new Set(descendantIds);

    this.subtasks = this.subtasks.filter((task) => !idsToRemove.has(task.id));

    if (isSubTaskList) {
      this.subtasks = this.subtasks.filter((task) => task.id !== taskId);
    } else if (sectionList) {
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

  getSeveralTasksFromList(sectionId, taskIds, isSubTask) {
    let sectionList = null;
    let foundTasks = null;

    if (isSubTask) {
      foundTasks = this.subtasks.filter((task) => taskIds.includes(task.id));
      if (!foundTasks) return null;
      return { foundTasks };
    } else if (sectionId) {
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
    const isSubTask = this.subtasks.some((task) => task.id === taskIds[0]);
    const result = this.getSeveralTasksFromList(sectionId, taskIds, isSubTask);
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

    const subtaskIdsToRemove = taskIds.flatMap((taskId) =>
      this.getAllDescendants(taskId).map((task) => task.id),
    );

    this.removeNotifications([...taskIds, ...subtaskIdsToRemove]);

    this.subtasks = this.subtasks.filter(
      (subtask) => !subtaskIdsToRemove.includes(subtask.id),
    );

    if (isSubTask) {
      this.subtasks = this.subtasks.filter(
        (task) => !taskIds.includes(task.id),
      );
    } else if (sectionList) {
      sectionList.tasks = sectionList.tasks.filter(
        (task) => !taskIds.includes(task.id),
      );
    } else {
      this.tasks = this.tasks.filter((task) => !taskIds.includes(task.id));
    }
  }

  duplicateSection(sectionId) {
    const sectionToDuplicate = this.getSectionList(sectionId);

    if (!sectionToDuplicate) throw new Error("no section found");

    const idMapping = new Map();
    // 1. Generate new IDs for root tasks.
    sectionToDuplicate.tasks.forEach((task) => {
      idMapping.set(task.id, this.generateId());
    });

    // 2. Collect descendants and generate their new IDs.
    sectionToDuplicate.tasks.forEach((rootTask) => {
      const descendants = this.getAllDescendants(rootTask.id);

      descendants.forEach((subtask) => {
        if (!idMapping.has(subtask.id)) {
          idMapping.set(subtask.id, this.generateId());
        }
      });
    });

    // 3. Duplicate root tasks.
    const duplicatedTasks = sectionToDuplicate.tasks.map((task) => ({
      ...task,
      id: idMapping.get(task.id),
    }));

    // 4. Duplicate all subtasks belonging to those roots.
    const duplicatedSubtasks = this.subtasks
      .filter((subtask) => idMapping.has(subtask.id))
      .map((subtask) => ({
        ...subtask,
        id: idMapping.get(subtask.id),
        parentTaskId: idMapping.get(subtask.parentTaskId),
      }));

    // 5. Add duplicated subtasks to the model.
    this.subtasks.push(...duplicatedSubtasks);

    const duplicatedSection = {
      ...sectionToDuplicate,
      id: this.generateId(),
      tasks: duplicatedTasks,
    };

    const indexOfOriginalSection = this.sections.indexOf(sectionToDuplicate);

    if (indexOfOriginalSection === -1) return;

    this.sections.splice(indexOfOriginalSection + 1, 0, duplicatedSection);

    return { duplicatedSection, idMapping };
  }

  duplicateTask(taskId, sectionId) {
    const isSubTaskList = this.subtasks.some((task) => task.id === taskId);
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

    const descendants = this.getAllDescendants(taskId);

    const idMapping = new Map();

    idMapping.set(taskId, duplicatedTask.id);

    descendants.forEach((subtask) => {
      const duplicatedSubTask = {
        ...subtask,
        id: this.generateId(),
        parentTaskId: idMapping.get(subtask.parentTaskId),
      };

      idMapping.set(subtask.id, duplicatedSubTask.id);

      const index = this.subtasks.indexOf(subtask);
      if (index !== -1) {
        this.subtasks.splice(index, 0, duplicatedSubTask);
      }
    });

    if (isSubTaskList) {
      const indexOfOriginalTask = this.subtasks.indexOf(foundTask);
      if (indexOfOriginalTask === -1) return;

      duplicatedTask.parentTaskId = foundTask.parentTaskId;
      this.subtasks.splice(indexOfOriginalTask + 1, 0, duplicatedTask);
    } else if (sectionList) {
      const indexOfOriginalTask = sectionList.tasks.indexOf(foundTask);
      if (indexOfOriginalTask === -1) return;

      sectionList.tasks.splice(indexOfOriginalTask + 1, 0, duplicatedTask);
    } else {
      const indexOfOriginalTask = this.getTasks().indexOf(foundTask);
      if (indexOfOriginalTask === -1) return;
      this.getTasks().splice(indexOfOriginalTask + 1, 0, duplicatedTask);
    }

    return {
      duplicatedTask,
      idMapping,
    };
  }

  duplicateTaskTree(task) {
    const descendants = this.getAllDescendants(task.id);

    const idMapping = new Map();
    idMapping.set(task.id, this.generateId());

    // Generate IDs for every descendant first.
    descendants.forEach((subtask) => {
      idMapping.set(subtask.id, this.generateId());
    });

    const duplicatedTask = {
      ...task,
      id: idMapping.get(task.id),
      createdAt: Date.now(),
      originalId: task.id,
    };

    const duplicatedSubtasks = descendants.map((subtask) => ({
      ...subtask,
      id: idMapping.get(subtask.id),
      parentTaskId: idMapping.get(subtask.parentTaskId),
    }));

    return {
      duplicatedTask,
      duplicatedSubtasks,
      idMapping,
    };
  }

  duplicateSeveralTasks(taskIds, sectionId) {
    const isSubtaskSelection = this.subtasks.some((task) =>
      taskIds.includes(task.id),
    );

    const sectionList = sectionId ? this.getSectionList(sectionId) : null;

    const sourceTasks = isSubtaskSelection
      ? this.subtasks
      : sectionList
        ? sectionList.tasks
        : this.getTasks();

    const duplicatedResults = [];

    taskIds.forEach((taskId) => {
      const originalTask = sourceTasks.find((task) => task.id === taskId);

      if (!originalTask) return;

      const result = this.duplicateTaskTree(originalTask);

      const { duplicatedTask, duplicatedSubtasks } = result;

      this.subtasks.push(...duplicatedSubtasks);

      const originalIndex = sourceTasks.indexOf(originalTask);

      sourceTasks.splice(originalIndex + 1, 0, duplicatedTask);

      duplicatedResults.push(result);
    });
    return duplicatedResults;
  }

  markTaskAsCompleted(taskId, sectionId) {
    const isSubtaskList = this.subtasks.some((task) => task.id === taskId);
    const result = this.getTaskFromlists(sectionId, taskId, isSubtaskList);
    if (!result) throw new Error("no task to complete");

    const { foundTask } = result;

    const taskToComplete = foundTask;

    taskToComplete.isCompleted = true;

    const descendants = this.getAllDescendants(taskId);

    descendants.forEach((subtask) => (subtask.isCompleted = true));

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
    const isSubTaskList = this.subtasks.some((task) =>
      taskIds.includes(task.id),
    );

    const result = this.getSeveralTasksFromList(
      sectionId,
      taskIds,
      isSubTaskList,
    );

    if (!result || result.foundTasks.length === 0) {
      throw new Error("no tasks to complete");
    }

    const { foundTasks } = result;

    const tasksToComplete = new Map();

    foundTasks.forEach((task) => {
      tasksToComplete.set(task.id, task);

      this.getAllDescendants(task.id).forEach((subtask) => {
        tasksToComplete.set(subtask.id, subtask);
      });
    });

    // Find selected tasks that don't have another selected ancestor.
    const selectedIds = new Set(taskIds);

    const tasksToRebuild = foundTasks.filter((task) => {
      let parentId = task.parentTaskId;

      while (parentId) {
        if (selectedIds.has(parentId)) return false;

        const parent = this.subtasks.find((subtask) => subtask.id === parentId);
        parentId = parent?.parentTaskId;
      }

      return true;
    });

    let completedTasksCount = 0;

    // Complete tasks and record only actual state changes.
    tasksToComplete.forEach((task) => {
      if (task.isCompleted) return;

      task.isCompleted = true;
      completedTasksCount++;
      this.taskHistory.completedTasks.push({
        text: task.text,
        completedAt: Date.now(),
        id: task.id,
        isCompleted: task.isCompleted,
        description: task.description,
        dueDate: task.dueDate,
      });
    });

    return {
      tasksToRebuild,
      completedTasksCount,
    };
  }

  moveTaskFromCompletedToActive(taskId, sectionId) {
    const isSubtaskList = this.subtasks.some((task) => task.id === taskId);
    const result = this.getTaskFromlists(sectionId, taskId, isSubtaskList);
    if (!result) throw new Error("no task to uncomplete");

    const { foundTask } = result;

    const taskToUncomplete = foundTask;

    taskToUncomplete.isCompleted = false;

    return taskToUncomplete;
  }

  uncompleteSeveralTasks(taskIds, sectionId) {
    const isSubtaskList = this.subtasks.some((task) =>
      taskIds.includes(task.id),
    );

    const result = this.getSeveralTasksFromList(
      sectionId,
      taskIds,
      isSubtaskList,
    );

    if (!result || result.foundTasks.length === 0) {
      throw new Error("no tasks to uncomplete");
    }

    const { foundTasks } = result;
    const tasksToUncomplete = new Map();

    foundTasks.forEach((task) => {
      tasksToUncomplete.set(task.id, task);

      let parentId = task.parentTaskId;

      while (parentId) {
        const parent = this.subtasks.find((subtask) => subtask.id === parentId);

        if (!parent) break;

        tasksToUncomplete.set(parent.id, parent);
        parentId = parent.parentTaskId;
      }
    });

    tasksToUncomplete.forEach((task) => {
      task.isCompleted = false;
    });

    return foundTasks;
  }

  undoCompletedTask(taskObject, previousCompletionStates) {
    const descendants = this.getAllDescendants(taskObject.id);
    descendants.forEach((subtask) => {
      if (previousCompletionStates.has(subtask.id)) {
        const previousStatus = previousCompletionStates.get(subtask.id);
        if (previousStatus !== undefined) {
          subtask.isCompleted = previousStatus;
        }
      }
    });
    taskObject.isCompleted = false;
  }

  undoSeveralCompletedTasks(
    undoneTasks,
    undoneSubtasks,
    isSectionList,
    sectionList,
  ) {
    if (isSectionList) {
      sectionList.tasks = undoneTasks;
    } else {
      this.tasks = undoneTasks;
    }

    this.subtasks = undoneSubtasks;
  }

  undoUncompletedTask(taskObject, previousCompletionStates) {
    this.subtasks.forEach((subtask) => {
      if (previousCompletionStates.has(subtask.id)) {
        const previousStatus = previousCompletionStates.get(subtask.id);
        if (previousStatus !== undefined) {
          subtask.isCompleted = previousStatus;
        }
      }
    });
    taskObject.isCompleted = true;
  }

  undoSeveralUncompletedTasks(
    originalTasks,
    originalSubtasks,
    isSectionList,
    sectionList,
  ) {
    if (isSectionList) {
      sectionList.tasks = originalTasks;
    } else {
      this.tasks = originalTasks;
    }

    this.subtasks = originalSubtasks;
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
    const subtasks = this.subtasks ?? [];

    const sectionTasks = (this.sections ?? []).flatMap(
      (section) => section.tasks ?? [],
    );

    return [...activeTasks, ...sectionTasks, ...subtasks];
  }

  undoMultipleDueDates(isSection, tasks, subtasks, sectionList) {
    if (isSection) sectionList.tasks = tasks;
    else this.tasks = tasks;

    this.subtasks = subtasks;
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
    const isSubTaskList = this.subtasks.some((task) => task.id === taskIds[0]);
    const result = this.getSeveralTasksFromList(
      sectionId,
      taskIds,
      isSubTaskList,
    );
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
    const isSubtask = this.subtasks.some((task) => task.id === taskId);

    if (isSubtask) {
      return this.subtasks.find((task) => task.id === taskId) || null;
    } else if (sectionId) {
      const sectionList = this.sections.find((task) => task.id === sectionId);
      if (!sectionList) return null;
      return sectionList.tasks.find((task) => task.id === taskId);
    } else {
      return this.getTasks().find((task) => task.id === taskId) || null;
    }
  }

  getAllDescendants(parentId, sourceList = this.subtasks) {
    const result = [];
    const stack = [parentId];
    while (stack.length > 0) {
      const currentId = stack.pop();

      const children = sourceList.filter(
        (task) => task.parentTaskId === currentId,
      );

      for (const child of children) {
        result.push(child);
        stack.push(child.id);
      }
    }

    return result;
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

  getSubtaskDepth(subtaskId) {
    let currentId = subtaskId;
    let depth = 1;

    while (depth <= this.subtasks.length) {
      const subtask = this.subtasks.find((t) => t.id === currentId);
      if (!subtask) break; // reached a root task (not in subtasks)

      depth++;
      currentId = subtask.parentTaskId;
    }

    return depth;
  }

  getRootParentId(subtaskId) {
    let currentId = subtaskId;
    let current = this.subtasks.find((s) => s.id === currentId);

    while (current) {
      currentId = current.parentTaskId;
      current = this.subtasks.find((s) => s.id === currentId);
    }

    return currentId;
  }

  getAncestorChain(taskObject, sectionId) {
    let parentAncestor = null;
    const ancestors = [];
    let currentTask = taskObject;

    while (currentTask.parentTaskId) {
      const parent = this.getTask(currentTask.parentTaskId, sectionId);

      if (!parent) break;

      parentAncestor = parent;
      ancestors.unshift(parent);
      currentTask = parent;
    }

    return {
      parentAncestor,
      ancestors,
    };
  }

  addSubTask(parentTaskId, subTaskText, sectionId) {
    const parentTask = this.getTask(parentTaskId, sectionId);
    if (!parentTask) throw new Error("Parent task not found");

    const subTask = {
      id: this.generateId(),
      text: subTaskText,
      createdAt: Date.now(),
      isCompleted: parentTask.isCompleted,
      description: null,
      dueDate: null,
      parentTaskId: parentTask.id,
    };

    this.subtasks.push(subTask);

    return subTask;
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
