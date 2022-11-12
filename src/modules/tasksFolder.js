import renderDOM from './renderDOM';
import Task from './task';

export let allFolders = []; // instances of the Folder class get pushed into this

export default class Folder {
  #name = `Folder ${allFolders.length + 1}`;
  #tasks = [];
  #numOfTasks = 0;

  constructor() {
    if (!(this.#numOfTasks)) { // create default tasks
      this.createTask('upcoming');
      this.createTask('inprogress');
      this.createTask('inprogress');
      this.createTask('completed');
    }
  };

  get name() { return this.#name };
  get tasks() { return this.#tasks };
  get numOfTasks() { return this.#numOfTasks };

  set name(value) {
    
  };

  createTask = (e) => {
    this.#numOfTasks++;

    const task = (e == 'upcoming' || e == 'inprogress' || e == 'completed')
    ? new Task(`Task ${this.numOfTasks}`, e, 'low', this.numOfTasks - 1)
    : new Task(`Task ${this.numOfTasks}`, this.determineTaskStatus(e), 'low', this.numOfTasks - 1);
    
    this.#tasks.push(task);
    const taskElements = renderDOM.createTaskElements(task, this.numOfTasks - 1);
    taskElements.addEventListener('click', () => renderDOM.showTaskSettingsView(task));
    renderDOM.appendTaskElementsToDOM(task, taskElements);
  };

  determineTaskStatus = e => {
    if (e.target.classList.contains('upcoming-tasks')) {
      return 'upcoming';
    } else if (e.target.classList.contains('inprogress-tasks')) {
      return 'inprogress';
    } else {
      return 'completed';
    }
  };

  updateTask = index => {
    const taskElementsDOM = document.getElementById(`${index}`);
    const taskObj = this.tasks[index];
    taskObj.name = document.querySelector('.sidebar-title > input').value;
    taskElementsDOM.querySelector('h3').textContent = taskObj.name;
  };

  deleteTask = index => {
    this.#numOfTasks--;
  };
}