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

// close sidemenus
const sidebarBlur = document.querySelector('.sidebar-blur');
const taskSettingsDOM = document.querySelector('.task-settings');
document.addEventListener('click', e => {
  if (e.target.classList.contains('task-settings-exit-btn') || (e.target.classList.contains('sidebar-blur'))) {
    [taskSettingsDOM, sidebarBlur].forEach(element => element.classList.remove('visible'));
    setTimeout(() => { [taskSettingsDOM, sidebarBlur].forEach(element => element.setAttribute('style', 'display: none')) }, 1000);
  }
});