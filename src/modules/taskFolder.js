import DOM from './DOM';
import Task from './task';

export const allFolders = {};

export default class Folder {
    #name = `Folder`;
    #tasks = {};
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

    appendToTasksObj = taskObj => this.#tasks[taskObj.name] = taskObj;

    generateTaskName = () => {
        const exampleTaskNames = ["Workout", "Call clients", "Chores", "Do homework", "Deep work", "Touch grass",
        "Meal prep", "Watch TV shows", "Maintain snap streaks (bruh)", "Doctor appointment", "Organise social activity",
        "Clean room", "Buy groceries", "Read book", "Organise finances", "Work on project", "Record podcast",
        "Play game with friends", "Meditate", "Get bitches"];
        
        const unusedTaskNames = exampleTaskNames.filter(taskName => !(taskName in this.tasks));

        return unusedTaskNames[Math.floor(Math.random() * unusedTaskNames.length)]

    }

    createTask = (e = null) => {
        this.incrementTasksNum();
        const taskStatus = e ? Task.determineTaskStatus(e.target) : 'upcoming';
        const taskObj = new Task(this.generateTaskName(), taskStatus, 'low')
        
        const taskElements = DOM.createTaskElements(taskObj);
        taskElements.setAttribute('task-name', taskObj.name);

        e 
        ? DOM.appendTaskElementsToDOM(e.target.parentNode.querySelector('.tasks-container'), taskElements)
        : DOM.appendTaskElementsToDOM(document.querySelector('.tasks-container.upcoming-tasks'), taskElements);

        this.appendToTasksObj(taskObj);
    }

    taskNameAlreadyExists = (newTaskName, oldTaskName) => newTaskName in this.tasks && newTaskName != oldTaskName;
}