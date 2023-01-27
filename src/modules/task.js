import Todo from './todo';

export default class Task {
    #name;
    #status;
    #priority;
    #dateCreated = new Date();
    #dateDue;
    #description = 'Add a description for this task!';
    #todos = {};
    #numOfTodos = 0;
    #currentTodoIndex = 0;

    constructor(name, status, priority) {
        this.#name = name;
        this.#status = status;
        this.#priority = priority;
        this.#dateDue = this.initializeDueDate();

        if (!(this.numOfTodos)) {
            this.createTodo();
            this.createTodo();
            this.createTodo();
        }
    }

    get name() { return this.#name };
    get status() { return this.#status };
    get priority() { return this.#priority };
    get dateCreated() { return this.#dateCreated };
    get dateDue() { return this.#dateDue };
    get description() { return this.#description };
    get todos() { return this.#todos };
    get numOfTodos() { return this.#numOfTodos };

    set name(value) { this.#name = value };
    set status(value) { this.#status = value };
    set priority(value) { this.#priority = value };
    set dateDue(value) { this.#dateDue = value };
    set description(value) { this.#description = value };

    initializeDueDate = () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);
      dueDate.setHours(13);
      dueDate.setMinutes(0);
      dueDate.setSeconds(0);
      return dueDate;
}


    updateTask = (parentFolder, taskSettingsInfo) => {
        const taskObject = parentFolder.tasks[taskSettingsInfo.oldTaskName];
        taskObject.name = taskSettingsInfo.taskName;
        taskObject.status = taskSettingsInfo.taskStatus;
        taskObject.priority = taskSettingsInfo.taskPriority;
        taskObject.dateDue = new Date(taskSettingsInfo.taskDueDate);
        taskObject.description = taskSettingsInfo.taskDescription;
        
        delete parentFolder.tasks[taskSettingsInfo.oldTaskName];
        parentFolder.tasks[taskObject.name] = taskObject;
    }

    updateTaskTodos = allTodoContainers => {
        const todoContainers = Array.from(allTodoContainers.children).filter(container => container.classList.contains('form-checkbox-container'));
        for (let i = 0; i < todoContainers.length; i++) {
            const todoIndex = todoContainers[i].getAttribute('todo-index');
            const todoDescription = todoContainers[i].querySelector('[type="text"]').value;
            const todoStatus = todoContainers[i].querySelector('[type="checkbox"]').checked;

            const todoObj = this.todos[todoIndex];
            todoObj.description = todoDescription;
            todoObj.status = todoStatus;
        }
    }

    incrementTodosNum = () => this.#numOfTodos++;

    decrementTodosNum = () => this.#numOfTodos--;

    incrementTodosIndex = () => this.#currentTodoIndex++;

    appendToTodosObject = todoObj => this.#todos[this.#currentTodoIndex] = todoObj;

    createTodo = () => {
        this.incrementTodosNum();
        this.incrementTodosIndex();
        const todoObj = new Todo(`Add info to this Todo...`, this.#currentTodoIndex);
        this.appendToTodosObject(todoObj);
        return todoObj;
    }

    deleteTodo = todoIndex => {
        this.decrementTodosNum();
        const todoElements = document.querySelector(`[todo-index="${todoIndex}"]`);
        delete this.todos[todoElements.getAttribute('todo-index')];
        todoElements.remove();
    }

    static determineTaskStatus = addTaskBtnEl => {
        if (addTaskBtnEl.classList.contains('upcoming-tasks')) {
            return 'upcoming';
        } else if (addTaskBtnEl.classList.contains('inprogress-tasks')) {
            return 'inprogress';
        } else {
            return 'completed';
        }
    }
};