import DOM from './DOM';
import Task from './task';

export const allFolders = {};
let currentFolderIndex = 0;

export default class Folder {
    #name = 'New folder';
    #index;
    #tasks = {};
    #numOfTasks = 0;

    constructor(index) {
        this.#index =  index;

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

    static createFolder = () => {
        const folderObj = new Folder(currentFolderIndex);
        console.log(folderObj)
        Folder.appendToFoldersObject(folderObj);
        
        const folderElements = DOM.createFolderElements(folderObj);
        DOM.appendFolderElementsToDOM(folderElements);

        Folder.incrementCurrentFolderIndex();

        return folderObj;
    }

    static appendToFoldersObject = folderObj => allFolders[folderObj.index] = folderObj;

    static incrementCurrentFolderIndex = () => currentFolderIndex++;

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