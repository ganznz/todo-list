import { differenceInBusinessDays } from "date-fns";
import Folder, { allFolders } from "./tasksFolder";

// -- VARIABLES -- //
const sidebarBlur = document.querySelector('.sidebar-blur');
const taskSettingsDOM = document.querySelector('.task-settings');
const folderMenu = document.querySelector('.folder-menu');
const addFoldersBtn = document.querySelector('.add-folders');

export default class renderDOM {

  static addFolderToSidebar = (folder) => {
    const ul = folderMenu.querySelector('ul');
    const li = document.createElement('li');
    li.setAttribute('folderindex', allFolders.length - 1)
    li.textContent = folder.name;
    if (allFolders.length > 1) {
      const previouslySelected = folderMenu.querySelector('.selected-folder');
      previouslySelected.classList.remove('selected-folder');
    }
    li.classList.add('selected-folder');
    ul.appendChild(li)
  }

  static renderFolder = (folder) => {
    const upcomingTasksContainer = document.querySelector('.tasks-container.upcoming-tasks');
    const inprogressTasksContainer = document.querySelector('.tasks-container.inprogress-tasks');
    const completedTasksContainer = document.querySelector('.tasks-container.completed-tasks');

    // removes old task DOM elements
    this.clearFolderTasksElements();
  }

  static createTaskElements = (task, index) => {
    const taskPerspectiveContainer = document.createElement('div');
    taskPerspectiveContainer.classList.add('task-perspective-container');
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task');
    const taskIcon = document.createElement('i');
    taskIcon.classList.add('fa-solid', 'fa-face-smile', 'fa-lg', 'task-icon');
    const taskInfoContainer = document.createElement('div');
    taskInfoContainer.classList.add('task-info-container');
    const h3 = document.createElement('h3');
    h3.textContent = task.name;
    const p = document.createElement('p');
    p.textContent = 'Due 23/11/22';
    const priorityLabel = document.createElement('div');
    priorityLabel.classList.add('priority-label', task.priority);
    taskInfoContainer.append(h3);
    taskInfoContainer.append(p);
    taskInfoContainer.append(priorityLabel);
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash-can');
    taskContainer.appendChild(taskIcon);
    taskContainer.appendChild(taskInfoContainer);
    taskContainer.appendChild(deleteIcon);
    taskPerspectiveContainer.appendChild(taskContainer);
    taskPerspectiveContainer.setAttribute('id', index);
    return taskPerspectiveContainer;
  }

  static appendTaskElementsToDOM = (task, taskElements) => {
    const upcomingTasksContainer = document.querySelector('.tasks-container.upcoming-tasks');
    const inprogressTasksContainer = document.querySelector('.tasks-container.inprogress-tasks');
    const completedTasksContainer = document.querySelector('.tasks-container.completed-tasks');

    if (task.status == 'upcoming') {
      upcomingTasksContainer.appendChild(taskElements);
    } else if (task.status == 'inprogress') {
      inprogressTasksContainer.appendChild(taskElements);
    } else {
      completedTasksContainer.appendChild(taskElements);
    }
  }

  static clearFolderTasksElements = () => {
    document.querySelectorAll('.tasks-container').forEach(container => container.innerHTML = "");
  }

  static showTaskSettingsView = (task) => {
    [sidebarBlur, taskSettingsDOM].forEach(element => element.setAttribute('style', 'display: block'));
    taskSettingsDOM.setAttribute('taskindex', task.index);

    setTimeout(() => {
      sidebarBlur.classList.add('visible');
      taskSettingsDOM.classList.add('visible');
    }, 100);

    const titleInput = taskSettingsDOM.querySelector('.task-minor-info-section > .sidebar-title > input');
    titleInput.setAttribute('value', task.name);
    titleInput.value = task.name;
    const taskStatusLabel = taskSettingsDOM.querySelector('.task-minor-container > .task-status > h5');
    taskStatusLabel.className = '';
    taskStatusLabel.classList.add(task.status);
    taskStatusLabel.textContent = task.status == 'upcoming' ? 'Upcoming' : (task.status == "inprogress" ? 'In Progress' : 'Completed');
    const taskPriorityLabel = taskSettingsDOM.querySelector('.task-minor-container > .task-priority > h5');
    taskPriorityLabel.className = '';
    taskPriorityLabel.classList.add(task.priority);
    taskPriorityLabel.textContent = task.priority == 'low' ? 'Low' : (task.priority == "medium" ? 'Medium' : 'High');
    const taskDescription = taskSettingsDOM.querySelector('.task-main-info-section > .task-description > textarea');
    taskDescription.setAttribute('value', task.description);
    taskDescription.value = task.description;
  }

  static closeTaskSettingsView = e => {
      [taskSettingsDOM, sidebarBlur].forEach(element => element.classList.remove('visible'));
      setTimeout(() => { [taskSettingsDOM, sidebarBlur].forEach(element => element.setAttribute('style', 'display: none')) }, 1000);
  }

  static closeFoldersSettingsView = e => {
      [folderMenu, sidebarBlur].forEach(element => element.classList.remove('visible'));
      setTimeout(() => { [folderMenu, sidebarBlur].forEach(element => element.setAttribute('style', 'display: none')) }, 1000);
  }
}

// close task settings sidebar
document.addEventListener('click', e => {
  if (e.target.classList.contains('task-settings-exit-btn') || (e.target.classList.contains('sidebar-blur'))) {
    renderDOM.closeTaskSettingsView(e);
    // selectedFolder = 
    // Folder.updateTask(taskSettingsDOM.getAttribute('taskindex'))
  }
});

// open folders sidebar
document.addEventListener('click', e => {
  if (e.target.classList.contains('folders-menu-icon')) {
    [sidebarBlur, folderMenu].forEach(element => element.setAttribute('style', 'display: block'));
    setTimeout(() => {
      sidebarBlur.classList.add('visible');
      folderMenu.classList.add('visible');
    }, 100);
  }
})

// close folders sidebar
document.addEventListener('click', e => {
  if (e.target.classList.contains('folders-menu-exit-btn') || (e.target.classList.contains('sidebar-blur'))) {
    renderDOM.closeFoldersSettingsView(e);
  }
});

// add folders to sidebar
addFoldersBtn.addEventListener('click', e => {
  renderDOM.clearFolderTasksElements(); // clears old folder viewport before showing new one
  const folderObj = new Folder();
  allFolders.push(folderObj);
  renderDOM.addFolderToSidebar(folderObj);
});