import renderDOM from './renderDOM';
import Task from './task';

export default class Folder {
  #name = 'Folder #num';
  #tasks = [];
  #numOfTasks = 0;

  constructor() {
    if (!(this.#numOfTasks)) { // create default tasks
      this.createTask('upcoming');
      this.createTask('inprogress');
      this.createTask('inprogress');
      this.createTask('completed');
    }
  }

  get name() { return this.#name };
  get tasks() { return this.#tasks };
  get numOfTasks() { return this.#numOfTasks };

  set name(value) {
    
  }

  createTask = (e) => {
    this.#numOfTasks++;

    const task = (e == 'upcoming' || e == 'inprogress' || e == 'completed')
    ? new Task(`Task ${this.numOfTasks}`, e, 'low')
    : new Task(`Task ${this.numOfTasks}`, this.determineTaskStatus(e), 'low');
    
    this.#tasks.push(task);
    const taskElements = renderDOM.createTaskElements(task);
    taskElements.addEventListener('click', () => renderDOM.showTaskSettingsView(task));
    renderDOM.appendTaskElementsToDOM(task, taskElements);
  }

  determineTaskStatus = e => {
    if (e.target.classList.contains('upcoming-tasks')) {
      return 'upcoming';
    } else if (e.target.classList.contains('inprogress-tasks')) {
      return 'inprogress';
    } else {
      return 'completed';
    }
  }

  deleteTask = () => {
    this.#numOfTasks--;
  }
}