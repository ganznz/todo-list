import renderDOM from "./renderDOM";
import Todo from "./todo";

export default class Task {
  #name;
  #status;
  #priority;
  #index
  #dateCreated = new Date();
  #dateDue = new Date();
  #description = "Add a description for this task!";
  #todos = [];
  #numOfTodos = 0;
  
  constructor(name, status, priority, index) {
    this.#name = name;
    this.#status = status.toLowerCase();
    this.#priority = priority.toLowerCase();
    this.#index = index;
    this.#dateDue.setDate(this.#dateDue.getDate() + 1);
    this.#dateDue.setHours(13, 0, 0); // sets initial due date to 1pm local time the next day
    if (!(this.#numOfTodos)) { // create default todos
      this.createTodo();
      this.createTodo();
      this.createTodo();
    }
  }

  get name() { return this.#name };
  get status() { return this.#status };
  get priority() { return this.#priority };
  get index() { return this.#index };
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

  updateDateDue = () => {
    const taskSettingsDateDue = document.querySelector('.task-date-due > input').value;

    if (taskSettingsDateDue.length > 0) {
      this.dateDue = new Date(taskSettingsDateDue);
    } else {
      const resetDate = new Date(this.dateCreated.getFullYear(), this.dateCreated.getMonth(), this.dateCreated.getDate() + 1);
      resetDate.setHours(13, 0, 0);
      this.dateDue = resetDate;
    }
  }

  updateTodos = () => {
    const taskTodos = document.querySelectorAll('.task-todos > form > div');
    this.todos.forEach((todo, index) => {
      const todoDescription = taskTodos[index].querySelector('input[type="text"]');
      const todoCheckbox = todoDescription.parentElement.querySelector('input[type="checkbox"]');
      todo.status = todoCheckbox.checked == true;
      todo.description = todoDescription.value;
    });
  }

  createTodo = () => {
    this.#numOfTodos++;
    // const todo = new Todo(`Todo ${this.numOfTodos}`);
    const todo = new Todo('Add a description');
    this.todos.push(todo);
    renderDOM.createTodoElement(this, todo);
  };

  deleteTodo = (todoIndex, todoElements) => {
    this.#numOfTodos--;
    todoElements.remove();
    this.todos.pop(todoIndex);
    renderDOM.updateTodoIndexes(parseInt(todoIndex));
  }

  completeTask = () => {
    
  }
};