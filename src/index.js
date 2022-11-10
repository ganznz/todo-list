import './styles.css';
import Folder, { allFolders } from './modules/tasksFolder';
import Task from './modules/task';
import renderDOM from './modules/renderDOM';
import { iterateEventOverNodeList } from './modules/helperFunctions';


const myFolder = new Folder();

// add tasks
const addTaskButtons = document.querySelectorAll('.add-tasks');
iterateEventOverNodeList(addTaskButtons, 'click', e => {
  myFolder.createTask(e);
  // myFolder.updateTaskIndexes();
});

// close sidemenus
const taskSettingsDOM = document.querySelector('.task-settings');
document.addEventListener('click', e => {
  renderDOM.closeTaskSettingsView(e);
});