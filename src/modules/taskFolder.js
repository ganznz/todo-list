import DOM from './DOM';
import Task from './task';

export const allFolders = {};
let currentFolderIndex = 0;

export default class Folder {
    #name = 'New folder';
    #index = currentFolderIndex;
    #tasks = {};
    #numOfTasks = 0;

    constructor() {
        // Folder.createFolder method relies on these methods running before it on instantiation
        Folder.appendToFoldersObject(this);
        const folderElements = DOM.createFolderElements(this);
        DOM.appendFolderElementsToDOM(folderElements);
        DOM.updateCurrentlySelectedFolder(this.index);

        if (!(this.#numOfTasks)) {
            this.createTask();
            this.createTask();
            this.createTask();
        }
    };

    get name() { return this.#name };
    get tasks() { return this.#tasks };
    get numOfTasks() { return this.#numOfTasks };
    get index() { return this.#index };
    
    set name(value) { this.#name = value };

    static createFolder = () => {
        DOM.clearFolderTasksElements();
        const folderObj = new Folder();

        Folder.incrementCurrentFolderIndex();

        return folderObj;
    }

    static appendToFoldersObject = folderObj => allFolders[folderObj.index] = folderObj;

    static incrementCurrentFolderIndex = () => currentFolderIndex++;

    static deleteFolder = (folderObj, folderElements) => {
        delete allFolders[folderObj.index];
        folderElements.remove();
    }

    updateFolder = (newFolderName, folderElements) => {
        this.name = newFolderName;
        folderElements.querySelector('p').textContent = newFolderName;
    }

    incrementTasksNum = () => this.#numOfTasks++;
    
    decrementTasksNum = () => this.#numOfTasks--;

    appendToTasksObj = taskObj => this.#tasks[taskObj.name] = taskObj;

    generateTaskName = () => {
        const exampleTaskNames = ["Workout", "Call clients", "Chores", "Do homework", "Deep work", "Touch grass",
        "Meal prep", "Watch TV shows", "Maintain snap streaks (bruh)", "Doctor appointment", "Organise social activity",
        "Clean room", "Buy groceries", "Read book", "Organise finances", "Work on project", "Record podcast",
        "Play game with friends", "Meditate", "Get bitches"];
        
        const unusedTaskNames = exampleTaskNames.filter(taskName => !(taskName in this.tasks));

        return unusedTaskNames[Math.floor(Math.random() * unusedTaskNames.length)];

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