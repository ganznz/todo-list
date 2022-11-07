export default class Folder {
  #name = 'Folder #num';
  #tasks;
  #numOfTasks = 0;


  constructor() {
    this.#tasks = []; // initially empty folder
  }

  get name() { return this.#name };
  get tasks() { return this.#tasks };
  get numOfTasks() { return this.#numOfTasks };

  set name(value) {
    
  }

  createTask = (task) => {
    this.#tasks.push(task);
    this.#numOfTasks++
  }

  deleteTask = () => {
    this.#numOfTasks--
  }
}