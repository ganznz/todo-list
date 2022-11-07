import './styles.css';
import Folder from './modules/tasksFolder';
import Task from './modules/task';
import renderDOM from './modules/renderDOM';

const task1 = new Task('task#1', 'Upcoming', 'Medium');
const task2 = new Task('task#2', 'In Progress', 'Low');
const task3 = new Task('task#3', 'In Progress', 'High');

const myFolder = new Folder();
myFolder.createTask(task1);
myFolder.createTask(task2);
myFolder.createTask(task3);

const dom = new renderDOM();
dom.renderFolder(myFolder);