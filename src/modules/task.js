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
    this.#dateDue.setHours(23, 59, 59); // sets initial due date to the end of the dateCreated date
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

  createTodo = () => {
    this.#numOfTodos++;
    // const todo = new Todo(`Todo ${this.numOfTodos}`);
    const todo = new Todo('Enter a description');
    this.todos.push(todo);
  };

  deleteTodo = () => {

  }

  completeTask = () => {
    
  }
};