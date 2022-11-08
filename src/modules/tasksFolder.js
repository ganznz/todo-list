import renderDOM from './renderDOM';
import Task from './task';

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

  createTask = (e) => {
    this.#numOfTasks++;
    const task = new Task(`Task ${this.numOfTasks}`, this.determineTaskStatus(e), 'low');
    this.#tasks.push(task);
    const taskElements = renderDOM.createTaskElements(task);
    renderDOM.appendTaskElementsToDOM(task, taskElements);
  }

  determineTaskStatus = e => {
    if (e.target.classList.contains('upcoming-tasks')) {
      return 'upcoming';
    } else if (e.target.classList.contains('inprogress-tasks')) {
      return 'in progress';
    } else {
      return 'completed';
    }
  }

  deleteTask = () => {
    this.#numOfTasks--;
  }
}