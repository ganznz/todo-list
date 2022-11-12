export default class Task {
  #name;
  #status;
  #priority;
  #index
  #dateCreated;
  #dateDue;
  #description = "Add a description for this task!";
  #todos = [];
  
  constructor(name, status, priority, index) {
    this.#name = name;
    this.#status = status.toLowerCase();
    this.#priority = priority.toLowerCase();
    this.#index = index;
    this.#dateCreated; // placeholder
    this.#dateDue; // set for same day task was created
  }

  get name() { return this.#name };
  get status() { return this.#status };
  get priority() { return this.#priority };
  get index() { return this.#index };
  get dateCreated() { return this.#dateCreated };
  get dateDue() { return this.#dateDue };
  get description() { return this.#description };
  
  set name(value) { this.#name = value };
  set status(value) { this.#status = value };
  set priority(value) { this.#priority = value };
  set dateDue(value) { this.#dateDue = value };
  set description(value) { this.#description = value };

  createTodo = () => {

  };

  deleteTodo = () => {

  }

  completeTask = () => {
    
  }
};