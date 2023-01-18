import DOM from './DOM';
import Task from './task';

export default class Folder {
    #name = `Folder`;
    #tasks = [];
    #numOfTasks = 0;

    constructor() {
        if (!(this.#numOfTasks)) {
            this.createTask();
            this.createTask();
            this.createTask();
        }
    };

    get name() { return this.#name };
    get tasks() { return this.#tasks };
    get numOfTasks() { return this.#numOfTasks };
    
    set name(value) { this.#name = value };

    incrementTasksNum = () => this.#numOfTasks++;
    
    decrementTasksNum = () => this.#numOfTasks--;

    appendTaskToTaskList = taskObj => this.#tasks.push(taskObj)

    createTask = (e = null) => {
        this.incrementTasksNum();
        const taskStatus = e ? Task.determineTaskStatus(e.target) : 'upcoming';
        const taskObj = new Task(`Task ${this.numOfTasks}`, taskStatus, 'low');
        const taskElements = DOM.createTaskElements(taskObj);

        e 
        ? DOM.appendTaskElementsToDOM(e.target.parentNode.querySelector('.tasks-container'), taskElements)
        : DOM.appendTaskElementsToDOM(document.querySelector('.tasks-container.upcoming-tasks'), taskElements);

        this.appendTaskToTaskList(taskObj);
    }
}