export default class Task {
  #name;
  #status;
  #priority;
  #index
  #dateCreated;
  #dateDue;
  #description = "Add some information to this task...";
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
  get dueDate() { return this.#dateDue };
  get description() { return this.#description };
  
  set name(value) {

  };

  set status(value) {

  }

  set priority(value) {

  }

  set dueDate(value) {

  };

  set description(value) {

  };

  createTodo = () => {

  };

  deleteTodo = () => {

  }

  completeTask = () => {
    
  }
};