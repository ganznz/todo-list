import './styles.css';
import Folder, { allFolders } from './modules/tasksFolder';
import Task from './modules/task';
import renderDOM from './modules/renderDOM';
import { iterateEventOverNodeList } from './modules/helperFunctions';

// default generated folders
for (let i = 0; i < 4; i++) {
  renderDOM.clearFolderTasksElements(); // clears old folder viewport before showing new one
  const folderObj = new Folder();
  allFolders.push(folderObj);
  renderDOM.addFolderToSidebar(folderObj);
}

// add tasks
const addTaskButtons = document.querySelectorAll('.add-tasks');
iterateEventOverNodeList(addTaskButtons, 'click', e => {
  const selectedFolder = document.querySelector('.selected-folder');
  const selectedFolderIndex = selectedFolder.getAttribute('folderindex');
  allFolders[selectedFolderIndex].createTask(e);
});