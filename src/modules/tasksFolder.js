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
      this.createTask('upcoming');
      this.createTask('inprogress');
    }
  };

  get name() { return this.#name };
  get tasks() { return this.#tasks };
  get numOfTasks() { return this.#numOfTasks };

  set name(value) { this.#name = value };

  createTask = (e) => {
    this.#numOfTasks++;

    const task = (e == 'upcoming' || e == 'inprogress' || e == 'completed')
    ? new Task(`Task ${this.numOfTasks}`, e, 'low', this.numOfTasks - 1)
    : new Task(`Task ${this.numOfTasks}`, this.determineTaskStatus(e), 'low', this.numOfTasks - 1);
    
    this.#tasks.push(task);
    if (task.status == 'completed') {
      task.setAllTodosTrue();
    }
    const taskElements = renderDOM.createTaskElements(task, this.numOfTasks - 1);
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
    taskObj.description = document.querySelector('.task-description > textarea').value;
    taskElementsDOM.querySelector('h3').textContent = taskObj.name;
    
    taskObj.updateDateDue();
    taskObj.updateTodos();

    const dueDateDescription = taskElementsDOM.querySelector('.task-info-container > p');
    renderDOM.updateTaskCardDueDateDescription(taskObj, dueDateDescription);
  };

  deleteTask = (taskIndex, taskElements) => {
    this.#numOfTasks--;
    this.tasks.pop(taskIndex);
    taskElements.remove();
  };
}