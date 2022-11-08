import './styles.css';
import Folder from './modules/tasksFolder';
import Task from './modules/task';
import renderDOM from './modules/renderDOM';
import { iterateEventOverNodeList } from './modules/helperFunctions';


const myFolder = new Folder();

const addTaskButtons = document.querySelectorAll('.add-tasks');
iterateEventOverNodeList(addTaskButtons, 'click', e => {
  myFolder.createTask(e);
});